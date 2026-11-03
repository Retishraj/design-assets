/* a small ZIP reader for the viewer: the central directory, then each file stored or deflated (inflated by the
   browser's DecompressionStream). Enough for a static site's ZIP; not ZIP64, not encrypted entries */

export function readZip(blob) {
  return blob.arrayBuffer().then(function (ab) {
    var buf = new Uint8Array(ab), dv = new DataView(ab), end = -1, i;
    // the end record: its signature, searched back from the end (past a comment of up to 64 KB)
    for (i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) if (dv.getUint32(i, true) === 0x06054b50) { end = i; break; }
    if (end < 0) throw new Error('not a zip');
    var n = dv.getUint16(end + 10, true), o = dv.getUint32(end + 16, true), td = new TextDecoder(), files = [];
    for (var k = 0; k < n && o + 46 <= buf.length; k++) {
      if (dv.getUint32(o, true) !== 0x02014b50) break;
      var flags = dv.getUint16(o + 8, true), method = dv.getUint16(o + 10, true);
      var nl = dv.getUint16(o + 28, true), xl = dv.getUint16(o + 30, true), cl = dv.getUint16(o + 32, true);
      var name = td.decode(buf.subarray(o + 46, o + 46 + nl));
      files.push({ name: name, method: method, enc: !!(flags & 1), csize: dv.getUint32(o + 20, true), size: dv.getUint32(o + 24, true), at: dv.getUint32(o + 42, true) });
      o += 46 + nl + xl + cl;
    }
    files = files.filter(function (f) { return !/\/$/.test(f.name) && !/(^|\/)(__MACOSX|\.DS_Store)/.test(f.name); });
    return {
      files: files,
      // a file's bytes
      bytes: function (f) {
        if (f.enc) return Promise.reject(new Error('encrypted'));
        var h = f.at, start = h + 30 + dv.getUint16(h + 26, true) + dv.getUint16(h + 28, true), raw = buf.subarray(start, start + f.csize);
        if (f.method === 0) return Promise.resolve(raw);
        if (f.method !== 8 || typeof DecompressionStream === 'undefined') return Promise.reject(new Error('unsupported'));
        var s = new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
        return new Response(s).arrayBuffer().then(function (b) { return new Uint8Array(b); });
      }
    };
  });
}
