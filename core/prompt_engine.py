"""
PromptEngine - Gera prompts otimizados para geracao de imagem (Flux/SDXL).
Cada tipo de criativo tem prompt especifico para qualidade maxima.
"""


IMAGE_PROMPT_TEMPLATES = {
    "hero": {
        "base": "ultra realistic architectural visualization, hero shot",
        "style": "cinematic wide angle, golden hour lighting, dramatic sky",
        "details": "modern residential building exterior, premium finish, landscaping",
        "negative": "text, watermark, logo, people, cars, low quality, blurry",
    },
    "lifestyle": {
        "base": "ultra realistic lifestyle photography",
        "style": "warm natural lighting, depth of field, aspirational mood",
        "details": "beach lifestyle, tropical location, modern architecture in background",
        "negative": "text, watermark, logo, low quality, blurry, artificial",
    },
    "roi": {
        "base": "ultra realistic architectural visualization",
        "style": "clean modern interior, natural lighting, high-end finish",
        "details": "compact studio interior optimized for Airbnb, minimalist decor, investor-focused aesthetic",
        "negative": "text, watermark, logo, people, clutter, low quality, blurry",
    },
    "interior": {
        "base": "ultra realistic interior design photography",
        "style": "bright airy space, professional staging, magazine quality",
        "details": "modern studio apartment, premium finishes, smart layout",
        "negative": "text, watermark, logo, low quality, blurry, dark",
    },
    "aerial": {
        "base": "ultra realistic aerial photography",
        "style": "drone shot, high altitude, clear sky, golden hour",
        "details": "coastal city, beach proximity, urban development area",
        "negative": "text, watermark, logo, low quality, blurry, rain",
    },
    "comparison": {
        "base": "ultra realistic split composition architectural visualization",
        "style": "clean modern design, side by side layout feel",
        "details": "investment property interior, premium studio, professional staging",
        "negative": "text, watermark, logo, low quality, blurry, messy",
    },
    "story": {
        "base": "ultra realistic vertical architectural photography",
        "style": "portrait orientation, dramatic lighting, modern aesthetic",
        "details": "premium real estate detail shot, texture focus, luxury finish",
        "negative": "text, watermark, logo, low quality, blurry, landscape orientation",
    },
}


class PromptEngine:
    def __init__(self, briefing: dict):
        self.briefing = briefing
        self.location = briefing.get("location", {})
        self.style_override = briefing.get("image_style", {})

    def build_prompt(self, creative_type: str) -> str:
        template = IMAGE_PROMPT_TEMPLATES.get(creative_type, IMAGE_PROMPT_TEMPLATES["hero"])

        parts = [template["base"]]

        # Add location context
        if self.location.get("beach_proximity"):
            parts.append(f"ocean view, {self.location['beach_proximity']} from beach")
        if self.location.get("neighborhood"):
            parts.append(f"{self.location['neighborhood']} neighborhood aesthetic")

        parts.append(template["style"])
        parts.append(template["details"])

        # Style overrides from briefing
        if self.style_override.get("extra_keywords"):
            parts.append(self.style_override["extra_keywords"])

        prompt = ", ".join(parts)
        return prompt

    def build_negative_prompt(self, creative_type: str) -> str:
        template = IMAGE_PROMPT_TEMPLATES.get(creative_type, IMAGE_PROMPT_TEMPLATES["hero"])
        return template["negative"]

    def build_prompt_with_variation(self, creative_type: str, variation_style: str) -> str:
        base = self.build_prompt(creative_type)

        mood_map = {
            "aggressive": "dramatic contrast, bold composition, high impact",
            "conservative": "calm serene atmosphere, balanced composition, trustworthy",
            "comparison": "clean analytical composition, organized layout feel",
            "emotional": "warm inviting atmosphere, dreamy soft light, aspirational",
        }

        mood = mood_map.get(variation_style, "")
        if mood:
            base = f"{base}, {mood}"

        return base

    def get_image_specs(self, format_type: str) -> dict:
        specs = {
            "single_image": {"width": 1080, "height": 1080, "aspect": "1:1"},
            "story": {"width": 1080, "height": 1920, "aspect": "9:16"},
            "carousel": {"width": 1080, "height": 1080, "aspect": "1:1"},
            "wide": {"width": 1200, "height": 628, "aspect": "1.91:1"},
        }
        return specs.get(format_type, specs["single_image"])
