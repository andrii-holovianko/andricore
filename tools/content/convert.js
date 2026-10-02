// Converts the LinkedIn markdown article into DA source HTML
const fs = require('fs');
const { marked } = require('marked'); // npm i marked (not a site dependency)

const SRC = 'C:/Users/andri/Documents/linkedin-articles/aem-multi-repo-reactor';
const MEDIA = 'https://content.da.live/andrii-holovianko/andricore/blog/media';
const SLUG = 'migrating-3-teams-to-aem-cloud';

const alt = (fig) => {
  const html = fs.readFileSync(`${SRC}/exports/${fig}.html`, 'utf8');
  const m = html.match(/aria-label="([^"]*)"/);
  return m ? m[1] : '';
};

// code block index (in document order) -> exported diagram
const FIGURES = {
  0: ['fig1', alt('fig1')],
  1: ['fig2', alt('fig2')],
  2: ['dirtree', 'Directory layout of the aggregator repository: root pom.xml, .gitmodules, Cloud Manager settings, shared resources, dispatcher and config folders, and one submodule per product repository.'],
  7: ['fig3', alt('fig3')],
  8: ['fig4', alt('fig4')],
  12: ['fig5', alt('fig5')],
  13: ['fig6', alt('fig6')],
};
// code blocks without a language that should still be highlighted
const LANGS = { 11: 'bash' };

let md = fs.readFileSync(`${SRC}/aem-multi-repo-article.md`, 'utf8').replace(/\r\n/g, '\n');
md = md.replace(/\n`#AEM[^\n]*`\s*$/, '\n'); // LinkedIn hashtags
md = md.replace(/^\n?---\n/gm, '\n'); // horizontal rules
let body = marked.parse(md, { gfm: true });
body = body.replace(/<(h[1-6]) id="[^"]*">/g, '<$1>');

let i = 0;
body = body.replace(/<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g, (m, attrs, code) => {
  const n = i;
  i += 1;
  if (FIGURES[n]) {
    const [fig, text] = FIGURES[n];
    return `<p><picture><img src="${MEDIA}/${SLUG}-${fig}.png" alt="${text.replace(/"/g, '&quot;')}"></picture></p>`;
  }
  if (LANGS[n] && !attrs) return `<pre><code class="language-${LANGS[n]}">${code}</code></pre>`;
  return m;
});

// markdown tables -> table block
body = body.replace(/<table>([\s\S]*?)<\/table>/g, (m, inner) => {
  const rows = [...inner.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((r) => {
    const cells = [...r[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map((c) => `<div>${c[1].trim()}</div>`);
    return `<div>${cells.join('')}</div>`;
  });
  return `<div class="table">${rows.join('\n')}</div>`;
});

const html = `<body><header></header><main>
<div>
${body}
</div>
<div>
<div class="metadata">
<div><div>Title</div><div>One Deployable, Many Repositories: Migrating a Multi-Site AEM Program to Cloud Service</div></div>
<div><div>Description</div><div>How we kept three independently-run product repositories and a shared library on one Cloud Manager pipeline with Git submodules, and why we ended up with three pipeline types.</div></div>
<div><div>Template</div><div>article</div></div>
<div><div>Author</div><div>Andrii Holovianko</div></div>
<div><div>Date</div><div>2026-09-17</div></div>
<div><div>Image</div><div><picture><img src="${MEDIA}/${SLUG}-cover.png" alt="One Deployable, Many Repositories"></picture></div></div>
</div>
</div>
</main><footer></footer></body>
`;
fs.mkdirSync(`${__dirname}/out/blog`, { recursive: true });
fs.writeFileSync(`${__dirname}/out/blog/${SLUG}.html`, html);
console.log('code blocks', i, '| figures', Object.keys(FIGURES).length, '| tables', (html.match(/class="table"/g) || []).length);
