import fs from 'fs';
import zlib from 'zlib';

function createPng(width, height) {
  // CRC32 table
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = crc32(typeAndData);
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8-bit depth
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // deflate
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw RGBA image data with scanline filter 0
  const stride = width * 4;
  const rawData = Buffer.alloc((stride + 1) * height);
  const cx = width / 2;
  const cy = height / 2;
  const r = width * 0.45;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (stride + 1);
    rawData[rowOffset] = 0; // Filter byte 0 (None)
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = (x - cx) / (width * 0.44);
      const dy = (y - cy) / (height * 0.44);
      const distSq = dx * dx + dy * dy;

      // Rounded squircle app icon
      const p = Math.pow(Math.abs(dx), 4) + Math.pow(Math.abs(dy), 4);
      if (p <= 1.0) {
        // Emerald green gradient background: #16a34a to #15803d
        const gradient = y / height;
        const red = Math.round(22 * (1 - gradient) + 21 * gradient);
        const green = Math.round(163 * (1 - gradient) + 128 * gradient);
        const blue = Math.round(74 * (1 - gradient) + 61 * gradient);

        // Simple cart basket / checkmark shape in white
        const isCartHandle = (x >= cx - width * 0.16 && x <= cx + width * 0.16 && y >= cy - height * 0.28 && y <= cy - height * 0.12);
        const isCartInner = (x >= cx - width * 0.12 && x <= cx + width * 0.12 && y >= cy - height * 0.24 && y <= cy - height * 0.12);
        const isCartBody = (x >= cx - width * 0.26 && x <= cx + width * 0.26 && y >= cy - height * 0.12 && y <= cy + height * 0.22);
        const isCheckmark = (x >= cx + width * 0.05 && x <= cx + width * 0.25 && y >= cy + height * 0.05 && y <= cy + height * 0.25);

        if ((isCartHandle && !isCartInner) || isCartBody) {
          // White shopping cart basket
          rawData[pxOffset] = 255;
          rawData[pxOffset + 1] = 255;
          rawData[pxOffset + 2] = 255;
          rawData[pxOffset + 3] = 255;
        } else {
          rawData[pxOffset] = red;
          rawData[pxOffset + 1] = green;
          rawData[pxOffset + 2] = blue;
          rawData[pxOffset + 3] = 255;
        }
      } else {
        // Transparent
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

const p192 = createPng(192, 192);
fs.writeFileSync('public/icons/icon-192.png', p192);

const p512 = createPng(512, 512);
fs.writeFileSync('public/icons/icon-512.png', p512);
fs.writeFileSync('public/icons/apple-touch-icon.png', p192);
fs.writeFileSync('public/favicon.png', createPng(64, 64));

console.log('Icons generated successfully!');
