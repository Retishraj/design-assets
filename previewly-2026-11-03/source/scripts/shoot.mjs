// Full-resolution screenshots of the page at given scroll positions, for checking detail (the browser pane's own
// screenshots are scaled down). Fresh headless Chrome over the DevTools protocol, no dependencies.
//   node scripts/shoot.mjs [url=http://localhost:5173/] [--out=dir] [--theme=light|dark] [--size=1440x900] [--dpr=2]
//        [--at=0,232,372,552,806,1020]   (positions in scroll.js units: 100 = one screen)
//        [--eval=expr]   run in the page before each shot (e.g. to hide a layer while hunting an artefact)
//        [--reduced]     with prefers-reduced-motion: reduce
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2), opt = (n, d) => { const a = args.find((x) => x.startsWith('--' + n + '=')); return a ? a.slice(a.indexOf('=') + 1) : d; };
const URL = args.find((a) => !a.startsWith('--')) || 'http://localhost:5173/';
const OUT = opt('out', 'shots'), THEME = opt('theme', 'light'), [W, H] = opt('size', '1440x900').split('x').map(Number), DPR = +opt('dpr', 2);
const AT = opt('at', '0,232,372,552,806,1020').split(',').map(Number), EVAL = opt('eval', ''), REDUCED = args.includes('--reduced');
mkdirSync(OUT, { recursive: true });
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const profile = mkdtempSync(join(tmpdir(), 'previewly-shoot-'));
const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--force-color-profile=srgb', `--window-size=${W},${H}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
const cleanup = () => { try { chrome.kill(); } catch (e) {} try { rmSync(profile, { recursive: true, force: true }); } catch (e) {} };
process.on('exit', cleanup); process.on('unhandledRejection', (e) => { console.error(e); process.exit(1); });
const wsUrl = await new Promise((res, rej) => { let buf = ''; chrome.stderr.on('data', (d) => { buf += d; const m = buf.match(/DevTools listening on (ws:\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error('Chrome did not start')), 15000); });
const ws = new WebSocket(wsUrl); await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); } });
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const id = ++seq; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method, params, sessionId })); });
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const page = (m, p) => send(m, p, sessionId);
const evaluate = async (expr) => (await page('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result.value;
await page('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: DPR, mobile: false });
await page('Page.enable');
if (REDUCED) await page('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await page('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('previewly-theme', '${THEME}'); } catch (e) {}` });
await page('Page.navigate', { url: URL });
await new Promise((r) => setTimeout(r, 6000));
for (const u of AT) {
  await evaluate(`window.scrollTo(0, ${u} * document.getElementById('stage').clientHeight / 100); new Promise(r => setTimeout(r, 3200))`);
  if (EVAL) await evaluate(EVAL + '; new Promise(r => setTimeout(r, 300))');
  const { data } = await page('Page.captureScreenshot', { format: 'png' });
  const f = join(OUT, `${THEME}-${W}x${H}-${String(u).padStart(4, '0')}.png`);
  writeFileSync(f, Buffer.from(data, 'base64'));
  console.log(f);
}
process.exit(0);
