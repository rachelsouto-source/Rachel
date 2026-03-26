const pptxgen = require("pptxgenjs");
const path = require("path");

// ═══════════════════════════════════════════════════════════════
// PALETA PREMIUM - Investimento Imobiliario
// ═══════════════════════════════════════════════════════════════
const C = {
  dark: "0D1117",       // fundo escuro principal
  darkAlt: "161B22",    // fundo escuro secundario
  card: "1C2128",       // cards sobre fundo escuro
  accent: "00C878",     // verde accent (brand)
  accentDark: "00A060", // verde mais escuro
  teal: "0891B2",       // teal para contraste
  gold: "F59E0B",       // dourado para destaque
  coral: "F96167",      // coral para urgencia
  white: "FFFFFF",
  light: "E6EDF3",      // texto claro
  muted: "8B949E",      // texto secundario
  divider: "30363D",    // linhas divisorias
};

// Tipografia
const TITLE_FONT = "Arial Black";
const BODY_FONT = "Calibri";

const makeShadow = () => ({
  type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.3,
});

// ═══════════════════════════════════════════════════════════════
// CRIACAO DA APRESENTACAO
// ═══════════════════════════════════════════════════════════════
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Maquina de Criativos";
pres.title = "SPOT Novo Campeche - Plataforma de Aquisicao de Investidores";

// ───────────────────────────────────────────────────
// SLIDE 1: TITLE (dark, impactante)
// ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  // Accent bar top
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent },
  });

  // Badge
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 1.2, w: 2.6, h: 0.4,
    fill: { color: C.accent }, rectRadius: 0.05,
  });
  s.addText("PLATAFORMA DE AQUISICAO", {
    x: 0.7, y: 1.2, w: 2.6, h: 0.4,
    fontSize: 10, fontFace: BODY_FONT, color: C.dark,
    bold: true, align: "center", valign: "middle", margin: 0,
  });

  // Title
  s.addText("SPOT\nNovo Campeche", {
    x: 0.7, y: 1.8, w: 8, h: 2.0,
    fontSize: 48, fontFace: TITLE_FONT, color: C.white,
    bold: true, align: "left", valign: "top", margin: 0,
  });

  // Subtitle
  s.addText("Maquina de Criativos para Investimento Imobiliario", {
    x: 0.7, y: 3.9, w: 7, h: 0.5,
    fontSize: 18, fontFace: BODY_FONT, color: C.muted,
    italic: true, margin: 0,
  });

  // Metrics row
  const metricsY = 4.7;
  const metrics = [
    { value: "1.8%", label: "ROI Mensal" },
    { value: "R$ 280K", label: "Ticket Medio" },
    { value: "21.6%", label: "ROI Anual" },
    { value: "500m", label: "Da Praia" },
  ];
  metrics.forEach((m, i) => {
    const mx = 0.7 + i * 2.3;
    s.addText(m.value, {
      x: mx, y: metricsY, w: 2, h: 0.5,
      fontSize: 28, fontFace: TITLE_FONT, color: C.accent,
      bold: true, margin: 0,
    });
    s.addText(m.label, {
      x: mx, y: metricsY + 0.5, w: 2, h: 0.3,
      fontSize: 11, fontFace: BODY_FONT, color: C.muted, margin: 0,
    });
  });
}

