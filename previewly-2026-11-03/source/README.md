# Previewly

The Previewly site: a six-chapter scroll story with an interactive 3D zipper hero (the landing page), and the app
pages (log in, upload a file, its link and passcode, My previews, view a shared link), a front-end prototype. Builds
to a fully self-contained static site for hosting on Previewly.

```
npm install
npm run dev          # local preview (also on your phone via the Network URL)
npm run zip          # production build zipped as previewly-site.zip
npm run standalone   # every page in one HTML file, previewly-standalone.html
npm run export       # the project as a folder of files, export/previewly-<date>/: the source and a readable build
```

Everything about the design decisions, tuned values and next steps is in **CLAUDE.md**.
