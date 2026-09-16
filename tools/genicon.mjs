// 生成 M3E Designer 应用图标 (icon.ico)：紫色圆角方块 + 画布 + FAB 加号
// 纯 Node 实现：RGBA 软光栅渲染(SDF+超采样) → PNG(zlib) → ICO 容器
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import zlib from "zlib";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "M3EDesigner", "icon.ico");

/* ---------- 形状 SDF（<0 在内部） ---------- */
function sdRoundRect(px, py, cx, cy, hw, hh, r) {
  const qx = Math.abs(px - cx) - (hw - r), qy = Math.abs(py - cy) - (hh - r);
  const ax = Math.max(qx, 0), ay = Math.max(qy, 0);
  return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - r;
}
const sdCircle = (px, py, cx, cy, r) => Math.hypot(px - cx, py - cy) - r;

/* 图形层：从底到顶，命中即返回颜色 */
function shade(nx, ny) {
  // 归一化坐标 0..256
  // 1) 紫色圆角底板（留 6% 透明边距）
  if (sdRoundRect(nx, ny, 128, 128, 118, 118, 52) < 0) {
    // 2) 奶白画布
    if (sdRoundRect(nx, ny, 118, 108, 84, 64, 22) < 0) return [0xF3, 0xED, 0xF7, 255];
    // 3) 淡紫 FAB 圆
    if (sdCircle(nx, ny, 176, 172, 46) < 0) {
      // 4) 深紫加号（两根圆角短棒）
      if (sdRoundRect(nx, ny, 176, 172, 26, 7, 7) < 0 || sdRoundRect(nx, ny, 176, 172, 7, 26, 7) < 0)
        return [0x21, 0x00, 0x5D, 255];
      return [0xD0, 0xBC, 0xFF, 255];
    }
    return [0x67, 0x50, 0xA4, 255];
  }
  return [0, 0, 0, 0];
}

function renderPNG(size) {
  const SS = 4; // 每轴超采样
  const px = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const nx = (x + (sx + 0.5) / SS) * 256 / size;
          const ny = (y + (sy + 0.5) / SS) * 256 / size;
          const c = shade(nx, ny);
          r += c[0]; g += c[1]; b += c[2]; a += c[3];
        }
      }
      const n = SS * SS, i = (y * size + x) * 4;
      px[i] = Math.round(r / n); px[i + 1] = Math.round(g / n);
      px[i + 2] = Math.round(b / n); px[i + 3] = Math.round(a / n);
    }
  }
  return encodePNG(size, size, px);
}

/* ---------- 最小 PNG 编码器（filter 0 + zlib） ---------- */
function crc32(buf) {
  let t = crc32.table;
  if (!t) {
    t = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c;
    }
  }
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = t[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function encodePNG(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    rgba.subarray(y * w * 4, (y + 1) * w * 4).forEach((v, i) => { raw[y * (w * 4 + 1) + 1 + i] = v; });
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8bit RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ---------- ICO 容器（内嵌 PNG） ---------- */
function buildIco(sizes) {
  const pngs = sizes.map(s => ({ s, png: renderPNG(s) }));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { s, png } of pngs) {
    const e = Buffer.alloc(16);
    e[0] = s >= 256 ? 0 : s; e[1] = s >= 256 ? 0 : s;
    e[2] = 0; e[3] = 0; e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
    e.writeUInt32LE(png.length, 8); e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += png.length;
  }
  return Buffer.concat([header, ...entries, ...pngs.map(p => p.png)]);
}

const ico = buildIco([16, 24, 32, 48, 64, 128, 256]);
writeFileSync(OUT, ico);
console.log("icon.ico written:", ico.length, "bytes →", OUT);