// ───────────────────────────────────────────────────
// SLIDE 2: O PROBLEMA
// ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.darkAlt };

  s.addText("O CENARIO ATUAL", {
    x: 0.7, y: 0.4, w: 8, h: 0.6,
    fontSize: 12, fontFace: BODY_FONT, color: C.accent,
    bold: true, charSpacing: 4, margin: 0,
  });

  s.addText("Por que investidores imobiliarios\nprecisam de algo novo?", {
    x: 0.7, y: 0.9, w: 8, h: 1.0,
    fontSize: 28, fontFace: TITLE_FONT, color: C.white,
    bold: true, margin: 0,
  });

  // Problem cards
  const problems = [
    { icon: "X", title: "Renda Fixa Decepcionante", desc: "CDB e poupanca rendem 7-12% ao ano. Insuficiente para quem quer liberdade financeira." },
    { icon: "X", title: "Aluguel Tradicional", desc: "Yield de 0.4% ao mes. Inquilino inadimplente, desgaste de imovel, burocracia." },
    { icon: "X", title: "Marketing Generico", desc: "Incorporadoras vendem imovel, nao investimento. Criativo sem dado, sem ROI, sem prova." },
  ];

  problems.forEach((p, i) => {
    const cy = 2.2 + i * 1.1;
    // Card bg
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.7, y: cy, w: 8.6, h: 0.9,
      fill: { color: C.card }, shadow: makeShadow(),
    });
    // Red icon circle
    s.addShape(pres.shapes.OVAL, {
      x: 1.0, y: cy + 0.2, w: 0.5, h: 0.5,
      fill: { color: C.coral },
    });
    s.addText(p.icon, {
      x: 1.0, y: cy + 0.2, w: 0.5, h: 0.5,
      fontSize: 16, fontFace: BODY_FONT, color: C.white,
      bold: true, align: "center", valign: "middle", margin: 0,
    });
    // Title + desc
    s.addText(p.title, {
      x: 1.8, y: cy + 0.1, w: 7, h: 0.35,
      fontSize: 15, fontFace: BODY_FONT, color: C.white, bold: true, margin: 0,
    });
    s.addText(p.desc, {
      x: 1.8, y: cy + 0.45, w: 7, h: 0.35,
      fontSize: 11, fontFace: BODY_FONT, color: C.muted, margin: 0,
    });
  });
}

// ───────────────────────────────────────────────────
// SLIDE 3: A SOLUCAO - Plataforma
// ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  s.addText("A SOLUCAO", {
    x: 0.7, y: 0.4, w: 8, h: 0.5,
    fontSize: 12, fontFace: BODY_FONT, color: C.accent,
    bold: true, charSpacing: 4, margin: 0,
  });

  s.addText("De ferramenta de criativo para\nplataforma de aquisicao", {
    x: 0.7, y: 0.9, w: 8, h: 1.0,
    fontSize: 28, fontFace: TITLE_FONT, color: C.white, bold: true, margin: 0,
  });

  // 3 pillars
  const pillars = [
    { color: C.accent, title: "Arquitetura", desc: "Projeto pensado para maximizar receita por m2" },
    { color: C.teal, title: "Investimento", desc: "Dados financeiros reais que convencem investidores" },
    { color: C.gold, title: "Marketing", desc: "Criativos automatizados com IA para cada perfil" },
  ];

  pillars.forEach((p, i) => {
    const px = 0.7 + i * 3.1;
    // Card
    s.addShape(pres.shapes.RECTANGLE, {
      x: px, y: 2.2, w: 2.8, h: 2.8,
      fill: { color: C.card }, shadow: makeShadow(),
    });
    // Colored top bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: px, y: 2.2, w: 2.8, h: 0.06,
      fill: { color: p.color },
    });
    // Number
    s.addText(String(i + 1), {
      x: px + 0.3, y: 2.5, w: 0.6, h: 0.6,
      fontSize: 28, fontFace: TITLE_FONT, color: p.color,
      bold: true, margin: 0,
    });
    // Title
    s.addText(p.title, {
      x: px + 0.3, y: 3.2, w: 2.2, h: 0.4,
      fontSize: 18, fontFace: BODY_FONT, color: C.white,
      bold: true, margin: 0,
    });
    // Desc
    s.addText(p.desc, {
      x: px + 0.3, y: 3.65, w: 2.2, h: 0.9,
      fontSize: 12, fontFace: BODY_FONT, color: C.muted, margin: 0,
    });
  });

  // Bottom quote
  s.addText("Ninguem fala: 'Projeto pensado para maximizar receita por m2'. Isso e absurdo de forte.", {
    x: 0.7, y: 5.1, w: 8.6, h: 0.4,
    fontSize: 12, fontFace: BODY_FONT, color: C.accent, italic: true, margin: 0,
  });
}

