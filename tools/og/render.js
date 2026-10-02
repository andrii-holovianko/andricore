// Renders Open Graph images (1200x627) from og.html. Needs puppeteer-core + local Chrome.
// usage: node render.js  -> out/og-home.png, out/og-blog.png
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer-core');

const VARIANTS = {
  'og-home': {},
  'og-blog': {
    pill: 'Writing · andricore.com/blog',
    title: 'Notes from real AEM programs',
    role: '<b>Architecture, migrations, EDS.</b> By Andrii Holovianko.',
    hideStats: true,
    tags: ['AEMaaCS', 'Cloud Manager', 'Edge Delivery Services'],
    domain: 'andricore.com/blog',
  },
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 627, deviceScaleFactor: 1 });
  fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
  for (const [name, v] of Object.entries(VARIANTS)) {
    await page.goto(`file://${path.join(__dirname, 'og.html')}`, { waitUntil: 'networkidle0' });
    await page.evaluate((o) => {
      if (o.pill) document.getElementById('pill').textContent = o.pill;
      if (o.title) {
        const h1 = document.getElementById('title');
        h1.textContent = o.title;
        h1.style.fontSize = '72px';
      }
      if (o.role) document.getElementById('role').innerHTML = o.role;
      if (o.tags) document.getElementById('tags').innerHTML = o.tags.map((t) => `<span>${t}</span>`).join('');
      if (o.domain) document.getElementById('domain').textContent = o.domain;
      if (o.hideStats) document.getElementById('stats').remove();
    }, v);
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(__dirname, 'out', `${name}.png`);
    await page.screenshot({ path: out });
    console.log(out);
  }
  await browser.close();
})();
