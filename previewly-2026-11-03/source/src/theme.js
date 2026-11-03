/* light and dark themes. index.html sets the theme before first paint (the visitor's last choice, else the system's);
   the toggle switches it, revealed as a circle growing from the button (View Transitions, where supported), and
   remembers the choice. Modules that draw with theme colours (the streams) listen with onTheme(). */
import { $, reduced } from './util.js';

var root = document.documentElement, btn = $('#theme'), KEY = 'previewly-theme', fns = [];
export function theme() { return root.dataset.theme === 'dark' ? 'dark' : 'light'; }
export function onTheme(fn) { fns.push(fn); }
function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
function apply(t) {
  root.dataset.theme = t;
  var dark = t === 'dark';
  btn.setAttribute('aria-pressed', String(dark));
  btn.setAttribute('aria-label', dark ? 'Light theme' : 'Dark theme');
  fns.forEach(function (fn) { fn(t); });
}
apply(theme());

btn.addEventListener('click', function () {
  var next = theme() === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem(KEY, next); } catch (e) {}
  if (!document.startViewTransition || reduced) { apply(next); return; }
  var r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  var R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  var vt = document.startViewTransition(function () { apply(next); });
  vt.ready.then(function () {
    root.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + R + 'px at ' + x + 'px ' + y + 'px)'] },
      { duration: 720, easing: 'cubic-bezier(.7,0,.25,1)', pseudoElement: '::view-transition-new(root)' });
  }).catch(function () {});
});

// follow the system while the visitor hasn't chosen
var mq = matchMedia('(prefers-color-scheme: dark)');
if (mq.addEventListener) mq.addEventListener('change', function (e) { if (!stored()) apply(e.matches ? 'dark' : 'light'); });
