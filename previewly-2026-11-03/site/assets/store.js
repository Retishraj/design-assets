import { d as pageName, a as $$, $, p as pageUrl } from "./theme.js";
var page = pageName();
if (page === "ready") page = "upload";
$$(".top [data-nav]").forEach(function(a) {
  if (a.dataset.nav === page) a.setAttribute("aria-current", "page");
});
var box = document.createElement("div"), toastT = 0;
box.className = "toasts";
box.innerHTML = '<span class="toast" role="status" aria-live="polite"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg><span></span></span>';
document.body.appendChild(box);
var toastEl = box.firstChild;
function toast(msg, plain) {
  toastEl.lastChild.textContent = msg;
  toastEl.classList.toggle("plain", !!plain);
  toastEl.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(function() {
    toastEl.classList.remove("show");
  }, 2400);
}
function copy(text) {
  function old() {
    var t = document.createElement("textarea");
    t.value = text;
    t.setAttribute("readonly", "");
    t.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
    document.body.appendChild(t);
    t.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
    }
    t.remove();
    return ok ? Promise.resolve() : Promise.reject();
  }
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).catch(old);
  return old();
}
function copied(btn, label) {
  var was = btn.dataset.label || btn.textContent;
  btn.dataset.label = was;
  btn.textContent = "Copied";
  btn.classList.add("done");
  clearTimeout(btn._t);
  btn._t = setTimeout(function() {
    btn.textContent = was;
    btn.classList.remove("done");
  }, 1800);
}
function fieldError(input, msg) {
  var f = input.closest(".field"), e = f && $(".ferr", f);
  input.setAttribute("aria-invalid", msg ? "true" : "false");
  if (e) {
    e.textContent = msg || "";
    e.hidden = !msg;
  }
}
$$("[data-reveal]").forEach(function(b) {
  var input = document.getElementById(b.dataset.reveal);
  b.addEventListener("click", function() {
    var show = input.type === "password";
    input.type = show ? "text" : "password";
    b.setAttribute("aria-pressed", String(show));
    b.setAttribute("aria-label", show ? "Hide" : "Show");
    input.focus();
  });
});
$$("[data-todo]").forEach(function(a) {
  a.addEventListener("click", function(e) {
    e.preventDefault();
    toast(a.dataset.todo, true);
  });
});
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function(c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function showCode(el, code2) {
  el.textContent = "";
  code2.split("").forEach(function(ch, i) {
    var s = document.createElement("i");
    s.style.setProperty("--i", i);
    s.textContent = ch;
    s.setAttribute("aria-hidden", "true");
    el.appendChild(s);
  });
  var sr = document.createElement("span");
  sr.className = "sr";
  sr.textContent = code2.split("").join(" ");
  el.appendChild(sr);
}
var KEY = "previewly-previews", SESSION = "previewly-session", OPENED = "previewly-opened";
var HOUR = 36e5, DAY = 24 * HOUR;
var MAX = 10 * 1024 * 1024;
function read(store, key) {
  try {
    return JSON.parse(store.getItem(key));
  } catch (e) {
    return null;
  }
}
function write(store, key, v) {
  try {
    store.setItem(key, JSON.stringify(v));
  } catch (e) {
  }
}
function bytes(n) {
  var b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return b;
}
function token() {
  var s = "";
  bytes(32).forEach(function(x) {
    s += String.fromCharCode(x);
  });
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function id() {
  return Array.prototype.map.call(bytes(8), function(x) {
    return x.toString(16).padStart(2, "0");
  }).join("");
}
var CODE = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function code() {
  return Array.prototype.map.call(bytes(10), function(x) {
    return CODE[x % CODE.length];
  }).join("");
}
function normCode(s) {
  return String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}
function linkFor(p) {
  return new URL(pageUrl("view.html?t=" + p.token), location.href).href;
}
function tokenFrom(text) {
  text = String(text || "").trim();
  if (/^[A-Za-z0-9_-]{20,}$/.test(text)) return text;
  try {
    var u = new URL(text, location.href), t = u.searchParams.get("t");
    if (t) return t;
    var m = u.pathname.match(/\/view\/([A-Za-z0-9_-]{20,})\/?$/);
    return m ? m[1] : null;
  } catch (e) {
    return null;
  }
}
function seed() {
  var now = Date.now();
  var rows = [
    ["dashboard-v3.html", 119603, "text/html", 0.4 * HOUR, 7 * DAY, "dashboard3"],
    ["northvale-site.zip", 492134, "application/zip", 3 * HOUR, null, "landing"],
    ["statement-october.pdf", 175616, "application/pdf", 26 * HOUR, 2 * DAY, "statement"],
    ["mobile-app.html", 65741, "text/html", 30 * HOUR, null, "phone"],
    ["dashboard-v2.html", 115098, "text/html", 3 * DAY, 2 * DAY, "dashboard2"],
    ["northvale-mark.svg", 2150, "image/svg+xml", 4 * DAY, null, "mark"],
    ["release-notes.txt", 1126, "text/plain", 5 * DAY, 1 * DAY, "notes"]
  ];
  return rows.map(function(r) {
    var at = Math.round(now - r[3]);
    return {
      id: id(),
      token: token(),
      name: r[0],
      size: r[1],
      type: r[2],
      sharedAt: at,
      expiresAt: r[4] ? at + r[4] : null,
      code: code(),
      codes: 1,
      sample: r[5]
    };
  });
}
function load() {
  var all = read(localStorage, KEY);
  if (!Array.isArray(all)) {
    all = seed();
    write(localStorage, KEY, all);
  }
  return all;
}
function save(all) {
  write(localStorage, KEY, all);
}
function list() {
  return load().slice().sort(function(a, b) {
    return b.sharedAt - a.sharedAt;
  });
}
function get(pid) {
  return load().find(function(p) {
    return p.id === pid;
  }) || null;
}
function byToken(t) {
  return t ? load().find(function(p) {
    return p.token === t;
  }) || null : null;
}
function expired(p) {
  return !!(p.expiresAt && p.expiresAt <= Date.now());
}
function add(file, days) {
  var now = Date.now(), p = {
    id: id(),
    token: token(),
    name: file.name,
    size: file.size,
    type: file.type || "",
    sharedAt: now,
    expiresAt: days ? now + days * DAY : null,
    code: null,
    codes: 0,
    sample: null
  };
  return putBlob(p.id, file).then(function() {
    var all = load();
    all.push(p);
    save(all);
    return p;
  });
}
function newCode(pid) {
  var all = load(), p = all.find(function(x) {
    return x.id === pid;
  });
  if (!p) return null;
  var c = code(), had = !!p.code;
  p.code = c;
  p.codes = (p.codes || 0) + 1;
  save(all);
  forget(p.token);
  return { code: c, replaced: had };
}
function check(p, entered) {
  return !!(p && p.code && normCode(entered) === p.code);
}
function opened(t) {
  var o = read(sessionStorage, OPENED) || [];
  return o.indexOf(t) >= 0;
}
function remember(t) {
  var o = read(sessionStorage, OPENED) || [];
  if (o.indexOf(t) < 0) o.push(t);
  write(sessionStorage, OPENED, o);
}
function forget(t) {
  var o = read(sessionStorage, OPENED) || [];
  write(sessionStorage, OPENED, o.filter(function(x) {
    return x !== t;
  }));
}
var dbp = null;
function db() {
  return dbp || (dbp = new Promise(function(ok, no) {
    var r = indexedDB.open("previewly", 1);
    r.onupgradeneeded = function() {
      r.result.createObjectStore("files");
    };
    r.onsuccess = function() {
      ok(r.result);
    };
    r.onerror = function() {
      no(r.error);
    };
  }));
}
function putBlob(key, blob) {
  return db().then(function(d) {
    return new Promise(function(ok, no) {
      var tx = d.transaction("files", "readwrite");
      tx.objectStore("files").put(blob, key);
      tx.oncomplete = function() {
        ok();
      };
      tx.onerror = function() {
        no(tx.error);
      };
    });
  });
}
function getBlob(key) {
  return db().then(function(d) {
    return new Promise(function(ok, no) {
      var r = d.transaction("files").objectStore("files").get(key);
      r.onsuccess = function() {
        ok(r.result || null);
      };
      r.onerror = function() {
        no(r.error);
      };
    });
  });
}
function session() {
  return read(localStorage, SESSION) || read(sessionStorage, SESSION);
}
function signIn(email, keep) {
  signOut();
  write(keep ? localStorage : sessionStorage, SESSION, { email, at: Date.now() });
}
function signOut() {
  try {
    localStorage.removeItem(SESSION);
    sessionStorage.removeItem(SESSION);
  } catch (e) {
  }
}
function safeNext(n) {
  return /^(upload|ready|previews)\.html(\?[A-Za-z0-9=&_-]*)?$/.test(n || "") ? n : "upload.html";
}
function size(n) {
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
  return (n / 1048576).toFixed(1) + " MB";
}
var fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
function when(ts) {
  return fmt.format(new Date(ts)).replace(" at ", ", ");
}
function ext(name) {
  var m = /\.([a-z0-9]+)$/i.exec(name || "");
  return m ? m[1].toLowerCase() : "";
}
export {
  MAX as M,
  session as a,
  signIn as b,
  signOut as c,
  copy as d,
  copied as e,
  fieldError as f,
  get as g,
  showCode as h,
  list as i,
  ext as j,
  escapeHtml as k,
  linkFor as l,
  size as m,
  newCode as n,
  expired as o,
  add as p,
  byToken as q,
  opened as r,
  safeNext as s,
  toast as t,
  tokenFrom as u,
  check as v,
  when as w,
  remember as x,
  getBlob as y
};
