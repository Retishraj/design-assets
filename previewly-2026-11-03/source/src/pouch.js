/* the pouch, opened in WebGL: the cut-out render (art.json "pouch") is split along the zipper and each half is warped
   outward above the slider, so the teeth part into a V the way fabric does (most at the seam, none at the pouch's
   outer edges, the fabric bunching where it's squeezed). The slider stops at the zipper's bottom stop, where the
   bag's slider sits. Through the V the inside shows: a back wall lit cobalt from within, the back panel's top edge,
   and the files standing inside (three of the tiles), rising as it opens. Once open, the pouch slumps into the bag's
   shape (slump 0..1): above the slider the opening sinks toward it, the flaps fold out into the bag's top corners,
   the outline widens to the bag's, and the back panel's edge drops to where the bag has it, so the bag render takes
   over without a jump (hero.js). A light sweep runs across it during the intro. Draws only when something changed.
   Without WebGL, the render is shown as an image instead. */

// shared by both vertex shaders: the seam, the opening and the slump. Positions in the layer's px; the canvas has a
// margin each side (frm.x px), so the slumped outline can be wider than the pouch
var WARP = [
  'uniform vec2 size;',              // the layer (px)
  'uniform vec2 frm;',               // the canvas margin each side (px), the canvas width (px)
  'uniform vec4 sa; uniform vec2 sb;',   // the seam: (x, y) at its top and where it bends, (x, y) at its bottom (px)
  'uniform vec2 zip;',               // the zipper's top (px), the slider's lowest point (px)
  'uniform vec2 open;',              // the slider (px), the V's half gap at the top (px)
  'uniform float slump;',            // 0 open pouch .. 1 the bag's shape
  'uniform vec3 sl;',                // the middle x, the pouch's half width, how far the top sinks toward the slider
  'uniform float prof[17]; uniform vec2 profY;',   // the bag's half width at 17 heights, from profY.x to profY.y
  'float seamX(float y){ if (y < sa.w) return mix(sa.x, sa.z, clamp((y - sa.y) / (sa.w - sa.y), 0.0, 1.0)); return mix(sa.z, sb.x, clamp((y - sa.w) / (sb.y - sa.w), 0.0, 1.0)); }',
  'float bagHalf(float y){ float f = clamp((y - profY.x) / (profY.y - profY.x), 0.0, 1.0) * 16.0; int i = int(min(floor(f), 15.0)); return mix(prof[i], prof[i + 1], f - float(i)); }',
  // the V's half gap at height y (0 at the slider, open.y at the top); straight sides once slumped
  'float gapAt(float y){ float h = clamp((open.x - y) / max(open.x - zip.x, 1.0), 0.0, 1.0); return open.y * pow(h, mix(0.85, 1.0, slump)); }',
  'vec2 relax(vec2 p){',
  '  if (p.y < open.x) p.y = open.x - (open.x - p.y) * mix(1.0, sl.z, slump);',
  '  p.x = sl.x + (p.x - sl.x) * mix(1.0, bagHalf(p.y) / sl.y, slump);',
  '  return p;',
  '}',
  'vec4 clip(vec2 p){ return vec4((p.x + frm.x) / frm.y * 2.0 - 1.0, 1.0 - p.y / size.y * 2.0, 0.0, 1.0); }'
].join('\n');

var VS = [
  'attribute vec2 uv;',
  WARP,
  'varying vec2 vUv; varying float vOpen; varying float vNear; varying float vCrease;',
  'void main(){',
  '  float side = uv.x < 0.0 ? -1.0 : 1.0;',          // the halves are passed with the left half flagged by u < 0
  '  vec2 t = vec2(abs(uv.x), uv.y);',
  '  vec2 p = t * size;',
  '  float sx = seamX(p.y);',
  '  float W = side < 0.0 ? sx : size.x - sx;',
  '  float r = clamp(abs(p.x - sx) / W, 0.0, 1.0);',
  '  float a = gapAt(p.y);',
  // the flap moves out most at its cut edge; the exponent eases toward 1 as the gap grows, so it never folds over
  '  float pe = min(1.7, 0.95 * W / max(a, 1.0));',
  '  float fall = pow(1.0 - r, pe);',
  '  p.x += side * a * fall;',
  '  vCrease = clamp(a * pe * pow(max(1.0 - r, 1e-3), pe - 1.0) / W, 0.0, 1.0);',   // how squeezed the fabric is here
  '  vOpen = a * fall; vNear = 1.0 - r;',
  '  vUv = t;',
  '  gl_Position = clip(relax(p));',
  '}'
].join('\n');

