(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
var $ = function(s, r) {
  return (r || document).querySelector(s);
};
var $$ = function(s, r) {
  return Array.prototype.slice.call((r || document).querySelectorAll(s));
};
var mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
var reduced = mqReduce.matches;
if (mqReduce.addEventListener) mqReduce.addEventListener("change", function(e) {
  reduced = e.matches;
});
function clamp(x, a, b) {
  a = a === void 0 ? 0 : a;
  b = b === void 0 ? 1 : b;
  return Math.min(b, Math.max(a, x));
}
function ease(t) {
  t = clamp(t);
  return t * t * (3 - 2 * t);
}
var INVISIBLE = 4e-3;
function asset(path) {
  var m = window.__ART;
  return m && m[path] || path;
}
function pageUrl(path) {
  var m = window.__STANDALONE && /^([a-z]+)\.html(?:\?([^#]*))?(#.*)?$/.exec(path);
  return m ? "?p=" + m[1] + (m[2] ? "&" + m[2] : "") + (m[3] || "") : path;
}
function pageName() {
  return window.__STANDALONE ? new URLSearchParams(location.search).get("p") || "index" : (location.pathname.split("/").pop() || "index.html").replace(/\.html$/, "");
}
var root = document.documentElement, btn = $("#theme"), KEY = "previewly-theme", fns = [];
function theme() {
  return root.dataset.theme === "dark" ? "dark" : "light";
}
function onTheme(fn) {
  fns.push(fn);
}
function stored() {
  try {
    return localStorage.getItem(KEY);
  } catch (e) {
    return null;
  }
}
function apply(t) {
  root.dataset.theme = t;
  var dark = t === "dark";
  btn.setAttribute("aria-pressed", String(dark));
  btn.setAttribute("aria-label", dark ? "Light theme" : "Dark theme");
  fns.forEach(function(fn) {
    fn(t);
  });
}
apply(theme());
btn.addEventListener("click", function() {
  var next = theme() === "dark" ? "light" : "dark";
  try {
    localStorage.setItem(KEY, next);
  } catch (e) {
  }
  if (!document.startViewTransition || reduced) {
    apply(next);
    return;
  }
  var r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  var R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  var vt = document.startViewTransition(function() {
    apply(next);
  });
  vt.ready.then(function() {
    root.animate(
      { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + R + "px at " + x + "px " + y + "px)"] },
      { duration: 720, easing: "cubic-bezier(.7,0,.25,1)", pseudoElement: "::view-transition-new(root)" }
    );
  }).catch(function() {
  });
});
var mq = matchMedia("(prefers-color-scheme: dark)");
if (mq.addEventListener) mq.addEventListener("change", function(e) {
  if (!stored()) apply(e.matches ? "dark" : "light");
});
export {
  $,
  INVISIBLE as I,
  $$ as a,
  asset as b,
  clamp as c,
  pageName as d,
  ease as e,
  onTheme as o,
  pageUrl as p,
  reduced as r,
  theme as t
};
