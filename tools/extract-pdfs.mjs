import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, 'extracted');

const files = [
  '90203-1036DSB_Arc Welding Operation Manual (E series)_Spanish.pdf',
  '90203-1104DSB_Operation Manual (E series)_Spanish.pdf',
  'Touch_sensing.pdf',
  'wire_check.pdf',
  'K-ROSET Instruction Manual_EN.pdf',
];

await fs.mkdir(OUT, { recursive: true });

for (const f of files) {
  const full = path.join(ROOT, f);
  const buf = await fs.readFile(full);
  const data = await pdf(buf);
  const base = f.replace(/\.pdf$/i, '');
  const outFile = path.join(OUT, `${base}.txt`);
  await fs.writeFile(outFile, data.text, 'utf8');
  console.log(`[ok] ${f} -> ${outFile} (${data.numpages} págs, ${data.text.length} chars)`);
}