var FS = [
  'precision mediump float;',
  'uniform sampler2D tex; uniform vec2 sheen; uniform float gap;',
  'varying vec2 vUv; varying float vOpen; varying float vNear; varying float vCrease;',
  'void main(){',
  '  vec4 c = texture2D(tex, vUv);',                   // premultiplied
  '  float o = clamp(vOpen / max(gap, 1.0), 0.0, 1.0);',
  // the cut edge curls in: a little darker, lit cobalt from inside, its very edge (the plastic's thickness) catching
  // the light
  '  float edge = smoothstep(0.82, 1.0, vNear) * clamp(o * 1.6, 0.0, 1.0);',
  '  c.rgb *= 1.0 - 0.18 * edge;',
  '  c.rgb += vec3(0.10, 0.26, 0.85) * 0.45 * edge * c.a;',
  '  float lip = smoothstep(0.975, 1.0, vNear) * clamp(o * 3.0, 0.0, 1.0);',
  '  c.rgb += vec3(0.55, 0.70, 1.0) * 0.32 * lip * c.a;',
  // where the flap is squeezed toward the side, the fabric bunches: soft shade
  '  c.rgb *= 1.0 - 0.2 * vCrease * vCrease;',
  // the intro's light sweep: a soft diagonal band
  '  float d = (vUv.x * 0.55 + vUv.y * 0.45) - sheen.x;',
  '  c.rgb += vec3(1.0) * sheen.y * exp(-d * d * 90.0) * c.a * 0.55;',
  '  gl_FragColor = c;',
  '}'
].join('\n');

// the inside: a strip across the V from the pouch's top to the slider, warped like the flaps so its sides stay on
// their cut edges
var VS2 = [
  'attribute vec2 uv;',                // u across the opening (-1..1), v from the layer's top (0) to the slider (1)
  WARP,
  'varying vec2 vP; varying vec2 vI;',
  'void main(){',
  '  float y = open.x * uv.y;',
  '  vec2 p = relax(vec2(seamX(y) + uv.x * gapAt(y), y));',
  '  vP = p; vI = vec2(uv.x, clamp((y - zip.x) / max(open.x - zip.x, 1.0), 0.0, 1.0));',
  '  gl_Position = clip(p);',
  '}'
].join('\n');
var FS2 = [
  'precision mediump float;',
  'uniform sampler2D card0; uniform sampler2D card1; uniform sampler2D card2;',
  'uniform vec4 box0; uniform vec4 box1; uniform vec4 box2;',   // each file: x, y (top left), w, h, after the slump (px)
  'uniform float cardA; uniform float glow; uniform float backEdge;',
  'varying vec2 vP; varying vec2 vI;',
  // a file standing inside: tinted by the light in there, darker the deeper it is, shaded next to the cut edges
  'vec4 file(vec4 o, sampler2D t, vec4 b, float shade){',
  '  vec2 q = (vP - b.xy) / b.zw;',
  '  float inside = step(0.0, q.x) * step(q.x, 1.0) * step(0.0, q.y) * step(q.y, 1.0);',
  '  vec4 c = texture2D(t, clamp(q, 0.0, 1.0)) * inside * cardA;',
  '  c.rgb *= mix(vec3(1.0), vec3(0.64, 0.80, 1.0), 0.55) * shade;',
  '  return c + o * (1.0 - c.a);',
  '}',
  'void main(){',
  '  float u = vI.x, v = vI.y;',
  // the back wall: lit cobalt from within, paler high up where the light reaches the back panel, deeper toward the
  // slider; in shadow while the opening is still a slit
  '  vec3 hi = vec3(0.40, 0.61, 0.98), lo = vec3(0.09, 0.42, 0.99), dark = vec3(0.03, 0.10, 0.36);',
  '  vec3 col = mix(dark, mix(hi, lo, smoothstep(0.0, 1.0, v)), glow);',
  '  float edge = smoothstep(0.55, 1.0, abs(u));',
  '  float shade = (1.0 - 0.32 * edge) * mix(1.0, 0.78, smoothstep(0.35, 1.0, v));',
  '  col *= 1.0 - 0.32 * edge;',
  // the back panel's top edge: a pale lit rim, open air above it
  '  float above = smoothstep(backEdge + 3.0, backEdge - 3.0, vP.y);',
  '  float rim = smoothstep(backEdge - 2.0, backEdge + 3.0, vP.y) * smoothstep(backEdge + 18.0, backEdge + 5.0, vP.y);',
  '  col = mix(col, vec3(0.82, 0.90, 1.0), rim * 0.55 * glow);',
  '  vec4 o = vec4(col, 1.0) * (1.0 - above);',
  '  o = file(o, card0, box0, shade); o = file(o, card1, box1, shade); o = file(o, card2, box2, shade);',
  '  gl_FragColor = o;',
  '}'
].join('\n');

