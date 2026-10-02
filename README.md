# andricore

Personal site and blog of Andrii Holovianko — Senior AEM Developer & Architect.

- **Production:** https://andricore.com
- **Live origin:** https://main--andricore--andrii-holovianko.aem.live/
- **Preview:** https://main--andricore--andrii-holovianko.aem.page/

Built on [Adobe Edge Delivery Services](https://www.aem.live/) (EDS). Content is authored as documents in
[DA](https://da.live/#/andrii-holovianko/andricore); this repository holds only code: plain JavaScript and CSS,
no build step, no framework.

## How it works

```
 author ──► da.live (documents) ──► Preview ──► *.aem.page ──► Publish ──► *.aem.live
                                                                              │
 developer ──► GitHub main ──► AEM Code Sync ──► code bus ────────────────────┤
                                                                              ▼
 visitor ──► andricore.com ──► Cloudflare (Worker: cdn/cloudflare) ──► main--andricore--andrii-holovianko.aem.live
```

- **Content** lives in DA. Each page is a document; a *block* is a table whose first row is the block name.
  Preview renders to `.aem.page`, Publish to `.aem.live`.
- **Code** lives here. A push to `main` is live on `.aem.page` / `.aem.live` within seconds (AEM Code Sync GitHub App).
- **Configuration** (content source, index, sitemap, CDN) lives in the AEM Configuration Service, not in files.
  `fstab.yaml` and `helix-query.yaml` are not used. Copies of the YAML we uploaded are in [`tools/config`](tools/config).
- **Production domain** is served by a Cloudflare Worker that proxies to the `.aem.live` origin.

## Repository layout

```
blocks/              one folder per block: <name>.js (decorate) + <name>.css
  article-list/      list of articles from /query-index.json
  article-meta/      author · date line, auto-inserted on `template: article` pages
  cards/             grid of cards; variants: (work), (compact)
  columns/ fragment/ boilerplate blocks
  footer/ header/    load /footer and /nav documents as fragments
  hero/              page intro; eyebrow paragraph before the H1
  stats/             key figures, value | label
  table/             renders an authored table as a real <table>
  testimonials/      quote | author
  timeline/          experience: period | details
  widget/            boilerplate
scripts/
  aem.js             EDS runtime (vendored from the boilerplate — do not edit)
  scripts.js         page decoration: auto blocks, section eyebrows, loading phases
  highlight.js       lazy syntax highlighting for `pre > code`
  vendor/hljs/       highlight.js core + grammars (xml, ini, yaml, bash, java, javascript)
styles/
  styles.css         design tokens (light/dark), typography, sections, article template
  fonts.css          Inter + JetBrains Mono (self-hosted, fonts/)
  lazy-styles.css    syntax highlighting theme (loaded after LCP)
cdn/cloudflare/      Cloudflare Worker for andricore.com (Adobe's official BYO-CDN worker)
tools/content/       one-off scripts that generated the initial DA pages
tools/config/        copies of query.yaml / sitemap.yaml uploaded to the Configuration Service
```

`.hlxignore` keeps `cdn/`, `tools/` and Markdown files from being served by EDS.

## Authoring reference

Blocks are tables in DA. Variants go in brackets in the block name, e.g. `Cards (work)`.

| Block | Rows | Notes |
|---|---|---|
| `Hero` | one cell: eyebrow paragraph, H1, lead paragraph, buttons | A paragraph right before the H1 renders as a pill badge |
| `Stats` | `13+` \| `years with AEM` | 2 columns on mobile, 4 on desktop |
| `Cards` | one cell per card: optional label paragraph, H3, text | `(work)`: last paragraph with **bold** number is the outcome; `(compact)`: small cards |
| `Timeline` | `period / location` \| `H3 role, org line, summary, list, stack` | Stack: last paragraph of `inline code` items renders as tags |
| `Testimonials` | `quote` \| `**Name** role` | |
| `Article List` | optional `path` \| `/blog/`, `limit` \| `3` | Reads `/query-index.json`, newest `Date` first |
| `Table` | header row, then data rows | Use for any tabular data — a plain table would become a block |
| `Metadata` | `Title`, `Description`, `Image`, `Template`, `Author`, `Date` | `Template: article` enables the reading layout and `article-meta` |
| `Section Metadata` | `Style` (`muted`, `contact`, `blog-index`), `Id`, `Eyebrow` | `Eyebrow` adds the small label above the section heading |

Buttons: a link alone in a paragraph becomes a button when it is **bold** (primary) or *italic* (secondary).

Code blocks keep their language from the editor (e.g. `xml`, `ini`, `bash`) and are highlighted lazily.

## Local development

```sh
npm i
npx @adobe/aem-cli up        # http://localhost:3000 — local code + previewed content
npm run lint                 # eslint + stylelint
```

Notes:

- Line endings must be LF (enforced by `.gitattributes`; eslint fails on CRLF).
- Check what the pipeline produces before writing a block: `curl localhost:3000/<path>.plain.html`.
- Every committed file is served unless listed in `.hlxignore`.

## Deploying

- **Code:** push to `main`. Nothing else to do.
- **Content:** Preview, then Publish in DA (or the sidekick). Publishing also updates the query index and sitemap.
- **Worker:** `cd cdn/cloudflare && npx wrangler deploy` (only when the worker changes).

## Performance

Lighthouse on `.aem.live` (October 2026): 100 / 100 / 100 on all pages, 98 performance on the long article on
mobile. SEO scores 69 on `.aem.live` only because that domain sends `X-Robots-Tag: noindex`; the production
domain does not.
