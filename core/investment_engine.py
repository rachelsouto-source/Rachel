"""
InvestmentEngine - Transforma briefing em argumentos financeiros.
O coracao da venda: calcula ROI, receita mensal, payback e metricas
que convertem investidor.
"""


class InvestmentEngine:
    def __init__(self, briefing: dict):
        inv = briefing["investment"]
        self.ticket = inv["ticket_medio"]
        self.daily = inv["daily_rate"]
        self.occupancy = inv["occupancy"]
        self.condo_fee = inv.get("condo_fee", 0)
        self.management_fee = inv.get("management_fee", 0.20)  # 20% default
        self.briefing = briefing

    def calculate(self) -> dict:
        gross_monthly = self.daily * self.occupancy * 30
        management_cost = gross_monthly * self.management_fee
        net_monthly = gross_monthly - self.condo_fee - management_cost

        roi_monthly = net_monthly / self.ticket
        roi_annual = roi_monthly * 12
        payback_months = self.ticket / net_monthly if net_monthly > 0 else float("inf")

        return {
            "gross_monthly": round(gross_monthly, 2),
            "net_monthly": round(net_monthly, 2),
            "management_cost": round(management_cost, 2),
            "roi_monthly": round(roi_monthly * 100, 2),
            "roi_annual": round(roi_annual * 100, 2),
            "payback_months": round(payback_months, 1),
            "ticket": self.ticket,
            "daily_rate": self.daily,
            "occupancy_pct": round(self.occupancy * 100, 1),
        }

    def generate_selling_points(self) -> list[dict]:
        metrics = self.calculate()
        points = []

        if metrics["roi_monthly"] >= 1.0:
            points.append({
                "type": "roi_highlight",
                "headline": f"Ate {metrics['roi_monthly']}% ao mes",
                "detail": f"Receita liquida de R$ {metrics['net_monthly']:,.0f}/mes",
                "strength": "strong",
            })

        if metrics["payback_months"] <= 60:
            years = metrics["payback_months"] / 12
            points.append({
                "type": "payback",
                "headline": f"Payback em {years:.1f} anos",
                "detail": "Retorno do investimento mais rapido que renda fixa",
                "strength": "strong" if years <= 4 else "moderate",
            })

        points.append({
            "type": "ticket",
            "headline": f"A partir de R$ {metrics['ticket']:,.0f}",
            "detail": f"Diaria media de R$ {metrics['daily_rate']:,.0f}",
            "strength": "neutral",
        })

        return points

    def compare_with_benchmarks(self, benchmarks: dict) -> dict:
        metrics = self.calculate()
        comparison = {}

        if "cdb" in benchmarks:
            cdb_annual = benchmarks["cdb"]["annual_rate"]
            comparison["vs_cdb"] = {
                "product_roi": metrics["roi_annual"],
                "benchmark_roi": cdb_annual,
                "advantage": round(metrics["roi_annual"] - cdb_annual, 2),
                "label": f"{metrics['roi_annual']:.1f}% vs {cdb_annual:.1f}% (CDI)",
            }

        if "poupanca" in benchmarks:
            poup_annual = benchmarks["poupanca"]["annual_rate"]
            multiplier = metrics["roi_annual"] / poup_annual if poup_annual > 0 else 0
            comparison["vs_poupanca"] = {
                "product_roi": metrics["roi_annual"],
                "benchmark_roi": poup_annual,
                "multiplier": round(multiplier, 1),
                "label": f"{multiplier:.1f}x mais que poupanca",
            }

        return comparison
