/* smooth wheel scrolling with Lenis (bundled, pinned), driven by GSAP's ticker so the scroll position and every
   scrubbed timeline update in the same frame. Touch and keyboard scrolling stay native (Lenis follows them). Off with
   reduced motion: the scroll then tracks the input 1:1.
   Everything that scrolls the page from code goes through scrollToY, so Lenis never fights it: the zipper's drag sync
   jumps there at once (and stops any glide); rail jumps glide. */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { reduced } from './util.js';

export var lenis = reduced ? null : new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9, autoRaf: false });

// frame callbacks run after Lenis has set this frame's scroll
var frameFns = [];
export function onFrame(fn) { frameFns.push(fn); }
var last = 0;
gsap.ticker.lagSmoothing(0);
gsap.ticker.add(function (time) {
  var now = time * 1000;
  if (lenis) lenis.raf(now);
  var dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
  for (var i = 0; i < frameFns.length; i++) frameFns[i](dt, now);
});

export function scrollToY(y, glide) {
  if (!lenis) { window.scrollTo({ top: y, behavior: glide && !reduced ? 'smooth' : 'auto' }); return; }
  if (glide) lenis.scrollTo(y, { duration: Math.min(2.6, 1 + Math.abs(y - window.scrollY) / 5000), easing: function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }, force: true });
  else lenis.scrollTo(y, { immediate: true, force: true });
}
