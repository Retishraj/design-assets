import { b as dashboardPhone, s as statement, l as landing, d as dashboard } from "./mockups.js";
import { y as getBlob, j as ext, k as escapeHtml } from "./store.js";
function readZip(blob) {
  return blob.arrayBuffer().then(function(ab) {
    var buf = new Uint8Array(ab), dv = new DataView(ab), end = -1, i;
    for (i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) if (dv.getUint32(i, true) === 101010256) {
      end = i;
      break;
    }
    if (end < 0) throw new Error("not a zip");
    var n = dv.getUint16(end + 10, true), o = dv.getUint32(end + 16, true), td = new TextDecoder(), files = [];
    for (var k = 0; k < n && o + 46 <= buf.length; k++) {
      if (dv.getUint32(o, true) !== 33639248) break;
      var flags = dv.getUint16(o + 8, true), method = dv.getUint16(o + 10, true);
      var nl = dv.getUint16(o + 28, true), xl = dv.getUint16(o + 30, true), cl = dv.getUint16(o + 32, true);
      var name = td.decode(buf.subarray(o + 46, o + 46 + nl));
      files.push({ name, method, enc: !!(flags & 1), csize: dv.getUint32(o + 20, true), size: dv.getUint32(o + 24, true), at: dv.getUint32(o + 42, true) });
      o += 46 + nl + xl + cl;
    }
    files = files.filter(function(f) {
      return !/\/$/.test(f.name) && !/(^|\/)(__MACOSX|\.DS_Store)/.test(f.name);
    });
    return {
      files,
      // a file's bytes
      bytes: function(f) {
        if (f.enc) return Promise.reject(new Error("encrypted"));
        var h = f.at, start = h + 30 + dv.getUint16(h + 26, true) + dv.getUint16(h + 28, true), raw = buf.subarray(start, start + f.csize);
        if (f.method === 0) return Promise.resolve(raw);
        if (f.method !== 8 || typeof DecompressionStream === "undefined") return Promise.reject(new Error("unsupported"));
        var s = new Blob([raw]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
        return new Response(s).arrayBuffer().then(function(b) {
          return new Uint8Array(b);
        });
      }
    };
  });
}
var NOTES = "Northvale prototype, release notes\n\nv3, today\n- A spending donut on the dashboard, by category.\n- An insight banner when a bill is due.\n- Merchant monograms in recent activity.\n\nv2, 19 Oct\n- Range tabs on the balance chart: week, month, year.\n- Quick actions: send, request, top up, exchange.\n- Savings goals.\n\nv1, 12 Oct\n- The first release: balance, cards and recent activity.\n";
var MARK = '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 120 120"><rect width="120" height="120" rx="30" fill="#111D37"/><path d="M40 82V38l40 44V38" fill="none" stroke="#F5EFE4" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var SAMPLES = {
  dashboard3: function() {
    return { page: dashboard(3), w: 1440, h: 900 };
  },
  dashboard2: function() {
    return { page: dashboard(2), w: 1440, h: 900 };
  },
  landing: function() {
    return { page: landing(), w: 1440, h: 900 };
  },
  statement: function() {
    return { page: statement(), w: 1440, h: 900 };
  },
  phone: function() {
    return { page: dashboardPhone(), w: 390, h: 844 };
  },
  mark: function() {
    return { pic: "data:image/svg+xml," + encodeURIComponent(MARK) };
  },
  notes: function() {
    return { text: NOTES };
  }
};
var IMG = /^(png|jpe?g|gif|webp|avif|svg|bmp|ico)$/, TEXT = /^(txt|md|csv|json|css|js|mjs|xml|log|yml|yaml)$/;
var MIME = {
  html: "text/html",
  htm: "text/html",
  css: "text/css",
  js: "text/javascript",
  mjs: "text/javascript",
  json: "application/json",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  ico: "image/x-icon",
  woff2: "font/woff2",
  woff: "font/woff",
  ttf: "font/ttf",
  otf: "font/otf",
  mp4: "video/mp4",
  webm: "video/webm",
  mp3: "audio/mpeg",
  pdf: "application/pdf",
  txt: "text/plain"
};
var urls = [];
function objectUrl(b) {
  var u = URL.createObjectURL(b);
  urls.push(u);
  return u;
}
addEventListener("pagehide", function() {
  urls.forEach(URL.revokeObjectURL);
});
function page(viewer, c) {
  viewer.classList.add("pg");
  viewer.innerHTML = '<div class="vw-stage">' + c.page + "</div>";
  var stage = viewer.firstChild, mk = stage.firstChild, z = "fit";
  function size() {
    var s = z === "fit" ? Math.min(1, (viewer.clientWidth - 2) / c.w) : 1;
    stage.style.width = Math.round(c.w * s) + "px";
    stage.style.height = Math.round(c.h * s) + "px";
    mk.style.transform = s === 1 ? "" : "scale(" + s + ")";
  }
  new ResizeObserver(size).observe(viewer);
  return function(v) {
    z = v;
    size();
    viewer.scrollTop = 0;
  };
}
function pic(viewer, url, name) {
  var box = document.createElement("div"), img = new Image();
  box.className = "vw-pic";
  img.alt = name;
  img.src = url;
  box.appendChild(img);
  viewer.innerHTML = "";
  viewer.appendChild(box);
  return function() {
    viewer.scrollTop = 0;
    viewer.scrollLeft = 0;
  };
}
function frame(viewer, attrs, name) {
  var f = document.createElement("iframe");
  f.className = "vw-frame";
  f.title = name;
  for (var k in attrs) f.setAttribute(k, attrs[k]);
  viewer.innerHTML = "";
  viewer.appendChild(f);
  return null;
}
function text(viewer, t) {
  viewer.innerHTML = '<pre class="vw-text"></pre>';
  viewer.firstChild.textContent = t;
  return null;
}
function none(viewer, blob, name, why) {
  viewer.innerHTML = '<div class="vw-none"><span class="drop-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 5v10.5m0 0 4.2-4.2M12 15.5l-4.2-4.2"/><path d="M4.5 14.5v2.2a2.8 2.8 0 0 0 2.8 2.8h9.4a2.8 2.8 0 0 0 2.8-2.8v-2.2"/></svg></span><h2>' + escapeHtml(why) + '</h2><p>Download it to open it on your computer.</p><a class="cta">Download ' + escapeHtml(name) + "</a></div>";
  var a = viewer.querySelector("a");
  a.href = objectUrl(blob);
  a.download = name;
  return null;
}
function listing(viewer, files) {
  viewer.innerHTML = '<div class="vw-none" style="min-height:0;padding-bottom:8px"><h2>No index.html in this ZIP</h2><p>A site’s ZIP opens at its index.html. These are the files in it.</p></div><ul class="vw-list"></ul>';
  var ul = viewer.querySelector("ul");
  files.forEach(function(f) {
    var li = document.createElement("li");
    li.innerHTML = "<b></b><span></span>";
    li.firstChild.textContent = f.name;
    li.lastChild.textContent = (f.size / 1024).toFixed(1) + " KB";
    ul.appendChild(li);
  });
  return null;
}
function dataUrl(bytes, type) {
  return new Promise(function(ok) {
    var r = new FileReader();
    r.onload = function() {
      ok(r.result);
    };
    r.readAsDataURL(new Blob([bytes], { type }));
  });
}
function siteDoc(blob) {
  return readZip(blob).then(function(z) {
    var byPath = {};
    z.files.forEach(function(f) {
      byPath[f.name] = f;
    });
    var index = z.files.filter(function(f) {
      return /(^|\/)index\.html?$/i.test(f.name);
    }).sort(function(a, b) {
      return a.name.split("/").length - b.name.split("/").length;
    })[0];
    if (!index) return { files: z.files };
    var dec = new TextDecoder();
    function resolve(ref, from) {
      if (!ref || /^([a-z]+:|\/\/|#|data:)/i.test(ref)) return null;
      var base = from.split("/").slice(0, -1), parts = ref.split(/[?#]/)[0].split("/");
      if (ref[0] === "/") {
        base = index.name.split("/").slice(0, -1);
        parts = parts.slice(1);
      }
      parts.forEach(function(p) {
        if (p === "..") base.pop();
        else if (p && p !== ".") base.push(decodeURIComponent(p));
      });
      return byPath[base.join("/")] || null;
    }
    function inline(f) {
      return z.bytes(f).then(function(b) {
        return dataUrl(b, MIME[ext(f.name)] || "application/octet-stream");
      });
    }
    function css(textIn, from) {
      var jobs = [], out = textIn;
      textIn.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, function(m, q, ref) {
        var f = resolve(ref.trim(), from);
        if (f) jobs.push(inline(f).then(function(u) {
          out = out.split(m).join('url("' + u + '")');
        }));
        return m;
      });
      return Promise.all(jobs).then(function() {
        return out;
      });
    }
    return z.bytes(index).then(function(b) {
      var doc = new DOMParser().parseFromString(dec.decode(b), "text/html"), jobs = [];
      doc.querySelectorAll('link[rel~="stylesheet"][href]').forEach(function(l) {
        var f = resolve(l.getAttribute("href"), index.name);
        if (f) jobs.push(z.bytes(f).then(function(cb) {
          return css(dec.decode(cb), f.name);
        }).then(function(t) {
          var s = doc.createElement("style");
          s.textContent = t;
          l.replaceWith(s);
        }));
      });
      doc.querySelectorAll("style").forEach(function(s) {
        jobs.push(css(s.textContent, index.name).then(function(t) {
          s.textContent = t;
        }));
      });
      doc.querySelectorAll('[src],[poster],link[rel~="icon"][href],[srcset]').forEach(function(el) {
        ["src", "poster", "href"].forEach(function(a) {
          var f = el.hasAttribute(a) && resolve(el.getAttribute(a), index.name);
          if (f) jobs.push(inline(f).then(function(u) {
            el.setAttribute(a, u);
          }));
        });
        if (el.hasAttribute("srcset")) el.removeAttribute("srcset");
      });
      doc.querySelectorAll("[style]").forEach(function(el) {
        jobs.push(css(el.getAttribute("style"), index.name).then(function(t) {
          el.setAttribute("style", t);
        }));
      });
      return Promise.all(jobs).then(function() {
        return { html: "<!doctype html>" + doc.documentElement.outerHTML };
      });
    });
  });
}
function site(viewer, blob, name) {
  return siteDoc(blob).then(function(d) {
    return d.html ? frame(viewer, { sandbox: "allow-scripts allow-forms allow-modals allow-popups", srcdoc: d.html }, name) : listing(viewer, d.files);
  }, function() {
    return none(viewer, blob, name, "This ZIP can’t be read");
  });
}
function show(p, viewer) {
  if (p.sample && SAMPLES[p.sample]) {
    var c = SAMPLES[p.sample]();
    return Promise.resolve(c.page ? page(viewer, c) : c.pic ? pic(viewer, c.pic, p.name) : text(viewer, c.text));
  }
  return getBlob(p.id).then(function(blob) {
    if (!blob) {
      viewer.innerHTML = '<div class="vw-none"><h2>This file isn’t in this browser</h2><p>Previews in this prototype are kept in the browser they were uploaded from.</p></div>';
      return null;
    }
    var e = ext(p.name), type = blob.type || MIME[e] || "";
    if (IMG.test(e) || /^image\//.test(type)) return pic(viewer, objectUrl(blob), p.name);
    if (e === "pdf" || type === "application/pdf") return frame(viewer, { src: objectUrl(new Blob([blob], { type: "application/pdf" })) }, p.name);
    if (e === "html" || e === "htm") return blob.text().then(function(t) {
      return frame(viewer, { sandbox: "allow-scripts allow-forms allow-modals allow-popups", srcdoc: t }, p.name);
    });
    if (e === "zip") return site(viewer, blob, p.name);
    if (TEXT.test(e) || /^text\//.test(type)) return blob.text().then(function(t) {
      return text(viewer, t);
    });
    return none(viewer, blob, p.name, "This file can’t be shown here");
  });
}
var ro = new ResizeObserver(function(es) {
  es.forEach(function(e) {
    if (e.target._fit) e.target._fit();
  });
});
function fitTo(box, el, w, h) {
  el.style.width = w + "px";
  el.style.height = h + "px";
  box._fit = function() {
    var bw = box.clientWidth, bh = box.clientHeight;
    if (!bw || !bh) return;
    var k = h / w > bh / bw ? bh / h : bw / w;
    el.style.transform = "translate(" + ((bw - w * k) / 2).toFixed(1) + "px,0) scale(" + k.toFixed(4) + ")";
  };
  ro.observe(box);
  box._fit();
}
function thPage(box, html, w, h) {
  box.className = "thumb pg";
  box.innerHTML = '<div class="th-stage">' + html + "</div>";
  fitTo(box, box.firstChild, w, h);
}
function thFrame(box, html) {
  box.className = "thumb pg";
  box.innerHTML = '<div class="th-stage"><iframe sandbox="" tabindex="-1" loading="lazy" title=""></iframe></div>';
  var st = box.firstChild, f = st.firstChild;
  f.width = 1280;
  f.height = 800;
  f.srcdoc = html;
  fitTo(box, st, 1280, 800);
}
function thPic(box, url) {
  box.className = "thumb pic";
  var img = new Image();
  img.alt = "";
  img.decoding = "async";
  img.src = url;
  box.innerHTML = "";
  box.appendChild(img);
}
function thText(box, t) {
  box.className = "thumb pg";
  box.innerHTML = '<div class="th-stage"><pre class="th-text"></pre></div>';
  box.querySelector("pre").textContent = t.slice(0, 1400);
  fitTo(box, box.firstChild, 640, 400);
}
function thIcon(box, name) {
  var e = ext(name), site2 = e === "zip" || e === "html" || e === "htm";
  box.className = "thumb icon";
  box.innerHTML = '<span class="fileic big' + (site2 ? " site" : "") + '" data-ext="' + escapeHtml(e || "file") + '"></span>';
}
function thumb(p, box) {
  if (p.sample && SAMPLES[p.sample]) {
    var c = SAMPLES[p.sample]();
    if (c.page) thPage(box, c.page, c.w, c.h);
    else if (c.pic) thPic(box, c.pic);
    else thText(box, c.text);
    return Promise.resolve();
  }
  thIcon(box, p.name);
  return getBlob(p.id).then(function(blob) {
    if (!blob) return;
    var e = ext(p.name), type = blob.type || MIME[e] || "";
    if (IMG.test(e) || /^image\//.test(type)) return thPic(box, objectUrl(blob));
    if (e === "html" || e === "htm") return blob.text().then(function(t) {
      thFrame(box, t);
    });
    if (e === "zip") return siteDoc(blob).then(function(d) {
      if (d.html) thFrame(box, d.html);
    }, function() {
    });
    if (TEXT.test(e) || /^text\//.test(type)) return blob.text().then(function(t) {
      thText(box, t);
    });
  }).catch(function() {
  });
}
export {
  show as s,
  thumb as t
};
