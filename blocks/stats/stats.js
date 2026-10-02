/**
 * Key figures. Each row: value | label.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const dl = document.createElement('dl');
  [...block.children].forEach((row) => {
    const [value, label] = [...row.children];
    if (!value) return;
    const item = document.createElement('div');
    const dt = document.createElement('dt');
    dt.textContent = value.textContent.trim();
    const dd = document.createElement('dd');
    dd.textContent = label ? label.textContent.trim() : '';
    item.append(dt, dd);
    dl.append(item);
  });
  block.replaceChildren(dl);
}
