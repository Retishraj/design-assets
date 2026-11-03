import { $, p as pageUrl } from "./theme.js";
import { g as get, m as size, l as linkFor, o as expired, w as when, d as copy, e as copied, t as toast, n as newCode, h as showCode } from "./store.js";
var p = get(new URLSearchParams(location.search).get("id"));
if (!p) {
  $("#missing").hidden = false;
} else {
  $("#ready").hidden = false;
  document.title = p.name + " is ready — Previewly";
  $("#what").append(
    document.createTextNode("Anyone with the link and its passcode can open "),
    Object.assign(document.createElement("b"), { textContent: p.name }),
    document.createTextNode(" (" + size(p.size) + ").")
  );
  $("#toPreviews").href = pageUrl("previews.html?new=" + p.id);
  var link = linkFor(p);
  $("#link").textContent = link;
  $("#expires").textContent = p.expiresAt ? (expired(p) ? "Expired " : "") + when(p.expiresAt) : "Does not expire";
  $("#copyLink").addEventListener("click", function(e) {
    var b = e.currentTarget;
    copy(link).then(function() {
      copied(b);
      toast("Link copied. Paste it anywhere.");
    }, function() {
      toast("Couldn’t copy. Select the link and copy it.", true);
    });
  });
  var code = "";
  $("#gen").addEventListener("click", function() {
    var r = newCode(p.id);
    if (!r) return;
    code = r.code;
    showCode($("#code"), code);
    $("#codeNote").textContent = "Shown once — copy it now." + (r.replaced ? " The previous passcode has stopped working." : "");
    $("#passBefore").hidden = true;
    $("#passAfter").hidden = false;
    $("#copyCode").focus();
  });
  $("#copyCode").addEventListener("click", function(e) {
    var b = e.currentTarget;
    copy(code).then(function() {
      copied(b);
      toast("Passcode copied.");
    }, function() {
      toast("Couldn’t copy. Select the passcode and copy it.", true);
    });
  });
}
