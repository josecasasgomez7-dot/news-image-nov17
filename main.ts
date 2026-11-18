// News-image entry for make.fun's "Sum up 17 November's world news in one image" bounty
// (competition news-image-20261117, Node 22, standard library only).
//
// The finished front page lives in entry.png beside this file: a 1024x1024 PNG of a
// one-page newspaper summing up Tuesday, 17 November 2026, drawn as HTML/CSS and
// rendered once, offline, with Chromium. This program only copies that image to the
// output directory, so every run writes the exact same bytes.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
copyFileSync(new URL('./entry.png', import.meta.url), join(outDir, 'entry.png'));
