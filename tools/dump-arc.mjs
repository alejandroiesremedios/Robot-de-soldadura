// Vuelca rango de páginas del manual Arc Welding para confirmar contenido.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PDF = path.join(
  ROOT,
  '90203-1036DSB_Arc Welding Operation Manual (E series)_Spanish.pdf',
);

const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
const data = new Uint8Array(await (await import('node:fs/promises')).readFile(PDF));
const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;

const FROM = Number(process.argv[2] ?? 50);
const TO = Number(process.argv[3] ?? 53);

for (let i = FROM; i <= TO; i++) {
  const page = await doc.getPage(i);
  const content = await page.getTextContent();
  const text = content.items.map((it) => ('str' in it ? it.str : '')).join(' ');
  console.log(`\n===== ARC PAGE ${i} =====`);
  console.log(text.slice(0, 900));
}
