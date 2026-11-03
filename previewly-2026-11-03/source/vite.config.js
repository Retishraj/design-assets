import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// the app pages share their <head> and header: <!-- @head --> and <!-- @header --> in a page are replaced by
// src/app/partials/head.html and header.html before Vite reads the page, so their links and scripts are bundled
const partial = (name) => readFileSync(resolve('src/app/partials', name + '.html'), 'utf8').trim();
const partials = {
  name: 'previewly-partials',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) => html.replace(/<!-- @(head|header) -->/g, (m, name) => partial(name))
  }
};

// base './' keeps every asset path relative, so the built site works
// at any URL depth on Previewly (e.g. previewly.cc/your-slug/).
export default defineConfig({
  base: './',
  plugins: [partials],
  server: { host: true },
  build: {
    assetsInlineLimit: 0, target: 'es2020',
    // the landing page and the app pages (mockups.html is for the dev server only)
    rollupOptions: {
      input: {
        main: resolve('index.html'),
        upload: resolve('upload.html'),
        ready: resolve('ready.html'),
        previews: resolve('previews.html'),
        login: resolve('login.html'),
        view: resolve('view.html')
      }
    }
  }
});
