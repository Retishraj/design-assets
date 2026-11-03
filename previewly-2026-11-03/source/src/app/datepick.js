/* the expiry date: a field that opens a calendar under it (a small glass popover), with the days from today up to
   the last allowed one to choose from, the span from today to the chosen day shaded, and a few quick picks. The days
   are counted from the chosen date. Keyboard as the ARIA date picker pattern has it: arrows by day and week, Home and
   End to the week's ends, Page Up and Down by month, Enter or Space to choose, Esc to close (focus back on the field) */
import { reduced } from '../util.js';

var DAY = 864e5;
var fDay = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
var fFull = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
var fMonth = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });
var WEEK = [['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday'], ['Su', 'Sunday']];
var QUICK = [[1, 'Tomorrow'], [7, '1 week'], [14, '2 weeks'], [30, '30 days']];
var CHEV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6.5 9 12l5.5 5.5"/></svg>';

function midnight(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
function same(a, b) { return a.getTime() === b.getTime(); }
function key(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
export function between(a, b) { return Math.round((midnight(b) - midnight(a)) / DAY); }
export function days(n) { return n === 1 ? '1 day' : n + ' days'; }

/* o: { button, text, badge (elements), pop (the popover), maxDays (30), start (days from today, 7), onChange(days) } */
export function datePicker(o) {
  var today = midnight(new Date()), min = addDays(today, 1), max = addDays(today, o.maxDays || 30);
  var sel = addDays(today, o.start || 7), focus = sel, view = new Date(sel.getFullYear(), sel.getMonth(), 1);
  var btn = o.button, pop = o.pop, open = false;

  pop.innerHTML =
    '<div class="cal-head"><button type="button" class="cal-nav" data-step="-1" aria-label="Previous month">' + CHEV + '</button>' +
    '<h3 class="cal-title" id="calTitle" aria-live="polite"></h3>' +
    '<button type="button" class="cal-nav next" data-step="1" aria-label="Next month">' + CHEV + '</button></div>' +
    '<table class="cal-grid" role="grid" aria-labelledby="calTitle"><thead><tr>' +
    WEEK.map(function (w) { return '<th scope="col" abbr="' + w[1] + '">' + w[0] + '</th>'; }).join('') +
    '</tr></thead><tbody></tbody></table>' +
    '<div class="cal-quick" role="group" aria-label="Quick picks">' +
    QUICK.map(function (q) { return '<button type="button" data-days="' + q[0] + '">' + q[1] + '</button>'; }).join('') + '</div>';
  var body = pop.querySelector('tbody'), title = pop.querySelector('.cal-title');
  var prev = pop.querySelector('[data-step="-1"]'), next = pop.querySelector('[data-step="1"]');

  // the month in view: Monday-first weeks; days outside the allowed span are there but can't be chosen
  function render() {
    title.textContent = fMonth.format(view);
    var first = new Date(view.getFullYear(), view.getMonth(), 1), lead = (first.getDay() + 6) % 7, d = addDays(first, -lead), html = '';
    for (var w = 0; w < 6; w++) {
      if (w > 0 && d.getMonth() !== view.getMonth()) break;
      html += '<tr>';
      for (var i = 0; i < 7; i++, d = addDays(d, 1)) {
        var inMonth = d.getMonth() === view.getMonth(), ok = d >= min && d <= max, isSel = same(d, sel);
        // the span from today to the chosen day is shaded: today starts it, the chosen day ends it
        var cls = 'cal-day' + (inMonth ? '' : ' out') + (same(d, today) ? ' today' : '') + (isSel ? ' sel' : '') +
          (d > today && d < sel ? ' span' : '');
        html += '<td' + (isSel ? ' aria-selected="true"' : '') + '><button type="button" class="' + cls + '" data-date="' + key(d) + '"' +
          ' tabindex="' + (same(d, focus) ? 0 : -1) + '" aria-label="' + fFull.format(d) + (ok ? ', ' + days(between(today, d)) : '') + '"' +
          (same(d, today) ? ' aria-current="date"' : '') + (ok ? '' : ' disabled') + '><span>' + d.getDate() + '</span></button></td>';
      }
      html += '</tr>';
    }
    body.innerHTML = html;
    prev.disabled = view <= new Date(min.getFullYear(), min.getMonth(), 1);
    next.disabled = view >= new Date(max.getFullYear(), max.getMonth(), 1);
  }
  function field() {
    var n = between(today, sel);
    o.text.textContent = fDay.format(sel);
    o.badge.textContent = days(n);
    if (o.onChange) o.onChange(n);
  }
  function focusDay() { var b = body.querySelector('[data-date="' + key(focus) + '"]'); if (b) b.focus(); }
  function moveTo(d) {
    focus = d < min ? min : d > max ? max : d;
    if (focus.getMonth() !== view.getMonth() || focus.getFullYear() !== view.getFullYear()) view = new Date(focus.getFullYear(), focus.getMonth(), 1);
    render(); focusDay();
  }
  function choose(d, close) { sel = focus = d; render(); field(); if (close) hide(true); }

  function show() {
    if (open) return;
    open = true; focus = sel; view = new Date(sel.getFullYear(), sel.getMonth(), 1); render();
    pop.hidden = false; btn.setAttribute('aria-expanded', 'true');
    // under the field if it fits, else over it if there's more room there
    pop.classList.remove('up');
    var r = btn.getBoundingClientRect(), h = pop.offsetHeight + 12, top = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--top')) || 64;
    if (innerHeight - r.bottom < h && r.top - top > innerHeight - r.bottom) pop.classList.add('up');
    if (!reduced) pop.animate([{ opacity: 0, transform: 'translateY(' + (pop.classList.contains('up') ? 6 : -6) + 'px) scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: 'cubic-bezier(.2,.9,.25,1)' });
    focusDay();
  }
  function hide(back) {
    if (!open) return;
    open = false; pop.hidden = true; btn.setAttribute('aria-expanded', 'false');
    if (back) btn.focus();
  }

  btn.addEventListener('click', function () { open ? hide(true) : show(); });
  btn.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); show(); } });
  pop.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b || b.disabled) return;
    if (b.dataset.date) { var p = b.dataset.date.split('-'); choose(new Date(+p[0], p[1] - 1, +p[2]), true); }
    else if (b.dataset.days) choose(addDays(today, +b.dataset.days), true);
    else if (b.dataset.step) { view = new Date(view.getFullYear(), view.getMonth() + +b.dataset.step, 1); render(); }
  });
  body.addEventListener('keydown', function (e) {
    var k = e.key, d = null, wd = (focus.getDay() + 6) % 7;
    if (k === 'ArrowLeft') d = addDays(focus, -1);
    else if (k === 'ArrowRight') d = addDays(focus, 1);
    else if (k === 'ArrowUp') d = addDays(focus, -7);
    else if (k === 'ArrowDown') d = addDays(focus, 7);
    else if (k === 'Home') d = addDays(focus, -wd);
    else if (k === 'End') d = addDays(focus, 6 - wd);
    else if (k === 'PageUp') d = new Date(focus.getFullYear(), focus.getMonth() - 1, focus.getDate());
    else if (k === 'PageDown') d = new Date(focus.getFullYear(), focus.getMonth() + 1, focus.getDate());
    if (d) { e.preventDefault(); moveTo(d); }
  });
  pop.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); hide(true); } });
  // closes when you click or tab away from it
  document.addEventListener('pointerdown', function (e) { if (open && !pop.contains(e.target) && !btn.contains(e.target)) hide(false); });
  pop.addEventListener('focusout', function (e) { if (open && e.relatedTarget && !pop.contains(e.relatedTarget) && e.relatedTarget !== btn) hide(false); });

  field();
  return {
    days: function () { return between(today, sel); },
    disable: function (v) { btn.disabled = v; if (v) hide(false); }
  };
}
