const LANGUAGES = {
  xml: 'xml',
  html: 'xml',
  ini: 'ini',
  toml: 'ini',
  yaml: 'yaml',
  yml: 'yaml',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  java: 'java',
  js: 'javascript',
  javascript: 'javascript',
};

/**
 * Syntax-highlights `pre > code` blocks that declare a known `language-*` class.
 * Grammars are loaded on demand, only for the languages present on the page.
 * @param {Element} main The container element
 */
export default async function highlight(main) {
  const blocks = [...main.querySelectorAll('pre > code')].map((code) => {
    const cls = [...code.classList].find((c) => c.startsWith('language-'));
    const lang = cls ? cls.slice('language-'.length).toLowerCase() : '';
    return { code, lang, grammar: LANGUAGES[lang] };
  });

  blocks.forEach(({ code, lang }) => {
    if (lang && lang !== 'plaintext' && lang !== 'text') code.parentElement.dataset.lang = lang;
  });

  const grammars = [...new Set(blocks.map((b) => b.grammar).filter(Boolean))];
  if (!grammars.length) return;

  const base = `${window.hlx.codeBasePath}/scripts/vendor/hljs`;
  const [{ default: hljs }, ...modules] = await Promise.all([
    import(`${base}/core.min.js`),
    ...grammars.map((g) => import(`${base}/${g}.min.js`)),
  ]);
  grammars.forEach((g, i) => hljs.registerLanguage(g, modules[i].default));
  hljs.configure({ ignoreUnescapedHTML: true });

  // highlight one block per task so long pages don't block the main thread
  // eslint-disable-next-line no-restricted-syntax
  for (const { code, grammar } of blocks.filter((b) => b.grammar)) {
    code.classList.add(`language-${grammar}`);
    hljs.highlightElement(code);
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => { setTimeout(resolve, 0); });
  }
}
