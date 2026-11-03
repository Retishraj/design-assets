/* what every app page shares: the theme toggle (theme.js, as on the landing page), the header's current page, the
   toast, copying to the clipboard, and the field and button helpers the forms use */
import '../theme.js';
import { $, $$, pageName } from '../util.js';

// the header marks the page you're on
var page = pageName();
if (page === 'ready') page = 'upload';
$$('.top [data-nav]').forEach(function (a) { if (a.dataset.nav === page) a.setAttribute('aria-current', 'page'); });

/* ---------- the toast ---------- */
var box = document.createElement('div'), toastT = 0;
box.className = 'toasts';
box.innerHTML = '<span class="toast" role="status" aria-live="polite"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg><span></span></span>';
document.body.appendChild(box);
var toastEl = box.firstChild;
export function toast(msg, plain) {
  toastEl.lastChild.textContent = msg;
  toastEl.classList.toggle('plain', !!plain);
  toastEl.classList.add('show'); clearTimeout(toastT);
  toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2400);
}

/* ---------- the clipboard ---------- */
// the async clipboard needs a secure context (not a phone on the dev server's LAN address): fall back to a selection
export function copy(text) {
  function old() {
    var t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', '');
    t.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(t); t.select();
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
    t.remove(); return ok ? Promise.resolve() : Promise.reject();
  }
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).catch(old);
  return old();
}
// a copy button: says "Copied" for a moment
export function copied(btn, label) {
  var was = label || btn.dataset.label || btn.textContent;
  btn.dataset.label = was; btn.textContent = 'Copied'; btn.classList.add('done');
  clearTimeout(btn._t); btn._t = setTimeout(function () { btn.textContent = was; btn.classList.remove('done'); }, 1800);
}

/* ---------- forms ---------- */
// shows or clears a field's error: the message under it, aria-invalid on the input
export function fieldError(input, msg) {
  var f = input.closest('.field'), e = f && $('.ferr', f);
  input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  if (e) { e.textContent = msg || ''; e.hidden = !msg; }
}
// the passcode and password fields' show/hide button
$$('[data-reveal]').forEach(function (b) {
  var input = document.getElementById(b.dataset.reveal);
  b.addEventListener('click', function () {
    var show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    b.setAttribute('aria-pressed', String(show));
    b.setAttribute('aria-label', show ? 'Hide' : 'Show');
    input.focus();
  });
});
// links to pages this prototype doesn't have (sign up, forgot password)
$$('[data-todo]').forEach(function (a) {
  a.addEventListener('click', function (e) { e.preventDefault(); toast(a.dataset.todo, true); });
});

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
}

// a passcode, shown a character at a time (app.css .code i); read out letter by letter
export function showCode(el, code) {
  el.textContent = '';
  code.split('').forEach(function (ch, i) {
    var s = document.createElement('i'); s.style.setProperty('--i', i); s.textContent = ch; s.setAttribute('aria-hidden', 'true'); el.appendChild(s);
  });
  var sr = document.createElement('span'); sr.className = 'sr'; sr.textContent = code.split('').join(' '); el.appendChild(sr);
}
