"""
generate_creatives.py - Orquestrador principal da Maquina de Criativos.

Fluxo:
1. Carrega briefing
2. Calcula metricas financeiras (InvestmentEngine)
3. Gera estrategia de campanha (StrategyEngine)
4. Cria variacoes (VariationEngine)
5. Gera prompts de imagem (PromptEngine)
6. Renderiza imagens (FluxClient)
7. Aplica overlays (Compositor)
8. Exporta pacote completo

Uso:
    python generate_creatives.py --briefing briefing_spot.json
    python generate_creatives.py --briefing briefing_spot.json --stages bottom
    python generate_creatives.py --briefing briefing_spot.json --profiles aggressive conservative
"""

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

from core.investment_engine import InvestmentEngine
from core.strategy_engine import StrategyEngine
from core.variation_engine import VariationEngine
from core.prompt_engine import PromptEngine
from render.flux_client import FluxClient
from render.compositor import Compositor


def load_briefing(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_benchmarks() -> dict:
    benchmarks_path = Path(__file__).parent / "data" / "benchmarks.json"
    with open(benchmarks_path, "r", encoding="utf-8") as f:
        return json.load(f)


def run(briefing_path: str, stages: list[str] | None = None, profiles: list[str] | None = None,
        provider: str = "fal", dry_run: bool = False):
    """Pipeline principal."""

    print("=" * 60)
    print("  MAQUINA DE CRIATIVOS - Geracao Automatizada")
    print("=" * 60)

    # 1. Load briefing
    briefing = load_briefing(briefing_path)
    project_name = briefing.get("project_name", "Projeto")
    print(f"\n[1/7] Briefing carregado: {project_name}")

    # 2. Calculate investment metrics
    inv_engine = InvestmentEngine(briefing)
    metrics = inv_engine.calculate()
    selling_points = inv_engine.generate_selling_points()

    print(f"[2/7] Metricas calculadas:")
    print(f"      ROI mensal: {metrics['roi_monthly']}%")
    print(f"      ROI anual: {metrics['roi_annual']}%")
    print(f"      Receita liquida: R$ {metrics['net_monthly']:,.0f}/mes")
    print(f"      Payback: {metrics['payback_months']} meses")

    # Compare with benchmarks
    benchmarks = load_benchmarks()
    comparisons = inv_engine.compare_with_benchmarks(benchmarks)
    for key, comp in comparisons.items():
        print(f"      {comp['label']}")

    # 3. Generate strategy
    strategy = StrategyEngine(briefing, metrics)
    campaign_seq = strategy.generate_campaign_sequence()

    if stages:
        campaign_seq = [c for c in campaign_seq if c["funnel_stage"] in stages]

    if profiles is None:
        profiles = ["conservative", "moderate", "aggressive"]

    print(f"[3/7] Estrategia gerada: {len(campaign_seq)} pecas na sequencia")

    # 4. Create variations
    var_engine = VariationEngine(styles=profiles + ["emotional"])
    print(f"[4/7] Variacoes: {len(var_engine.styles)} estilos por peca")

    # 5. Build image prompts
    prompt_engine = PromptEngine(briefing)

    # 6. Setup render pipeline
    flux = FluxClient(provider=provider)
    compositor = Compositor(brand_config=briefing.get("brand", {}))

    # 7. Generate everything
    output = {
        "project": project_name,
        "generated_at": datetime.now().isoformat(),
        "metrics": metrics,
        "selling_points": selling_points,
        "comparisons": comparisons,
        "creatives": [],
    }

    total = 0
    for step in campaign_seq:
        day = step["day"]
        creative_type = step["type"]
        funnel_stage = step["funnel_stage"]
        fmt = step["format"]

        print(f"\n[5/7] Dia {day}: {step['description']}")

        # Generate copy for each investor profile in this step
        step_profiles = [p for p in profiles if p in step.get("profiles", profiles)]

        for profile in step_profiles:
            # Build Claude prompt (for copy generation)
            claude_prompt = strategy.build_claude_prompt(funnel_stage, profile)

            # Build variations
            base_creative = {
                "day": day,
                "type": creative_type,
                "funnel_stage": funnel_stage,
                "format": fmt,
                "investor_profile": profile,
                "claude_prompt": claude_prompt,
                "selling_points": selling_points,
            }

            variations = var_engine.generate_variations(base_creative)

            for var in variations:
                # Image prompt
                img_prompt = prompt_engine.build_prompt_with_variation(
                    creative_type, var["variation_style"]
                )
                neg_prompt = prompt_engine.build_negative_prompt(creative_type)
                img_specs = prompt_engine.get_image_specs(fmt)

                var["image_prompt"] = img_prompt
                var["negative_prompt"] = neg_prompt
                var["image_specs"] = img_specs

                if not dry_run:
                    # Generate image
                    result = flux.generate(img_prompt, neg_prompt, img_specs)
                    var["image_result"] = result

                    # Download and composite if successful
                    if result.get("status") == "success" and result.get("image_url"):
                        filename = f"d{day}_{creative_type}_{profile}_{var['variation_style']}.png"
                        img_path = flux.download_image(result["image_url"], filename)
                        if img_path:
                            overlay_data = {
                                "roi": metrics["roi_monthly"],
                                "headline": "",  # Will come from Claude copy
                                "cta": var["cta_options"][0],
                            }
                            comp_path = compositor.apply_overlay(img_path, overlay_data, var["color_scheme"])
                            var["composited_path"] = str(comp_path) if comp_path else None
                else:
                    var["image_result"] = {"status": "dry_run"}

                output["creatives"].append(var)
                total += 1
                style_name = var["variation_name"]
                print(f"      [{profile}/{style_name}] {fmt} - {'OK' if not dry_run else 'DRY RUN'}")

    print(f"\n[6/7] Total de criativos gerados: {total}")

    # Save output manifest
    output_dir = Path("output")
    output_dir.mkdir(exist_ok=True)
    manifest_path = output_dir / f"manifest_{project_name.lower().replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

    # Remove non-serializable items
    clean_output = json.loads(json.dumps(output, default=str, ensure_ascii=False))
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(clean_output, f, ensure_ascii=False, indent=2)

    print(f"[7/7] Manifest salvo: {manifest_path}")
    print(f"\n{'=' * 60}")
    print(f"  CAMPANHA: {project_name}")
    print(f"  {total} criativos | {len(profiles)} perfis | {len(campaign_seq)} dias")
    print(f"{'=' * 60}")

    return output


def main():
    parser = argparse.ArgumentParser(description="Maquina de Criativos - Geracao Automatizada")
    parser.add_argument("--briefing", required=True, help="Caminho para arquivo de briefing JSON")
    parser.add_argument("--stages", nargs="+", choices=["top", "middle", "bottom", "retargeting"],
                        help="Filtrar estagios do funil")
    parser.add_argument("--profiles", nargs="+", choices=["conservative", "moderate", "aggressive"],
                        help="Perfis de investidor")
    parser.add_argument("--provider", default="fal", choices=["fal", "replicate", "placeholder"],
                        help="Provider de geracao de imagem")
    parser.add_argument("--dry-run", action="store_true", help="Gerar apenas specs sem chamar APIs")

    args = parser.parse_args()
    run(args.briefing, args.stages, args.profiles, args.provider, args.dry_run)


if __name__ == "__main__":
    main()
