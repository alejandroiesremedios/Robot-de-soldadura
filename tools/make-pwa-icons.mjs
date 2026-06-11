// Genera public/icon-192.png y public/icon-512.png a partir de public/icon.svg.
// Algunos launchers Android no rasterizan bien el SVG del manifest y muestran
// un icono genérico; los PNG de 192/512 px son la recomendación de Chrome.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, '../public');
const svg = path.join(PUBLIC, 'icon.svg');

for (const size of [192, 512]) {
  const out = path.join(PUBLIC, `icon-${size}.png`);
  await sharp(svg, { density: 300 }).resize(size, size).png().toFile(out);
  console.log(`[ok] ${out}`);
}
