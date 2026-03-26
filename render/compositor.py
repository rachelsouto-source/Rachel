"""
Compositor - Aplica overlays de marca sobre imagens geradas.
Adiciona badge de ROI, CTA, logo, gradientes e textos padronizados.
"""

from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
    HAS_PIL = True
except ImportError:
    HAS_PIL = False


# Brand defaults
BRAND_COLORS = {
    "dark": {"bg": (20, 20, 20), "text": (255, 255, 255), "accent": (0, 200, 120)},
    "light": {"bg": (255, 255, 255), "text": (30, 30, 30), "accent": (0, 150, 100)},
    "warm": {"bg": (40, 30, 25), "text": (255, 240, 220), "accent": (220, 160, 60)},
    "neutral": {"bg": (245, 245, 245), "text": (50, 50, 50), "accent": (60, 120, 200)},
}


class Compositor:
    def __init__(self, brand_config: dict | None = None):
        self.brand = brand_config or {}
        self.logo_path = self.brand.get("logo_path")
        self.font_path = self.brand.get("font_path")
        self.output_dir = Path("output/composited")
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def apply_overlay(self, image_path: str | Path, data: dict, color_scheme: str = "dark") -> Path | None:
        if not HAS_PIL:
            print("[Compositor] Pillow nao instalado. Gerando spec JSON.")
            return self._generate_spec(data, color_scheme)

        colors = BRAND_COLORS.get(color_scheme, BRAND_COLORS["dark"])
        img = Image.open(str(image_path)).convert("RGBA")
        overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)

        # Bottom gradient
        w, h = img.size
        gradient_h = int(h * 0.35)
        for y in range(gradient_h):
            alpha = int(200 * (y / gradient_h))
            draw.line([(0, h - gradient_h + y), (w, h - gradient_h + y)],
                      fill=(*colors["bg"], alpha))

        # ROI badge (top right)
        if data.get("roi"):
            self._draw_roi_badge(draw, data["roi"], w, colors)

        # CTA (bottom center)
        if data.get("cta"):
            self._draw_cta(draw, data["cta"], w, h, colors)

        # Headline (above CTA)
        if data.get("headline"):
            self._draw_headline(draw, data["headline"], w, h, colors)

        # Compose
        result = Image.alpha_composite(img, overlay).convert("RGB")

        # Logo
        if self.logo_path and Path(self.logo_path).exists():
            self._apply_logo(result)

        output_path = self.output_dir / f"comp_{Path(image_path).stem}.jpg"
        result.save(str(output_path), "JPEG", quality=95)
        return output_path

    def _draw_roi_badge(self, draw: "ImageDraw.Draw", roi: float, img_width: int, colors: dict):
        font = self._get_font(32)
        text = f"{roi}% ao mes"
        badge_w, badge_h = 280, 60
        x = img_width - badge_w - 30
        y = 30

        draw.rounded_rectangle(
            [x, y, x + badge_w, y + badge_h],
            radius=12,
            fill=(*colors["accent"], 220),
        )
        draw.text(
            (x + badge_w // 2, y + badge_h // 2),
            text,
            fill=(255, 255, 255),
            font=font,
            anchor="mm",
        )

    def _draw_cta(self, draw: "ImageDraw.Draw", cta_text: str, w: int, h: int, colors: dict):
        font = self._get_font(28)
        btn_w, btn_h = 320, 56
        x = (w - btn_w) // 2
        y = h - 80

        draw.rounded_rectangle(
            [x, y, x + btn_w, y + btn_h],
            radius=28,
            fill=(*colors["accent"], 240),
        )
        draw.text(
            (w // 2, y + btn_h // 2),
            cta_text,
            fill=(255, 255, 255),
            font=font,
            anchor="mm",
        )

    def _draw_headline(self, draw: "ImageDraw.Draw", headline: str, w: int, h: int, colors: dict):
        font = self._get_font(42)
        y = h - 160
        draw.text(
            (w // 2, y),
            headline,
            fill=colors["text"],
            font=font,
            anchor="mm",
        )

    def _apply_logo(self, img: "Image.Image"):
        logo = Image.open(self.logo_path).convert("RGBA")
        logo_h = 40
        ratio = logo_h / logo.height
        logo = logo.resize((int(logo.width * ratio), logo_h), Image.LANCZOS)
        img.paste(logo, (30, 30), logo)

    def _get_font(self, size: int):
        if self.font_path and Path(self.font_path).exists():
            return ImageFont.truetype(self.font_path, size)
        try:
            return ImageFont.truetype("arial.ttf", size)
        except OSError:
            return ImageFont.load_default()

    def _generate_spec(self, data: dict, color_scheme: str) -> Path:
        """Fallback: gera JSON com specs do overlay quando Pillow nao esta disponivel."""
        import json
        spec = {
            "overlay_data": data,
            "color_scheme": color_scheme,
            "colors": BRAND_COLORS.get(color_scheme, BRAND_COLORS["dark"]),
            "elements": [],
        }
        if data.get("roi"):
            spec["elements"].append({"type": "roi_badge", "position": "top_right", "value": f"{data['roi']}% ao mes"})
        if data.get("headline"):
            spec["elements"].append({"type": "headline", "position": "bottom_center_above_cta", "value": data["headline"]})
        if data.get("cta"):
            spec["elements"].append({"type": "cta_button", "position": "bottom_center", "value": data["cta"]})

        spec_path = self.output_dir / f"spec_{hash(str(data)) % 10000}.json"
        spec_path.write_text(json.dumps(spec, ensure_ascii=False, indent=2))
        return spec_path
