/* scroll model. The story is one master GSAP timeline whose time is the scroll position in units of the stage height
   (1 unit = 1% of the stage, so 100 units is one screen). Every chapter has a rest point, where its copy is fully
   shown and nothing moves, and hands over to the next chapter through a transition [a, b]. Nav jumps land on rests. */
import { $, clamp } from './util.js';

// chapter 1 is the zipper: it opens over [Z0, Z1], and the burst then plays over time (zipper.js)
export var Z0 = 6, Z1 = 128;
// each chapter's transition into the next, [start, end], and where each chapter rests
export var T = [[136, 182], [262, 340], [420, 528], [592, 700], [858, 940]];
export var R = [0, 232, 372, 552, 806, 1020];
export var END = 1090;
// where a chapter's copy is on screen: in once its arrival is 70% done, out a quarter into its transition
export var COPY = [[-1e9, 150], [176, 284], [318, 448], [502, 620], [672, 880], [918, 1e9]];

export var scroller = $('#scroller'), stage = $('#stage');
export var vh = innerHeight, unit = vh / 100, total = 0;
export function measure() {
  vh = stage.clientHeight || innerHeight; unit = vh / 100; total = END * unit;
  scroller.style.height = (total + vh) + 'px';
}
export function posOf(y) { return clamp((y - scroller.offsetTop) / unit, 0, END); }
export function pos() { return posOf(window.scrollY); }
export function yOf(p) { return Math.round(scroller.offsetTop + p * unit); }

// which chapter the reader is in: the boundary is the middle of each transition
export function chapterAt(p) { var i = 0; while (i < T.length && p >= (T[i][0] + T[i][1]) / 2) i++; return i; }
// progress through the transition out of chapter i (0..1, clamped)
export function tu(i, p) { return clamp((p - T[i][0]) / (T[i][1] - T[i][0])); }
// the rail: 0 at the first rest, 1 at the last, linear between rests so each node is reached at its rest point
export function railFrac(p) {
  if (p <= R[0]) return 0;
  for (var i = 0; i < R.length - 1; i++) if (p < R[i + 1]) return (i + (p - R[i]) / (R[i + 1] - R[i])) / (R.length - 1);
  return 1;
}

// how long the page has been still (warm-ups wait for a still moment)
var lastY = -1, movedAt = 0;
export function noteScroll(now) { var y = window.scrollY; if (y !== lastY) { lastY = y; movedAt = now; } }
export function stillFor(now) { return now - movedAt; }
