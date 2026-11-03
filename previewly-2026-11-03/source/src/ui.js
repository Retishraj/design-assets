/* page elements over the art and their interactions: the passcode keypad (chapter 4, sinking into the padlock as the
   chapter hands over), the update card and the version switcher (chapter 5), copy link and replay (chapter 6). They
   follow what they belong to through the camera's moves (camera.js project()), and are shown by scroll position. */
import { gsap } from 'gsap';
import { $, $$, clamp, ease, reduced } from './util.js';
import { T, tu } from './scroll.js';
import { fit, onLayout, toScreen } from './layout.js';
import { invalidateBar } from './bar.js';
import { demo, VLABEL, statusEl } from './state.js';
import { SITE } from './content.js';
import { UPD, P, padlock, pickVersion } from './sets.js';
import { project } from './camera.js';
import { atPoint } from './world.js';
import { go } from './rail.js';

/* ---------- chapter 4: keypad ---------- */
var keypad = $('#keypad'), code = '', dots = $$('.dots i', keypad);
function renderDots() { dots.forEach(function (d, i) { d.classList.toggle('on', i < code.length); }); }
function press(k) {
  if (demo.unlocked) return;
  if (k === 'del') code = code.slice(0, -1); else if (code.length < 4) code += k;
  renderDots();
  if (code.length === 4) {
    if (code === SITE.passcode) { demo.unlocked = true; keypad.classList.add('good'); $('#kpTitle').textContent = 'Preview unlocked'; $('#kpSub').textContent = 'Welcome in. Only people with the code see this.'; statusEl.textContent = 'Preview unlocked.'; invalidateBar(); P.hero.root.classList.add('unlocked'); }
    else { keypad.classList.remove('shake'); void keypad.offsetWidth; if (!reduced) keypad.classList.add('shake'); $('#kpSub').textContent = 'That code didn’t match. Try ' + SITE.passcode + '.'; setTimeout(function () { code = ''; renderDots(); }, 260); }
  }
}
$$('.keys button', keypad).forEach(function (b) { b.addEventListener('click', function () { press(b.classList.contains('del') ? 'del' : b.textContent); }); });
keypad.addEventListener('keydown', function (e) { if (/^[0-9]$/.test(e.key)) { press(e.key); e.preventDefault(); } else if (e.key === 'Backspace') { press('del'); e.preventDefault(); } });
$('#relock').addEventListener('click', function () { demo.unlocked = false; code = ''; renderDots(); keypad.classList.remove('good'); $('#kpTitle').textContent = 'This preview is private'; $('#kpSub').textContent = 'Enter the 4-digit passcode'; invalidateBar(); P.hero.root.classList.remove('unlocked'); });

/* ---------- chapter 5: the update and the versions ---------- */
var deploy = $('#deploy'), deployBar = $('#deployBar'), deployPct = $('#deployPct'), steps = $$('#deploySteps li'), versions = $('#versions');
var vbtns = $$('#versions button');
function choose(v, quiet) {
  demo.ver = v;
  vbtns.forEach(function (x) { x.setAttribute('aria-pressed', String(+x.dataset.ver === v)); });
  pickVersion(v, quiet); invalidateBar();
  if (!quiet) statusEl.textContent = 'Showing ' + VLABEL[v] + '. The link is unchanged.';
}
vbtns.forEach(function (b) { b.addEventListener('click', function () { choose(parseInt(b.dataset.ver, 10)); }); });

/* ---------- chapter 6: copy link, replay ---------- */
var LINK = 'https://' + SITE.url, toastT = null, toast = $('#toast');
function doCopy() {
  try { if (navigator.clipboard) navigator.clipboard.writeText(LINK).catch(function () {}); } catch (e) {}
  demo.copied = true; invalidateBar(); $$('[data-copy]').forEach(function (b) { b.textContent = 'Copied'; });
  toast.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  statusEl.textContent = 'Link copied.';
}
document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-copy]'); if (b) doCopy(); });
$('#replay').addEventListener('click', function () { go(0); });
$('#home').addEventListener('click', function (e) { e.preventDefault(); go(0); });
// skip the story: glide to chapter 6, and once its copy is in, focus its first button
$('#skip').addEventListener('click', function (e) {
  e.preventDefault(); go(5);
  var ship = $('#ship'), to = function () { $('a, button', ship).focus({ preventScroll: true }); };
  if (ship.classList.contains('on')) return to();
  var mo = new MutationObserver(function () { if (ship.classList.contains('on')) { mo.disconnect(); to(); } });
  mo.observe(ship, { attributes: true, attributeFilter: ['class'] });
});

