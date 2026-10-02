import { getMetadata } from '../../scripts/aem.js';

/**
 * Shows author and publication date from page metadata.
 * Auto-blocked on pages with `template: article`.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const author = getMetadata('author');
  const rawDate = getMetadata('date');
  const parts = [];

  if (author) {
    const span = document.createElement('span');
    span.className = 'article-meta-author';
    span.textContent = author;
    parts.push(span);
  }

  const date = rawDate ? new Date(rawDate) : null;
  if (date && !Number.isNaN(date.getTime())) {
    const time = document.createElement('time');
    time.dateTime = date.toISOString().slice(0, 10);
    time.textContent = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    parts.push(time);
  }

  if (!parts.length) {
    block.remove();
    return;
  }
  block.replaceChildren(...parts);
}
