// Exports the whole site as one self-contained HTML file, previewly-standalone.html: the landing page and the app
// pages (upload, ready, My previews, log in, view). Open it from disk (no server), send it, or attach it. Nothing is
// fetched from anywhere, not even from beside it.
//   npm run standalone
// How: Vite builds each page on its own into one script, with the fonts inlined into the CSS; each page's script and
// CSS go into its HTML, and the six pages are kept in the file as strings (window.__PAGES). Opened, the file writes the
// page its address names (?p=upload&…; none: the landing page) over itself, so every page runs as it does on the site.
// The pages link to each other through util.js pageUrl(), which gives ?p= addresses in this file (window.__STANDALONE),
// and their own links are rewritten here. The font is kept once (window.__FONT) and put back into each page as it's
// written; the art (public/art, AVIF only: every browser that runs the page's WebGL reads AVIF) is embedded as data
// URIs in window.__ART, which util.js asset() looks paths up in. What's uploaded stays in the browser (localStorage,
// IndexedDB), as on the site.
import { build } from 'vite';
import { mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import config from '../vite.config.js';

const OUT = 'previewly-standalone.html';
const PAGES = ['index', 'upload', 'ready', 'previews', 'login', 'view'];
const FONT = '__PREVIEWLY_FONT__';
const inline = (code) => code.replace(/<\/script/gi, '<\\/script');   // a script's own text can't close its tag early
let font = null;
const pages = {};

for (const name of PAGES) {
  const tmp = mkdtempSync(join(tmpdir(), 'standalone-'));
  await build({
    configFile: false,      // one page at a time, with the shared head and header put in (vite.config.js's plugin)
    plugins: config.plugins,
    base: './',
    logLevel: 'warn',
    publicDir: false,
    build: {
      outDir: tmp, emptyOutDir: true, modulePreload: false, cssCodeSplit: false, target: 'es2020',
      assetsInlineLimit: (file) => file.endsWith('.woff2'),   // the fonts go into the CSS
      rollupOptions: { input: name + '.html', output: { inlineDynamicImports: true } }
    }
  });
  const assets = readdirSync(join(tmp, 'assets'));
  const js = readFileSync(join(tmp, 'assets', assets.find((f) => f.endsWith('.js'))), 'utf8');
  let css = assets.filter((f) => f.endsWith('.css')).map((f) => readFileSync(join(tmp, 'assets', f), 'utf8')).join('\n');
  let html = readFileSync(join(tmp, name + '.html'), 'utf8');
  rmSync(tmp, { recursive: true, force: true });
  // links between the pages (in the markup; the scripts use pageUrl()): this file, with the page in its address
  html = html.replace(/href="(index|upload|ready|previews|login|view)\.html(?:\?([^"#]*))?"/g, (m, p, q) => `href="?p=${p}${q ? '&amp;' + q : ''}"`);

  // the font once for all the pages
  css = css.replace(/url\((["']?)(data:font\/woff2;base64,[^"')]+)\1\)/g, (m, q, uri) => { font = uri; return 'url(' + FONT + ')'; });
  // the page: no preloads (the fonts are in the CSS), the CSS and the script inline
  html = html.replace(/<link rel="(?:preload|modulepreload)"[^>]*>\n?/g, '');
  html = html.replace(/<script type="module" crossorigin src="[^"]+"><\/script>/, () => '');
  html = html.replace(/<link rel="stylesheet" crossorigin href="[^"]+">\n?/g, '');
  html = html.replace('</head>', () => `<style>${css}</style>\n</head>`);
  // the script as a classic one, strict and in its own scope as a module would be: a module written in by
  // document.write ran on the first page opened but not on a page reached from it (Chrome). One bundle per page, so
  // it has no imports or exports to need a module for
  if (/^\s*(import|export)\b|\bimport\.meta\b|\bimport\(/m.test(js)) throw new Error(name + ': the bundle needs to be a module');
  html = html.replace('</body>', () => `<script>(function(){'use strict';\n${inline(js)}\n})();</script>\n</body>`);
  pages[name] = html;
}

const art = {};
for (const f of readdirSync('public/art').filter((f) => f.endsWith('.avif')).sort()) {
  art['art/' + f] = 'data:image/avif;base64,' + readFileSync('public/art/' + f).toString('base64');
}
// as a script's text: JSON, with every "</" written "<\/" (the same string, and nothing can close the tag)
const data = (v) => JSON.stringify(v).replace(/<\//g, '<\\/');
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Previewly</title>
<!-- the ground in the visitor's theme until the page is written over it -->
<script>(function(){var t;try{t=localStorage.getItem('previewly-theme')}catch(e){}if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.style.background=t==='dark'?'#0A0C11':'#EEF0F3';})();</script>
</head>
<body>
<script>window.__STANDALONE = 1; window.__FONT = ${data(font)};</script>
<script>window.__PAGES = ${data(pages)};</script>
<script>window.__ART = ${data(art)};</script>
<!-- the page this address names (?p=…), written over this one once it's read -->
<script>addEventListener('DOMContentLoaded', function () {
  var p = new URLSearchParams(location.search).get('p'), h = (window.__PAGES[p] || window.__PAGES.index).split('${FONT}').join(window.__FONT);
  document.open(); document.write(h); document.close();
});</script>
</body>
</html>
`;
writeFileSync(OUT, html);
const mb = (n) => (n / 1048576).toFixed(1) + ' MB';
console.log(`wrote ${OUT}: ${mb(statSync(OUT).size)} (${PAGES.length} pages, ${Object.keys(art).length} embedded images)`);