// ───────────────────────────────────────────────────
// SLIDE 4: METRICAS DO INVESTIMENTO
// ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.darkAlt };

  s.addText("METRICAS DE INVESTIMENTO", {
    x: 0.7, y: 0.4, w: 8, h: 0.5,
    fontSize: 12, fontFace: BODY_FONT, color: C.accent,
    bold: true, charSpacing: 4, margin: 0,
  });

  s.addText("Numeros que vendem sozinhos", {
    x: 0.7, y: 0.9, w: 8, h: 0.6,
    fontSize: 28, fontFace: TITLE_FONT, color: C.white, bold: true, margin: 0,
  });

  // Big metric cards (2x2 grid)
  const bigMetrics = [
    { value: "1.8%", label: "ROI Mensal Liquido", sub: "Descontados condominio e gestao", color: C.accent },
    { value: "21.6%", label: "ROI Anual", sub: "vs 12.5% do CDB e 7.5% da poupanca", color: C.teal },
    { value: "R$ 5.475", label: "Receita Liquida/Mes", sub: "Diaria R$350 x 75% ocupacao", color: C.gold },
    { value: "4.3 anos", label: "Payback", sub: "Retorno total do investimento", color: C.accent },
  ];

  bigMetrics.forEach((m, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const mx = 0.7 + col * 4.5;
    const my = 1.7 + row * 1.8;

    s.addShape(pres.shapes.RECTANGLE, {
      x: mx, y: my, w: 4.2, h: 1.5,
      fill: { color: C.card }, shadow: makeShadow(),
    });
    // Left accent
    s.addShape(pres.shapes.RECTANGLE, {
      x: mx, y: my, w: 0.06, h: 1.5,
      fill: { color: m.color },
    });

    s.addText(m.value, {
      x: mx + 0.3, y: my + 0.15, w: 3.5, h: 0.6,
      fontSize: 32, fontFace: TITLE_FONT, color: m.color,
      bold: true, margin: 0,
    });
    s.addText(m.label, {
      x: mx + 0.3, y: my + 0.75, w: 3.5, h: 0.3,
      fontSize: 13, fontFace: BODY_FONT, color: C.white,
      bold: true, margin: 0,
    });
    s.addText(m.sub, {
      x: mx + 0.3, y: my + 1.05, w: 3.5, h: 0.3,
      fontSize: 10, fontFace: BODY_FONT, color: C.muted, margin: 0,
    });
  });
}

// ───────────────────────────────────────────────────
// SLIDE 5: COMPARATIVO COM BENCHMARKS
// ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  s.addText("COMPARATIVO DE RENTABILIDADE", {
    x: 0.7, y: 0.4, w: 8, h: 0.5,
    fontSize: 12, fontFace: BODY_FONT, color: C.accent,
    bold: true, charSpacing: 4, margin: 0,
  });

  s.addText("Short Stay vs Investimentos Tradicionais", {
    x: 0.7, y: 0.9, w: 8, h: 0.6,
    fontSize: 28, fontFace: TITLE_FONT, color: C.white, bold: true, margin: 0,
  });

  // Bar chart
  s.addChart(pres.charts.BAR, [{
    name: "Rentabilidade Anual (%)",
    labels: ["SPOT\nShort Stay", "CDB\n100% CDI", "Tesouro\nSelic", "FII\nMedia", "Poupanca", "Aluguel\nTradicional"],
    values: [21.6, 12.5, 13.0, 10.0, 7.5, 5.0],
  }], {
    x: 0.5, y: 1.7, w: 9, h: 3.5,
    barDir: "col",
    chartColors: [C.accent],
    chartArea: { fill: { color: C.darkAlt }, roundedCorners: true },
    plotArea: { fill: { color: C.darkAlt } },
    catAxisLabelColor: C.light,
    catAxisLabelFontSize: 9,
    valAxisLabelColor: C.muted,
    valAxisLabelFontSize: 9,
    valGridLine: { color: C.divider, size: 0.5 },
    catGridLine: { style: "none" },
    showValue: true,
    dataLabelPosition: "outEnd",
    dataLabelColor: C.accent,
    dataLabelFontSize: 12,
    showLegend: false,
  });

  // Callout
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 5.1, w: 8.6, h: 0.4,
    fill: { color: C.card },
  });
  s.addText("SPOT Novo Campeche rende ate 2.9x mais que a poupanca e 1.7x mais que o CDB", {
    x: 0.7, y: 5.1, w: 8.6, h: 0.4,
    fontSize: 12, fontFace: BODY_FONT, color: C.accent,
    bold: true, align: "center", valign: "middle", margin: 0,
  });
}

