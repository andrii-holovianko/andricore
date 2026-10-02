/**
 * Renders a table block as a real <table>. The first row becomes the header.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  [...block.children].forEach((row, i) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell) => {
      const td = document.createElement(i === 0 ? 'th' : 'td');
      if (i === 0) td.scope = 'col';
      while (cell.firstChild) td.append(cell.firstChild);
      tr.append(td);
    });
    (i === 0 ? thead : tbody).append(tr);
  });

  table.append(thead, tbody);
  block.replaceChildren(table);
}
