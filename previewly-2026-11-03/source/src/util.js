/* small helpers shared by every module */

export var $ = function (s, r) { return (r || document).querySelector(s); };
export var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

var mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
export var reduced = mqReduce.matches;
if (mqReduce.addEventListener) mqReduce.addEventListener('change', function (e) { reduced = e.matches; });

export function clamp(x, a, b) { a = a === undefined ? 0 : a; b = b === undefined ? 1 : b; return Math.min(b, Math.max(a, x)); }
export function ease(t) { t = clamp(t); return t * t * (3 - 2 * t); }
export function mix(a, b, t) { return a + (b - a) * t; }
// 0..1 across [a, b] of x, eased
export function span(x, a, b) { return ease((x - a) / (b - a)); }
// the frame's first paint of an element costs a raster; when it's not on screen yet, show it at an invisible opacity
// first (warm-ups), so the browser has rasterised it before it's needed
export var INVISIBLE = 0.004;

// an art file's URL: beside the page, or embedded in the page by the standalone build (scripts/standalone.mjs)
export function asset(path) { var m = window.__ART; return (m && m[path]) || path; }

// a page's address: beside this one on the site ('view.html?t=…'), or, in the standalone file, that same file with the
// page named in the query ('?p=view&t=…': scripts/standalone.mjs writes each page into it). Every link and redirect
// between the pages goes through here
export function pageUrl(path) {
  var m = window.__STANDALONE && /^([a-z]+)\.html(?:\?([^#]*))?(#.*)?$/.exec(path);
  return m ? '?p=' + m[1] + (m[2] ? '&' + m[2] : '') + (m[3] || '') : path;
}
// the page this is: 'index', 'upload', 'view'…
export function pageName() {
  return window.__STANDALONE ? new URLSearchParams(location.search).get('p') || 'index'
    : (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '');
}
