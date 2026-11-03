/* Upload a preview: choose (or drop) one file up to 10 MB, choose whether the link expires and on which day (the days
   are counted from it, datepick.js), upload. The upload is simulated (the file goes into this browser's storage,
   store.js) with the landing page's progress line: it fills cobalt to cyan, a check sweeps it green, and the page
   moves on to the preview's link (ready.html) */
import { toast } from './shell.js';
import { $, reduced, pageUrl } from '../util.js';
import { add, MAX, size, ext } from './store.js';
import { datePicker } from './datepick.js';

var form = $('#form'), input = $('#file'), drop = $('#drop'), file = null;
var expire = $('#expire'), daysField = $('#daysField'), submit = $('#submit');

/* ---------- the file ---------- */
function show() {
  $('#dropEmpty').hidden = !!file; $('#dropFile').hidden = !file;
  drop.classList.toggle('has', !!file);
  if (!file) return;
  var e = ext(file.name), ic = $('#fileIc');
  ic.dataset.ext = e || 'file'; ic.classList.toggle('site', e === 'zip' || e === 'html' || e === 'htm');
  $('#fileName').textContent = file.name; $('#fileName').title = file.name;
  $('#fileSize').textContent = size(file.size);
}
function setFile(f) {
  fileErr('');
  if (f && f.size > MAX) { file = null; show(); fileErr('That file is ' + size(f.size) + '. The limit is 10 MB.'); return; }
  if (f && !f.size) { file = null; show(); fileErr('That file is empty. Choose another one.'); return; }
  file = f || null; show();
}
function fileErr(msg) {
  var e = $('#fileErr'); e.textContent = msg; e.hidden = !msg;
  drop.classList.toggle('bad', !!msg);
}
$('#choose').addEventListener('click', function () { input.click(); });
$('#change').addEventListener('click', function () { input.click(); });
$('#clear').addEventListener('click', function () { input.value = ''; setFile(null); $('#choose').focus(); });
input.addEventListener('change', function () { if (input.files[0]) { setFile(input.files[0]); if (file) $('#change').focus(); } });

// dropping: anywhere on the page, so a near miss isn't opened by the browser instead
var depth = 0;
function hasFiles(e) { return e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') >= 0; }
document.addEventListener('dragenter', function (e) { if (!hasFiles(e)) return; e.preventDefault(); depth++; drop.classList.add('over'); });
document.addEventListener('dragleave', function (e) { if (!hasFiles(e)) return; depth = Math.max(0, depth - 1); if (!depth) drop.classList.remove('over'); });
document.addEventListener('dragover', function (e) { if (hasFiles(e)) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; } });
document.addEventListener('drop', function (e) {
  if (!hasFiles(e)) return;
  e.preventDefault(); depth = 0; drop.classList.remove('over');
  var fs = e.dataTransfer.files;
  if (fs.length > 1) toast('One file at a time: the first one is chosen.', true);
  if (fs[0]) setFile(fs[0]);
});

/* ---------- the expiry: a day from tomorrow to 30 days out; the days are counted from it ---------- */
var until = datePicker({ button: $('#until'), text: $('#untilText'), badge: $('#untilDays'), pop: $('#cal'), maxDays: 30, start: 7 });
function syncExpire() { daysField.hidden = !expire.checked; }
expire.addEventListener('change', syncExpire);
syncExpire();

/* ---------- uploading ---------- */
var up = $('#up'), track = $('.upbar-track', up), glint = $('#upFill b'), busy = false;
function run(f, d) {
  busy = true; submit.textContent = 'Uploading…';
  form.querySelectorAll('input, button').forEach(function (el) { el.disabled = true; });
  until.disable(true);
  $('#upName').textContent = f.name; up.hidden = false;
  var saved = add(f, d), T = Math.min(2600, 900 + f.size / 4500), t0 = performance.now(), last = 0;
  // the fill eases out over T (a real upload would report its bytes), then the check sweeps it green
  function frame(now) {
    var u = Math.min(1, (now - t0) / T), p = 1 - Math.pow(1 - u, 2.2);
    track.style.setProperty('--p', p.toFixed(4));
    if (!reduced) glint.style.transform = 'translateX(' + ((now / 9 % 260) - 130).toFixed(1) + '%)';
    var pct = Math.round(p * 100);
    if (pct !== last) { $('#upPct').textContent = pct + '%'; last = pct; }
    if (u < 1) requestAnimationFrame(frame); else checking();
  }
  requestAnimationFrame(frame);
  function checking() {
    glint.style.transform = 'translateX(-100%)';
    $('#upState').textContent = 'Checking the file';
    var c0 = performance.now(), C = reduced ? 1 : 520;
    saved.then(function (p) {
      (function sweep(now) {
        var c = Math.min(1, (now - c0) / C);
        track.style.setProperty('--c', (c * c * (3 - 2 * c)).toFixed(4));
        if (c < 1) return requestAnimationFrame(sweep);
        $('#upState').textContent = 'Uploaded. Opening its link';
        setTimeout(function () { location.href = pageUrl('ready.html?id=' + p.id); }, reduced ? 0 : 260);
      })(performance.now());
    }, function () {
      busy = false; submit.textContent = 'Upload and share'; up.hidden = true;
      form.querySelectorAll('input, button').forEach(function (el) { el.disabled = false; });
      until.disable(false);
      track.style.setProperty('--p', 0); track.style.setProperty('--c', 0);
      fileErr('Something went wrong. Please try again.');
    });
  }
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (busy) return;
  var bad = null;
  if (!file) { fileErr('Choose a file to upload.'); bad = bad || $('#choose'); }
  if (bad) { bad.focus(); return; }
  run(file, expire.checked ? until.days() : null);
});
// coming back to this page from the next one (the back button), start over
addEventListener('pageshow', function (e) { if (e.persisted) location.reload(); });
