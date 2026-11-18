// News-image entry for make.fun's "Sum up 17 November's world news in one image" bounty
// (competition news-image-20261117, Node 22, standard library only).
//
// The finished front page lives in entry.png beside this file: a 1024x1024 PNG of a
// one-page newspaper summing up Tuesday, 17 November 2026, drawn as HTML/CSS and
// rendered once, offline, with Chromium. This program validates that image, then
// copies it to the output directory, so every run writes the exact same bytes.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1_048_576; // 1 MiB
const MAX_WIDTH = 1024;
const MAX_HEIGHT = 1024;
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const source = fileURLToPath(new URL('./entry.png', import.meta.url));

// 1. The source image must exist.
if (!existsSync(source)) {
  throw new Error(`entry.png not found at ${source}`);
}

// 2. It must fit the 1 MiB size limit.
const { size } = statSync(source);
if (size > MAX_BYTES) {
  throw new Error(`entry.png is ${size} bytes, over the ${MAX_BYTES} byte limit`);
}

// 3. It must be a real PNG: magic bytes, then a valid IHDR chunk with
//    width/height at most 1024x1024.
const bytes = readFileSync(source);
if (bytes.length < 33 || !bytes.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error('entry.png is not a PNG file (bad magic bytes)');
}
const ihdrLength = bytes.readUInt32BE(8);
const ihdrType = bytes.toString('ascii', 12, 16);
if (ihdrType !== 'IHDR' || ihdrLength !== 13) {
  throw new Error('entry.png has no valid IHDR chunk');
}
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width > MAX_WIDTH || height > MAX_HEIGHT) {
  throw new Error(`entry.png is ${width}x${height}, over the ${MAX_WIDTH}x${MAX_HEIGHT} limit`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
// Deterministic copy: output bytes are exactly the input bytes.
copyFileSync(source, join(outDir, 'entry.png'));
