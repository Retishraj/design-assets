/* the intro, once the fonts and the pouch are in: the header and the bar settle in, the halo blooms behind the
   pouch while it turns in from a three-quarter view and a light sweep runs across it, then the headline rises line by
   line and the rail draws itself. Then a slow pointer tilt keeps the pouch alive (desktop, not with reduced motion).
   With reduced motion everything simply fades in. */
import { gsap } from 'gsap';
import { $, $$, reduced } from './util.js';
import { pouchRig, setSheen } from './hero.js';

// copyIn: called when the copy may come in (main.js then reveals the block for wherever the page is)
export function playIntro(copyIn, done) {
  var body = document.body, halo = $('#halo'), rail = $('#rail'), track = $('#rail .track'), nodes = $$('#rail li');
  var top = $$('.top .brand, .top .tools > *'), bar = $('#bar');
  body.classList.remove('booting');
  if (reduced) {
    gsap.fromTo([top, bar, rail, '.copies'], { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'none' });
    gsap.set(halo, { opacity: 1, scale: 1 });
    copyIn(); if (done) done();
    return;
  }
  var sw = { p: -0.4, a: 0 };
  var tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: function () { setSheen(-1, 0); tilt(); if (done) done(); } });
  tl.fromTo(top, { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.06 }, 0.05)
    .fromTo(halo, { opacity: 0, scale: 0.35 }, { opacity: 1, scale: 1, duration: 2.6, ease: 'power3.out' }, 0)
    .fromTo(pouchRig, { rotationY: -38, rotationX: 9, rotationZ: -3, y: 70, z: -260, opacity: 0 },
      { rotationY: 0, rotationX: 0, rotationZ: 0, y: 0, z: 0, opacity: 1, duration: 2.3, ease: 'expo.out' }, 0.1)
    .fromTo(sw, { p: -0.4, a: 0 }, { p: 1.4, a: 1, duration: 1.5, ease: 'power2.inOut', onUpdate: function () { setSheen(sw.p, Math.sin(Math.min(1, (sw.p + 0.4) / 1.8) * Math.PI) * sw.a); } }, 0.55)
    .fromTo(bar, { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, 0.45)
    .set('.copies', { opacity: 1 }, 0.7)
    .add(copyIn, 0.75)
    .fromTo(rail, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'none' }, 1.0)
    .fromTo(track, { scaleY: 0, transformOrigin: '50% 0' }, { scaleY: 1, duration: 1.2, ease: 'power3.inOut' }, 1.0)
    .fromTo(nodes, { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.06 }, 1.15);
}

// the pouch leans a few degrees toward the pointer, on a soft spring
function tilt() {
  if (reduced || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var rx = gsap.quickTo(pouchRig, 'rotationX', { duration: 1.4, ease: 'power3.out' }), ry = gsap.quickTo(pouchRig, 'rotationY', { duration: 1.4, ease: 'power3.out' });
  addEventListener('pointermove', function (e) {
    if (document.body.classList.contains('dragging')) return;
    var nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
    ry(nx * 7); rx(-ny * 4);
  }, { passive: true });
}