// ───────────────────────────────────────────────────
// SLIDE 6: FUNIL DE CAMPANHA
// ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.darkAlt };

  s.addText("ESTRATEGIA DE CAMPANHA", {
    x: 0.7, y: 0.4, w: 8, h: 0.5,
    fontSize: 12, fontFace: BODY_FONT, color: C.accent,
    bold: true, charSpacing: 4, margin: 0,
  });

  s.addText("Funil completo: do desejo a conversao", {
    x: 0.7, y: 0.9, w: 8, h: 0.6,
    fontSize: 28, fontFace: TITLE_FONT, color: C.white, bold: true, margin: 0,
  });

  // Funnel stages
  const stages = [
    {
      label: "TOPO", color: C.accent, width: 8.6,
      title: "Atracao", items: ["Lifestyle e localizacao", "Desejo aspiracional", "500m da praia mais desejada"],
    },
    {
      label: "MEIO", color: C.teal, width: 6.5,
      title: "Educacao", items: ["Produto e arquitetura", "Logica de investimento", "Studios de 17.5m2 para rentabilizar"],
    },
    {
      label: "FUNDO", color: C.gold, width: 4.4,
      title: "Conversao", items: ["ROI e numeros concretos", "CTA forte e urgencia", "Ate 1.8% ao mes"],
    },
  ];

  stages.forEach((st, i) => {
    const sy = 1.8 + i * 1.2;
    const sx = (10 - st.width) / 2;

    // Funnel shape
    s.addShape(pres.shapes.RECTANGLE, {
      x: sx, y: sy, w: st.width, h: 0.95,
      fill: { color: C.card }, shadow: makeShadow(),
    });
    // Left accent
    s.addShape(pres.shapes.RECTANGLE, {
      x: sx, y: sy, w: 0.06, h: 0.95,
      fill: { color: st.color },
    });

    // Stage label
    s.addText(st.label, {
      x: sx + 0.25, y: sy + 0.05, w: 0.8, h: 0.35,
      fontSize: 10, fontFace: BODY_FONT, color: st.color,
      bold: true, charSpacing: 2, margin: 0,
    });
    s.addText(st.title, {
      x: sx + 0.25, y: sy + 0.35, w: 1.5, h: 0.3,
      fontSize: 16, fontFace: BODY_FONT, color: C.white, bold: true, margin: 0,
    });

    // Items
    st.items.forEach((item, j) => {
      s.addText(item, {
        x: sx + 2.0 + j * 2.2, y: sy + 0.25, w: 2.0, h: 0.45,
        fontSize: 10, fontFace: BODY_FONT, color: C.muted, margin: 0,
      });
    });
  });

  // Retargeting bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 2.0, y: 5.0, w: 6.0, h: 0.4,
    fill: { color: C.coral },
  });
  s.addText("RETARGETING: Escassez + Prova Social + Urgencia", {
    x: 2.0, y: 5.0, w: 6.0, h: 0.4,
    fontSize: 11, fontFace: BODY_FONT, color: C.white,
    bold: true, align: "center", valign: "middle", margin: 0,
  });
}

