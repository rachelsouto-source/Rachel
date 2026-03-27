const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, 'criativos_exportados');

const CRIATIVOS = [
  // FEED 1080x1080
  { id: 'creative-hero', name: '01_Feed_Hero_Investimento', w: 540, h: 540, realW: 1080, realH: 1080 },
  { id: 'creative-roi', name: '02_Feed_ROI_Numeros', w: 540, h: 540, realW: 1080, realH: 1080 },
  { id: 'creative-lifestyle', name: '03_Feed_Lifestyle_Localizacao', w: 540, h: 540, realW: 1080, realH: 1080 },
  { id: 'creative-comparison', name: '04_Feed_Comparativo_Investimentos', w: 540, h: 540, realW: 1080, realH: 1080 },
  { id: 'creative-location', name: '05_Feed_Localizacao_Terreno', w: 540, h: 540, realW: 1080, realH: 1080 },
  { id: 'creative-scarcity', name: '06_Feed_Escassez_Retargeting', w: 540, h: 540, realW: 1080, realH: 1080 },
  // STORIES 1080x1920
  { id: 'creative-story-roi', name: '07_Story_ROI_Urgencia', w: 360, h: 640, realW: 1080, realH: 1920 },
  { id: 'creative-story-location', name: '08_Story_Localizacao', w: 360, h: 640, realW: 1080, realH: 1920 },
  { id: 'creative-story-product', name: '09_Story_Produto', w: 360, h: 640, realW: 1080, realH: 1920 },
  { id: 'creative-story-monica', name: '10_Story_Monica_Depoimento', w: 360, h: 640, realW: 1080, realH: 1920 },
  // WIDE 1200x628
  { id: 'creative-wide', name: '12_Wide_Ad_Facebook_Google', w: 600, h: 314, realW: 1200, realH: 628 },
  // MÔNICA FEED
  { id: 'creative-monica', name: '13_Feed_Monica_Spokesperson', w: 540, h: 540, realW: 1080, realH: 1080 },
];

// Carousel slides are separate
const CAROUSEL_SLIDES = [
  { class: 'slide-1', name: '11a_Carousel_Slide1_PorQue' },
  { class: 'slide-2', name: '11b_Carousel_Slide2_Planta' },
  { class: 'slide-3', name: '11c_Carousel_Slide3_Renda' },
  { class: 'slide-4', name: '11d_Carousel_Slide4_CTA' },
];

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('Abrindo navegador...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: null,
  });

  const page = await browser.newPage();

  const htmlPath = `file://${path.resolve(__dirname, 'index.html').replace(/\\/g, '/')}`;
  console.log(`Carregando: ${htmlPath}`);
  await page.goto(htmlPath, { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait for fonts
  await page.waitForFunction(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 2000));

  console.log(`\nExportando ${CRIATIVOS.length + CAROUSEL_SLIDES.length} criativos...\n`);

  // Export each creative
  for (const c of CRIATIVOS) {
    try {
      const el = await page.$(`#${c.id}`);
      if (!el) {
        console.log(`  [SKIP] ${c.name} - elemento #${c.id} não encontrado`);
        continue;
      }

      // Set device scale for high-res export
      const scale = c.realW / c.w;
      await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: scale });
      await new Promise(r => setTimeout(r, 500));

      const filePath = path.join(OUTPUT_DIR, `${c.name}.png`);
      await el.screenshot({ path: filePath, type: 'png' });

      const stats = fs.statSync(filePath);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
      console.log(`  [OK] ${c.name}.png (${sizeMB} MB)`);
    } catch (err) {
      console.log(`  [ERR] ${c.name}: ${err.message}`);
    }
  }

  // Export carousel slides
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  await new Promise(r => setTimeout(r, 500));

  for (let i = 0; i < CAROUSEL_SLIDES.length; i++) {
    const s = CAROUSEL_SLIDES[i];
    try {
      const els = await page.$$(`.carousel-slide.${s.class}`);
      if (!els.length) {
        console.log(`  [SKIP] ${s.name} - slide não encontrado`);
        continue;
      }
      const filePath = path.join(OUTPUT_DIR, `${s.name}.png`);
      await els[0].screenshot({ path: filePath, type: 'png' });
      const stats = fs.statSync(filePath);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
      console.log(`  [OK] ${s.name}.png (${sizeMB} MB)`);
    } catch (err) {
      console.log(`  [ERR] ${s.name}: ${err.message}`);
    }
  }

  await browser.close();

  // Copy video
  const videoSrc = path.join(__dirname, 'output', 'Monica_NovoCampeche_SpotII.mp4');
  const videoDst = path.join(OUTPUT_DIR, '10_Video_Monica_NovoCampeche.mp4');
  if (fs.existsSync(videoSrc)) {
    fs.copyFileSync(videoSrc, videoDst);
    console.log(`  [OK] 10_Video_Monica_NovoCampeche.mp4 (vídeo copiado)`);
  }

  console.log(`\n========================================`);
  console.log(`  EXPORTAÇÃO COMPLETA!`);
  console.log(`  Pasta: ${OUTPUT_DIR}`);
  console.log(`  Total: ${CRIATIVOS.length + CAROUSEL_SLIDES.length} imagens + 1 vídeo`);
  console.log(`========================================\n`);
}

run().catch(console.error);
