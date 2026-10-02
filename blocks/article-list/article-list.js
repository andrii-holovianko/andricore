import { createOptimizedPicture, readBlockConfig } from '../../scripts/aem.js';

/**
 * Publication time in ms: authored `date` metadata, falling back to lastModified.
 * @param {object} article Index entry
 * @returns {number}
 */
function articleTime(article) {
  const authored = Date.parse(article.date);
  if (!Number.isNaN(authored)) return authored;
  return Number(article.lastModified || 0) * 1000;
}

/**
 * Fetches pages from the query index.
 * @param {string} prefix Only pages whose path starts with this prefix
 * @returns {Promise<object[]>} Index entries, newest first
 */
async function fetchArticles(prefix) {
  const resp = await fetch('/query-index.json');
  if (!resp.ok) return [];
  const { data = [] } = await resp.json();
  return data
    .filter((entry) => entry.path.startsWith(prefix) && entry.path !== prefix)
    .sort((a, b) => articleTime(b) - articleTime(a));
}

function formatDate(time) {
  if (!time) return '';
  return new Date(time).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function buildCard(article) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = article.path;

  const image = document.createElement('div');
  image.className = 'article-list-image';
  if (article.image && !article.image.includes('default-meta-image')) {
    image.append(createOptimizedPicture(article.image, article.title, false, [{ width: '750' }]));
  } else {
    // no cover: a typographic placeholder in the style of the code blocks
    image.classList.add('article-list-image-placeholder');
    const label = document.createElement('span');
    label.textContent = article.path;
    image.append(label);
  }
  a.append(image);

  const body = document.createElement('div');
  body.className = 'article-list-body';
  const date = formatDate(articleTime(article));
  if (date) {
    const time = document.createElement('p');
    time.className = 'article-list-date';
    time.textContent = date;
    body.append(time);
  }
  const title = document.createElement('h3');
  title.textContent = article.title;
  body.append(title);
  if (article.description) {
    const description = document.createElement('p');
    description.textContent = article.description;
    body.append(description);
  }
  a.append(body);
  li.append(a);
  return li;
}

/**
 * Lists articles from the query index.
 * Optional config rows: `path` (default /blog/), `limit`.
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const config = readBlockConfig(block);
  let prefix = config.path || '/blog/';
  if (prefix.startsWith('http')) prefix = new URL(prefix).pathname;
  if (!prefix.endsWith('/')) prefix += '/';
  const limit = Number(config.limit) || 0;

  const articles = await fetchArticles(prefix);
  const ul = document.createElement('ul');
  (limit ? articles.slice(0, limit) : articles).forEach((article) => ul.append(buildCard(article)));

  if (!ul.children.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No articles yet.';
    block.replaceChildren(empty);
    return;
  }
  block.replaceChildren(ul);
}
