// Makes lossless graded plates from the original Higgsfield PNGs. The JPEG masters in assets/plates-4k were graded
// toward the page's studio grey but are heavily compressed (about 0.6 MB for 4K); the PNGs (assets/plates-4k/
// hf-originals, downloaded from the original GPT Image 2.5 jobs) are clean but ungraded. Per plate and channel, this
// fits the grade as a smooth monotonic curve from PNG values to JPEG values, applies it to the PNG and writes
// assets/plates-4k/graded/plateNN.png, which scripts/cutouts.mjs reads.
//   node scripts/grade-originals.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const PAIRS = { '01': 'frosted/plate01_4k.jpg', '02': 'frosted/plate02_4k.jpg', '03': 'plate03_4k.jpg', '04': 'plate04_4k.jpg', '05': 'plate05_4k.jpg', '06': 'plate06_4k.jpg' };
mkdirSync('assets/plates-4k/graded', { recursive: true });
for (const [n, jpg] of Object.entries(PAIRS)) {
  const a = await sharp(`assets/plates-4k/hf-originals/p${n}.png`).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const b = await sharp(`assets/plates-4k/${jpg}`).removeAlpha().raw().toBuffer();
  const src = a.data, N = src.length / 3, out = Buffer.alloc(src.length), curves = [];
  for (let c = 0; c < 3; c++) {
    const sum = new Float64Array(256), cnt = new Float64Array(256);
    for (let i = 0; i < N; i++) { const v = src[i * 3 + c]; sum[v] += b[i * 3 + c]; cnt[v]++; }
    // mean JPEG value per PNG value, gaps filled, smoothed, then forced monotonic
    let lut = new Float64Array(256), last = -1;
    for (let v = 0; v < 256; v++) if (cnt[v] > 20) { lut[v] = sum[v] / cnt[v]; last = v; } else lut[v] = NaN;
    for (let v = 0; v < 256; v++) if (isNaN(lut[v])) { let lo = v - 1; while (lo >= 0 && isNaN(lut[lo])) lo--; let hi = v + 1; while (hi < 256 && isNaN(lut[hi])) hi++;
      lut[v] = lo < 0 ? (hi < 256 ? lut[hi] - (hi - v) : v) : hi > 255 ? lut[lo] + (v - lo) : lut[lo] + (lut[hi] - lut[lo]) * (v - lo) / (hi - lo); }
    const sm = new Float64Array(256);
    for (let v = 0; v < 256; v++) { let s = 0, w = 0; for (let d = -4; d <= 4; d++) { const u = v + d; if (u < 0 || u > 255) continue; const k = 5 - Math.abs(d); s += lut[u] * k; w += k; } sm[v] = s / w; }
    for (let v = 1; v < 256; v++) sm[v] = Math.max(sm[v], sm[v - 1]);
    curves.push(sm);
  }
  let err = 0;
  for (let i = 0; i < src.length; i++) { const v = Math.min(255, Math.max(0, Math.round(curves[i % 3][src[i]]))); out[i] = v; err += Math.abs(v - b[i]); }
  await sharp(out, { raw: { width: a.info.width, height: a.info.height, channels: 3 } }).png({ compressionLevel: 9 }).toFile(`assets/plates-4k/graded/plate${n}.png`);
  console.log(`plate ${n}: graded, mean difference from the JPEG master ${(err / src.length).toFixed(2)} levels`);
}
