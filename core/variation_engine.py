"""
VariationEngine - Gera multiplas variacoes de cada criativo.
Cada peca vira 4 versoes automaticamente para teste A/B massivo.
"""

import copy


VARIATION_STYLES = {
    "aggressive": {
        "name": "Agressivo",
        "tone_modifier": "direto e urgente",
        "headline_prefix": "",
        "cta_options": [
            "Invista agora",
            "Garanta sua unidade",
            "Nao perca essa oportunidade",
        ],
        "color_scheme": "dark",
        "urgency_level": "high",
        "copy_rules": {
            "use_numbers": True,
            "use_exclamation": True,
            "max_words_headline": 6,
        },
    },
    "conservative": {
        "name": "Conservador",
        "tone_modifier": "seguro e confiavel",
        "headline_prefix": "",
        "cta_options": [
            "Saiba mais",
            "Converse com um consultor",
            "Conheca o projeto",
        ],
        "color_scheme": "light",
        "urgency_level": "low",
        "copy_rules": {
            "use_numbers": True,
            "use_exclamation": False,
            "max_words_headline": 8,
        },
    },
    "comparison": {
        "name": "Comparativo",
        "tone_modifier": "analitico e racional",
        "headline_prefix": "",
        "cta_options": [
            "Compare voce mesmo",
            "Veja os numeros",
            "Analise essa oportunidade",
        ],
        "color_scheme": "neutral",
        "urgency_level": "medium",
        "copy_rules": {
            "use_numbers": True,
            "use_exclamation": False,
            "max_words_headline": 10,
        },
    },
    "emotional": {
        "name": "Emocional",
        "tone_modifier": "aspiracional e pessoal",
        "headline_prefix": "",
        "cta_options": [
            "Realize esse sonho",
            "Comece sua jornada",
            "Imagine-se aqui",
        ],
        "color_scheme": "warm",
        "urgency_level": "low",
        "copy_rules": {
            "use_numbers": False,
            "use_exclamation": False,
            "max_words_headline": 8,
        },
    },
}


class VariationEngine:
    def __init__(self, styles: list[str] | None = None):
        if styles is None:
            styles = list(VARIATION_STYLES.keys())
        self.styles = {s: VARIATION_STYLES[s] for s in styles if s in VARIATION_STYLES}

    def generate_variations(self, base_creative: dict) -> list[dict]:
        variations = []
        for style_key, style_config in self.styles.items():
            variation = copy.deepcopy(base_creative)
            variation["variation_style"] = style_key
            variation["variation_name"] = style_config["name"]
            variation["tone_modifier"] = style_config["tone_modifier"]
            variation["color_scheme"] = style_config["color_scheme"]
            variation["urgency_level"] = style_config["urgency_level"]
            variation["copy_rules"] = style_config["copy_rules"]
            variation["cta_options"] = style_config["cta_options"]
            variations.append(variation)
        return variations

    def get_style_config(self, style: str) -> dict:
        return self.styles.get(style, VARIATION_STYLES["conservative"])

    def get_ab_test_pairs(self) -> list[tuple[str, str]]:
        """Retorna pares ideais para teste A/B."""
        return [
            ("aggressive", "conservative"),
            ("comparison", "emotional"),
            ("aggressive", "comparison"),
        ]
