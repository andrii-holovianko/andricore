/**
 * Experience timeline. Each row: period (and optional location) | details.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const ol = document.createElement('ol');
  [...block.children].forEach((row) => {
    const [meta, body] = [...row.children];
    if (!body) return;
    const li = document.createElement('li');
    meta.className = 'timeline-meta';
    body.className = 'timeline-body';
    li.append(meta, body);
    ol.append(li);
  });
  block.replaceChildren(ol);
}
