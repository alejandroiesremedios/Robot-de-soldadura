// Convierte imágenes pesadas a WebP y las redimensiona al ancho máximo deseado.
// El original (.jpg) se mantiene como fuente; el .webp generado es el que se
// importa en la app.
//
//   node tools/optimize-images.mjs           -> procesa toda la lista TARGETS
//   node tools/optimize-images.mjs robot     -> solo el job con id=robot
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const TARGETS = [
  {
    id: 'robot',
    input: 'src/assets/robot.jpg',
    output: 'src/assets/robot.webp',
    maxWidth: 1200,
    quality: 82,
  },
];

const ONLY = process.argv.slice(2);
const jobs = ONLY.length ? TARGETS.filter((t) => ONLY.includes(t.id)) : TARGETS;

const fmtKB = (n) => `${(n / 1024).toFixed(1)} kB`;

for (const job of jobs) {
  const src = path.join(ROOT, job.input);
  const dst = path.join(ROOT, job.output);
  const srcSize = (await fs.stat(src)).size;
  await sharp(src)
    .resize({ width: job.maxWidth, withoutEnlargement: true })
    .webp({ quality: job.quality })
    .toFile(dst);
  const dstSize = (await fs.stat(dst)).size;
  const ratio = ((1 - dstSize / srcSize) * 100).toFixed(1);
  // eslint-disable-next-line no-console
  console.log(
    `[ok] ${job.id}: ${path.basename(job.input)} ${fmtKB(srcSize)} -> ${path.basename(
      job.output,
    )} ${fmtKB(dstSize)} (-${ratio}%)`,
  );
}
