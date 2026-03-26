"""
StrategyEngine - Gera estrategia de copy e campanha usando Claude.
Injeta briefing + metricas financeiras + estagio do funil para
produzir copy que vende de verdade.
"""

import json


# Funnel stage prompts - cada estagio tem abordagem diferente
FUNNEL_PROMPTS = {
    "top": {
        "objective": "Gerar desejo e clique. Foco em lifestyle e localizacao.",
        "tone": "aspiracional, visual, emocional",
        "cta_style": "suave - 'Conheca', 'Descubra', 'Imagine'",
        "focus": ["lifestyle", "localizacao", "desejo"],
    },
    "middle": {
        "objective": "Educar sobre o produto e logica de investimento.",
        "tone": "informativo, confiavel, tecnico mas acessivel",
        "cta_style": "educativo - 'Saiba mais', 'Entenda como', 'Veja os numeros'",
        "focus": ["produto", "arquitetura", "logica_investimento"],
    },
    "bottom": {
        "objective": "Converter. ROI, numeros concretos, urgencia.",
        "tone": "direto, confiante, urgente",
        "cta_style": "forte - 'Invista agora', 'Garanta sua unidade', 'Fale com consultor'",
        "focus": ["roi", "numeros", "escassez", "prova_social"],
    },
    "retargeting": {
        "objective": "Reconverter quem ja viu. Escassez + prova.",
        "tone": "urgente, exclusivo, pessoal",
        "cta_style": "urgente - 'Ultimas unidades', 'Voce viu, agora garanta'",
        "focus": ["escassez", "prova_social", "urgencia"],
    },
}

# Investor profiles - cada perfil recebe linguagem diferente
INVESTOR_PROFILES = {
    "conservative": {
        "name": "Conservador",
        "focus": "seguranca e previsibilidade",
        "language": [
            "investimento seguro", "patrimonio protegido",
            "renda previsivel", "mercado solido",
        ],
        "avoid": ["risco", "agressivo", "especulacao"],
        "emphasis": "payback e comparacao com renda fixa",
    },
    "moderate": {
        "name": "Moderado",
        "focus": "equilibrio entre retorno e seguranca",
        "language": [
            "retorno inteligente", "diversificacao",
            "oportunidade equilibrada", "crescimento patrimonial",
        ],
        "avoid": ["extremo", "garantido"],
        "emphasis": "ROI mensal e valorizacao",
    },
    "aggressive": {
        "name": "Agressivo",
        "focus": "retorno maximo e escala",
        "language": [
            "rentabilidade acima do mercado", "retorno expressivo",
            "oportunidade unica", "multiplicar patrimonio",
        ],
        "avoid": ["conservador", "lento"],
        "emphasis": "ROI anual e comparativo com outros investimentos",
    },
}


class StrategyEngine:
    def __init__(self, briefing: dict, investment_metrics: dict):
        self.briefing = briefing
        self.metrics = investment_metrics
        self.project_name = briefing.get("project_name", "Empreendimento")
        self.location = briefing.get("location", {})
        self.differentials = briefing.get("differentials", [])

    def build_strategy_input(self, funnel_stage: str, investor_profile: str = "moderate") -> dict:
        funnel = FUNNEL_PROMPTS.get(funnel_stage, FUNNEL_PROMPTS["middle"])
        profile = INVESTOR_PROFILES.get(investor_profile, INVESTOR_PROFILES["moderate"])

        return {
            "project": {
                "name": self.project_name,
                "location": self.location,
                "differentials": self.differentials,
            },
            "metrics": self.metrics,
            "funnel": funnel,
            "investor_profile": profile,
            "architecture_angle": self._get_architecture_angle(),
        }

    def build_claude_prompt(self, funnel_stage: str, investor_profile: str = "moderate") -> str:
        strategy = self.build_strategy_input(funnel_stage, investor_profile)

        return f"""Voce e um copywriter especialista em investimento imobiliario de short stay.

PROJETO: {strategy['project']['name']}
LOCALIZACAO: {json.dumps(strategy['project']['location'], ensure_ascii=False)}
DIFERENCIAIS: {json.dumps(strategy['project']['differentials'], ensure_ascii=False)}

METRICAS FINANCEIRAS:
- ROI mensal: {strategy['metrics']['roi_monthly']}%
- ROI anual: {strategy['metrics']['roi_annual']}%
- Receita liquida mensal: R$ {strategy['metrics']['net_monthly']:,.0f}
- Ticket: R$ {strategy['metrics']['ticket']:,.0f}
- Payback: {strategy['metrics']['payback_months']} meses

ESTAGIO DO FUNIL: {funnel_stage}
- Objetivo: {strategy['funnel']['objective']}
- Tom: {strategy['funnel']['tone']}
- CTA: {strategy['funnel']['cta_style']}
- Foco: {', '.join(strategy['funnel']['focus'])}

PERFIL DO INVESTIDOR: {strategy['investor_profile']['name']}
- Foco: {strategy['investor_profile']['focus']}
- Linguagem preferida: {', '.join(strategy['investor_profile']['language'])}
- Evitar: {', '.join(strategy['investor_profile']['avoid'])}
- Enfase: {strategy['investor_profile']['emphasis']}

ANGULO ARQUITETONICO (diferencial competitivo):
{strategy['architecture_angle']}

Gere:
1. HEADLINE (max 8 palavras, impactante)
2. SUBHEADLINE (1 frase de suporte)
3. BODY COPY (2-3 frases curtas)
4. CTA (chamada para acao)
5. HASHTAGS (5 relevantes)

Formato de resposta: JSON com as chaves headline, subheadline, body, cta, hashtags"""

    def generate_campaign_sequence(self) -> list[dict]:
        return [
            {
                "day": 1,
                "type": "hero",
                "funnel_stage": "top",
                "description": "Lancamento - impacto visual maximo",
                "format": "single_image",
                "profiles": ["moderate"],
            },
            {
                "day": 2,
                "type": "lifestyle",
                "funnel_stage": "top",
                "description": "Lifestyle e localizacao",
                "format": "single_image",
                "profiles": ["moderate"],
            },
            {
                "day": 3,
                "type": "educational",
                "funnel_stage": "middle",
                "description": "Carrossel educativo - produto e arquitetura",
                "format": "carousel",
                "profiles": ["conservative", "moderate", "aggressive"],
            },
            {
                "day": 4,
                "type": "roi",
                "funnel_stage": "bottom",
                "description": "Foco em numeros e retorno",
                "format": "single_image",
                "profiles": ["conservative", "moderate", "aggressive"],
            },
            {
                "day": 5,
                "type": "story_data",
                "funnel_stage": "bottom",
                "description": "Story com dados e urgencia",
                "format": "story",
                "profiles": ["moderate", "aggressive"],
            },
            {
                "day": 6,
                "type": "retargeting",
                "funnel_stage": "retargeting",
                "description": "Escassez + prova social",
                "format": "single_image",
                "profiles": ["conservative", "moderate", "aggressive"],
            },
        ]

    def _get_architecture_angle(self) -> str:
        angles = [
            "Projeto pensado para maximizar receita por m2",
            "Planta otimizada para operacao short stay",
            "Design que aumenta avaliacao no Airbnb",
            "Acabamento premium que justifica diaria mais alta",
        ]
        diff = self.differentials
        if diff:
            angles.extend([f"Diferencial: {d}" for d in diff[:3]])
        return "\n".join(f"- {a}" for a in angles)