// ───────────────────────────────────────────────────
// SLIDE 7: SEQUENCIA DE CAMPANHA (5 DIAS)
// ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  s.addText("SEQUENCIA DE CAMPANHA", {
    x: 0.7, y: 0.4, w: 8, h: 0.5,
    fontSize: 12, fontFace: BODY_FONT, color: C.accent,
    bold: true, charSpacing: 4, margin: 0,
  });

  s.addText("5 dias para converter investidor", {
    x: 0.7, y: 0.9, w: 8, h: 0.6,
    fontSize: 28, fontFace: TITLE_FONT, color: C.white, bold: true, margin: 0,
  });

  const days = [
    { day: "DIA 1", type: "HERO", desc: "Lancamento visual maximo", stage: "TOPO", color: C.accent },
    { day: "DIA 2", type: "LIFESTYLE", desc: "Estilo de vida praiano", stage: "TOPO", color: C.accent },
    { day: "DIA 3", type: "CARROSSEL", desc: "Educativo: produto e arquitetura", stage: "MEIO", color: C.teal },
    { day: "DIA 4", type: "ROI", desc: "Foco em numeros e retorno", stage: "FUNDO", color: C.gold },
    { day: "DIA 5", type: "STORY", desc: "Dados + urgencia em stories", stage: "FUNDO", color: C.gold },
  ];

  days.forEach((d, i) => {
    const dx = 0.5 + i * 1.85;
    const cardW = 1.7;

    // Card
    s.addShape(pres.shapes.RECTANGLE, {
      x: dx, y: 1.7, w: cardW, h: 3.4,
      fill: { color: C.card }, shadow: makeShadow(),
    });
    // Top color bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: dx, y: 1.7, w: cardW, h: 0.06,
      fill: { color: d.color },
    });

    // Day number
    s.addText(d.day, {
      x: dx, y: 1.9, w: cardW, h: 0.35,
      fontSize: 11, fontFace: BODY_FONT, color: d.color,
      bold: true, align: "center", margin: 0,
    });

    // Type
    s.addText(d.type, {
      x: dx, y: 2.4, w: cardW, h: 0.5,
      fontSize: 16, fontFace: TITLE_FONT, color: C.white,
      bold: true, align: "center", valign: "middle", margin: 0,
    });

    // Description
    s.addText(d.desc, {
      x: dx + 0.15, y: 3.1, w: cardW - 0.3, h: 0.7,
      fontSize: 10, fontFace: BODY_FONT, color: C.muted,
      align: "center", margin: 0,
    });

    // Stage badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: dx + 0.2, y: 4.2, w: cardW - 0.4, h: 0.3,
      fill: { color: d.color, transparency: 80 },
    });
    s.addText(d.stage, {
      x: dx + 0.2, y: 4.2, w: cardW - 0.4, h: 0.3,
      fontSize: 9, fontFace: BODY_FONT, color: d.color,
      bold: true, align: "center", valign: "middle", margin: 0,
    });
  });
}

