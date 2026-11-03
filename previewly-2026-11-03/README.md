# Previewly, exported 2026-11-03

The Previewly site as ordinary files: the landing page (a six-chapter scroll story) and the app pages (log in, upload
a file, its link and passcode, My previews, view a shared link). Everything runs in the browser and makes no
requests to other servers.

## `source/`: the project

Open this folder to work on the site.

```
npm install
npm run dev          # the site at http://localhost:5173, live as you edit
npm run build        # the production build (minified) in dist/
npm run zip          # the build zipped, ready to upload to Previewly
npm run standalone   # every page in one self-contained HTML file
```

- The pages: `index.html` (the landing page), `upload.html`, `ready.html`, `previews.html`, `login.html`,
  `view.html`. The app pages share `src/app/partials/` (their head and header).
- The landing page's JS, `src/`: bar.js, camera.js, content.js, hero.js, intro.js, layout.js, main.js, pouch.js, rail.js, reveal.js, scroll.js, sets.js, smooth.js, sound.js, sparks.js, stage.js, state.js, streams.js, theme.js, ui.js, util.js, world.js, zipper.js.
- The app pages' JS, `src/app/`: datepick.js, login.js, previews.js, ready.js, render.js, shell.js, store.js, upload.js, view.js, zip.js.
- The Northvale screens: `src/mockups/mockups.js` and `mockups.css`.
- Styles: `src/base.css` (shared: tokens for both themes, header, buttons, glass), `src/styles.css` (the landing
  page), `src/app/app.css` (the app pages).
- The data is simulated in the browser by `src/app/store.js` (localStorage and IndexedDB): that one module is what
  the service's API replaces.
- The art the pages use is in `public/art/`. Its sources (the 4K renders and plates, 278 MB) and the archived
  earlier versions aren't in this export; `npm run assets` and `npm run grade` need them.
- `CLAUDE.md` is the full brief: every decision, the tuned values, what's been checked.

## `site/`: the built site

The site built from `source/`, not minified, so its JS is readable: login.js, main.js, mockups.js, previews.js, ready.js, render.js, store.js, theme.js, upload.js, view.js.
Serve the folder from any static server (the pages use JavaScript modules, which browsers don't run from a file
opened from disk): in `site/`, `python3 -m http.server 8080`, then open http://localhost:8080. Or zip it and upload
it to Previewly.
