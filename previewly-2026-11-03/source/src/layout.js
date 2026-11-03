/* layout: the art is one 1100×720 frame (F), scaled (s) and centred between the pinned bar and the copy. Every set
   places its objects in frame pixels; page elements over the art (counter, keypad, chips) go through toScreen().
   onLayout() hooks run after every layout. */
import { $, $$, clamp } from './util.js';
import { stage } from './scroll.js';

export var F = { w: 1100, h: 720 };
// the subjects live in frame y 40..650; below that is floor and reflection, which may run under the copy
var SUBJ_TOP = 40, SUBJ_BOT = 650;
export var fit = { s: 1, x: 0, y: 0, vw: 0, vh: 0, narrow: false, top: 0, copyTop: 0 };
var frame = $('#frame'), bar = $('#bar'), copies = $$('.copy'), hooks = [];

export function onLayout(fn) { hooks.push(fn); }
export function toScreen(x, y) { return { x: fit.x + x * fit.s, y: fit.y + y * fit.s }; }

export function layoutAll() {
  var vw = stage.clientWidth, vh = stage.clientHeight;
  fit.vw = vw; fit.vh = vh; fit.narrow = vw / vh < 0.95;
  var barBottom = bar.getBoundingClientRect().bottom;
  // the tallest chapter copy decides where the art must stop
  var copyH = 0;
  copies.forEach(function (c) { copyH = Math.max(copyH, c.offsetHeight); });
  var bottomGap = 44;
  fit.top = barBottom + (fit.narrow ? 10 : 16);
  var s, used;
  if (!fit.narrow) {
    fit.copyTop = vh - bottomGap - copyH;
    var avail = Math.max(120, fit.copyTop - 18 - fit.top);
    s = Math.min(avail / (SUBJ_BOT - SUBJ_TOP), vw * 0.92 / F.w);
    used = (SUBJ_BOT - SUBJ_TOP) * s;
    fit.y = Math.round(fit.top + Math.max(0, (avail - used) / 2) - SUBJ_TOP * s);
  } else {
    // phones: the art may run past the screen's sides (the sets are centred, their edges crop), and the art and the
    // copy are centred together in the height, instead of the copy sitting at the bottom with a gap above it
    var room = vh - fit.top - 28 - copyH - 20;
    s = Math.min(room / (SUBJ_BOT - SUBJ_TOP), vw * 1.4 / F.w);
    used = (SUBJ_BOT - SUBJ_TOP) * s;
    var start = fit.top + Math.max(0, (room - used) / 2);
    fit.y = Math.round(start - SUBJ_TOP * s);
    bottomGap = Math.max(28, vh - (start + used + 20 + copyH));
    fit.copyTop = vh - bottomGap - copyH;
  }
  stage.style.setProperty('--copy-bottom', Math.round(bottomGap) + 'px');
  fit.s = s;
  fit.x = Math.round((vw - F.w * s) / 2);
  frame.style.transform = 'translate(' + fit.x + 'px,' + fit.y + 'px) scale(' + s + ')';
  var root = stage.style;
  root.setProperty('--fs', s);
  root.setProperty('--horizon', clamp((fit.y + 560 * s) / vh * 100, 40, 92) + '%');
  hooks.forEach(function (fn) { fn(); });
}
