// Measures scroll smoothness the way a first-time visitor meets it: a fresh Chrome profile (nothing cached, nothing
// decoded), the page loaded, then one pass from the top to the end of chapter 6, recording every frame. Frames over
// 25 ms are listed with the chapter and local t they happened at. Drives the installed Chrome over the DevTools
// protocol (no dependencies), in its own temporary profile, so it never touches your browser.
//   node scripts/measure-scroll.mjs [url] [--wheel] [--cpu=4] [--phone] [--headed] [--passes=2]
//   url defaults to the production preview, http://localhost:4173 (npm run build && npm run preview)
//   --wheel   real mouse-wheel notches (100 px every 110 ms) instead of a scripted smooth scroll (6 px a frame)
//   --cpu=N   CPU throttling, as in DevTools (4 = "4× slowdown")
//   --phone   375×812 at 3x, touch, mobile viewport (an emulation, not a real phone)
//   --pause=ms  with the scripted scroll, stop at each chapter's rest point for ms (a reader pausing)
//   --network  also list requests to other hosts and console errors (the network rule)
//   --passes  how many passes (the second shows what's left once everything is decoded)
//   --list    every long frame, not just the ten worst
//   --loaf[=ms]  main-thread long animation frames over 60 ms (or ms), with the scripts in them
//   --eval=expr  evaluate expr in the page after each pass and print the result (e.g. a page's own stats object)
//   --trace=file  also record a Chrome performance trace of the pass (open it in DevTools' Performance panel) and list
//             the main thread's tasks over 50 ms with the longest events inside them, and every image decode or GPU
//             upload over 4 ms (on any thread) with where in the page it happened
//   --headed  a visible Chrome window instead of headless (closer to a real visit; it appears on screen while it runs)
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2), flag = (n) => args.includes('--' + n), opt = (n, d) => { const a = args.find((x) => x.startsWith('--' + n + '=')); return a ? a.slice(a.indexOf('=') + 1) : d; };
const URL = args.find((a) => !a.startsWith('--')) || 'http://localhost:4173/';
const CPU = +opt('cpu', 1), PASSES = +opt('passes', 1), PHONE = flag('phone'), WHEEL = flag('wheel');
// scroll.js: positions in units of 1% of the stage height; a chapter ends halfway through its transition
const T = [[136, 182], [262, 340], [420, 528], [592, 700], [858, 940]], R = [0, 232, 372, 552, 806, 1020], END = 1060;
const NAMES = ['1 Pack', '2 Drop', '3 Host', '4 Protect', '5 Update', '6 Ship'];
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const profile = mkdtempSync(join(tmpdir(), 'previewly-measure-'));
const chrome = spawn(CHROME, [...(flag('headed') ? [] : ['--headless=new']), '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check',
  '--window-size=1440,900', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
// close Chrome however this script ends (a crash used to leave it running, rendering in the background and skewing later runs)
const cleanup = () => { try { chrome.kill(); } catch (e) {} try { rmSync(profile, { recursive: true, force: true }); } catch (e) {} };
process.on('exit', cleanup); process.on('uncaughtException', (e) => { console.error(e); process.exit(1); }); process.on('unhandledRejection', (e) => { console.error(e); process.exit(1); });
const wsUrl = await new Promise((res, rej) => { let buf = ''; chrome.stderr.on('data', (d) => { buf += d; const m = buf.match(/DevTools listening on (ws:\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error('Chrome did not start')), 15000); });

// a minimal DevTools protocol client
const ws = new WebSocket(wsUrl); await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let seq = 0; const pending = new Map(), waiters = [];
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); }
  else if (m.method) waiters.filter((w) => w.method === m.method).forEach((w) => { waiters.splice(waiters.indexOf(w), 1); w.res(m.params); });
});
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const id = ++seq; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method, params, sessionId })); });
const once = (method) => new Promise((res) => waiters.push({ method, res }));

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: S } = await send('Target.attachToTarget', { targetId, flatten: true });
const page = (m, p) => send(m, p, S);
const evaluate = async (expression) => { const r = await page('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
await page('Page.enable'); await page('Runtime.enable');
// --network: every request the page makes, and every console error or uncaught exception (the network rule)
const requests = [], problems = [];
if (flag('network')) {
  await page('Network.enable'); await page('Log.enable');
  ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.sessionId !== S) return;
    if (m.method === 'Network.requestWillBeSent') requests.push(m.params.request.url);
    if (m.method === 'Runtime.exceptionThrown') problems.push('exception: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
    if (m.method === 'Runtime.consoleAPICalled' && (m.params.type === 'error' || m.params.type === 'warning')) problems.push('console.' + m.params.type + ': ' + m.params.args.map((a) => a.value ?? a.description).join(' '));
    if (m.method === 'Log.entryAdded' && (m.params.entry.level === 'error' || m.params.entry.level === 'warning')) problems.push('log: ' + m.params.entry.text); });
}
const W = PHONE ? 375 : 1440, H = PHONE ? 812 : 900;
await page('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: PHONE ? 3 : 2, mobile: PHONE });
if (PHONE) await page('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
if (CPU > 1) await page('Emulation.setCPUThrottlingRate', { rate: CPU });
const loaded = once('Page.loadEventFired'); await page('Page.navigate', { url: URL }); await loaded;
await new Promise((r) => setTimeout(r, 2000));   // a visitor reads the hero for a moment before scrolling

const gl = await evaluate(`(() => { const g = document.createElement('canvas').getContext('webgl'); const d = g && g.getExtension('WEBGL_debug_renderer_info'); return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : 'no WebGL'; })()`);
console.log(`${URL}  ${PHONE ? 'phone 375×812@3x' : 'desktop 1440×900@2x'}  ${WHEEL ? 'mouse wheel' : 'scripted scroll'}  CPU ${CPU}×  ${flag('headed') ? 'headed' : 'headless'}  GPU: ${gl}`);

// records every frame (time, scroll position) until told to stop
const RECORD = `performance.mark('rec'); window.__frames = []; window.__loaf = []; window.__rec = true; (function f(t) { window.__frames.push([t, scrollY]); if (window.__rec) requestAnimationFrame(f); })(performance.now());
  try { window.__lo && window.__lo.disconnect(); window.__lo = new PerformanceObserver(l => l.getEntries().forEach(e => window.__loaf.push({ t: e.startTime, dur: e.duration, render: e.renderStart ? e.startTime + e.duration - e.renderStart : 0, layout: e.styleAndLayoutStart ? e.startTime + e.duration - e.styleAndLayoutStart : 0, block: e.blockingDuration, y: scrollY,
    scripts: (e.scripts || []).map(x => ({ d: Math.round(x.duration), fn: x.sourceFunctionName || '', src: (x.sourceURL || '').split('/').pop() + ':' + (x.sourceCharPosition || ''), inv: x.invoker || '' })) }))); window.__lo.observe({ type: 'long-animation-frame' }); } catch (e) {}
  true`;
const where = (y, info) => { const u = (y - info.top) / info.vh * 100; let i = 0; while (i < T.length && u >= (T[i][0] + T[i][1]) / 2) i++; return NAMES[i] + ' t=' + Math.round(u); };
for (let pass = 1; pass <= PASSES; pass++) {
  const info = await evaluate(`({ top: document.getElementById('scroller').offsetTop, vh: document.getElementById('stage').clientHeight, end: document.getElementById('scroller').offsetTop + ${END} * document.getElementById('stage').clientHeight / 100 })`);
  await evaluate('window.scrollTo(0, 0); new Promise(r => setTimeout(r, 600))');
  if (opt('trace')) await send('Tracing.start', { transferMode: 'ReturnAsStream', traceConfig: { includedCategories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'v8', 'v8.execute', 'blink', 'blink.user_timing', 'loading', 'cc', 'gpu', 'disabled-by-default-v8.gc'] } });
  await evaluate(RECORD);
  if (WHEEL) {
    // notches until the end of chapter 6; Lenis (or the browser) turns them into a glide
    for (let n = 0; n < 400; n++) {
      // the protocol's wheel delta is divided by the emulated pixel density, so ×DPR makes the page see 100 px notches
      await page('Input.dispatchMouseEvent', { type: 'mouseWheel', x: W / 2, y: H / 2, deltaX: 0, deltaY: 100 * (PHONE ? 3 : 2) });
      await new Promise((r) => setTimeout(r, 110));
      if (n % 5 === 4 && (await evaluate('scrollY')) >= info.end) break;
    }
    await new Promise((r) => setTimeout(r, 1200));
  } else {
    // --pause=ms: stop at each chapter's rest point for that long, as a reader does (scroll.js R)
    const rests = R.slice(1).map((r) => info.top + r * info.vh / 100);
    await evaluate(`new Promise(res => { const end = ${info.end}, stops = ${JSON.stringify(+opt('pause', 0) ? rests : [])}, ms = ${+opt('pause', 0)}; let si = 0;
      (function f() { let y = Math.min(end, scrollY + 6); if (si < stops.length && y >= stops[si]) { y = stops[si++]; window.scrollTo(0, y); return setTimeout(() => requestAnimationFrame(f), ms); }
        window.scrollTo(0, y); if (y < end) requestAnimationFrame(f); else setTimeout(res, 500); })(); })`);
  }
  const frames = await evaluate('window.__rec = false; window.__frames');
  if (opt('trace')) await saveTrace(opt('trace'), frames, info, await evaluate("performance.getEntriesByName('rec')[0].startTime"));
  if (opt('eval')) console.log('  eval: ' + JSON.stringify(await evaluate(opt('eval'))));
  const loaf = await evaluate('window.__loaf');
  const d = frames.slice(1).map((f, i) => ({ ms: f[0] - frames[i][0], y: frames[i][1] }));
  const long = d.filter((x) => x.ms > 25), sorted = d.map((x) => x.ms).sort((a, b) => a - b);
  console.log(`pass ${pass}: ${d.length} frames, median ${sorted[sorted.length >> 1].toFixed(1)} ms, p95 ${sorted[Math.floor(sorted.length * 0.95)].toFixed(1)} ms, worst ${sorted[sorted.length - 1].toFixed(1)} ms, ${long.length} over 25 ms`);
  // per chapter: how many frames ran long and the worst; then the ten worst with where they happened
  const by = {}; for (const x of d) { const c = where(x.y, info).split(' t=')[0]; by[c] = by[c] || { n: 0, long: 0, worst: 0, ms: [] }; by[c].n++; by[c].ms.push(x.ms); if (x.ms > 25) by[c].long++; by[c].worst = Math.max(by[c].worst, x.ms); }
  for (const [c, v] of Object.entries(by)) { const m = v.ms.sort((a, b) => a - b); console.log(`  ${c.padEnd(10)} ${String(v.n).padStart(5)} frames, ${String(v.long).padStart(4)} over 25 ms, worst ${v.worst.toFixed(0)} ms, median ${m[m.length >> 1].toFixed(1)}, p95 ${m[Math.floor(m.length * 0.95)].toFixed(1)}`); }
  if (flag('loaf') || opt('loaf')) for (const e of loaf.filter((e) => e.dur > +opt('loaf', 60))) console.log(`  main-thread frame ${e.dur.toFixed(0)} ms at ${where(e.y, info)} (style+layout ${e.layout.toFixed(0)}, render ${e.render.toFixed(0)}): ${e.scripts.map((x) => x.d + 'ms ' + (x.fn || x.inv) + ' ' + x.src).join(' | ')}`);
  if (flag('list')) for (const x of long) console.log(`  ${x.ms.toFixed(0).padStart(5)} ms  at ${where(x.y, info)}`);
  else for (const x of [...long].sort((a, b) => b.ms - a.ms).slice(0, 10)) console.log(`  ${x.ms.toFixed(0).padStart(5)} ms  at ${where(x.y, info)}`);
}
// stops the trace, writes it, and lists the renderer main thread's long tasks with their longest events inside
async function saveTrace(file, frames, info, recAt) {
  const done = once('Tracing.tracingComplete'); await send('Tracing.end'); const { stream } = await done;
  let json = ''; for (;;) { const r = await send('IO.read', { handle: stream, size: 1 << 20 }); json += r.base64Encoded ? Buffer.from(r.data, 'base64').toString() : r.data; if (r.eof) break; }
  await send('IO.close', { handle: stream }); writeFileSync(file, json);
  const ev = JSON.parse(json); const events = ev.traceEvents || ev;
  const names = {}; events.filter((e) => e.name === 'thread_name').forEach((e) => { names[e.pid + ':' + e.tid] = e.args.name; });
  const main = events.filter((e) => e.ph === 'X' && names[e.pid + ':' + e.tid] === 'CrRendererMain');
  const tasks = main.filter((e) => e.name === 'RunTask' && e.dur > 50000).sort((a, b) => b.dur - a.dur).slice(0, 8);
  console.log(`  trace: ${file}; main-thread tasks over 50 ms: ${tasks.length}`);
  for (const t of tasks) {
    const inside = main.filter((e) => e !== t && e.ts >= t.ts && e.ts + e.dur <= t.ts + t.dur && e.dur > 5000).sort((a, b) => b.dur - a.dur).slice(0, 6);
    console.log(`    ${(t.dur / 1000).toFixed(0)} ms task: ` + inside.map((e) => `${e.name}${e.args?.data?.url ? ' ' + e.args.data.url.split('/').slice(-2).join('/') : e.args?.data?.functionName ? ' ' + e.args.data.functionName : ''} ${(e.dur / 1000).toFixed(0)}`).join(' | '));
  }
  // image decodes and GPU uploads over 4 ms, placed in the page through the 'rec' mark (page time recAt at its ts)
  const mark = events.find((e) => e.name === 'rec' && names[e.pid + ':' + e.tid] === 'CrRendererMain');
  if (!mark) return;
  const at = (ts) => { const pt = recAt + (ts - mark.ts) / 1000; let i = 0; while (i < frames.length - 1 && frames[i + 1][0] <= pt) i++; return pt < frames[0][0] ? 'before the pass' : where(frames[i][1], info); };
  const img = events.filter((e) => e.ph === 'X' && e.dur > 4000 && /^(ImageDecodeTask|ImageUploadTask|GpuImageDecodeCache::UploadImage|ImageDecoder::DecodeFrameBufferAtIndex)$/.test(e.name)).sort((a, b) => a.ts - b.ts);
  for (const e of img) console.log(`    ${(e.dur / 1000).toFixed(1).padStart(5)} ms ${e.name} on ${(names[e.pid + ':' + e.tid] || '?').replace(/\d+$/, '')} at ${at(e.ts)}`);
}
if (flag('network')) {
  const host = new globalThis.URL(URL).host, foreign = requests.filter((u) => !u.startsWith('data:') && !u.startsWith('blob:') && new globalThis.URL(u).host !== host);
  console.log(`network: ${requests.length} requests, ${foreign.length} to other hosts${foreign.length ? ': ' + [...new Set(foreign)].join(', ') : ''}; console errors and warnings: ${problems.length}`);
  problems.forEach((p) => console.log('  ' + p));
}
ws.close(); chrome.kill(); setTimeout(() => rmSync(profile, { recursive: true, force: true }), 500);