// ───────────────────────────────────────────────────
// SLIDE 8: 3 PERFIS DE INVESTIDOR
// ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.darkAlt };

  s.addText("3 PERFIS, 1 CAMPANHA", {
    x: 0.7, y: 0.4, w: 8, h: 0.5,
    fontSize: 12, fontFace: BODY_FONT, color: C.accent,
    bold: true, charSpacing: 4, margin: 0,
  });

  s.addText("Fale com 3 investidores diferentes\nsem refazer campanha", {
    x: 0.7, y: 0.9, w: 8, h: 1.0,
    fontSize: 28, fontFace: TITLE_FONT, color: C.white, bold: true, margin: 0,
  });

  const profiles = [
    {
      name: "CONSERVADOR",
      color: C.teal,
      focus: "Seguranca e previsibilidade",
      language: '"Investimento seguro"\n"Patrimonio protegido"\n"Renda previsivel"',
      emphasis: "Payback + comparativo renda fixa",
    },
    {
      name: "MODERADO",
      color: C.accent,
      focus: "Equilibrio retorno/seguranca",
      language: '"Retorno inteligente"\n"Diversificacao"\n"Crescimento patrimonial"',
      emphasis: "ROI mensal + valorizacao",
    },
    {
      name: "AGRESSIVO",
      color: C.gold,
      focus: "Retorno maximo e escala",
      language: '"Rentabilidade acima do mercado"\n"Retorno expressivo"\n"Multiplicar patrimonio"',
      emphasis: "ROI anual + comparativo",
    },
  ];

  profiles.forEach((p, i) => {
    const px = 0.7 + i * 3.1;

    // Card
    s.addShape(pres.shapes.RECTANGLE, {
      x: px, y: 2.2, w: 2.8, h: 3.1,
      fill: { color: C.card }, shadow: makeShadow(),
    });
    // Top bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: px, y: 2.2, w: 2.8, h: 0.06,
      fill: { color: p.color },
    });

    // Name
    s.addText(p.name, {
      x: px, y: 2.4, w: 2.8, h: 0.4,
      fontSize: 14, fontFace: TITLE_FONT, color: p.color,
      bold: true, align: "center", margin: 0,
    });

    // Focus
    s.addText(p.focus, {
      x: px + 0.2, y: 2.9, w: 2.4, h: 0.3,
      fontSize: 11, fontFace: BODY_FONT, color: C.white, align: "center", margin: 0,
    });

    // Divider
    s.addShape(pres.shapes.LINE, {
      x: px + 0.4, y: 3.35, w: 2.0, h: 0,
      line: { color: C.divider, width: 1 },
    });

    // Language label
    s.addText("LINGUAGEM:", {
      x: px + 0.3, y: 3.5, w: 2.2, h: 0.25,
      fontSize: 8, fontFace: BODY_FONT, color: C.muted,
      bold: true, charSpacing: 2, margin: 0,
    });
    s.addText(p.language, {
      x: px + 0.3, y: 3.75, w: 2.2, h: 0.9,
      fontSize: 10, fontFace: BODY_FONT, color: C.light, italic: true, margin: 0,
    });

    // Emphasis
    s.addText("ENFASE:", {
      x: px + 0.3, y: 4.65, w: 2.2, h: 0.2,
      fontSize: 8, fontFace: BODY_FONT, color: C.muted,
      bold: true, charSpacing: 2, margin: 0,
    });
    s.addText(p.emphasis, {
      x: px + 0.3, y: 4.85, w: 2.2, h: 0.3,
      fontSize: 10, fontFace: BODY_FONT, color: p.color, bold: true, margin: 0,
    });
  });
}

// ───────────────────────────────────────────────────
// SLIDE 9: ARQUITETURA TECNICA
// ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  s.addText("ARQUITETURA DA PLATAFORMA", {
    x: 0.7, y: 0.4, w: 8, h: 0.5,
    fontSize: 12, fontFace: BODY_FONT, color: C.accent,
    bold: true, charSpacing: 4, margin: 0,
  });

  s.addText("Engine modular e escalavel", {
    x: 0.7, y: 0.9, w: 8, h: 0.6,
    fontSize: 28, fontFace: TITLE_FONT, color: C.white, bold: true, margin: 0,
  });

  // Pipeline flow
  const engines = [
    { name: "Investment\nEngine", desc: "Briefing vira\nargumento financeiro", color: C.accent },
    { name: "Strategy\nEngine", desc: "Claude pensa\ncomo vendedor", color: C.teal },
    { name: "Variation\nEngine", desc: "4 versoes por\ncriativo automatico", color: C.gold },
    { name: "Prompt\nEngine", desc: "Qualidade maxima\nde imagem", color: C.accent },
    { name: "Compositor", desc: "Overlay de marca\npadronizado", color: C.coral },
  ];

  engines.forEach((e, i) => {
    const ex = 0.3 + i * 1.95;

    // Card
    s.addShape(pres.shapes.RECTANGLE, {
      x: ex, y: 1.8, w: 1.75, h: 2.2,
      fill: { color: C.card }, shadow: makeShadow(),
    });
    // Top color
    s.addShape(pres.shapes.RECTANGLE, {
      x: ex, y: 1.8, w: 1.75, h: 0.06,
      fill: { color: e.color },
    });

    // Name
    s.addText(e.name, {
      x: ex, y: 2.0, w: 1.75, h: 0.7,
      fontSize: 13, fontFace: TITLE_FONT, color: e.color,
      bold: true, align: "center", valign: "middle", margin: 0,
    });

    // Desc
    s.addText(e.desc, {
      x: ex + 0.1, y: 2.8, w: 1.55, h: 0.7,
      fontSize: 10, fontFace: BODY_FONT, color: C.muted,
      align: "center", margin: 0,
    });

    // Arrow (except last)
    if (i < engines.length - 1) {
      s.addText(">", {
        x: ex + 1.75, y: 2.5, w: 0.2, h: 0.5,
        fontSize: 20, fontFace: BODY_FONT, color: C.divider,
        align: "center", valign: "middle", margin: 0,
      });
    }
  });

  // Output section
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.3, w: 8.6, h: 1.0,
    fill: { color: C.card }, shadow: makeShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.3, w: 8.6, h: 0.06,
    fill: { color: C.accent },
  });

  s.addText("OUTPUT: Campanha completa por projeto", {
    x: 1.0, y: 4.4, w: 8, h: 0.35,
    fontSize: 14, fontFace: BODY_FONT, color: C.accent, bold: true, margin: 0,
  });

  const outputs = [
    "Criativos para todas as etapas do funil",
    "3 perfis de investidor automaticos",
    "4 variacoes por peca (teste A/B)",
    "Copy + imagem + overlay prontos",
  ];
  s.addText(outputs.map(o => ({ text: o, options: { bullet: true, breakLine: true } })), {
    x: 1.0, y: 4.8, w: 8, h: 0.5,
    fontSize: 11, fontFace: BODY_FONT, color: C.light, margin: 0,
  });
}