function compile(gl, type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
function program(gl, vs, fs) { var p = gl.createProgram(); gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs)); gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p; }
function smooth(a, b, x) { var t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }

function seamAt(S, y) {
  var a = y < S[1][1] ? S[0] : S[1], b = y < S[1][1] ? S[1] : S[2], k = Math.min(1, Math.max(0, (y - a[1]) / (b[1] - a[1])));
  return a[0] + (b[0] - a[0]) * k;
}

/* PouchGL(canvas, layer {w, h}, A): the anchors, all in the layer's px —
   seam: [[x, y] top, [x, y] where it bends, [x, y] bottom]; zipTop, zipEnd (the slider's lowest point);
   margin (the canvas's extra width each side); slump: { cx, half (the pouch's half width), sink (how far the top sinks
   toward the slider, 0..1), profY: [y0, y1], prof: 17 half widths of the bag, backEdge (the bag's back panel top) };
   cards: [{ dx, w, h, low, high }] (the files inside: offset from the middle, size, top when hidden and when open) */
export function PouchGL(canvas, layer, A) {
  this.canvas = canvas; this.L = layer; this.A = A;
  this.state = { q: 0, s: 0, sheen: -1, sheenA: 0 }; this.dirty = true; this.ok = false; this.cards = [];
  // WebGL 2 where there is one: it can mipmap the cut-out (its size isn't a power of two), which keeps it crisp when it
  // is drawn at half its size or less; WebGL 1 samples it linearly
  var opts = { premultipliedAlpha: true, alpha: true, antialias: true };
  var gl = canvas.getContext('webgl2', opts) || canvas.getContext('webgl', opts);
  if (!gl) return;
  this.gl = gl; this.gl2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
  try {
    this.front = program(gl, VS, FS); this.inside = program(gl, VS2, FS2);
  } catch (e) { console.warn('pouch:', e.message); return; }
  // the two halves: a grid each, from the outer edge to the seam; the left half's u is negative (a flag)
  var NX = 28, NY = 72, verts = [], idx = [];
  var self = this;
  function seamU(v) { return seamAt(A.seam, v * layer.h) / layer.w; }
  [-1, 1].forEach(function (side) {
    var base = verts.length / 2;
    for (var j = 0; j <= NY; j++) {
      var v = j / NY, su = seamU(v);
      for (var i = 0; i <= NX; i++) {
        var f = i / NX;
        // denser toward the seam, where the warp bends most
        var g = 1 - Math.pow(1 - f, 1.8);
        var u = side < 0 ? g * su : 1 - g * (1 - su);
        verts.push(side < 0 ? -Math.max(u, 1e-5) : u, v);
      }
    }
    for (j = 0; j < NY; j++) for (i = 0; i < NX; i++) {
      var a = base + j * (NX + 1) + i, b = a + 1, c = a + NX + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  });
  this.n = idx.length;
  this.vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, this.vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
  this.ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ib);
  this.ext = this.gl2 || gl.getExtension('OES_element_index_uint');
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.n > 65535 ? new Uint32Array(idx) : new Uint16Array(idx), gl.STATIC_DRAW);
  this.idxType = this.n > 65535 ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
  // the inside: a strip, 10 across (slightly past the cut edges, which the flaps cover) by 64 down
  var IU = 10, IV = 64, iv = [], ii = [], i, j;
  for (j = 0; j <= IV; j++) for (i = 0; i <= IU; i++) iv.push((i / IU * 2 - 1) * 1.02, j / IV);
  for (j = 0; j < IV; j++) for (i = 0; i < IU; i++) { var q0 = j * (IU + 1) + i; ii.push(q0, q0 + IU + 1, q0 + 1, q0 + 1, q0 + IU + 1, q0 + IU + 2); }
  this.ni = ii.length;
  this.ivb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, this.ivb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(iv), gl.STATIC_DRAW);
  this.iib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ii), gl.STATIC_DRAW);
  this.tex = gl.createTexture();
  this.ok = true;
  canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); self.ok = false; });
}

