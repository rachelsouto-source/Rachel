"""
FluxClient - Cliente para geracao de imagens via API (Flux/Replicate/FAL).
Abstrai a chamada de API para gerar imagens a partir de prompts.
"""

import os
import json
import time
import urllib.request
import urllib.error
from pathlib import Path


class FluxClient:
    def __init__(self, provider: str = "fal", api_key: str | None = None):
        self.provider = provider
        self.api_key = api_key or os.environ.get("FAL_KEY") or os.environ.get("REPLICATE_API_TOKEN")
        self.output_dir = Path("output/images")
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def generate(self, prompt: str, negative_prompt: str = "", specs: dict | None = None) -> dict:
        if specs is None:
            specs = {"width": 1080, "height": 1080}

        if self.provider == "fal":
            return self._generate_fal(prompt, negative_prompt, specs)
        elif self.provider == "replicate":
            return self._generate_replicate(prompt, negative_prompt, specs)
        else:
            return self._generate_placeholder(prompt, specs)

    def _generate_fal(self, prompt: str, negative_prompt: str, specs: dict) -> dict:
        if not self.api_key:
            print("[FluxClient] FAL_KEY nao encontrada. Gerando placeholder.")
            return self._generate_placeholder(prompt, specs)

        url = "https://fal.run/fal-ai/flux/dev"
        payload = json.dumps({
            "prompt": prompt,
            "negative_prompt": negative_prompt,
            "image_size": {
                "width": specs.get("width", 1080),
                "height": specs.get("height", 1080),
            },
            "num_inference_steps": 28,
            "guidance_scale": 3.5,
        }).encode()

        req = urllib.request.Request(
            url,
            data=payload,
            headers={
                "Authorization": f"Key {self.api_key}",
                "Content-Type": "application/json",
            },
        )

        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                result = json.loads(resp.read())
                image_url = result.get("images", [{}])[0].get("url", "")
                return {
                    "status": "success",
                    "image_url": image_url,
                    "provider": "fal",
                    "prompt_used": prompt,
                    "specs": specs,
                }
        except urllib.error.URLError as e:
            return {
                "status": "error",
                "error": str(e),
                "provider": "fal",
                "prompt_used": prompt,
            }

    def _generate_replicate(self, prompt: str, negative_prompt: str, specs: dict) -> dict:
        if not self.api_key:
            print("[FluxClient] REPLICATE_API_TOKEN nao encontrada. Gerando placeholder.")
            return self._generate_placeholder(prompt, specs)

        url = "https://api.replicate.com/v1/predictions"
        payload = json.dumps({
            "version": "black-forest-labs/flux-dev",
            "input": {
                "prompt": prompt,
                "width": specs.get("width", 1080),
                "height": specs.get("height", 1080),
                "num_inference_steps": 28,
                "guidance": 3.5,
            },
        }).encode()

        req = urllib.request.Request(
            url,
            data=payload,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
        )

        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                result = json.loads(resp.read())
                prediction_url = result.get("urls", {}).get("get", "")

            # Poll for completion
            for _ in range(60):
                time.sleep(2)
                poll_req = urllib.request.Request(
                    prediction_url,
                    headers={"Authorization": f"Bearer {self.api_key}"},
                )
                with urllib.request.urlopen(poll_req, timeout=30) as resp:
                    status = json.loads(resp.read())
                    if status["status"] == "succeeded":
                        output = status.get("output", [])
                        image_url = output[0] if output else ""
                        return {
                            "status": "success",
                            "image_url": image_url,
                            "provider": "replicate",
                            "prompt_used": prompt,
                            "specs": specs,
                        }
                    elif status["status"] == "failed":
                        return {
                            "status": "error",
                            "error": status.get("error", "Unknown"),
                            "provider": "replicate",
                        }

            return {"status": "error", "error": "Timeout", "provider": "replicate"}

        except urllib.error.URLError as e:
            return {"status": "error", "error": str(e), "provider": "replicate"}

    def _generate_placeholder(self, prompt: str, specs: dict) -> dict:
        """Gera um placeholder quando nao ha API key."""
        return {
            "status": "placeholder",
            "image_url": None,
            "prompt_used": prompt,
            "specs": specs,
            "message": "Imagem nao gerada - configure FAL_KEY ou REPLICATE_API_TOKEN",
        }

    def download_image(self, image_url: str, filename: str) -> Path | None:
        if not image_url:
            return None
        filepath = self.output_dir / filename
        try:
            urllib.request.urlretrieve(image_url, str(filepath))
            return filepath
        except Exception as e:
            print(f"[FluxClient] Erro ao baixar imagem: {e}")
            return None