// ───────────────────────────────────────────────────
// SLIDE 10: DIFERENCIAL COMPETITIVO
// ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.darkAlt };

  s.addText("DIFERENCIAL COMPETITIVO", {
    x: 0.7, y: 0.4, w: 8, h: 0.5,
    fontSize: 12, fontFace: BODY_FONT, color: C.accent,
    bold: true, charSpacing: 4, margin: 0,
  });

  s.addText("Por que voce ganha do mercado", {
    x: 0.7, y: 0.9, w: 8, h: 0.6,
    fontSize: 28, fontFace: TITLE_FONT, color: C.white, bold: true, margin: 0,
  });

  // Comparison table
  const rows = [
    ["", "Marketing Tradicional", "Maquina de Criativos"],
    ["Abordagem", "Vende imovel generico", "Vende investimento com dados"],
    ["Copy", "Emocional sem dados", "ROI + payback + comparativo"],
    ["Segmentacao", "Publico unico", "3 perfis automaticos"],
    ["Escala", "1 criativo manual", "4 variacoes automaticas"],
    ["Funil", "Post unico", "Sequencia de 5 dias"],
    ["Diferencial", "Foto bonita", "Arquitetura + produto + operacao"],
  ];

  const tableRows = rows.map((row, ri) => {
    if (ri === 0) {
      return row.map((cell, ci) => ({
        text: cell,
        options: {
          fill: { color: ci === 0 ? C.dark : ci === 1 ? C.card : C.accent },
          color: ci === 2 ? C.dark : C.muted,
          bold: true,
          fontSize: 11,
          fontFace: BODY_FONT,
        },
      }));
    }
    return row.map((cell, ci) => ({
      text: cell,
      options: {
        fill: { color: ri % 2 === 0 ? C.dark : C.card },
        color: ci === 0 ? C.accent : ci === 2 ? C.white : C.muted,
        bold: ci === 0,
        fontSize: 11,
        fontFace: BODY_FONT,
      },
    }));
  });

  s.addTable(tableRows, {
    x: 0.7, y: 1.7, w: 8.6,
    colW: [1.8, 3.4, 3.4],
    border: { pt: 0.5, color: C.divider },
    rowH: [0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45],
  });

  // Bottom callout
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 5.0, w: 8.6, h: 0.5,
    fill: { color: C.accent },
  });
  s.addText("Voce tem arquitetura + produto + operacao short stay. Ninguem mais tem isso junto.", {
    x: 0.7, y: 5.0, w: 8.6, h: 0.5,
    fontSize: 13, fontFace: BODY_FONT, color: C.dark,
    bold: true, align: "center", valign: "middle", margin: 0,
  });
}