function upload(gl, gl2, tex, img) {
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  if (gl2) gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl2 ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
  var an = gl.getExtension('EXT_texture_filter_anisotropic');
  if (an) gl.texParameterf(gl.TEXTURE_2D, an.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, gl.getParameter(an.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

PouchGL.prototype.setImage = function (img) {
  var gl = this.gl; if (!gl) return;
  upload(gl, this.gl2, this.tex, img);
  this.hasImage = true;
  // compile both programs and touch every mip now, drawing once half open and once slumped: the first real opening
  // otherwise paid for the shader compile (a 280 ms frame where the zipper first moved)
  var st = this.state, keep = [st.q, st.s];
  this.set(0.4, -1, 0, 0); this.draw(); this.set(1, -1, 0, 0.6); this.draw();
  this.set(keep[0], -1, 0, keep[1]); this.dirty = true; this.draw();
};
// the files inside (three tile renders, back to front)
PouchGL.prototype.setCards = function (imgs) {
  var gl = this.gl, self = this; if (!gl) return;
  this.cards = imgs.map(function (img) { var t = gl.createTexture(); upload(gl, self.gl2, t, img); return t; });
  // drawn once open, where they show, then put back: their first use pays for the upload now, not mid-scroll (if the
  // pouch's own texture isn't in yet, setImage's warm draws cover them instead)
  var st = this.state, keep = [st.q, st.sheen, st.sheenA, st.s];
  this.set(1, -1, 0, 0); this.dirty = true; this.draw();
  this.set(keep[0], keep[1], keep[2], keep[3]); this.dirty = true; this.draw();
};

// the backing store: css size × device pixel ratio (capped)
PouchGL.prototype.resize = function (cssW, cssH, dpr) {
  var w = Math.max(2, Math.round(cssW * dpr)), h = Math.max(2, Math.round(cssH * dpr));
  if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; this.dirty = true; }
};

// q: the zipper's opening (0..1); sheen: the light sweep's position (-1 off) and strength; s: the slump (0..1)
PouchGL.prototype.set = function (q, sheenPos, sheenA, s) {
  var st = this.state; s = s || 0;
  if (Math.abs(q - st.q) > 1e-4 || Math.abs(s - st.s) > 1e-4 || sheenPos !== st.sheen || sheenA !== st.sheenA) {
    st.q = q; st.s = s; st.sheen = sheenPos; st.sheenA = sheenA; this.dirty = true;
  }
};

// the slider for opening q, and the V's half gap at the top, in layer px
PouchGL.prototype.geometry = function (q, s) {
  var A = this.A, L = this.L, ys = A.zipTop + (A.zipEnd - A.zipTop) * q;
  // the gap grows as the slider travels, up to a share of the width; slumping, the flaps fold out to the corners
  var gq = Math.min(L.w * 0.2, (ys - A.zipTop) * 0.36) * Math.min(1, q * 6);
  var flap = Math.min(A.seam[0][0], L.w - A.seam[0][0]);
  return { ys: ys, gap: gq + (flap * 0.985 - gq) * smooth(0, 1, s) };
};

PouchGL.prototype.draw = function () {
  if (!this.ok || !this.hasImage || !this.dirty) return;
  this.dirty = false;
  var gl = this.gl, L = this.L, A = this.A, st = this.state, SL = A.slump;
  var g = this.geometry(st.q, st.s), s = st.s;
  gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  var S = A.seam, sa = [S[0][0], S[0][1], S[1][0], S[1][1]], sb = [S[2][0], S[2][1]];
  function common(p) {
    var u = function (n) { return gl.getUniformLocation(p, n); };
    gl.uniform2f(u('size'), L.w, L.h); gl.uniform2f(u('frm'), A.margin, L.w + 2 * A.margin);
    gl.uniform4fv(u('sa'), sa); gl.uniform2fv(u('sb'), sb); gl.uniform2f(u('zip'), A.zipTop, A.zipEnd);
    gl.uniform2f(u('open'), g.ys, g.gap); gl.uniform1f(u('slump'), s);
    gl.uniform3f(u('sl'), SL.cx, SL.half, SL.sink); gl.uniform1fv(u('prof'), SL.prof); gl.uniform2fv(u('profY'), SL.profY);
    return u;
  }
  if (g.gap > 0.5) {
    var p2 = this.inside; gl.useProgram(p2);
    var u2 = common(p2);
    gl.uniform1f(u2('glow'), smooth(0, 0.7, st.q));
    // the back panel's top edge: level with the pouch's top, dropping to the bag's as it slumps
    gl.uniform1f(u2('backEdge'), A.zipTop - 4 + (SL.backEdge - A.zipTop + 4) * s);
    // the files: hidden below the slider at first, rising into the opening as it widens, lifting as it slumps; they
    // hand over to the tiles (hero.js) as the bag takes over
    var rise = smooth(0.4, 1, st.q), cardA = this.cards.length === 3 ? 1 - smooth(0.55, 0.9, s) : 0;
    gl.uniform1f(u2('cardA'), cardA);
    for (var c = 0; c < 3; c++) {
      var cd = A.cards[c], top = cd.low + (cd.high - cd.low) * rise - cd.lift * s;
      gl.uniform4f(u2('box' + c), SL.cx + cd.dx * (1 + 0.08 * s) - cd.w / 2, top, cd.w, cd.h);
      gl.activeTexture(gl.TEXTURE1 + c); gl.bindTexture(gl.TEXTURE_2D, this.cards[c] || this.tex);
      gl.uniform1i(u2('card' + c), 1 + c);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.ivb);
    var a2 = gl.getAttribLocation(p2, 'uv'); gl.enableVertexAttribArray(a2); gl.vertexAttribPointer(a2, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iib);
    gl.drawElements(gl.TRIANGLES, this.ni, gl.UNSIGNED_SHORT, 0);
  }
  var p = this.front; gl.useProgram(p);
  var u = common(p);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.tex);
  gl.uniform1i(u('tex'), 0);
  gl.uniform1f(u('gap'), Math.max(g.gap, 1));
  gl.uniform2f(u('sheen'), st.sheen, st.sheenA);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vb);
  var a = gl.getAttribLocation(p, 'uv'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ib);
  gl.drawElements(gl.TRIANGLES, this.n, this.idxType, 0);
};

// where the slider sits for opening q and slump s, in layer px (the slump's mapping, as in the shader)
PouchGL.prototype.slider = function (q, s) {
  var A = this.A, SL = A.slump, y = A.zipTop + (A.zipEnd - A.zipTop) * q, x = seamAt(A.seam, y);
  if (s) {
    var f = Math.min(1, Math.max(0, (y - SL.profY[0]) / (SL.profY[1] - SL.profY[0]))) * 16, i = Math.min(15, Math.floor(f));
    var half = SL.prof[i] + (SL.prof[i + 1] - SL.prof[i]) * (f - i);
    x = SL.cx + (x - SL.cx) * (1 + (half / SL.half - 1) * s);
  }
  return { x: x, y: y };
};
