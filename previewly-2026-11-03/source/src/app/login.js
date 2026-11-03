/* Log in, before Upload and My previews: then on to the page that asked (?next=). A prototype: any email and
   password sign you in, kept in this browser (store.js session) */
import { fieldError } from './shell.js';
import { $, pageUrl } from '../util.js';
import { signIn, safeNext, session } from './store.js';

var next = safeNext(new URLSearchParams(location.search).get('next'));
if (session()) location.replace(pageUrl(next));

var email = $('#email'), pw = $('#pw');
function emailOk(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
email.addEventListener('input', function () { if (email.getAttribute('aria-invalid') === 'true' && emailOk(email.value.trim())) fieldError(email, ''); });
pw.addEventListener('input', function () { if (pw.value) fieldError(pw, ''); });

$('#form').addEventListener('submit', function (e) {
  e.preventDefault();
  var v = email.value.trim(), bad = null;
  if (!v) { fieldError(email, 'Enter your email.'); bad = email; }
  else if (!emailOk(v)) { fieldError(email, 'Enter an email like you@example.com.'); bad = email; }
  else fieldError(email, '');
  if (!pw.value) { fieldError(pw, 'Enter your password.'); bad = bad || pw; }
  else fieldError(pw, '');
  if (bad) { bad.focus(); return; }
  var b = $('#submit'); b.disabled = true; b.textContent = 'Logging in…';
  signIn(v, $('#keep').checked);
  setTimeout(function () { location.replace(pageUrl(next)); }, 350);
});
