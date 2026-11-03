/* the pinned URL bar: one address through every chapter, with a state per chapter. Upload progress follows the zipper,
   the files are checked and the URL types itself in chapter 2, then: Live, Passcode on, the update rolling out with
   the URL unchanged, and Copy link. Under it, a slim progress line: the upload fills it, checking the files sweeps it
   green, then it fades as the address types itself; the update in chapter 5 fills it again */
import { $, clamp, ease, reduced } from './util.js';
import { demo, VLABEL } from './state.js';
import { SITE } from './content.js';
import { UPD } from './sets.js';

export var CHECK = [184, 208], TYPE = [208, 224];   // chapter 2: files checked, then the URL types itself
var bar = $('#bar'), barUrl = $('#barUrl'), barStatus = $('#barStatus'), prog = $('#barProg'), glint = prog.querySelector('.prog-glint'), barShackle = $('#barShackle'), key = '';
var URL_TXT = SITE.url, N = SITE.fileCount;
var TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
function chip(cls, html) { return '<span class="chip ' + cls + '">' + html + '</span>'; }
function set(st) {
  var k = JSON.stringify(st); if (k === key) return; key = k;
  barUrl.className = 'url' + (st.muted ? ' muted' : '');
  barUrl.innerHTML = st.url + (st.caret ? '<span class="caret"></span>' : '');
  barStatus.innerHTML = st.status || '';
  bar.classList.toggle('locked', !!st.locked);
  barShackle.setAttribute('d', st.locked ? 'M8 10.5V7.5a4 4 0 0 1 8 0v3' : 'M8 10.5V7.5a4 4 0 0 1 7.6-1.8');
}
// makes the next update re-render, after the keypad, version or copy state changed
export function invalidateBar() { key = ''; }

/* the progress line (styles.css .prog): fill (0..1, cobalt to cyan), check (0..1, green over it), shown (opacity),
   busy (something is in progress). The glint runs along it only while the fill is advancing (the upload follows the
   reader's zipper and scroll: when they stop, so does it), and not with reduced motion */
var now = { p: -1, c: -1, o: -1, r: null }, still = 1, phase = 0;
function line(fill, check, shown, busy, dt) {
  still = Math.abs(fill - now.p) > 1e-4 ? 0 : still + dt;
  if (fill !== now.p) { now.p = fill; prog.style.setProperty('--p', fill.toFixed(4)); }
  if (check !== now.c) { now.c = check; prog.style.setProperty('--c', check.toFixed(4)); }
  if (shown !== now.o) { now.o = shown; prog.style.opacity = shown.toFixed(3); }
  var running = busy && !reduced && still < 0.4;
  if (running !== now.r) { now.r = running; prog.classList.toggle('running', running); }
  if (running) { phase = (phase + dt / 1.4) % 1; glint.style.transform = 'translateX(' + ((phase * 2 - 1) * 100).toFixed(2) + '%)'; }
}

// p: scroll position (scroll.js units), zp: the zipper's progress, c: the current chapter
export function updateBar(p, zp, c, dt) {
  var fill = 0, check = 0, shown = 0, running = false, st;
  if (c === 0) {
    if (zp < 0.015) st = { url: 'previewly.cc/', muted: true, caret: true, status: chip('', 'Waiting for a ZIP') };
    else { fill = zp; shown = 1; running = zp < 0.999; st = { url: zp < 0.999 ? 'Uploading ' + SITE.zip : SITE.zip + ' uploaded', status: chip('blue', Math.round(zp * 100) + '%') }; }
  } else if (c === 1) {
    var u = clamp((p - CHECK[0]) / (CHECK[1] - CHECK[0])), w = ease((p - TYPE[0]) / (TYPE[1] - TYPE[0]));
    // uploaded and full; the check sweeps it green file by file; it fades as the address types itself
    fill = 1; check = u; shown = 1 - ease(clamp(w * 1.6));
    st = p < CHECK[1] ? { url: 'Checking files', status: chip('blue', Math.round(N * u) + ' / ' + N) }
      : { url: URL_TXT.slice(0, Math.round(URL_TXT.length * w)), caret: w < 1, status: chip('ok', TICK + N + ' / ' + N + ' checked') };
  } else if (c === 2) st = { url: URL_TXT, status: chip('ok', TICK + 'Live') };
  else if (c === 3) st = { url: URL_TXT, locked: !demo.unlocked, status: demo.unlocked ? chip('ok', TICK + 'Unlocked for you') : chip('blue', 'Passcode on') };
  else if (c === 4) {
    var up = clamp((p - UPD[0]) / (UPD[1] - UPD[0]));
    var after = p - UPD[1];
    // the update fills it; once it's out, a quick green pass (the link is unchanged) and it fades
    if (up > 0) { fill = up; check = clamp(after / 8); shown = 1 - clamp((after - 10) / 10); running = up < 1; }
    if (up > 0 && up < 1) st = { url: URL_TXT, locked: true, status: chip('blue', 'Updating to v3') };
    else st = { url: URL_TXT, locked: true, status: chip('ok', TICK + 'URL unchanged') + chip('', '<span>v' + demo.ver + '<span class="long">, ' + VLABEL[demo.ver].slice(4) + '</span></span>') };
  } else st = { url: URL_TXT, locked: true, status: '<button type="button" class="copybtn" data-copy>' + (demo.copied ? 'Copied' : 'Copy link') + '</button>' };
  set(st);
  line(fill, check, shown, running, dt || 1 / 60);
}
