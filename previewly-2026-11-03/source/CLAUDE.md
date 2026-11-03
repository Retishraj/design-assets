# Previewly landing page — project brief

Read this first. It records the decisions made so far, so work can continue without re-asking the designer (Taoufik)
what is already settled. The previous site (plates, AI-video transitions, the Spline and Blender heroes) is archived in
`reference/site-v1/`, with its full brief in `reference/site-v1/CLAUDE-v1.md`; its history and measurements are there.

## What this is

A landing page for **Previewly** (previewly.cc): upload a ZIP of a static site (HTML/CSS/JS), get a shareable,
optionally passcode-protected URL that stays the same across version updates. **The URL is the hero of the story**:
one pinned address bar that never moves and never changes.

The page tells it in six scroll chapters around a fictional bank's prototype, **Northvale**: the frosted pouch is
unzipped (drag or scroll), its files burst out, three of them become the bank's landing page, dashboard and PDF
statement, the landing page is locked behind a passcode, the dashboard is updated from v2 to v3 under the same link,
and the link streams out to a phone, a laptop and a tablet.

Beside it, the **app pages** (since 2 Nov 2026): Flow 1, Upload (log in, upload a file, its link and passcode, My
previews) and Flow 2, View (paste a shared link, enter its passcode, see the document). A front-end prototype: see
"The app pages".

**The site must be self-contained and static** — it is zipped and hosted on Previewly. No requests to any other
server (no CDNs, no Google Fonts, no remote images, no analytics). See "Network rule".

## Run it

```
npm install
npm run dev          # local preview; also reachable from a phone on the same Wi-Fi (URL printed in terminal)
npm run build        # production build into dist/
npm run zip          # build + previewly-site.zip, ready to upload to Previewly
npm run standalone   # the whole site, every page, as one self-contained file: previewly-standalone.html (opens from disk)
npm run export       # the project as a folder of ordinary files, export/previewly-<date>/ (+ .zip): source/ and site/
npm run assets       # the isolated renders -> the page's layers: assets/renders -> public/art + src/art.json
npm run grade        # the plates only (reference): the original Higgsfield PNGs graded like the masters
node scripts/measure-scroll.mjs [url] [--wheel] [--cpu=4] [--phone] [--headed] [--network]   # frame timing
node scripts/shoot.mjs [url] --theme=dark --at=60,372,1020 [--size=390x844 --dpr=3] [--reduced]   # full-res shots
```

## Links

- Figma (design source, the storyboards): https://www.figma.com/design/Vw0OVWvXLzi4Hjply6bnko — page
  `Hi-fi — A vs A+B (rendered)` (node 15:2), row `A+B`. Its plates set the look; since 30 Oct the objects are
  re-rendered in isolation at 4K (see "The renders").
- `mockups.html` (dev server only, not built): every Northvale mockup at 1:1; `?only=dashboard3`, `?scale=0.4`,
  `?new` (outlines what each version added), `?check` (overflow and font-size report).

## Decisions (29 Oct 2026, Taoufik's brief)

- **Visuals:** the Figma plates' objects (the frosted pouch, the bag and its six tiles, the cobalt padlock, the
  phone, laptop and tablet), cut out of the 4K plates with their translucency, shadows and reflections. **No Blender
  and no Spline 3D** (Taoufik, after seeing the Blender rebuild start). The glass panes are built in CSS 3D in the
  plates' frosted-glass look, with real HTML on them.
- **Content:** a banking prototype. Chapter 3 shows its landing page, dashboard and a PDF statement; chapter 5 shows
  the dashboard changing from v2 to v3 and the update process; chapter 6 shows real screens (dashboard, landing page,
  phone app) on the devices, fed by light streams from the URL bar.
- **Layout:** everything centred on one frame; copy centred under the art. No top navigation: a side progress rail
  with a tooltip per chapter, its fill and head glowing while it moves.
