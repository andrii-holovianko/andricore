/**
 * Testimonials. Each row: quote | author (name, role).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const list = document.createElement('div');
  list.className = 'testimonials-list';
  [...block.children].forEach((row) => {
    const [quote, author] = [...row.children];
    if (!quote) return;
    const figure = document.createElement('figure');
    const blockquote = document.createElement('blockquote');
    blockquote.append(...quote.childNodes);
    figure.append(blockquote);
    if (author) {
      const caption = document.createElement('figcaption');
      caption.append(...author.childNodes);
      figure.append(caption);
    }
    list.append(figure);
  });
  block.replaceChildren(list);
}
