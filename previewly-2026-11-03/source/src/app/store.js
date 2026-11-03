/* the app pages' data, a front-end prototype: nothing leaves the browser. Each preview's details are kept in
   localStorage and the file itself in IndexedDB, so a real upload can be opened again in the viewer. The real service
   replaces this module: the same calls, backed by its API (and it keeps passcodes hashed, never as text).
   A first visit is given sample previews from the Northvale story, so My previews and the viewer have something
   to show; their content is drawn by render.js. */

import { pageUrl } from '../util.js';

var KEY = 'previewly-previews', SESSION = 'previewly-session', OPENED = 'previewly-opened';
var HOUR = 3600e3, DAY = 24 * HOUR;
export var MAX = 10 * 1024 * 1024;   // one file, up to 10 MB

function read(store, key) { try { return JSON.parse(store.getItem(key)); } catch (e) { return null; } }
function write(store, key, v) { try { store.setItem(key, JSON.stringify(v)); } catch (e) {} }

/* ---------- ids, links and passcodes ---------- */
function bytes(n) { var b = new Uint8Array(n); crypto.getRandomValues(b); return b; }
// a link's token: 32 random bytes, base64url (43 characters), like the service's
function token() {
  var s = ''; bytes(32).forEach(function (x) { s += String.fromCharCode(x); });
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function id() { return Array.prototype.map.call(bytes(8), function (x) { return x.toString(16).padStart(2, '0'); }).join(''); }
// ten characters, without the ones that read alike (0 O, 1 I L)
var CODE = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function code() { return Array.prototype.map.call(bytes(10), function (x) { return CODE[x % CODE.length]; }).join(''); }
export function normCode(s) { return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }

// the link a preview is shared at: the viewer page beside this one, with the token
export function linkFor(p) { return new URL(pageUrl('view.html?t=' + p.token), location.href).href; }
// the token in whatever the viewer pasted: a whole link, or the token alone
export function tokenFrom(text) {
  text = String(text || '').trim();
  if (/^[A-Za-z0-9_-]{20,}$/.test(text)) return text;
  try {
    var u = new URL(text, location.href), t = u.searchParams.get('t');
    if (t) return t;
    var m = u.pathname.match(/\/view\/([A-Za-z0-9_-]{20,})\/?$/);   // previewly.cc/view/<token>
    return m ? m[1] : null;
  } catch (e) { return null; }
}

/* ---------- previews ---------- */
function seed() {
  var now = Date.now();
  var rows = [
    ['dashboard-v3.html', 119603, 'text/html', 0.4 * HOUR, 7 * DAY, 'dashboard3'],
    ['northvale-site.zip', 492134, 'application/zip', 3 * HOUR, null, 'landing'],
    ['statement-october.pdf', 175616, 'application/pdf', 26 * HOUR, 2 * DAY, 'statement'],
    ['mobile-app.html', 65741, 'text/html', 30 * HOUR, null, 'phone'],
    ['dashboard-v2.html', 115098, 'text/html', 3 * DAY, 2 * DAY, 'dashboard2'],
    ['northvale-mark.svg', 2150, 'image/svg+xml', 4 * DAY, null, 'mark'],
    ['release-notes.txt', 1126, 'text/plain', 5 * DAY, 1 * DAY, 'notes']
  ];
  return rows.map(function (r) {
    var at = Math.round(now - r[3]);
    return { id: id(), token: token(), name: r[0], size: r[1], type: r[2], sharedAt: at, expiresAt: r[4] ? at + r[4] : null,
      code: code(), codes: 1, sample: r[5] };
  });
}
function load() {
  var all = read(localStorage, KEY);
  if (!Array.isArray(all)) { all = seed(); write(localStorage, KEY, all); }
  return all;
}
function save(all) { write(localStorage, KEY, all); }

export function list() { return load().slice().sort(function (a, b) { return b.sharedAt - a.sharedAt; }); }
export function get(pid) { return load().find(function (p) { return p.id === pid; }) || null; }
export function byToken(t) { return t ? load().find(function (p) { return p.token === t; }) || null : null; }
export function expired(p) { return !!(p.expiresAt && p.expiresAt <= Date.now()); }

// adds an upload: the file into IndexedDB, its details into the list. days: null for a link that doesn't expire
export function add(file, days) {
  var now = Date.now(), p = { id: id(), token: token(), name: file.name, size: file.size, type: file.type || '',
    sharedAt: now, expiresAt: days ? now + days * DAY : null, code: null, codes: 0, sample: null };
  return putBlob(p.id, file).then(function () { var all = load(); all.push(p); save(all); return p; });
}
// a new passcode for a preview, returned once; the one before it stops working
export function newCode(pid) {
  var all = load(), p = all.find(function (x) { return x.id === pid; });
  if (!p) return null;
  var c = code(), had = !!p.code;
  p.code = c; p.codes = (p.codes || 0) + 1; save(all);
  forget(p.token);
  return { code: c, replaced: had };
}
export function check(p, entered) { return !!(p && p.code && normCode(entered) === p.code); }

// a viewer who has entered the passcode isn't asked again in this tab
export function opened(t) { var o = read(sessionStorage, OPENED) || []; return o.indexOf(t) >= 0; }
export function remember(t) { var o = read(sessionStorage, OPENED) || []; if (o.indexOf(t) < 0) o.push(t); write(sessionStorage, OPENED, o); }
function forget(t) { var o = read(sessionStorage, OPENED) || []; write(sessionStorage, OPENED, o.filter(function (x) { return x !== t; })); }

/* ---------- the files, in IndexedDB ---------- */
var dbp = null;
function db() {
  return dbp || (dbp = new Promise(function (ok, no) {
    var r = indexedDB.open('previewly', 1);
    r.onupgradeneeded = function () { r.result.createObjectStore('files'); };
    r.onsuccess = function () { ok(r.result); };
    r.onerror = function () { no(r.error); };
  }));
}
function putBlob(key, blob) {
  return db().then(function (d) {
    return new Promise(function (ok, no) {
      var tx = d.transaction('files', 'readwrite'); tx.objectStore('files').put(blob, key);
      tx.oncomplete = function () { ok(); }; tx.onerror = function () { no(tx.error); };
    });
  });
}
export function getBlob(key) {
  return db().then(function (d) {
    return new Promise(function (ok, no) {
      var r = d.transaction('files').objectStore('files').get(key);
      r.onsuccess = function () { ok(r.result || null); }; r.onerror = function () { no(r.error); };
    });
  });
}

/* ---------- the session: Upload and My previews ask to log in first ---------- */
// "Remember me" keeps it in localStorage, otherwise for this tab only (sessionStorage). The pages that need it check
// before they paint, in their <head> (see upload.html)
export function session() { return read(localStorage, SESSION) || read(sessionStorage, SESSION); }
export function signIn(email, keep) { signOut(); write(keep ? localStorage : sessionStorage, SESSION, { email: email, at: Date.now() }); }
export function signOut() { try { localStorage.removeItem(SESSION); sessionStorage.removeItem(SESSION); } catch (e) {} }
// where to go after logging in: only one of this site's own pages
export function safeNext(n) { return /^(upload|ready|previews)\.html(\?[A-Za-z0-9=&_-]*)?$/.test(n || '') ? n : 'upload.html'; }

/* ---------- formatting ---------- */
export function size(n) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  return (n / 1048576).toFixed(1) + ' MB';
}
var fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
// "2 Nov 2026, 14:05"
export function when(ts) { return fmt.format(new Date(ts)).replace(' at ', ', '); }
export function ext(name) { var m = /\.([a-z0-9]+)$/i.exec(name || ''); return m ? m[1].toLowerCase() : ''; }