- **Type:** Geist (variable, self-hosted, OFL; `src/fonts/Geist-OFL.txt`). Geist Mono was dropped on 30 Oct 2026.
- **Themes:** light and dark, toggled in the header (remembered; the system's until chosen). Supersedes the old
  light-only rule: the cut-outs carry their own alpha, so they sit on either background.
- **Motion:** GSAP 3.15.0 (timelines, SplitText) and Lenis 1.3.26, both bundled. The pouch turns in on load
  with a halo glow behind it and a light sweep across it.

## Decisions (30 Oct 2026, Taoufik: "the visuals have bad quality")

- **Crisp art from the originals** (superseded the same day by isolated renders, below): the cut-outs came from
  the original GPT Image 2.5 PNGs (downloaded from their Higgsfield jobs into `assets/plates-4k/hf-originals`), not
  the JPEG masters (about 0.6 MB for 4K, visibly compressed). `npm run grade` fits each JPEG master's grade (per
  channel, from the PNG) and applies it to the PNG: `assets/plates-4k/graded/plateNN.png`, within 1 level of the
  masters on average. An enhancing upscale (Higgsfield's bytedance upscaler) was tried and fails on 4K inputs: they
  are already its maximum.
- **The glass panels are rendered glass:** a GPT Image 2.5 render (4K, high, transparent background, plate 03 as the
  material reference; job `76a53c49-a0db-4ef5-ab43-b4ed63f5ade7`, its sibling `a879bd9d-…` unused, 8.5 credits for
  the pair) of one thick polished glass slab, front-on, with a clear centre (`assets/glass/`). It is drawn over each
  pane's live screen as a 9-slice (`border-image`), so its corners and bevels keep their shape at the panes' 16:10.
- **Geist only:** no Geist Mono anywhere (site and mockups); figures use tabular numerals.
- **Laser light:** the rail, the streams to the devices and the update beam are lasers, cobalt `#2B6CF6` to neon cyan
  (`--laser-a`, `--laser-mid`, `--laser-b`, `--laser-core` per theme).
- **The mockups are blue:** every green in Northvale's screens became blue by hue (navy brand, blue positives); the
  warm cream, sand and clay stay. This replaces the earlier "Northvale is never blue" rule.

## Decisions (30 Oct 2026, second round: glass, smoothness, depth, streaks, devices, reflections)

- **New renders, not upscales:** every object (pouch, pull, bag, six tiles, padlock, phone, laptop, tablet) was
  generated again with Higgsfield on GPT Image 2.5 as an isolated object on a transparent background (4K, the pull and
  the padlock at 2K), with the plates as references, so edges are crisp and nothing is cut out of a studio background.
  Upscaling the old cut-outs was ruled out (blurred edges). 35.25 credits (186.93 → 151.68). The plate cut-outs, their
  floor layers and `cutouts.mjs` are archived in `reference/site-v1/art-plate-cutouts/`.
- **Glassmorphism** for the page's components: the URL bar, icon buttons, rail tooltips, keypad and keys, update
  card, version switcher, counter, file chips, buttons and toast are frosted glass (`--g-fill`, `--g-key`, `--g-edge`,
  `--g-blur`, `--g-hi` per theme; dark glass is smoked, dense enough that the light mockups don't turn it grey).
- **Depth:** a floor plane in the 3D scene (light pool and grid, fading at every edge), objects that stand on it get
  a contact shadow and a mirrored reflection (the pouch, the bag, the padlock); floating objects (panes, devices) get a
  soft pool on the floor line; light motes at different depths give parallax; a camera path runs through every
  chapter (superseded by the travelling camera, below).
- **Light streaks** (after Taoufik's reference loader): the side rail and the streams to the devices are one
  renderer (`sparks.js`): a faint guide, a streak brightening to a flaring head, fine sparks; cobalt to neon cyan.
  The URL bar had one too, along its lower edge; Taoufik found it "very weird and off" (its glow cut by the pill's
  border, running backwards with its head flaring as the address typed itself), so the bar has a plain progress
  line instead (below).
- **Devices:** rendered with their screens off (black glass); the pages are mapped onto the screens' traced quads.
- **The pouch's proportions** (Taoufik: "why is the bag tall?", then "try a squarer one"): the first render came
  out 0.64 as wide as tall against the Figma pouch's 0.84 (in three-quarter view, so wider still face-on), and drawn
  540 px tall it read as a column. A slim sleeve at 0.76 (`407a8451-…`, 21 credits for it and an unused sibling) was
  still too tall; the pouch now is a nearly square one at 0.88 (job `66595a50-3038-4438-980d-7fde31d26229`, made
  from the 0.76 one and the Figma plate; its sibling `80cc83df-…` at 0.94 unused; 14 credits, 130.68 → 116.68),
  drawn 500 frame px tall (about 442 wide; 450 until Taoufik asked for it a bit bigger, so it's now a little wider
  than the bag it relaxes into). The earlier ones are kept as `assets/renders/pouch-tall.png` and
  `pouch-slim.png`. The bag render was made from the tall pouch; its material still matches.
- **The pull rides the seam by the slider's top** (the teeth part there): the V's apex meets it, and closed it sits
  flush with the pouch's top edge (anchored by its middle, it stood 7 px above it).
- **The Emirates NBD logomark on the pull's tab** (Taoufik, 30 Oct; `src/brand/enbd-logomark.svg`, the paths of his
  file, inlined as vector so it stays crisp and costs no request): white, faintly debossed, centred on the tab's face
  at 56% of its width. The tab was made wider for it: a new pull render with a badge-like tab (job
  `9c116e55-7c03-4b38-aed6-a0eca7ac72bb`, 0.43 as wide as tall against the pill's 0.23), drawn 30 px wide. **One
  pull through chapters 1 and 2:** the bag was re-rendered with no slider or pull of its own (job
  `234ea1e4-f246-4036-9124-3b5e0dd99f83`, the teeth meeting at a small stop), so the pouch's pull lands at the bag's
  V and a copy of it, logo and all, hangs there in chapter 2 (a bag render with its own wide tab, `bag-wide-tab.png`,
  had its tab 31 px off the pouch's at the hand-over). 26.5 credits (116.68 → 90.18) for the two pulls and three
  bags.

## Decisions (30 Oct 2026, Taoufik: "change the whole animation experience")

- **The camera travels from phase to phase.** Each chapter's set stands at its own station along one long studio
  floor (`world.js`; chapters 1 and 2 share the first), and scrolling moves the camera from station to station in a
  cinematic move (`camera.js`): it eases out of each rest, pulls back and cranes on the way, pans ahead or swings
  round what it carries, and eases into the next rest, square on the next set. What travels between sets goes with
  it: the three files fly from the bag to the Host station with the camera following them, the landing page is
  carried from station to station and finally dives into the laptop. At every rest the set is framed exactly as it
  was designed, so the copy, keypad, switcher and update card are unchanged there; between rests they follow their
  objects (`project()`).
- Each set still animates in place when the camera arrives (the burst, the panes assembling, the frost and padlock,
  the update, the devices rising and the streams).

## Decisions (2 Nov 2026, Taoufik's wireframes: the Upload and View flows)

- **Eight wireframes** (screens of the service's own app at localhost:3000): Upload a preview, Your preview is ready
  (before and after the passcode), My previews, Log in, Open shared document (passcode, its error, the document).
  Their copy is kept word for word, the passcode error included ("Something went wrong. Please try again.").
- **A front-end prototype** (Taoufik's choice): static pages in this site; uploads, links, passcodes and the previews
  list are simulated in the browser (`src/app/store.js`), so the network rule holds. The service's developers replace
  that one module with its API.
- **View starts with a link** (Taoufik's choice): a short "Open shared document" step to paste the link, then the
  passcode page, then the document. A shared link opens on the passcode step directly.
- **Log in before Upload and My previews** (Taoufik's choice), then on to the page that asked; viewing a shared link
  needs no account. Sign up and Forgot password aren't built (they say so in a toast).
- **The landing page's system** (Taoufik's choice): Geist, cobalt, the glass, both themes and the same toggle; calm app
  layouts after the wireframes, no 3D. The header on every page has **View** next to **Upload ZIP** (the CTA the brief
  asked for; on the landing page too; phones say "Upload").

## The app pages

- Pages: `upload.html` → `ready.html?id=` (link, expiry, Generate passcode, shown once) ; `previews.html` (the table,
  re-generate in a dialog that asks first) ; `login.html?next=` ; `view.html` (paste) → `view.html?t=<token>`
  (passcode) → the document, in place. `view.html?t=…&own=1` is My previews' Open: signed in, no passcode, a note that
  it's what recipients see (or that the link has expired). Expired and unknown links have their own state.
- Shared parts: `src/app/partials/head.html` and `header.html`, put in by a small plugin in `vite.config.js`
  (`<!-- @head -->`, `<!-- @header -->`); `src/base.css` (the tokens, Geist, header, buttons, toast, glass; the landing
  page links it too) and `src/app/app.css`; `src/app/shell.js` (theme, current page, toast, copy, fields).
- Data (`store.js`): the previews in localStorage (`previewly-previews`), each file in IndexedDB (`previewly`), the
  session in localStorage with Remember me, else sessionStorage (`previewly-session`; the protected pages check it in
  their `<head>`, before paint), unlocked links per tab in sessionStorage. Links are `view.html?t=` + 43-character
  base64url tokens; passcodes are 10 characters without look-alikes, compared case-blind. A first visit gets seven
  sample previews from the Northvale story (two expired), drawn by `render.js` from `src/mockups`.
- The viewer (`render.js`): sample pages at their own size, Fit (to the width) or 100%; uploads by type: images, PDF
  (the browser's viewer), HTML (a sandboxed frame), a ZIP site (`zip.js` reads it in the page: its index.html with
  stylesheets, scripts, images and fonts inlined as data URLs; links between its pages and fetches from its scripts
  don't resolve), text; anything else offers a download. Fit and 100% for pages and images only.
- The upload's progress is the landing page's progress line (cobalt to cyan, glint only while it fills, swept green
  when checked), timed by the file's size: there's nothing to upload to.
- **No background shader** (Taoufik, 2 Nov): the upload page had one for a while (two silk bands of light, then
  subtle cloud particles, stirred by an upload); he asked for it removed, so the upload page has the app pages' plain
  ground, glow and grid like the others. The last version is kept in `reference/app-upload-shader/backdrop.js`
  (`backdrop(canvas)`, `.energy(0..1)`; it needs a `<canvas>` behind the page and its CSS) if it's ever wanted back.
- **The expiry is a date** (Taoufik, 2 Nov: a date picker, the days counted from it): "Valid until", a field showing
  the day and a badge with the days (default 7), opening a glass calendar (`datepick.js`): tomorrow to 30 days out can
  be chosen, the span from today to the chosen day shaded (today's circle filled in the span's colour, solid, with a
  fine cobalt ring: half on the span, it read as a half circle), quick picks (Tomorrow, 1 week, 2 weeks, 30 days); it opens
  upward when there's no room below. Keyboard as the ARIA date picker pattern (arrows, Home and End, Page Up and
  Down, Enter, Esc back to the field), kept inside the allowed days. The link expires at the upload's time of day on
  the chosen date (`store.add(file, days)` is unchanged).
- **My previews as a list or a grid** (Taoufik, 2 Nov): a switch over the list (List, Grid; remembered in
  localStorage `previewly-previews-view`; the list first, as the wireframe) with the count beside it. The grid is a
  glass card per preview: a 16:10 thumbnail (`render.js thumb()`: sample pages drawn small, wide ones from the top,
  tall ones like the phone app by their height; images contained on a checkerboard; uploaded HTML and ZIP sites in a
  frame with their scripts off; text as a page; a PDF upload or an unknown type as its type, large), the name and
  its type, size and date, the status, and the same actions. The grid is drawn the first time it's shown. The
  thumbnail opens the file too, for the pointer (out of the tab order; Open is the keyboard's way).
- **Back to the list:** a file opened from My previews (`?own=1`) has a "My previews" link above its title; a
  recipient's view doesn't.
- **The standalone export carries every page** (Taoufik, 2 Nov: "for sharing and demo"; `npm run standalone`,
  `previewly-standalone.html`, about 2.4 MB): each page is built on its own (with the shared partials) into one
  script and its CSS, all six kept in the file as strings (`window.__PAGES`), the font once (`window.__FONT`), the art
  in `window.__ART`. Opened, the file writes the page its address names over itself (`?p=upload&…`; none: the
  landing page). The pages link to each other through `pageUrl()` and know which they are through `pageName()`
  (util.js; `window.__STANDALONE` gives `?p=` addresses), the log-in gate in their `<head>` reads either form, and
  the build rewrites the links in their markup. Each page's script goes in as a strict classic script in its own
  function: as a module written in by `document.write` it ran on the first page opened but not on a page reached
  from it (Chrome). What's uploaded stays in the browser that opened the file (localStorage and IndexedDB work from
  disk), so a shared link only opens in that browser, and it shows the file's path.

## Project layout

```
index.html            all markup: header, URL bar, rail, the stage (backdrop, frame, page elements, copy); no footer;
                      sets the theme before first paint
upload.html, ready.html, previews.html, login.html, view.html   the app pages (see "The app pages")
vite.config.js        the pages to build, and the plugin that puts the shared head and header into the app pages
src/main.js           boot and the frame loop: builds the master timeline, primes first paints, runs the intro, then
                      each frame sets the timeline to the scroll position and steps every module
src/util.js           $, $$, clamp, ease, reduced (prefers-reduced-motion, live), asset() (art paths, for standalone)
src/scroll.js         the scroll model: Z0/Z1 (zipper), T (transitions), R (rests), END, COPY (copy windows), pos(),
                      chapterAt(), tu(), railFrac()
src/smooth.js         Lenis on GSAP's ticker; onFrame(); scrollToY() (every scroll from code goes through it)
src/layout.js         the 1100×720 frame: scale and position (centred between the bar and the copy), toScreen()
src/theme.js          light/dark: toggle with a circular View Transition from the button, onTheme()
src/rail.js           the side rail: fill, glowing head and comet tail, tooltips, jumps to rests
src/reveal.js         the chapter copy's staggered reveals (SplitText lines in masks, words, buttons)
src/intro.js          the load intro (header, halo, the pouch turning in, light sweep, copy, rail) and the pointer tilt
src/zipper.js         the zipper engine: drag / momentum / keys / scroll, springs and tuned values, the burst's timing
src/pouch.js          the pouch in WebGL: the cut-out split along its seam and warped open into a V, the glowing inside
src/hero.js           chapters 1–2: the pouch rig (WebGL canvas, pull sprite, contact shadow), the bag rig (bag, six
                      tiles, front fabric), the burst timeline, file chips and counter, the drag track; heroReady
src/world.js          the stations (a set's offset per chapter), at(), travel() (the camera's easing)
src/camera.js         the camera: poseAt(p) along the journey, applyCamera(p) (one matrix3d), project() for overlays
src/stage.js          the floor patches under the stations, contact(), the light motes along the route
src/sparks.js         the light streak renderer (bar, rail, streams): Streak, streakColours()
src/sets.js           chapters 3–6: the glass panes with the mockups, the padlock, the devices with mapped screens,
                      and their whole choreography on the master timeline (UPD, LAUNCH timings), at their stations
src/streams.js        chapter 6: the streams from the URL bar to the devices and the packets down them (canvas 2D)
src/ui.js             page elements over the art: keypad, update card, version switcher, copy link, replay
src/bar.js            the pinned URL bar's state per chapter, and its progress line
src/state.js, content.js, sound.js   demo state; Northvale's names, numbers and dates; the tooth tick
src/mockups/          mockups.js (landing, dashboard(v), statement, landingTablet, dashboardPhone) + mockups.css
src/brand/            enbd-logomark.svg (on the pull's tab; imported ?raw and inlined)
src/art.json          every layer's size, and anchors (seam, pull seat, bag mouth and pull, screen quads…)
src/base.css          shared by every page: tokens for both themes, Geist, header, buttons, toast, the glass
src/styles.css        the landing page: the bar, rail, stage, sets, copy, the 3D objects
src/app/              the app pages: store.js (data), shell.js, upload, ready, previews, login, view, render.js (the
                      viewer), zip.js, datepick.js; app.css; partials/
public/art/           the layers, AVIF (10-bit, with alpha) and WebP; generated by npm run assets
assets/renders/       the isolated Higgsfield renders (PNG, transparent background): the sources of every layer
assets/cutouts/       PNG masters of the layers
assets/plates-4k/     the Figma plates (reference): JPEG masters, hf-originals/, graded/
assets/glass/         the rendered glass rim (source render and the cropped 9-slice); public/art/glass-rim.*
scripts/assets.mjs    renders → layers and anchors; see "The renders"
scripts/grade-originals.mjs  fits each plate master's grade and applies it to its original PNG (npm run grade)
scripts/shoot.mjs     full-resolution screenshots at scroll positions, either theme, any size
scripts/export.mjs    npm run export: source/ (the project without node_modules, dist, assets/, reference/) and site/
                      (built, not minified, plain names: assets/main.js, upload.js…; CSS named after its source files)
reference/site-v1/    the previous site, its public assets and its brief; art-plate-cutouts/ (the plate cut-outs)
reference/app-upload-shader/  the upload page's removed background shader (backdrop.js)
```

## Art direction

- World: a precision studio in daylight (light theme) or at night (dark theme). Light tokens: ground `#EEF0F3`, ink
  `#15171C`, muted `#5B616E`, line `#D5D9E0`, surface `#FFFFFF`. Dark: ground `#0A0C11`, ink `#EEF1F6`, muted
  `#9BA2B0`, line `#262C38`, surface `#141821`. Both in `:root` / `:root[data-theme="dark"]` in styles.css.
- Accent cobalt `#2B6CF6` (`#3B7BFF` on dark) is Previewly's only saturated colour: the pull, the halo, the rail,
  the beam, the streams, the lock ring, CTAs. Validated green `#1F8F5F` for checks and "URL unchanged", sparingly.
- Northvale (the customer) has its own palette — navy, steel blue, bright blue for positives, clay, cream, sand
  (`--nv-navy`, `--nv-steel`, `--nv-blue`… in mockups.css). Its screens stay light in both themes.
- Laser: cobalt `#2B6CF6` → neon cyan (`#2FF0FF` on dark, a deeper `#00C2EE` on light, where light can't add up),
  with a white-hot core; used for the rail, the streams and the update beam.
- Type: Geist only. 600 for headlines (clamp(34px, 4.1vw, 62px), tracking −0.042em), 400 for the lead
  (16–18.5px), 500 for eyebrows, the URL and chips; tabular numerals.
- Grid: one centred frame for the art, the copy centred under it (max 900px), 16–48px side padding.
- Motion grammar: every chapter has a rest point where its copy is fully shown; motion happens between rests; the
  camera drifts slowly through the holds so scroll always moves something; reduced motion removes the intro turn,
  the tilt, the camera drifts, the bounce, idle pulses and Lenis.

## Copy conventions

Sentence case. Curly apostrophes and quotes (’ “ ”) in visible text. No middle-dot "meta" strings (write "v1, 12 Oct",
not "v1 · 12 Oct"). No ALL-CAPS eyebrows (eyebrows are "01 / 06 — Your prototype"). Short, plain sentences.

## The scroll model (`scroll.js`)

One master GSAP timeline whose time is the scroll position in **units of 1% of the stage height** (100 units = one
screen); `main.js` sets it every frame the position changes (no ScrollTrigger needed). Total `END = 1090`.

| Chapter | Rest (R) | Transition out (T) | What moves |
|---|---|---|---|
| 1 Pack | 0 | 136 → 182 | zipper opens over Z0 6 → Z1 128 (camera still); the burst plays over time once open, the camera pulls back and looks up into it |
| 2 Drop | 232 | 262 → 340 | chips tick 184 → 208, URL types 208 → 224; the files fly to station 3 as panes, the camera following |
| 3 Host | 372 | 420 → 528 | side panes swing away; the camera carries the landing page to station 4, swinging round it; it frosts, padlock drops |
| 4 Protect | 552 | 592 → 700 | keypad sinks into the padlock; the camera carries the page to station 5; frost clears to v2; v1 slides in |
| 5 Update | 806 | 858 → 940 | the update (UPD 714 → 784, the camera a little closer): beam wipes v2 → v3; then the big crane to station 6 |
| 6 Ship | 1020 | — | devices rise, the page dives into the laptop; streams launch (LAUNCH 904–974), screens boot |

Copy windows (`COPY`): a chapter's copy comes in once its arrival is ~70% done and leaves a quarter into its
transition; reveals are time-based (played forward, reversed fast), not scrubbed. The rail reaches each node exactly
at its rest. To retime anything, change `scroll.js` (and `UPD`/`LAUNCH` in sets.js, `CHECK`/`TYPE` in bar.js).

## The chapters

1. **Pack** — "Your work, ready to show." The frosted pouch on a halo, standing on the floor. On load it turns in from a
   three-quarter view (rotateY −38°, 2.3 s, expo.out) while the halo blooms and a light sweep runs across it (in the
   shader). Then it leans a few degrees toward the pointer. Drag the pull or scroll: the zipper opens. The teeth
   part above the slider into a V; through it the inside shows, dark while it's a slit, then lit cobalt from within,
   with the back panel's top edge and three of the files standing inside, rising as it widens. The slider stops at
   the zipper's bottom stop (where the bag's slider sits), its tab still on the pouch.
2. **Drop** — "Unzip. That’s the upload." Fully open, the burst plays: the pouch flops open into the bag's shape
   (0.42 s accelerating, a slight overshoot, settling by 0.62 s: the flaps fold out into the corners, the top sinks
   onto the slider, the outline widens, the back panel drops), the bag render fades in over it as it lands (0.36 to
   0.56 s) and the pouch goes; the six tiles lift out of its mouth (between the bag's inside and its front fabric,
   from 0.48 s) onto an arc above it; file chips land with them and tick green; the counter reaches 38 / 38; the URL
   types itself into the bar.
3. **Host** — "Live in seconds. Exactly as built." `statement.pdf`, `index.html` (the cobalt tile) and
   `dashboard.html` fly up into three glass panes: the PDF statement (left), the landing page (front), the dashboard
   (right), in a centred line-up.
4. **Protect** — "One link. Locked when it matters." The landing page faces us and frosts over (a blurred copy and a
   veil); the cobalt padlock drops in at its foot (bouncing) and backs away into the depth on the way out; a
   working keypad (demo code 2026).
5. **Update** — "New version. Same link." The frost clears onto the live dashboard (v2); v1 stands behind. The
   update card (northvale-v3.zip → 41 files checked → published to the same link) runs while a beam sweeps the pane
   and reveals v3 behind it; then rings mark what v3 added (from the mockup's `data-new="3"`), and v2 slides back
   into the line-up. The bar says "Updating to v3", then "URL unchanged". The switcher brings v1 or v2 forward.
6. **Ship** — "Send it once. It stays current." The line-up falls back, the live pane dives toward the laptop, and the
   devices rise, screens off. Three light streaks launch from the URL bar's lower edge (the bar's ring pulses), each
   with a flaring head shedding sparks, to the laptop, phone and tablet; as each arrives its screen flashes and opens
   the page (dashboard v3, the phone app, the tablet landing page). Then packets of light run down the streams. Upload
   ZIP, Copy link, Replay.

## The renders (`npm run assets`, `scripts/assets.mjs`)

Sources in `assets/renders/` (GPT Image 2.5 on Higgsfield, transparent background, the plates as references; job IDs:
pouch `66595a50-3038-4438-980d-7fde31d26229` (earlier: tall `9fd0fe0a-…`, slim `407a8451-…`), pull
`9c116e55-7c03-4b38-aed6-a0eca7ac72bb` (earlier, the pill: `f39bc6bc-…`), tiles
`990f4a06-8fae-4fb4-8b38-77f338a5a160`, padlock `2afff0ce-8a6d-46fa-a944-6dacc158b706`, devices
`f3f1d02a-d6ab-4ff2-aadf-c11cf25a455f`, bag `234ea1e4-f246-4036-9124-3b5e0dd99f83`, no pull (earlier: `79d21504-…`
with the pill, `8ba1314c-…` with the wide tab)). The script trims each to its
object, splits the multi-object renders by connected components (six tiles; phone, laptop, tablet), and measures:
- the pouch's seam (the teeth's x at top and bottom: the median over that end's tenth of the rows, since the end
  stops alone sit off-centre), `zipTop`/`zipBottom`, the teeth's half width; the pull's `seat` (its x is used) and
  `tab` (its face: centre and size, from the rows of saturated cobalt, for the logo);
- the bag's `mouth` and `apex` (the V's lowest point, found from the dark teeth: the page's pull hangs there), and
  splits the bag along the V into `bag` (inside and back) and `bag-front` (the fabric below the V), so the tiles come
  out between the two; for the slump, its `corners` (the zipper's top ends), `backTop` (the inside's top edge at the
  middle) and `profile` (the outline's half width at 17 heights from the corners down). If a bag render has a pull of
  its own (a saturated cobalt tab below the apex), it's filled over from the fabric either side, row by row;
- each tile's centre and which one is cobalt;
- each device's screen quad: the black display's edges fitted as lines in the device's own frame (PCA of the display
  pixels; the middle half of each side, the top from its sides to skip the notch), met at the corners, sorted by
  position; and the stream's attach point (middle of the top edge).
Layers are written as AVIF (quality 86, 10-bit) and WebP (92), with PNG masters in `assets/cutouts/`. Reflections are
not baked in: the page mirrors each standing object (`-webkit-box-reflect`, faded), so they always match.

## The world and the camera (`world.js`, `camera.js`)

- **Stations** (`STATION`, frame px from chapter 1's): 3 Host (2400, 0, −450), 4 Protect (4800, 0, −1050), 5 Update
  (7200, 0, −300), 6 Ship (9600, 0, −1200), in multiples of the floor grid (150 px) so the floor patches line up.
  A set's poses are written in its own frame and moved there with `at(i, pose)`; `atPoint()` for single points.
- **The camera** is a pose: a point looked at, a distance (1800 at a rest: the distance the sets were designed at,
  the scene's perspective), yaw, pitch and roll. `applyCamera(p)` writes it as one `matrix3d` on `#camera`
  (transform-origin 0 0 0); the eye sits where the scene's perspective puts it (550, 302.4, 1800).
- **The journey** (`SEG`; Taoufik asked for it more dynamic: "zoom out and in again into the next phase", 3D orbits,
  in step with the scroll): still while the zipper is in hand (the drag handle maps the pointer to the pull 1:1);
  the burst: back 600, up 10°, round −8°; each hold drifts ±3° and ±45 px across its rest; chapter 5 moves in 120 px
  while the update runs. Each move between stations eases with `travel()` (smoothstep: still only right at the
  rests, otherwise close to the scroll's pace; smootherstep lagged at both ends, then rushed) and adds a zoom
  (distance, pitch, focus height: out over the first 45%, held wide, in over the last 45%) and an orbit (yaw, roll:
  sin², widest midway), alternating sides: 2 → 3 back 2200, up 20°, yaw −30°, roll −3° (following the files); 3 → 4
  back 1900, up 14°, yaw +32°, roll +3° (orbiting the page it carries); 4 → 5 back 2000, up 18°, yaw −28°, roll
  −2.5°; 5 → 6 back 2400, up 24°, yaw +20°, roll +2.5° (over the whole studio). Wide, the focus is raised 190–270 px
  so the sets, looked down on, sit mid-screen (the copy is out between rests). Yaw stays within ±32°: the objects
  are flat renders, and further round they'd read as cards. What it carries moves with the same `travel()` easing
  (`TRAVEL` in sets.js), so it stays framed while the studio passes behind it. Reduced motion keeps the moves but
  drops the drifts, the burst move, the zoom and the orbit.
- **Following through the moves:** `project(x, y, z)` maps a world point to the stage (and its scale). The pull
  handle and its track, the file chips and counter, the keypad (on the landing page, sinking into the padlock, sized
  with the page), the update card, the switcher and the streams' end points are placed with it each frame they're
  shown, with no reads from the page.
- The halo (behind the art, not in the scene) is each set's light: it dims to 0.15 while the camera travels.

## The stage (`stage.js`)

- The floor: a patch under each station (five canvases, 900×675, stretched to 3600×2700 px; a light pool and a grid
  line every 150 px, painted once per theme), from 1800 behind its station to 900 in front. Neighbours overlap by a
  third and cross-fade over their outer thirds, their grids on the same lines, so the floor runs on between stations
  and streams past as the camera travels. Each patch fades at its far and near edges (the near one passes under the
  copy).
- `contact(obj, x, w, bottom, depth)`: a soft shadow lying on the floor under an object, moving with it. Floating
  objects use `.contact.far`, a camera-facing soft ellipse on the floor line (the floor is seen almost edge-on, where a
  shadow lying on it thinned to a hard line). Each shadow fades with its object (the pouch's with the burst).
- Reflections: `.pouchgl`, `.pouchstill`, `.bagbase .cut` and `.padlock .cut` only. Chrome drops
  `-webkit-box-reflect: none`, so nothing can opt out of an inherited selector: scope the rule to what stands.
- Light motes: 36 dots along the route at different depths, still in themselves, drifting past only with the camera
  (each is its own layer in the 3D scene, which the browser re-sorts every frame the camera moves: keep them few).

## The light streaks (`sparks.js`)

`new Streak(streakColours())`, then `draw(ctx, pts, t, o)` along a polyline prepared by `Streak.prep(pts)`: a faint
guide over the whole path; over the travelled part four layers (a halo, a glow, a cobalt-to-cyan body and a white
core), each one continuous stroke of the same path whose brightness is ramped from the tail (`base`) to the head by a
linear gradient along it; a short hot comet right behind the head; a few fine round sparks hugging the line near the
head (deterministic hash, so they twinkle instead of reshuffling); a small flare at the head; sparks shed behind it.
On the dark ground the light adds up (`lighter`); on the light ground it can't, so the body is saturated and the
white core reads against it, with a fainter halo and fewer loose sparks. Used by rail.js (down the track) and
streams.js (three streams, then two packets each). Both canvases draw at the screen's pixel ratio (max 2).

## The URL bar's progress line (`bar.js`, `.prog` in styles.css)

A 2 px track inside the pill, 18 px in from its ends and 4 px above its bottom (clear of the border and the rounded
ends; 16 and 3 on phones). The fill is cobalt to cyan with a soft glow and a rounded leading edge (a `clip-path`
inset set by `--p`), with a white glint running along it only while the fill is advancing (moved by bar.js each
frame, never an endless CSS loop: the upload follows the reader, and a shimmer while nothing moves would be a lie;
not with reduced motion). The green check (`--c`) sweeps over it. The story: the upload fills it with the zipper;
it stays full while uploaded; checking the files sweeps it green (38 / 38); it fades over the first part of the
address typing itself. In chapter 5 the update fills it again, then a quick green pass (URL unchanged) and it
fades. Hidden otherwise. No wash behind the text, no sparks.

Taoufik called the first version "very bad" (30 Oct): it stroked the streak as ten separate pieces with round caps,
so the overlaps beaded up into knots along the line; it scattered square specks around it, which read as grain; the
streams' canvas was drawn at 1.5× and stretched, so everything was soft; and on the light theme the core was cyan,
so nothing read as light. Keep strokes continuous, sparks sparse and round, and the canvases at full resolution.

## The pouch in WebGL (`pouch.js`)

Taoufik found the first version "not realistic and skipping important details" (30 Oct): the slider ran past the
pouch's bottom (the tab hung through the floor), the opening was a flat blue panel with stripes and no inside, the
corners never moved, and at the end the pouch cross-faded into a stretched bag, with the files already outside. Now:
- **The flaps:** the cut-out is two meshes split along the traced seam. Above the slider each half moves outward by
  `gap · h^e · (1 − r)^p` (h: how far up from the slider, r: share of the way to the outer edge; e 0.85, straight
  once slumped; p 1.7, eased toward 1 as the gap grows so a flap never folds over itself). Where a flap is squeezed
  the fabric shades (bunching); the cut edge darkens, picks up cobalt from inside and its very edge catches light.
- **The slider** rides the seam by its top (the teeth part there) and stops at the bottom stop, `zipEnd`, set so the
  V's apex meets the bag's slider: about 77% down the teeth, the rest staying closed.
- **The inside** is its own mesh between the cut edges, warped the same way: a back wall lit cobalt from within (paler
  high up, deeper toward the slider, in shadow next to the edges, dark while it's a slit), the back panel's top edge
  as a pale rim with open air above it, and three tile renders standing inside (`setCards`), tinted and shaded by
  their depth, rising from below the slider as the opening widens.
- **The slump** (`slump` 0..1, driven by the burst): above the slider everything sinks toward it until the pouch's top
  reaches the bag's corners (`sink`), the V's top opens to the corners, every row widens to the bag's measured
  outline (`prof`), the back panel's edge drops to the bag's, and the files lift and fade as the tiles take over. The
  canvas has a 7% margin each side for the wider outline. The pull grows to the bag's tab size as it lands.
It draws only when the opening, the slump or the sweep changes (nothing in chapters 3–6). The backing store is the
canvas's size on screen × device pixel ratio (max 2). On WebGL 2 the textures are mipmapped with anisotropic
filtering. Without WebGL the cut-out shows as an image and the burst still plays (a plain cross-fade).

## The glass panes (`sets.js`)

Each pane is a CSS 3D slab: a faint frosted backing, the live screen (a mockup rendered at its own size and scaled into
600×375 frame px) inset 18 px, the rendered glass rim over it as a 9-slice (`.rim`, `border-image-slice: 172`, 38 px
wide), a soft-light sheen, and thickness edges on the right and bottom. The rim is the same image in both themes: its
white and cyan bevel reads on the light ground, and glows on the dark one.

## The zipper (tuned by the designer — keep these values)

One progress value (0 closed → 1 open). Drag and scroll both write to it; one renderer reads it. Fabric follow (lag)
**0.17 s**, tooth detents **0.55**, flick momentum **0.9**, breakaway **17 px**. The pull tracks the pointer 1:1;
release stays put; a flick coasts (decay `0.985 + flick × 0.012`), past 95.5% it snaps open. Rubber band past either
end. While dragging, scroll is set to match; any real scroll hands control back. Keyboard: arrows ±4%, Page Up/Down
±20%, Home/End. Sound (tooth tick, WebAudio) off by default; haptics every 3 teeth where supported.

## Performance

- Only transforms and opacity animate; WebGL draws only on change; the streams canvas only in chapter 6.
- **The art is hidden until it's placed** (`index.html`: the frame at `opacity:0`): before main.js places the sets
  (after the fonts and the pouch's upload, up to 2.5 s) every pane, the padlock and the devices stand at their
  element's default spot, piled in the frame's top corner; that showed as a flash on load. The priming takes it
  from there.
- **First paints are primed**: before the intro, the frame is shown at 0.4% opacity at each set's rest (Host,
  Protect, the update, Update, Ship) for a frame each, so every pane, the frosted copy and the devices are rasterised
  before they're met. Without it, each first paint landed mid-transition as a 250–900 ms frame.
- Pane faces and devices have `will-change: transform` (rasterised once at their rest scale, not again whenever their
  scale on screen changes). The glass components blur what's behind them (`backdrop-filter`); inside the 3D scene
  that isn't available, so the pane tags are glass without it.
- The intro waits for the pouch's texture and the three file textures inside it to reach the GPU (`heroReady`, at
  most 2.5 s), and each is warmed with a hidden draw where it shows: the first zipper opening was a 283 ms frame
  (compile), a late pouch upload a 233 ms one, and in the standalone file (images decoded from embedded data) the
  files' late first draw a 500–650 ms frame early in the unzip.
- Device screens are painted at about their size on screen (`k` per device in sets.js: the page at k of its size,
  scaled back by the screen's matrix3d): a full-size page under a perspective transform was rasterised at full size,
  a 330 ms first paint. Their pages are never hidden: a dark "screen off" layer over them fades when the stream lands.
- Layers that wait off-stage (the frosted copy, the live pane's v2, the devices before they rise, the v1 and v2 panes
  and the padlock until they come in) rest at 0.4% opacity (`INVISIBLE`), never 0: at 0 the browser drops their paint
  and repaints on arrival (the frost's blur: 500 ms on the throttled phone; v1 sliding in: 67 ms).
- The streams keep the bar's rectangle and their curves between frames (reading the bar's position each frame
  forced a layout; the curves are re-read only when the camera or the devices move), draw at the screen's pixel ratio
  (max 2; at 1.5 the lines went soft, and 2 measured no slower), and the canvas is set up at layout (its first draw
  was a 230 ms frame).
- The priming also shows chapter 2 with the burst landed (it runs on the zipper's clock), and every cut-out is decoded
  as soon as it loads: the bag and tiles first painting mid-burst cost up to 67 ms on the throttled phone.
- The version switcher's two extra screens are hidden outright (`autoAlpha`) until clicked: kept at 0.4% opacity they
  showed through the live pane as a ghost, composited after the wipe's clip.

## Network rule

The built site must make **zero requests to other servers**. `node scripts/measure-scroll.mjs --network` checks it
against the preview build (fresh profile, a full pass, requests to other hosts and console errors listed). By hand:
build, serve `dist/`, DevTools → Network → Disable cache → reload → use the whole page → filter `-domain:<host>`.

## Stack

- Vite 6.4.4 (pinned), `sharp` 0.35.5 (dev, the assets script). Nothing from them ships.
- `gsap` 3.15.0 (pinned; SplitText is in the package since 3.13), `lenis` 1.3.26 (pinned). Both bundled.
- Fonts: Geist variable woff2 from the `geist` package 1.7.2 (copied into `src/fonts`; 1.8.x was under two weeks
  old). Removed: `@splinetool/runtime`, Mona Sans (29 Oct 2026), Geist Mono (30 Oct 2026).

## Verified vs not yet verified

**Verified 3 Nov 2026, the project export** (`npm run export`, Taoufik: "the whole project in a folder with all the
files, specially the JS files", not the standalone file): source/ 4.6 MB (93 files) builds the six pages and the
standalone file on its own (in another folder, with the packages linked in); site/ 4.6 MB, served by `vite preview`:
both flows (log-in gate, upload a ZIP, passcode, list and grid with thumbnails, back link, paste, wrong and right
passcode, the site rendered) with no errors and nothing from other hosts; the landing page 0 frames over 25 ms (a
cold first run had 20, the machine at load 4.7). The zip 8.5 MB. assets/ (278 MB of render and plate sources) and
reference/ (18 MB) aren't in it.

**Verified 2 Nov 2026, the list and grid and the back link** (site and standalone file, light and dark, 1440×900
and 390×844): the switch by keyboard, the choice kept across reloads, a thumbnail for each kind (an uploaded image
and ZIP site, the samples), Open then the back link returns to the grid, no back link for a recipient; both flows
again on the site and from the file: no errors, nothing from other hosts. Standalone file 2.5 MB.

**Verified 2 Nov 2026, the standalone file with every page** (2.4 MB, from disk in fresh headless Chrome): the
scripted walk of both flows (log in, upload a ZIP into IndexedDB, ready, passcode, My previews, the dialog, paste,
passcode, the uploaded site rendered, the samples, expired and unknown links, the landing page): no errors, nothing
from other hosts. The landing page from the file: 0 frames over 25 ms, 17 requests (embedded data), no console
errors. The site build after the `pageUrl()` change: both flows the same, no `?p=` link in dist/.

**Verified 2 Nov 2026, the app pages** (dev server and production build, fresh headless Chrome, a scripted walk of
both flows: log in with its errors, upload a test site ZIP with the days error, the progress, ready, generate,
reload, My previews, the re-generate dialog, paste a wrong link, the link, a wrong passcode, the right one in lower
case, the ZIP site rendered, sample pages at Fit and 100%, the phone page, an image, text, an expired link as owner
and as recipient, an unknown link): no console errors, no requests to other hosts. Shots in light and dark at
1440×900 and light at 390×844; the header measured from 320 to 430 px wide on every page (nothing overlaps). By
keyboard: tab order, Enter submits, Esc closes the dialog and focus returns to its button, focus lands on the document
after the passcode. The upload page's calendar (same day): by keyboard and its quick picks; the days stored match the
date. Both flows re-run on the production build after the shader was removed: no errors, no outside requests. The landing page after the CSS split: scripted pass 0 frames over 25 ms, 23 requests, none to
other hosts; the standalone file the same (17 requests). Not checked: a real phone, Safari, Firefox, a screen reader.

**Verified 2 Nov 2026, the standalone export** (`npm run standalone`, 2.1 MB, opened from disk in fresh headless
Chrome, 1440×900): three scripted passes, 0, 1 and 0 frames over 25 ms (worst 33 ms, after the file textures joined
`heroReady`); 17 requests, all embedded data, none to other hosts; no console errors. Every chapter shot in both
themes from the file. Its only `http` strings are XML namespaces, GSAP's licence comment and warning text, the link
Copy link copies, and plain links to previewly.cc.

**Verified 30 Oct 2026, the travelling camera** (production build, fresh Chrome, 1440×900 2×): scripted ×2, 0 frames
over 25 ms (worst 16.8 ms); 19 requests, none to other hosts, no console errors (the standalone file the same). The
wheel and the 4× throttled phone were measured while the machine was under heavy load (load average 9–19: Spotlight
indexing, another browser): one single 33 ms frame on the wheel, 15 on the phone (none longer). Re-measure when it's
quiet. Checked in shots: the whole journey at 28 positions in light and dark, and at 390×844.

**Verified 30 Oct 2026, second round** (renders, glass, camera, streaks, stage; production build, fresh Chrome,
1440×900 2× on the M1 Air):

| Run | Frames | Over 25 ms | Worst |
|---|---|---|---|
| Scripted smooth scroll ×2, with the network check | 1,619 / 1,620 | 0 / 0 | 16.8 ms |
| Real wheel notches through Lenis | 955 | 0 | 16.8 ms |
| Phone emulation 375×812 3×, 4× CPU | 1,465 | 1 (a single 33 ms frame, chapter 6) | 33.3 ms |
| Headed window ×2 | 1,619 / 1,620 | 1 / 1 (single 33 ms frames, chapters 4 and 6) | 33.3 ms |
| The standalone file (1.9 MB) from disk | 1,619 | 0 | 16.8 ms |

- Network: 19 requests (standalone 17), none to other hosts, no console errors or warnings.
- Shots (`shoot.mjs`): every chapter in both themes at 1440×900 (2× and 1×) and 390×844 2×, and with reduced motion
  emulated (`--reduced`).
- One traced headed pass (`--trace`) stalled at Update t=859 on 0.5–0.7 s image decodes; untraced runs never did
  (tracing slows decoding), but it's the place to look first if a real phone hitches entering chapter 6.
- A headed run stalls if the display sleeps (an on-screen window is throttled): keep the screen awake for `--headed`.
- dist/ 4.6 MB with the WebP copies (art 1.2 MB of AVIF); page JS 183 KB (68 KB gzipped), CSS 62 KB.

**Verified 30 Oct 2026, first round**, after the crisp art, glass, lasers and Geist (production build, same harness):
scripted ×2 and with the network check, 0 frames over 25 ms (worst 16.8 ms); real wheel, 0 (16.8 ms); phone emulation
4× CPU, 0 and 6 single 33 ms frames in two runs; 23 requests, none to other hosts, no console errors or warnings.
Checked in full-resolution shots (`shoot.mjs`): every chapter in both themes at 1440×900 2×, and chapters 3, 5, 6 at
390×844 3×. dist/ 3.5 MB with the WebP copies (art 1.0 MB of AVIF). The standalone file (1.6 MB) passes the same
checks from disk.

**Verified 29 Oct 2026** (production build, `measure-scroll.mjs`, fresh headless Chrome, 1440×900 2× on the M1 Air):

| Run | Frames | Over 25 ms | Worst |
|---|---|---|---|
| Scripted smooth scroll (×2, with the network check) | 1,619 | 0 | 16.8 ms |
| Real wheel notches through Lenis | 1,065 | 0 | 16.8 ms |
| Phone emulation 375×812 3×, 4× CPU | 1,464 | 6 (single 33 ms frames, chapters 2, 5, 6) | 33.3 ms |
| The standalone file opened from disk | 1,619 | 0 | 16.8 ms |

- Network: 23 requests, none to other hosts, no console errors or warnings (built site and standalone file).
- By hand in the browser pane: the intro; dragging the pull (a quick drag flicks it open, the scroll follows, the
  burst plays, the bar reads "northvale.zip uploaded"); Home and End on the focused pull; rail jumps (they glide to
  the rest); the keypad (2026 unlocks, the frost clears, "Unlocked for you"); the version switcher (v1 and v2 shown on
  the live pane, the bar keeps "URL unchanged"); the theme toggle (remembered across reloads); both themes in every
  chapter; the phone layout (375×812) in every chapter.
- Bundle: page JS 179 KB (66 KB gzipped: GSAP, SplitText, Lenis, the mockups), CSS 57 KB, fonts 141 KB, art about
  600 KB of AVIF. dist/ 2.5 MB with the WebP copies. Standalone file 1.2 MB.

**Not yet verified:** a real phone (iOS Safari, Android Chrome), Safari and Firefox on desktop (`backdrop-filter` and
`-webkit-box-reflect` there), a physical mouse wheel and trackpad, a screen reader end to end, the View Transition theme
switch in Safari, reduced motion in a real browser with it switched on (checked only emulated, in headless Chrome).

## TODO

1. Review the whole page with Taoufik in both themes: the new renders, the camera path, the glass, the streaks, the
   padlock's place at the pane's corner, the frame placement per chapter, copy.
2. Real phone, Safari, Firefox, a physical wheel and trackpad.
3. Replace Northvale with a real customer prototype if one comes (src/content.js, src/mockups).
4. Final QA (keyboard, screen reader, reduced motion in a real browser), network check, `npm run zip`, upload.
5. The app pages: review with Taoufik; the developers swap `src/app/store.js` for the service's API (and hash the
   passcodes); Sign up and Forgot password if they're wanted. For demos from the standalone file: sample previews
   with fixed links and a known passcode, if a demo should open one on another computer.
