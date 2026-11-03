import { r as reduced, $, p as pageUrl } from "./theme.js";
import { t as toast, M as MAX, m as size, p as add, j as ext } from "./store.js";
var DAY = 864e5;
var fDay = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
var fFull = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
var fMonth = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
var WEEK = [["Mo", "Monday"], ["Tu", "Tuesday"], ["We", "Wednesday"], ["Th", "Thursday"], ["Fr", "Friday"], ["Sa", "Saturday"], ["Su", "Sunday"]];
var QUICK = [[1, "Tomorrow"], [7, "1 week"], [14, "2 weeks"], [30, "30 days"]];
var CHEV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6.5 9 12l5.5 5.5"/></svg>';
function midnight(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function addDays(d, n) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}
function same(a, b) {
  return a.getTime() === b.getTime();
}
function key(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function between(a, b) {
  return Math.round((midnight(b) - midnight(a)) / DAY);
}
function days(n) {
  return n === 1 ? "1 day" : n + " days";
}
function datePicker(o) {
  var today = midnight(/* @__PURE__ */ new Date()), min = addDays(today, 1), max = addDays(today, o.maxDays || 30);
  var sel = addDays(today, o.start || 7), focus = sel, view = new Date(sel.getFullYear(), sel.getMonth(), 1);
  var btn = o.button, pop = o.pop, open = false;
  pop.innerHTML = '<div class="cal-head"><button type="button" class="cal-nav" data-step="-1" aria-label="Previous month">' + CHEV + '</button><h3 class="cal-title" id="calTitle" aria-live="polite"></h3><button type="button" class="cal-nav next" data-step="1" aria-label="Next month">' + CHEV + '</button></div><table class="cal-grid" role="grid" aria-labelledby="calTitle"><thead><tr>' + WEEK.map(function(w) {
    return '<th scope="col" abbr="' + w[1] + '">' + w[0] + "</th>";
  }).join("") + '</tr></thead><tbody></tbody></table><div class="cal-quick" role="group" aria-label="Quick picks">' + QUICK.map(function(q) {
    return '<button type="button" data-days="' + q[0] + '">' + q[1] + "</button>";
  }).join("") + "</div>";
  var body = pop.querySelector("tbody"), title = pop.querySelector(".cal-title");
  var prev = pop.querySelector('[data-step="-1"]'), next = pop.querySelector('[data-step="1"]');
  function render() {
    title.textContent = fMonth.format(view);
    var first = new Date(view.getFullYear(), view.getMonth(), 1), lead = (first.getDay() + 6) % 7, d = addDays(first, -lead), html = "";
    for (var w = 0; w < 6; w++) {
      if (w > 0 && d.getMonth() !== view.getMonth()) break;
      html += "<tr>";
      for (var i = 0; i < 7; i++, d = addDays(d, 1)) {
        var inMonth = d.getMonth() === view.getMonth(), ok = d >= min && d <= max, isSel = same(d, sel);
        var cls = "cal-day" + (inMonth ? "" : " out") + (same(d, today) ? " today" : "") + (isSel ? " sel" : "") + (d > today && d < sel ? " span" : "");
        html += "<td" + (isSel ? ' aria-selected="true"' : "") + '><button type="button" class="' + cls + '" data-date="' + key(d) + '" tabindex="' + (same(d, focus) ? 0 : -1) + '" aria-label="' + fFull.format(d) + (ok ? ", " + days(between(today, d)) : "") + '"' + (same(d, today) ? ' aria-current="date"' : "") + (ok ? "" : " disabled") + "><span>" + d.getDate() + "</span></button></td>";
      }
      html += "</tr>";
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
  function focusDay() {
    var b = body.querySelector('[data-date="' + key(focus) + '"]');
    if (b) b.focus();
  }
  function moveTo(d) {
    focus = d < min ? min : d > max ? max : d;
    if (focus.getMonth() !== view.getMonth() || focus.getFullYear() !== view.getFullYear()) view = new Date(focus.getFullYear(), focus.getMonth(), 1);
    render();
    focusDay();
  }
  function choose(d, close) {
    sel = focus = d;
    render();
    field();
    hide(true);
  }
  function show2() {
    if (open) return;
    open = true;
    focus = sel;
    view = new Date(sel.getFullYear(), sel.getMonth(), 1);
    render();
    pop.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    pop.classList.remove("up");
    var r = btn.getBoundingClientRect(), h = pop.offsetHeight + 12, top = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--top")) || 64;
    if (innerHeight - r.bottom < h && r.top - top > innerHeight - r.bottom) pop.classList.add("up");
    if (!reduced) pop.animate([{ opacity: 0, transform: "translateY(" + (pop.classList.contains("up") ? 6 : -6) + "px) scale(.98)" }, { opacity: 1, transform: "none" }], { duration: 200, easing: "cubic-bezier(.2,.9,.25,1)" });
    focusDay();
  }
  function hide(back) {
    if (!open) return;
    open = false;
    pop.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    if (back) btn.focus();
  }
  btn.addEventListener("click", function() {
    open ? hide(true) : show2();
  });
  btn.addEventListener("keydown", function(e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      show2();
    }
  });
  pop.addEventListener("click", function(e) {
    var b = e.target.closest("button");
    if (!b || b.disabled) return;
    if (b.dataset.date) {
      var p = b.dataset.date.split("-");
      choose(new Date(+p[0], p[1] - 1, +p[2]));
    } else if (b.dataset.days) choose(addDays(today, +b.dataset.days));
    else if (b.dataset.step) {
      view = new Date(view.getFullYear(), view.getMonth() + +b.dataset.step, 1);
      render();
    }
  });
  body.addEventListener("keydown", function(e) {
    var k = e.key, d = null, wd = (focus.getDay() + 6) % 7;
    if (k === "ArrowLeft") d = addDays(focus, -1);
    else if (k === "ArrowRight") d = addDays(focus, 1);
    else if (k === "ArrowUp") d = addDays(focus, -7);
    else if (k === "ArrowDown") d = addDays(focus, 7);
    else if (k === "Home") d = addDays(focus, -wd);
    else if (k === "End") d = addDays(focus, 6 - wd);
    else if (k === "PageUp") d = new Date(focus.getFullYear(), focus.getMonth() - 1, focus.getDate());
    else if (k === "PageDown") d = new Date(focus.getFullYear(), focus.getMonth() + 1, focus.getDate());
    if (d) {
      e.preventDefault();
      moveTo(d);
    }
  });
  pop.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      hide(true);
    }
  });
  document.addEventListener("pointerdown", function(e) {
    if (open && !pop.contains(e.target) && !btn.contains(e.target)) hide(false);
  });
  pop.addEventListener("focusout", function(e) {
    if (open && e.relatedTarget && !pop.contains(e.relatedTarget) && e.relatedTarget !== btn) hide(false);
  });
  field();
  return {
    days: function() {
      return between(today, sel);
    },
    disable: function(v) {
      btn.disabled = v;
      if (v) hide(false);
    }
  };
}
var form = $("#form"), input = $("#file"), drop = $("#drop"), file = null;
var expire = $("#expire"), daysField = $("#daysField"), submit = $("#submit");
function show() {
  $("#dropEmpty").hidden = !!file;
  $("#dropFile").hidden = !file;
  drop.classList.toggle("has", !!file);
  if (!file) return;
  var e = ext(file.name), ic = $("#fileIc");
  ic.dataset.ext = e || "file";
  ic.classList.toggle("site", e === "zip" || e === "html" || e === "htm");
  $("#fileName").textContent = file.name;
  $("#fileName").title = file.name;
  $("#fileSize").textContent = size(file.size);
}
function setFile(f) {
  fileErr("");
  if (f && f.size > MAX) {
    file = null;
    show();
    fileErr("That file is " + size(f.size) + ". The limit is 10 MB.");
    return;
  }
  if (f && !f.size) {
    file = null;
    show();
    fileErr("That file is empty. Choose another one.");
    return;
  }
  file = f || null;
  show();
}
function fileErr(msg) {
  var e = $("#fileErr");
  e.textContent = msg;
  e.hidden = !msg;
  drop.classList.toggle("bad", !!msg);
}
$("#choose").addEventListener("click", function() {
  input.click();
});
$("#change").addEventListener("click", function() {
  input.click();
});
$("#clear").addEventListener("click", function() {
  input.value = "";
  setFile(null);
  $("#choose").focus();
});
input.addEventListener("change", function() {
  if (input.files[0]) {
    setFile(input.files[0]);
    if (file) $("#change").focus();
  }
});
var depth = 0;
function hasFiles(e) {
  return e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], "Files") >= 0;
}
document.addEventListener("dragenter", function(e) {
  if (!hasFiles(e)) return;
  e.preventDefault();
  depth++;
  drop.classList.add("over");
});
document.addEventListener("dragleave", function(e) {
  if (!hasFiles(e)) return;
  depth = Math.max(0, depth - 1);
  if (!depth) drop.classList.remove("over");
});
document.addEventListener("dragover", function(e) {
  if (hasFiles(e)) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }
});
document.addEventListener("drop", function(e) {
  if (!hasFiles(e)) return;
  e.preventDefault();
  depth = 0;
  drop.classList.remove("over");
  var fs = e.dataTransfer.files;
  if (fs.length > 1) toast("One file at a time: the first one is chosen.", true);
  if (fs[0]) setFile(fs[0]);
});
var until = datePicker({ button: $("#until"), text: $("#untilText"), badge: $("#untilDays"), pop: $("#cal"), maxDays: 30, start: 7 });
function syncExpire() {
  daysField.hidden = !expire.checked;
}
expire.addEventListener("change", syncExpire);
syncExpire();
var up = $("#up"), track = $(".upbar-track", up), glint = $("#upFill b"), busy = false;
function run(f, d) {
  busy = true;
  submit.textContent = "Uploading…";
  form.querySelectorAll("input, button").forEach(function(el) {
    el.disabled = true;
  });
  until.disable(true);
  $("#upName").textContent = f.name;
  up.hidden = false;
  var saved = add(f, d), T = Math.min(2600, 900 + f.size / 4500), t0 = performance.now(), last = 0;
  function frame(now) {
    var u = Math.min(1, (now - t0) / T), p = 1 - Math.pow(1 - u, 2.2);
    track.style.setProperty("--p", p.toFixed(4));
    if (!reduced) glint.style.transform = "translateX(" + (now / 9 % 260 - 130).toFixed(1) + "%)";
    var pct = Math.round(p * 100);
    if (pct !== last) {
      $("#upPct").textContent = pct + "%";
      last = pct;
    }
    if (u < 1) requestAnimationFrame(frame);
    else checking();
  }
  requestAnimationFrame(frame);
  function checking() {
    glint.style.transform = "translateX(-100%)";
    $("#upState").textContent = "Checking the file";
    var c0 = performance.now(), C = reduced ? 1 : 520;
    saved.then(function(p) {
      (function sweep(now) {
        var c = Math.min(1, (now - c0) / C);
        track.style.setProperty("--c", (c * c * (3 - 2 * c)).toFixed(4));
        if (c < 1) return requestAnimationFrame(sweep);
        $("#upState").textContent = "Uploaded. Opening its link";
        setTimeout(function() {
          location.href = pageUrl("ready.html?id=" + p.id);
        }, reduced ? 0 : 260);
      })(performance.now());
    }, function() {
      busy = false;
      submit.textContent = "Upload and share";
      up.hidden = true;
      form.querySelectorAll("input, button").forEach(function(el) {
        el.disabled = false;
      });
      until.disable(false);
      track.style.setProperty("--p", 0);
      track.style.setProperty("--c", 0);
      fileErr("Something went wrong. Please try again.");
    });
  }
}
form.addEventListener("submit", function(e) {
  e.preventDefault();
  if (busy) return;
  var bad = null;
  if (!file) {
    fileErr("Choose a file to upload.");
    bad = bad || $("#choose");
  }
  if (bad) {
    bad.focus();
    return;
  }
  run(file, expire.checked ? until.days() : null);
});
addEventListener("pageshow", function(e) {
  if (e.persisted) location.reload();
});