/* ---------- placement ---------- */
// the switcher under the versions' line-up and the update card over its oldest version, at chapter 5's station
var VS = atPoint(4, 550, 600, 0), DP = atPoint(4, 190, 240, 0), TO = { x: 550, y: 640 };
var KZ = 1800 / (1800 - 30);   // the landing page's perspective at its chapter 4 rest, where the keypad is its size
var place = {};
onLayout(function () {
  var s = clamp(fit.s * 1.05, 0.72, 1);
  keypad.classList.toggle('compact', fit.s < 0.62);
  place.kpS = s;
  // on phones the update card is a compact strip hanging under the pinned bar
  deploy.classList.toggle('compact', fit.narrow);
  if (fit.narrow) { var br = $('#bar').getBoundingClientRect(); place.dp = { x: br.left + br.width / 2, y: br.bottom + 30 }; }
  var t = toScreen(TO.x, TO.y); toast.style.transform = 'translate(-50%,-50%) translate(' + t.x + 'px,' + t.y + 'px)';
  last = {};
});
function prop(e, k) { return gsap.getProperty(e, k); }

var last = {};
function vis(elm, key, o, liveCls) {
  if (last[key] === o) return;
  last[key] = o;
  elm.style.opacity = o;
  elm.style.visibility = o > 0.01 ? 'visible' : 'hidden';
  if (liveCls) elm.classList.toggle('live', o > 0.6);
}

export function updateUI(p, c) {
  // keypad: in as the pane frosts (3 → 4), then into the padlock (4 → 5)
  var inK = ease((p - (T[2][0] + 0.8 * (T[2][1] - T[2][0]))) / 22), outU = tu(3, p), sink = ease(outU / 0.3);
  var ko = inK * (1 - ease((outU - 0.15) / 0.15));
  vis(keypad, 'kp', +ko.toFixed(3), true);
  if (ko > 0) {
    // on the landing page's middle, sinking into the padlock's body; sized with the page as the camera moves
    var h = P.hero.root, kp = project(prop(h, 'x'), prop(h, 'y'), prop(h, 'z'));
    var pd = sink > 0 ? project(prop(padlock, 'x'), prop(padlock, 'y') - 138, prop(padlock, 'z')) : kp;
    var x = kp.x + (pd.x - kp.x) * sink, y = kp.y + (pd.y - kp.y) * sink;
    var sc = place.kpS * (kp.k / KZ) * (0.94 + 0.06 * inK) * (1 - 0.82 * sink);
    keypad.style.transform = 'translate(-50%,-50%) translate(' + x + 'px,' + y + 'px) scale(' + sc + ')';
  }
  // the update card: in just before the update, the bar and steps follow it, out as 5 → 6 begins
  var u = clamp((p - UPD[0]) / (UPD[1] - UPD[0]));
  var dO = ease((p - (UPD[0] - 12)) / 10) * (1 - ease((p - T[4][0]) / 16));
  vis(deploy, 'dp', +dO.toFixed(3));
  if (dO > 0) {
    var dp = fit.narrow ? place.dp : project(DP[0], DP[1], DP[2]);
    deploy.style.transform = 'translate(-50%,-50%) translate(' + dp.x + 'px,' + dp.y + 'px) translateY(' + ((1 - Math.min(1, dO)) * 10) + 'px)' + (fit.narrow ? '' : ' scale(' + place.kpS + ')');
    var pct = Math.round(u * 100);
    if (last.pct !== pct) { last.pct = pct; deployBar.style.transform = 'scaleX(' + u + ')'; deployPct.textContent = pct + '%'; }
    steps.forEach(function (li, i) { var on = u >= [0.3, 0.68, 1][i]; if (li._on !== on) { li._on = on; li.classList.toggle('on', on); } });
  }
  var vO = ease((p - (UPD[1] - 4)) / 14) * (1 - ease((p - T[4][0]) / 12));
  vis(versions, 'vs', +vO.toFixed(3), true);
  if (vO > 0) { var v = project(VS[0], VS[1], VS[2]); versions.style.transform = 'translate(-50%,-50%) translate(' + v.x + 'px,' + v.y + 'px)'; }
  // leaving chapter 5, the live pane goes back to the latest version
  if (c !== 4 && demo.ver !== 3) choose(3, true);
}
