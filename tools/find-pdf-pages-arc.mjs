// Localiza páginas del manual Arc Welding (E series) y de la sección HOME
// del manual Serie E que aún nos faltan por insertar en Fundamentos.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

const JOBS = [
  {
    pdf: '90203-1036DSB_Arc Welding Operation Manual (E series)_Spanish.pdf',
    skipFirst: 22,
    targets: [
      { id: 'instr_punto', pattern: /5\.5\.1\s+INSTRUCCI[OÓ]N/i },
      { id: 'instr_interpol', pattern: /5\.5\.2\s+INTERPOLACI[OÓ]N/i },
      { id: 'flujo_basico', pattern: /5\.7\.1\s+FLUJO\s+B[AÁ]SICO/i },
      { id: 'creacion_hoja', pattern: /5\.8\.1\s+CREACI[OÓ]N\s+DE\s+UNA\s+HOJA/i },
      { id: 'pantalla_aprendizaje', pattern: /5\.4\s+CONFIGURACI[OÓ]N\s+DE\s+LA\s+PANTALLA/i },
      { id: 'establecer_estado', pattern: /5\.7\.2\.1\s+C[OÓ]MO\s+ESTABLECER\s+EL\s+ESTADO/i },
    ],
  },
  {
    pdf: '90203-1104DSB_Operation Manual (E series)_Spanish.pdf',
    skipFirst: 22,
    targets: [
      { id: 'home_aux0402', pattern: /AUX\.?\s*0402\s+POSICI[OÓ]N\s+DE\s+INICIO/i },
      { id: 'home_ajuste', pattern: /Ajusta\s+la\s+pose\s+HOME/i },
    ],
  },
];

for (const job of JOBS) {
  const PDF = path.join(ROOT, job.pdf);
  const data = new Uint8Array(await (await import('node:fs/promises')).readFile(PDF));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
  console.log(`\n===== ${job.pdf} (${doc.numPages} págs) =====`);

  const found = {};
  for (let i = job.skipFirst + 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((it) => ('str' in it ? it.str : '')).join(' ');
    for (const t of job.targets) {
      if (!found[t.id] && t.pattern.test(text)) {
        found[t.id] = i;
        console.log(`[${i.toString().padStart(3, ' ')}] ${t.id}`);
      }
    }
    if (Object.keys(found).length === job.targets.length) break;
  }
}
