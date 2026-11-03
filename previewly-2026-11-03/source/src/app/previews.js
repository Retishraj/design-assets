/* My previews: everything shared from this browser, newest first, as a list (the wireframe's table) or a grid of
   cards with thumbnails (render.js thumb(); drawn the first time the grid is shown), the choice remembered. Open a
   file to see it as recipients do (the viewer, without the passcode: it's yours), copy its link, or re-generate its
   passcode (asked first: the current one stops working; the new one is shown once, in the dialog) */
import { copy, copied, toast, showCode, escapeHtml } from './shell.js';
import { $, pageUrl } from '../util.js';
import { list, get, linkFor, newCode, size, when, expired, ext, session, signOut } from './store.js';
import { thumb } from './render.js';

var rows = $('#rows'), cards = $('#gridView'), fresh = new URLSearchParams(location.search).get('new');
var VIEW = 'previewly-previews-view', view = 'list', drawn = false, all = [];

function status(p) {
  if (!p.expiresAt) return '<span class="st">No expiry</span>';
  if (expired(p)) return '<span class="st off">Expired ' + when(p.expiresAt) + '</span>';
  return '<span class="st">Expires ' + when(p.expiresAt) + '</span>';
}
function acts(p, name) {
  return '<span class="tacts">' +
    '<a class="btn sm" href="' + escapeHtml(pageUrl('view.html?t=' + p.token + '&own=1')) + '" aria-label="Open ' + name + '">Open</a>' +
    '<button type="button" class="linkish" data-act="copy" aria-label="Copy the link to ' + name + '">Copy link</button>' +
    '<button type="button" class="linkish" data-act="code" aria-label="Re-generate the passcode for ' + name + '">Re-generate passcode</button></span>';
}
function render() {
  all = list();
  $('#tbl').hidden = !all.length; $('#empty').hidden = !!all.length;
  $('#listbar').hidden = !all.length;
  $('#count').textContent = all.length === 1 ? '1 preview' : all.length + ' previews';
  rows.innerHTML = all.map(function (p) {
    var e = ext(p.name), site = e === 'zip' || e === 'html' || e === 'htm', name = escapeHtml(p.name);
    return '<tr data-id="' + p.id + '"' + (p.id === fresh ? ' class="fresh"' : '') + '>' +
      '<td class="c-file"><span class="tfile"><span class="fileic' + (site ? ' site' : '') + '" data-ext="' + escapeHtml(e || 'file') + '" aria-hidden="true"></span><b title="' + name + '">' + name + '</b></span></td>' +
      '<td class="c-size num" data-label="Size">' + size(p.size) + '</td>' +
      '<td class="c-date num" data-label="Shared on">' + when(p.sharedAt) + '</td>' +
      '<td class="c-status" data-label="Status">' + status(p) + '</td>' +
      '<td class="c-acts">' + acts(p, name) + '</td></tr>';
  }).join('');
}
// the grid: a card per preview, its thumbnail a way in too (for the pointer: the Open button is the one in the tab order)
function grid() {
  drawn = true;
  cards.innerHTML = all.map(function (p) {
    var e = ext(p.name), site = e === 'zip' || e === 'html' || e === 'htm', name = escapeHtml(p.name);
    return '<li class="card' + (p.id === fresh ? ' fresh' : '') + '" data-id="' + p.id + '">' +
      '<a class="card-thumb" href="' + escapeHtml(pageUrl('view.html?t=' + p.token + '&own=1')) + '" tabindex="-1" aria-hidden="true"><div class="thumb"></div></a>' +
      '<div class="card-body"><div class="card-name"><b title="' + name + '">' + name + '</b><span class="extpill' + (site ? ' site' : '') + '">' + escapeHtml(e || 'file') + '</span></div>' +
      '<p class="card-meta">' + size(p.size) + ', shared ' + when(p.sharedAt) + '</p>' +
      '<p class="card-st">' + status(p) + '</p>' + acts(p, name) + '</div></li>';
  }).join('');
  all.forEach(function (p, i) { thumb(p, cards.children[i].querySelector('.thumb')); });
}
function show(v, remember) {
  view = v === 'grid' ? 'grid' : 'list';
  if (view === 'grid' && !drawn && all.length) grid();
  $('#listView').hidden = view === 'grid' && !!all.length;
  cards.hidden = view !== 'grid' || !all.length;
  $('#viewAs').querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.view === view)); });
  if (remember) { try { localStorage.setItem(VIEW, view); } catch (e) {} }
}
render();
var saved = null; try { saved = localStorage.getItem(VIEW); } catch (e) {}
show(saved || 'list');
$('#viewAs').addEventListener('click', function (e) { var b = e.target.closest('[data-view]'); if (b) show(b.dataset.view, true); });
var s = session();
$('#who').textContent = s ? s.email : '';
$('#logout').addEventListener('click', function () { signOut(); location.href = pageUrl('index.html'); });

// the actions, in either view
$('#main').addEventListener('click', function (e) {
  var b = e.target.closest('[data-act]');
  if (!b) return;
  var p = get(b.closest('[data-id]').dataset.id);
  if (!p) return;
  if (b.dataset.act === 'copy') {
    copy(linkFor(p)).then(function () { copied(b); toast('Link copied. Paste it anywhere.'); }, function () { toast('Couldn’t copy the link.', true); });
  } else ask(p, b);
});

/* ---------- re-generating a passcode ---------- */
var dlg = $('#dlg'), cur = null, from = null, code = '';
function ask(p, btn) {
  cur = p; from = btn;
  dlg.querySelectorAll('.dlgFile').forEach(function (b) { b.textContent = p.name; });
  $('#dlgAsk').hidden = false; $('#dlgDone').hidden = true;
  dlg.setAttribute('aria-labelledby', 'dlgTitle');
  dlg.showModal();
  $('#dlgGo').focus();
}
$('#dlgGo').addEventListener('click', function () {
  var r = newCode(cur.id);
  if (!r) { dlg.close(); return; }
  code = r.code;
  showCode($('#dlgCode'), code);
  $('#dlgAsk').hidden = true; $('#dlgDone').hidden = false;
  dlg.setAttribute('aria-labelledby', 'dlgTitle2');
  $('#dlgCopy').focus();
});
$('#dlgCopy').addEventListener('click', function (e) {
  var b = e.currentTarget;
  copy(code).then(function () { copied(b); toast('Passcode copied.'); }, function () { toast('Couldn’t copy. Select the passcode and copy it.', true); });
});
$('#dlgCancel').addEventListener('click', function () { dlg.close(); });
$('#dlgClose').addEventListener('click', function () { dlg.close(); });
// a click on the backdrop closes it, as Esc does
dlg.addEventListener('click', function (e) {
  if (e.target !== dlg) return;
  var r = dlg.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
});
dlg.addEventListener('close', function () { code = ''; if (from && from.isConnected) from.focus(); });
