/* View: open a preview someone shared. No account needed. Without a link (?t=), paste one; with it, the passcode
   (the wireframes' "Open shared document", its button off until something's typed, the error under it); then the
   document. An expired or unknown link says so. From My previews (?own=1, signed in) the owner skips the passcode */
import { fieldError } from './shell.js';
import { $, reduced, pageUrl } from '../util.js';
import { byToken, tokenFrom, expired, check, opened, remember, size, when, ext, session } from './store.js';
import { show } from './render.js';

var q = new URLSearchParams(location.search), t = q.get('t'), main = $('#main');
var own = q.get('own') === '1' && !!session();

function only(id) {
  ['paste', 'lock', 'gone', 'doc'].forEach(function (x) { $('#' + x).hidden = x !== id; });
  main.className = 'page ' + (id === 'doc' ? 'full' : 'narrow');
}
function alertOn(box, msg) { if (msg) $('span', box).textContent = msg; box.hidden = false; }

/* ---------- paste a link ---------- */
function paste() {
  only('paste');
  var input = $('#linkIn'), go = $('#pasteGo'), err = $('#pasteErr');
  input.addEventListener('input', function () { go.disabled = !input.value.trim(); err.hidden = true; input.removeAttribute('aria-invalid'); });
  $('#pasteForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var tok = tokenFrom(input.value);
    if (!tok || !byToken(tok)) {
      alertOn(err, 'We couldn’t find a preview at that link. Check that you have all of it, and try again.');
      input.setAttribute('aria-invalid', 'true'); input.focus(); input.select();
      return;
    }
    location.href = pageUrl('view.html?t=' + encodeURIComponent(tok));
  });
  input.focus();
}

/* ---------- the passcode ---------- */
function lock(p) {
  only('lock');
  var input = $('#code'), go = $('#lockGo'), err = $('#lockErr'), exp = $('#lockExp');
  if (p.expiresAt) { exp.textContent = 'This link expires on ' + when(p.expiresAt) + '.'; exp.hidden = false; }
  input.addEventListener('input', function () { go.disabled = !input.value.trim(); if (!err.hidden) { err.hidden = true; fieldError(input, ''); } });
  $('#lockForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!input.value.trim() || go.disabled) return;
    go.disabled = true; go.textContent = 'Checking…';
    setTimeout(function () {
      go.textContent = 'View document';
      if (check(p, input.value)) { remember(p.token); doc(p); return; }
      go.disabled = false;
      alertOn(err); fieldError(input, ' ');
      input.focus(); input.select();
      if (!reduced) input.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }], { duration: 360, easing: 'ease-out' });
    }, 380);
  });
  input.focus();
}

/* ---------- gone: expired, or no such link ---------- */
function gone(p) {
  only('gone');
  if (p) {
    $('#goneTitle').textContent = 'This link has expired';
    $('#goneLead').textContent = 'It stopped working on ' + when(p.expiresAt) + '. Ask the sender for a new link.';
  } else {
    $('#goneTitle').textContent = 'This link doesn’t work';
    $('#goneLead').textContent = 'Check that you have the whole link, or ask the sender for a new one.';
  }
  document.title = $('#goneTitle').textContent + ' — Previewly';
}

/* ---------- the document ---------- */
function doc(p) {
  only('doc');
  document.title = p.name + ' — Previewly';
  var e = ext(p.name), ic = $('#docIc');
  ic.dataset.ext = e || 'file'; ic.classList.toggle('site', e === 'zip' || e === 'html' || e === 'htm');
  $('#docName').textContent = p.name;
  $('#docMeta').textContent = size(p.size) + ', shared ' + when(p.sharedAt) + (p.expiresAt && !expired(p) ? ', expires ' + when(p.expiresAt) : '');
  if (own) {
    $('#back').hidden = false;   // back to the list it was opened from
    var n = $('#ownNote');
    n.textContent = expired(p) ? 'This link expired on ' + when(p.expiresAt) + '. You can still open it here; your recipients can’t.' : 'You’re seeing it as your recipients do.';
    n.classList.toggle('off', expired(p)); n.hidden = false;
  }
  var viewer = $('#viewer'), seg = $('#zoom');
  seg.hidden = true;
  show(p, viewer).then(function (zoom) {
    seg.hidden = !zoom;
    if (!zoom) return;
    function set(z) {
      seg.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.zoom === z)); });
      viewer.classList.toggle('fit', z === 'fit'); zoom(z);
    }
    seg.addEventListener('click', function (ev) { var b = ev.target.closest('[data-zoom]'); if (b) set(b.dataset.zoom); });
    set('fit');
  });
  $('h1', $('#doc')).focus({ preventScroll: true });
}

if (!t) paste();
else {
  var p = byToken(t);
  if (!p) gone(null);
  else if (own) doc(p);
  else if (expired(p)) gone(p);
  else if (opened(t)) doc(p);
  else lock(p);
}
