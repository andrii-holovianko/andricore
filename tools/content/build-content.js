// Generates DA source HTML for the site pages into ./content
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'out');
const LINKEDIN = 'https://www.linkedin.com/in/andrii-holovianko';

const esc = (s) => s.replace(/&(?!(amp|lt|gt|quot|#\d+);)/g, '&amp;');
const cell = (html) => `<div>${html}</div>`;
const row = (...cells) => `<div>${cells.map(cell).join('')}</div>`;
const block = (name, rows) => `<div class="${name}">${rows.join('')}</div>`;
const meta = (obj) => block('metadata', Object.entries(obj).map(([k, v]) => row(k, v)));
const sectionMeta = (obj) => block('section-metadata', Object.entries(obj).map(([k, v]) => row(k, v)));
const section = (...parts) => `<div>\n${parts.join('\n')}\n</div>`;
const page = (...sections) => `<body><header></header><main>\n${sections.join('\n')}\n</main><footer></footer></body>\n`;
const ul = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
const tags = (items) => `<p>${items.map((i) => `<code>${esc(i)}</code>`).join(' ')}</p>`;
const write = (file, html) => {
  const p = path.join(OUT, file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, html);
};

/* ---------- nav ---------- */
write('nav.html', page(
  section('<p><a href="/">Andrii Holovianko</a></p>'),
  section(`<ul>
<li><a href="/#work">Work</a></li>
<li><a href="/#experience">Experience</a></li>
<li><a href="/blog/">Writing</a></li>
<li><a href="/#contact">Contact</a></li>
</ul>`),
  section(`<p><a href="${LINKEDIN}">LinkedIn</a></p>`),
));

/* ---------- footer ---------- */
write('footer.html', page(
  section('<p><strong>Andrii Holovianko</strong></p><p>Senior AEM Developer &amp; Architect · Prague, Czechia</p>'),
  section(`<ul><li><a href="${LINKEDIN}">LinkedIn</a></li><li><a href="/blog/">Writing</a></li></ul>`),
  section(`<p>This site runs on Adobe Edge Delivery Services — authored as documents in DA, plain JavaScript and CSS, no build step.</p><p>© 2026 Andrii Holovianko</p>`),
));

/* ---------- home ---------- */
const expertise = [
  ['01', 'AEM architecture', 'AEM as a Cloud Service, AEM 6.x and hybrid AEM Sites + Edge Delivery Services setups — content structure, integrations, performance and scale.'],
  ['02', 'Edge Delivery Services', 'Block development, AEM authoring with Universal Editor and replatforming from legacy CMS to performance-first sites.'],
  ['03', 'Adobe App Builder', 'Custom extensions on Adobe I/O Runtime that take AEM past what the platform gives you out of the box.'],
  ['04', 'AI-assisted authoring', 'Co-built an AI authoring extension for AEM, rolled out across six customer projects on OpenAI and Azure OpenAI.'],
  ['05', 'Large-scale migrations', 'Content architecture, decomposition and zero-downtime cutover — from CQ 5.6 to AEM as a Cloud Service.'],
  ['06', 'Enterprise integrations', 'Azure, AWS, SAML/SSO, PIM/PDH, Adobe Commerce and enterprise search, designed to survive production load.'],
];

const work = [
  ['Eaton · 2023 – present', 'AEM 6.5 → AEM as a Cloud Service', 'Migration strategy and delivery for a global power-management platform, plus integration with the enterprise product data hub via custom APIs.', '66', 'countries on one platform'],
  ['Visit Qatar · 2021 – 2023', 'FIFA World Cup 2022', 'Tech lead for the official tourism platform on AEM as a Cloud Service: Azure integrations, the API layer behind the mobile apps, a team of five.', '0', 'downtime incidents during the tournament'],
  ['Daimler AG · 2017 – 2019', 'CQ 5.6 → AEM 6.2', 'Tech lead for the internal marketing platform used by truck merchants in 20 markets, including a search redesign that cut query times by 45%.', '1M+', 'pages migrated'],
  ['Replatforming · EDS', 'Magnolia CMS → Edge Delivery Services', 'Target architecture, EDS block library and Universal Editor content model, content migration and the authoring-to-publishing workflow.', 'EDS', 'with Universal Editor authoring'],
  ['Product · AI', 'AI authoring extension for AEM', 'Generates titles, SEO metadata and alt text for page, component and asset fields from images, page content and other fields.', '6', 'customer projects'],
  ['Hewlett Packard Enterprise · 2019 – 2021', '<a href="https://www.hpe.com">hpe.com</a>', 'AEM consultant on a global platform in 50+ countries: SSO and security hardening, refactoring of legacy modules, internal authoring plugins.', '35→65%', 'automated test coverage'],
];

const experience = [
  {
    period: 'Jun 2023 – Present', where: 'Remote · Prague',
    role: 'Senior AEM Developer &amp; Architecture Advisor', org: 'Eaton · <a href="https://www.eaton.com">eaton.com</a>',
    summary: 'Senior AEM developer on Eaton’s global digital platform across 66 countries, regularly consulted on architecture and solution design.',
    bullets: [
      'Contributed to the migration strategy and delivery of the AEM 6.5 → AEM as a Cloud Service migration',
      'Designed and built the integration with the enterprise PDH (product data hub) via custom APIs',
      'Advised on content structure, integrations, performance and scalability across multi-country sites',
      'Introduced CI/CD best practices and code review standards across the team',
    ],
    stack: ['AEMaaCS', 'AEM 6.5', 'Cloud Manager', 'Java', 'Sling', 'OSGi', 'Core Components', 'Coveo'],
  },
  {
    period: 'Sep 2021 – May 2023', where: 'Remote',
    role: 'AEM Tech Lead / Consultant', org: 'Emakina · <a href="https://www.visitqatar.com">visitqatar.com</a>, <a href="https://www.usait.org">usait.org</a>',
    summary: 'Tech lead of a five-engineer team on the AEM as a Cloud Service platform behind Qatar’s official tourism site during the FIFA World Cup 2022.',
    bullets: [
      'Designed Azure integrations: SAML authentication, Blob Storage, CosmosDB',
      'Led development of the API layer powering the official mobile applications',
      'Sustained platform availability through the tournament with zero downtime incidents',
      'Led the usait.org migration to AEM as a Cloud Service, including component decomposition',
    ],
    stack: ['AEMaaCS', 'Azure', 'SAML', 'CosmosDB', 'REST APIs'],
  },
  {
    period: 'Dec 2019 – Aug 2021', where: 'Kharkiv',
    role: 'Senior AEM Developer / Consultant', org: 'Exadel · <a href="https://www.hpe.com">hpe.com</a>',
    summary: 'AEM consultant on Hewlett Packard Enterprise’s global digital platform — 50+ countries, multi-language.',
    bullets: [
      'Implemented SSO authentication and security hardening across the multi-region platform',
      'Raised automated test coverage from 35% to 65% and led refactoring of legacy modules',
      'Developed internal plugins extending authoring capabilities; ran POCs feeding architecture decisions',
    ],
    stack: ['AEM', 'Java', 'SSO', 'JUnit', 'AEM Mocks'],
  },
  {
    period: 'Feb 2017 – Nov 2019', where: 'Kharkiv',
    role: 'Senior AEM Developer / Tech Lead', org: 'Mensemedia · Daimler AG',
    summary: 'Tech lead of a four-engineer team migrating Daimler AG’s internal marketing platform from CQ 5.6 to AEM 6.2 — over a million pages used by truck merchants in 20 markets.',
    bullets: [
      'Delivered the 1M+ page migration, including content structure redesign and component modernization',
      'Redesigned search for a complex product catalog (engines, gearboxes, cabs), cutting query times by 45%',
      'Architected the permission model and the AEM-to-AEM integration API for the MKP system',
      'Delivered mytruckparts.com end to end',
    ],
    stack: ['AEM 6.2', 'CQ 5.6', 'Java', 'Solr', 'REST APIs'],
  },
  {
    period: 'Nov 2013 – Feb 2017', where: 'Kharkiv',
    role: 'Senior Software Engineer / Deputy Team Lead', org: 'EPAM Systems · <a href="https://www.sap.com">sap.com</a>, <a href="https://www.canadiantire.ca">canadiantire.ca</a>',
    summary: 'From junior Java engineer to deputy team lead on two large AEM programs.',
    bullets: [
      'Designed and maintained the Google Search Appliance integration with AEM on sap.com',
      'Implemented Adobe Analytics and Adobe Target integrations for personalization at scale',
      'Contributed to the canadiantire.ca migration from Blue Martini CMS to Adobe CQ 5.6',
    ],
    stack: ['AEM', 'CQ 5.6', 'Java', 'Adobe Analytics', 'Adobe Target', 'GSA'],
  },
];

const certifications = [
  ['Adobe · 2022', 'Adobe Certified Master — AEM Sites Architect', 'https://certification.adobe.com/credential/verify/7635a540-196f-4011-b5d7-860afc1c28ad'],
  ['Adobe · 2023', 'Adobe Certified Expert — AEM Sites Developer', 'https://certification.adobe.com/credential/verify/6d946bc5-deed-44cf-af5c-331e5706e293'],
  ['Adobe · 2026', 'AEM Edge Delivery Services — Developer Professional', 'https://certification.adobe.com/completion/verify/ce06abf5-7784-43bc-8ea7-ec6a6f3209f1'],
  ['Oracle · 2015', 'Oracle Certified Associate, Java SE 8 Programmer', 'https://www.credly.com/badges/1b9a8b6d-6843-48a1-92bc-0cf1154ed043'],
  ['Education · 2013', 'B.Sc. Software Engineering, Kharkiv National University of Radioelectronics'],
];

const toolbox = [
  ['Adobe Experience Manager', 'AEM as a Cloud Service, AEM 6.0–6.5, Edge Delivery Services, Universal Editor, Cloud Manager, Core Components, Content Fragments, Assets, Dispatcher, MSM, Workflows'],
  ['Adobe ecosystem', 'App Builder, Adobe Commerce, Adobe Analytics, Adobe Target, Search &amp; Promote'],
  ['Core', 'Java, OSGi, Apache Sling, Sling Models, JCR, HTL, REST APIs, GraphQL'],
  ['Cloud &amp; integrations', 'Microsoft Azure, AWS, SAML/SSO, OpenAI and Azure OpenAI'],
  ['Frontend', 'JavaScript, TypeScript, HTML, CSS, Vue.js'],
  ['Search', 'Apache Solr, Elasticsearch, Endeca, Google Search Appliance'],
  ['DevOps &amp; quality', 'Git, Maven, Jenkins, Docker, CI/CD, SonarQube, JUnit, AEM Mocks, JMeter'],
];

const testimonials = [
  ['Having had the opportunity to work closely with Andrii for over a year, I highly recommend Andrii as an AEM Technical Lead. He is a skilled communicator, adept at asking the right questions to solve technical problems. Andrii’s pragmatic approach and ability to lead and earn the trust of his team make him an invaluable asset.',
    '<strong>Sven Aarts</strong>Senior Software Engineer · worked with Andrii on the same team'],
  ['If you give him just an idea, he’ll make all the best to have it implemented in the best way, clarify everything from requirements perspective, discuss solution with all necessary people and make sure deadlines are met. One of the most self-organized and self-managed persons I have ever worked with. Perfect combination of soft skills and deep tech knowledge.',
    '<strong>Tim Sakharchuk</strong>Senior Delivery Manager, Exadel · managed Andrii directly'],
];

write('index.html', page(
  section(block('hero', [row(`<p>Adobe Certified Master — AEM Sites Architect</p>
<h1>Andrii Holovianko</h1>
<p><strong>Senior AEM Developer &amp; Architect.</strong> 13+ years building and modernizing enterprise Adobe Experience Manager platforms for Fortune 500 organizations — from AEM as a Cloud Service migrations to Edge Delivery Services.</p>
<p><strong><a href="#contact">Get in touch</a></strong></p>
<p><em><a href="/blog/">Read the blog</a></em></p>`)])),
  section(block('stats', [
    row('13+', 'years with Adobe Experience Manager'),
    row('66', 'countries on one AEM platform'),
    row('1M+', 'pages moved in a single CMS migration'),
    row('6', 'customer projects running an AI authoring extension I co-built'),
  ])),
  section(
    '<h2>Architecture-level AEM work</h2>',
    '<p>I decide what stays on Sling and what moves to Edge Delivery Services, plan migrations that don’t break production, and extend AEM past what the platform gives you out of the box.</p>',
    block('cards', expertise.map(([n, t, d]) => row(`<p>${n}</p><h3>${t}</h3><p>${d}</p>`))),
    sectionMeta({ Eyebrow: 'What I do', Id: 'expertise' }),
  ),
  section(
    '<h2>Selected work</h2>',
    '<p>Platforms for HPE, SAP, Daimler AG, Eaton and Qatar Tourism — global, multi-language and under real production load.</p>',
    block('cards (work)', work.map(([l, t, d, n, u]) => row(`<p>${l}</p><h3>${t}</h3><p>${d}</p><p><strong>${n}</strong> ${u}</p>`))),
    sectionMeta({ Eyebrow: 'Work', Id: 'work', Style: 'muted' }),
  ),
  section(
    '<h2>Experience</h2>',
    '<p>From CQ 5.6 to AEM as a Cloud Service and Edge Delivery Services — 13+ years on enterprise AEM programs.</p>',
    block('timeline', experience.map((e) => row(
      `<p>${e.period}</p><p>${e.where}</p>`,
      `<h3>${e.role}</h3><p>${e.org}</p><p>${e.summary}</p>${ul(e.bullets)}${tags(e.stack)}`,
    ))),
    sectionMeta({ Eyebrow: 'Career', Id: 'experience' }),
  ),
  section(
    '<h2>Certifications &amp; education</h2>',
    block('cards (compact)', certifications.map(([l, t, url]) => row(`<p>${l}</p><h3>${t}</h3>${url ? `<p><a href="${url}">Verify credential</a></p>` : ''}`))),
    sectionMeta({ Eyebrow: 'Credentials', Id: 'certifications' }),
  ),
  section(
    '<h2>Toolbox</h2>',
    block('cards (compact)', toolbox.map(([t, d]) => row(`<h3>${t}</h3><p>${d}</p>`))),
    sectionMeta({ Eyebrow: 'Stack', Id: 'toolbox' }),
  ),
  section(
    '<h2>What colleagues say</h2>',
    block('testimonials', testimonials.map(([q, a]) => row(`<p>${q}</p>`, `<p>${a}</p>`))),
    sectionMeta({ Eyebrow: 'Recommendations', Id: 'recommendations', Style: 'muted' }),
  ),
  section(
    '<h2>Writing</h2>',
    '<p>Notes from real AEM programs: architecture, migrations and Edge Delivery Services.</p>',
    block('article-list', [row('limit', '3')]),
    '<p><em><a href="/blog/">All articles</a></em></p>',
    sectionMeta({ Eyebrow: 'Blog', Id: 'writing' }),
  ),
  section(
    '<h2>Let’s talk</h2>',
    '<p>The fastest way to reach me is LinkedIn. Based in Prague, Czechia (CET), working remotely.</p>',
    `<p><strong><a href="${LINKEDIN}">Message me on LinkedIn</a></strong></p>`,
    sectionMeta({ Eyebrow: 'Contact', Id: 'contact', Style: 'contact' }),
  ),
  section(meta({
    Title: 'Andrii Holovianko — Senior AEM Developer & Architect',
    Description: 'Adobe Certified Master — AEM Sites Architect with 13+ years building enterprise Adobe Experience Manager platforms: AEM as a Cloud Service, Edge Delivery Services, App Builder.',
  })),
));

/* ---------- blog index ---------- */
write('blog/index.html', page(
  section(
    '<h1>Writing</h1>',
    '<p>Notes from real AEM programs: architecture decisions, migrations, Cloud Manager and Edge Delivery Services.</p>',
    block('article-list', [row('path', '/blog/')]),
    sectionMeta({ Eyebrow: 'Blog', Style: 'blog-index' }),
  ),
  section(meta({
    Title: 'Writing — Andrii Holovianko',
    Description: 'Articles about Adobe Experience Manager architecture, AEM as a Cloud Service migrations and Edge Delivery Services.',
  })),
));

console.log('content written to', OUT);
