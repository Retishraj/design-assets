/* the stage the objects stand in: one studio floor under the whole route (world.js), as a patch under each station
   (a light pool and a faint grid fading into the distance, drawn once per theme on a small canvas the compositor
   stretches, so it costs no raster as the camera moves; neighbouring patches overlap by a third and cross-fade, their
   grids on the same lines, so the floor runs on between stations), soft contact shadows under the objects, and light
   motes floating at different depths along the route, which drift past at different speeds as the camera travels.
   Reflections are the objects' own, mirrored on the floor (CSS -webkit-box-reflect on each standing object,
   styles.css), so they always match what stands there. */
import { $, reduced } from './util.js';
import { onTheme, theme } from './theme.js';
import { STATION } from './world.js';

var camera = $('#camera');
export var FLOOR = 612, CX = 550;
// 3600 × 2700 px each (styles.css), from 1800 behind its station to 900 in front, 1250 either side of its middle
var floors = STATION.filter(function (s, i) { return i !== 1; }).map(function (s) {
  var f = document.createElement('canvas');
  f.className = 'floorplane'; f.width = 900; f.height = 675; f.setAttribute('aria-hidden', 'true');
  f.style.transform = 'translate3d(' + s[0] + 'px,0,' + s[2] + 'px) rotateX(90deg) translateY(-1800px)';
  camera.insertBefore(f, camera.firstChild);
  return f;
});

function paintFloors() { floors.forEach(paintFloor); }
function paintFloor(floor) {
  var c = floor.getContext('2d'), W = floor.width, H = floor.height, dark = theme() === 'dark';
  c.clearRect(0, 0, W, H);
  // the light pool under the subjects (the front of the plane, near the bottom of the canvas, is nearest the camera)
  var g = c.createRadialGradient(W / 2, H * 0.62, 0, W / 2, H * 0.62, W * 0.5);
  if (dark) { g.addColorStop(0, 'rgba(70,130,255,0.20)'); g.addColorStop(0.45, 'rgba(40,90,220,0.07)'); g.addColorStop(1, 'rgba(10,12,17,0)'); }
  else { g.addColorStop(0, 'rgba(255,255,255,0.85)'); g.addColorStop(0.5, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(238,240,243,0)'); }
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  // a faint grid, fading out with distance and toward the sides: a line every 150 px of the floor (4 px a canvas px)
  c.save();
  c.globalAlpha = dark ? 0.12 : 0.07;
  c.strokeStyle = dark ? '#7FA8FF' : '#2A3550'; c.lineWidth = 0.6;
  for (var x = 0; x <= W; x += 37.5) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
  for (var y = 0; y <= H; y += 37.5) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
  c.restore();
  // fade the far edge, the near edge (it passes under the copy), and the sides over their outer thirds, where the
  // neighbouring patch fades in
  c.globalCompositeOperation = 'destination-in';
  var f = c.createLinearGradient(0, 0, 0, H); f.addColorStop(0, 'rgba(0,0,0,0)'); f.addColorStop(0.35, 'rgba(0,0,0,0.6)'); f.addColorStop(0.7, 'rgba(0,0,0,1)'); f.addColorStop(0.86, 'rgba(0,0,0,0.7)'); f.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = f; c.fillRect(0, 0, W, H);
  var s = c.createLinearGradient(0, 0, W, 0); s.addColorStop(0, 'rgba(0,0,0,0)'); s.addColorStop(1 / 3, 'rgba(0,0,0,1)'); s.addColorStop(2 / 3, 'rgba(0,0,0,1)'); s.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = s; c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = 'source-over';
}
paintFloors(); onTheme(paintFloors);

// a soft contact shadow lying on the floor under an upright object: appended to the object, so it moves with it.
// x: its centre across the object, w: its width (px of the object), bottom: the object's height (where its foot is)
export function contact(obj, x, w, bottom, depth) {
  var s = document.createElement('div');
  s.className = 'contact';
  s.style.left = (x - w / 2) + 'px'; s.style.top = bottom + 'px'; s.style.width = w + 'px'; s.style.height = (depth || w * 0.34) + 'px';
  obj.appendChild(s);
  return s;
}

// light motes at different depths along the route: still in themselves (a slow shimmer at most), they move only with
// the camera
(function () {
  var last = STATION[STATION.length - 1], N = 36, seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  for (var i = 0; i < N; i++) {
    var m = document.createElement('i');
    m.className = 'mote';
    var x = -400 + rnd() * (last[0] + 1900), z = -1500 + rnd() * 1500 + last[2] * (x / last[0]) * 0.6, y = 40 + rnd() * 520, s = 2 + rnd() * 4;
    m.style.width = m.style.height = s + 'px';
    m.style.transform = 'translate3d(' + x.toFixed(0) + 'px,' + y.toFixed(0) + 'px,' + z.toFixed(0) + 'px)';
    m.style.setProperty('--o', (0.25 + rnd() * 0.55).toFixed(2));
    if (!reduced) m.style.animationDelay = (-rnd() * 6).toFixed(2) + 's';
    camera.appendChild(m);
  }
})();
