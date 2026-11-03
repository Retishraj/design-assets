// Exports the project as a folder of ordinary files, for handing over: export/previewly-<date>/ and a zip of it.
//   source/    the project as it is here: every page, src/ (all the JS and CSS, readable, commented), scripts/,
//              public/art (the art the pages use), the config, the brief. Not node_modules (npm install brings it
//              back), dist, the standalone file, nor the large art sources (assets/: the renders and plates that
//              npm run assets turns into public/art; reference/: archived versions)
//   site/      the site built from it, not minified and with plain file names (assets/main.js, assets/upload.js…), so
//              its JS reads like the source. Serve it from any static server, or zip it and upload it to Previewly
//   README.md  what's where, and how to run it
//   npm run export
import { build } from 'vite';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const day = new Date().toISOString().slice(0, 10);
const NAME = 'previewly-' + day, OUT = join('export', NAME), ZIP = join('export', NAME + '.zip');
rmSync(OUT, { recursive: true, force: true }); rmSync(ZIP, { force: true });
mkdirSync(join(OUT, 'source'), { recursive: true });

// the source: what's needed to run, build and change the site
const FILES = ['index.html', 'upload.html', 'ready.html', 'previews.html', 'login.html', 'view.html', 'mockups.html',
  'vite.config.js', 'package.json', 'package-lock.json', '.gitignore', 'README.md', 'CLAUDE.md', 'src', 'scripts', 'public'];
const skip = (p) => /(^|\/)\.DS_Store$/.test(p);
for (const f of FILES) cpSync(f, join(OUT, 'source', f), { recursive: true, filter: (p) => !skip(p) });

// the site, built from this project: readable JS (not minified), plain names. The bundler names a shared stylesheet
// after the first chunk that uses it; these are the files they come from
const CSS = { 'theme.css': 'base.css', 'store.css': 'app.css', 'main.css': 'styles.css' };
function cssName(a) { const n = (a.names && a.names[0]) || a.name || ''; return 'assets/' + (CSS[n] || '[name][extname]'); }
// the site, built from this project: readable JS (not minified), plain names
await build({
  logLevel: 'warn',
  build: {
    outDir: join(OUT, 'site'), emptyOutDir: true, minify: false,
    rollupOptions: { output: { entryFileNames: 'assets/[name].js', chunkFileNames: 'assets/[name].js', assetFileNames: cssName } }
  }
});
for (const f of readdirSync(join(OUT, 'site'), { recursive: true })) if (skip(f)) rmSync(join(OUT, 'site', f));

const list = (dir) => readdirSync(dir).filter((f) => !f.startsWith('.')).sort();
const js = (dir) => list(dir).filter((f) => f.endsWith('.js'));
writeFileSync(join(OUT, 'README.md'), `# Previewly, exported ${day}

The Previewly site as ordinary files: the landing page (a six-chapter scroll story) and the app pages (log in, upload
a file, its link and passcode, My previews, view a shared link). Everything runs in the browser and makes no
requests to other servers.

## \`source/\`: the project

Open this folder to work on the site.

\`\`\`
npm install
npm run dev          # the site at http://localhost:5173, live as you edit
npm run build        # the production build (minified) in dist/
npm run zip          # the build zipped, ready to upload to Previewly
npm run standalone   # every page in one self-contained HTML file
\`\`\`

- The pages: \`index.html\` (the landing page), \`upload.html\`, \`ready.html\`, \`previews.html\`, \`login.html\`,
  \`view.html\`. The app pages share \`src/app/partials/\` (their head and header).
- The landing page's JS, \`src/\`: ${js('src').join(', ')}.
- The app pages' JS, \`src/app/\`: ${js('src/app').join(', ')}.
- The Northvale screens: \`src/mockups/mockups.js\` and \`mockups.css\`.
- Styles: \`src/base.css\` (shared: tokens for both themes, header, buttons, glass), \`src/styles.css\` (the landing
  page), \`src/app/app.css\` (the app pages).
- The data is simulated in the browser by \`src/app/store.js\` (localStorage and IndexedDB): that one module is what
  the service's API replaces.
- The art the pages use is in \`public/art/\`. Its sources (the 4K renders and plates, 278 MB) and the archived
  earlier versions aren't in this export; \`npm run assets\` and \`npm run grade\` need them.
- \`CLAUDE.md\` is the full brief: every decision, the tuned values, what's been checked.

## \`site/\`: the built site

The site built from \`source/\`, not minified, so its JS is readable: ${js(join(OUT, 'site', 'assets')).join(', ')}.
Serve the folder from any static server (the pages use JavaScript modules, which browsers don't run from a file
opened from disk): in \`site/\`, \`python3 -m http.server 8080\`, then open http://localhost:8080. Or zip it and upload
it to Previewly.
`);

execFileSync('zip', ['-qr', NAME + '.zip', NAME, '-x', '*.DS_Store'], { cwd: 'export' });
const size = (p) => { let n = 0; for (const f of readdirSync(p, { recursive: true })) { const s = statSync(join(p, f)); if (s.isFile()) n += s.size; } return n; };
const mb = (n) => (n / 1048576).toFixed(1) + ' MB';
console.log(`wrote ${OUT}/: source ${mb(size(join(OUT, 'source')))}, site ${mb(size(join(OUT, 'site')))}; ${ZIP} ${mb(statSync(ZIP).size)}`);
if (!existsSync(join(OUT, 'site', 'index.html'))) throw new Error('the site did not build');
