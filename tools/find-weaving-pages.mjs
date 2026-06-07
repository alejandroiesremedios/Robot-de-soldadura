// One-shot: localizar páginas del manual Arc Welding relativas a weaving.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

const PDF = path.join(
  ROOT,
  '90203-1036DSB_Arc Welding Operation Manual (E series)_Spanish.pdf'
);

const TARGETS = [
  { id: 'weaving_5_5_12', pattern: /5\.5\.12\s+DATOS\s+DE\s+DESPLAZAMIENTO\s+LATERAL/i },
  { id: 'weaving_6_2', pattern: /6\.2\s+MOVIMIENTO\s+DE\s+DESPLAZAMIENTO\s+LATERAL/i },
  { id: 'weaving_cap10', pattern: /10\.1\s+DESCRIPCI[OÓ]N\s+GENERAL\s+DEL\s+PATR[OÓ]N\s+ESPECIAL/i },
  { id: 'weaving_10_1_1', pattern: /10\.1\.1\s+PATR[OÓ]N\s+ESPECIAL\s+DE\s+DESPLAZAMIENTO/i },
  { id: 'weaving_10_1_4', pattern: /10\.1\.4\s+DIAGRAMA\s+DE\s+FLUJO/i },
  { id: 'weaving_10_2', pattern: /10\.2\s+PATRONES\s+DE\s+DESPLAZAMIENTO\s+LATERAL\s+EST[AÁ]NDAR/i },
  { id: 'weaving_10_3', pattern: /10\.3\s+OPERACI[OÓ]N\s+DE\s+APRENDIZAJE\s+PARA\s+PATR[OÓ]N\s+ESPECIAL/i },
  { id: 'weaving_10_4', pattern: /10\.4\s+CREACI[OÓ]N\s+DE\s+UN\s+NUEVO\s+PATR[OÓ]N/i },
  { id: 'weaving_10_4_1', pattern: /10\.4\.1\s+SISTEMA\s+DE\s+COORDENADAS/i },
  { id: 'weaving_10_4_2', pattern: /10\.4\.2\s+CREACI[OÓ]N\s+DE\s+PATRONES/i },
  { id: 'arc_8_7_2', pattern: /8\.7\.2\s+PATR[OÓ]N\s+DE\s+DESPLAZAMIENTO\s+LATERAL\s+ESPECIAL/i },
];

const found = {};
const data = new Uint8Array(await (await import('node:fs/promises')).readFile(PDF));
const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
console.log(`Páginas totales: ${doc.numPages}`);

const SKIP_FIRST = 25;
for (let i = SKIP_FIRST + 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const content = await page.getTextContent();
  const text = content.items.map((it) => ('str' in it ? it.str : '')).join(' ');
  for (const t of TARGETS) {
    if (!found[t.id] && t.pattern.test(text)) {
      found[t.id] = i;
      console.log(`[${i.toString().padStart(3, ' ')}] ${t.id}`);
    }
  }
  if (Object.keys(found).length === TARGETS.length) break;
}

console.log('\nResultado:');
console.log(JSON.stringify(found, null, 2));