// ───────────────────────────────────────────────────
// SLIDE 11: VISAO FINAL + CTA
// ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  // Accent bar top
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent },
  });

  s.addText("VISAO FINAL", {
    x: 0.7, y: 0.5, w: 8, h: 0.5,
    fontSize: 12, fontFace: BODY_FONT, color: C.accent,
    bold: true, charSpacing: 4, margin: 0,
  });

  // Before -> After
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 1.3, w: 3.8, h: 1.5,
    fill: { color: C.card }, shadow: makeShadow(),
  });
  s.addText("ANTES", {
    x: 0.7, y: 1.4, w: 3.8, h: 0.35,
    fontSize: 11, fontFace: BODY_FONT, color: C.coral,
    bold: true, align: "center", margin: 0,
  });
  s.addText("Ferramenta\nde criativo", {
    x: 0.7, y: 1.7, w: 3.8, h: 0.9,
    fontSize: 22, fontFace: TITLE_FONT, color: C.muted,
    align: "center", valign: "middle", margin: 0,
  });

  // Arrow
  s.addText(">", {
    x: 4.5, y: 1.5, w: 1, h: 1.0,
    fontSize: 36, fontFace: BODY_FONT, color: C.accent,
    align: "center", valign: "middle", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.5, y: 1.3, w: 3.8, h: 1.5,
    fill: { color: C.card }, shadow: makeShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.5, y: 1.3, w: 3.8, h: 0.06,
    fill: { color: C.accent },
  });
  s.addText("DEPOIS", {
    x: 5.5, y: 1.4, w: 3.8, h: 0.35,
    fontSize: 11, fontFace: BODY_FONT, color: C.accent,
    bold: true, align: "center", margin: 0,
  });
  s.addText("Plataforma de\naquisicao de investidores", {
    x: 5.5, y: 1.7, w: 3.8, h: 0.9,
    fontSize: 20, fontFace: TITLE_FONT, color: C.white,
    align: "center", valign: "middle", margin: 0,
  });

  // Key results
  s.addText("O QUE VOCE ENTREGA:", {
    x: 0.7, y: 3.2, w: 8, h: 0.4,
    fontSize: 12, fontFace: BODY_FONT, color: C.accent,
    bold: true, charSpacing: 2, margin: 0,
  });

  const results = [
    { value: "72+", label: "criativos por\ncampanha" },
    { value: "3", label: "perfis de\ninvestidor" },
    { value: "5", label: "dias de\nsequencia" },
    { value: "4", label: "variacoes por\npeca (A/B)" },
  ];

  results.forEach((r, i) => {
    const rx = 0.7 + i * 2.3;
    s.addText(r.value, {
      x: rx, y: 3.7, w: 2, h: 0.7,
      fontSize: 36, fontFace: TITLE_FONT, color: C.accent,
      bold: true, margin: 0,
    });
    s.addText(r.label, {
      x: rx, y: 4.4, w: 2, h: 0.5,
      fontSize: 11, fontFace: BODY_FONT, color: C.muted, margin: 0,
    });
  });

  // CTA
  s.addShape(pres.shapes.RECTANGLE, {
    x: 2.5, y: 5.0, w: 5.0, h: 0.5,
    fill: { color: C.accent },
  });
  s.addText("Vamos comecar?", {
    x: 2.5, y: 5.0, w: 5.0, h: 0.5,
    fontSize: 18, fontFace: TITLE_FONT, color: C.dark,
    bold: true, align: "center", valign: "middle", margin: 0,
  });
}

// ═══════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════
const outputPath = path.join(__dirname, "SPOT_Novo_Campeche_Apresentacao.pptx");
pres.writeFile({ fileName: outputPath }).then(() => {
  console.log("Apresentacao gerada com sucesso!");
  console.log("Arquivo:", outputPath);
}).catch(err => {
  console.error("Erro:", err);
});
