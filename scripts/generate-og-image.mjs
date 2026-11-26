import { createWriteStream, writeFileSync } from "node:fs";
import { deflateRawSync } from "node:zlib";

const W = 1200;
const H = 630;
const bg = [240, 241, 235]; // paper
const ink = [18, 30, 37]; // ink

// Build raw RGBA scanlines: each row starts with a filter byte (0 = none).
const rowBytes = W * 4;
const raw = Buffer.allocUnsafe(1 + rowBytes);
const rows = [];
for (let y = 0; y < H; y += 1) {
  raw[0] = 0; // filter: none
  for (let x = 0; x < W; x += 1) {
    const o = 1 + x * 4;
    raw[o] = bg[0];
    raw[o + 1] = bg[1];
    raw[o + 2] = bg[2];
    raw[o + 3] = 255;
  }
  rows.push(Buffer.from(raw));
}
const rawData = Buffer.concat(rows);
const idat = deflateRawSync(rawData);

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcInput = Buffer.concat([typeBuf, data]);
  const crc32 = crc32Buf(crcInput);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32 >>> 0, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function crc32Buf(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j += 1) {
      crc = crc & 1 ? (0xedb88320 ^ (crc >>> 1)) : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 6; // color type RGBA
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const png = Buffer.concat([
  signature,
  chunk("IHDR", ihdr),
  chunk("IDAT", idat),
  chunk("IEND", Buffer.alloc(0)),
]);

writeFileSync("C:/Users/acer/OneDrive/Desktop/quickscan-pdf/public/og-image.png", png);
console.log("Wrote og-image.png", png.length, "bytes");
