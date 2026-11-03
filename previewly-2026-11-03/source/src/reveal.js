/* the chapter copy: each block comes in with a staggered reveal (the eyebrow, then the headline line by line rising
   out of a mask, then the paragraph word by word, then the buttons) once its chapter's arrival is 70% done, and leaves
   quickly a quarter into its transition (scroll.js COPY). Split with GSAP SplitText; the headline re-splits when the
   fonts load or the width changes, and its timeline is rebuilt where it was. With reduced motion the blocks fade. */
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { $$, reduced } from './util.js';
import { COPY } from './scroll.js';

gsap.registerPlugin(SplitText);
var blocks = $$('.copy').map(function (el) { return { el: el, tl: null, on: false }; });

function timeline(b, lines, words) {
  var el = b.el, eb = el.querySelector('.eyebrow'), rest = el.querySelectorAll('.hint,.ctas');
  var tl = gsap.timeline({ paused: true, onReverseComplete: function () { el.classList.remove('on'); el.inert = true; } });
  if (reduced) return tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'none' });
  tl.fromTo(eb, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0)
    .fromTo(lines, { yPercent: 115 }, { yPercent: 0, duration: 1.05, ease: 'expo.out', stagger: 0.09 }, 0.06)
    .fromTo(words, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', stagger: 0.014 }, 0.3);
  if (rest.length) tl.fromTo(rest, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.07 }, 0.44);
  return tl;
}

export function initReveal() {
  blocks.forEach(function (b) {
    var el = b.el, h = el.querySelector('h1,h2'), lead = el.querySelector('.lead');
    el.inert = true;
    if (reduced) { b.tl = timeline(b); return; }
    var words = SplitText.create(lead, { type: 'words', wordsClass: 'wd' }).words;
    SplitText.create(h, { type: 'lines', mask: 'lines', linesClass: 'ln', autoSplit: true, onSplit: function (self) {
      var at = b.tl ? b.tl.progress() : 0, rev = b.tl ? b.tl.reversed() : false;
      if (b.tl) b.tl.kill();
      b.tl = timeline(b, self.lines, words);
      b.tl.progress(b.on ? (rev ? at : Math.max(at, 0.999)) : 0);
    } });
  });
}

function show(b) { b.on = true; b.el.classList.add('on'); b.el.inert = false; b.tl.timeScale(1).play(); }
function hide(b) { b.on = false; b.tl.timeScale(reduced ? 1.5 : 2.4).reverse(); }

// once per frame: which blocks should be shown at scroll position p (hold: keep everything as it is, for the intro)
export function updateReveal(p, hold) {
  if (hold) return;
  blocks.forEach(function (b, i) {
    var want = p >= COPY[i][0] && p <= COPY[i][1];
    if (want !== b.on) (want ? show : hide)(b);
  });
}
