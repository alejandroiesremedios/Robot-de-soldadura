// Localiza las páginas del PDF Serie E donde aparecen las secciones que nos interesan,
// para no renderizar páginas a ciegas.
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

const PDF = path.join(ROOT, '90203-1104DSB_Operation Manual (E series)_Spanish.pdf');

// Patrones a buscar (regex aplicado al texto plano de cada página).
// Para cada uno guardamos solo la primera coincidencia (el inicio de la sección).
const TARGETS = [
  { id: 'apariencia_control', pattern: /APARIENCIA\s+DEL\s+CONTROL/i },
  { id: 'apariencia_tp', pattern: /APARIENCIA\s+DEL\s+MANDO\s+MANUAL/i },
  { id: 'teclado_tp', pattern: /TECLADO\s+DEL\s+TP/i },
  { id: 'pantallas_tp', pattern: /PANTALLAS\s+DEL\s+TP/i },
  { id: 'encendido', pattern: /3\.1\s+PROCEDIMIENTO DE ENCENDIDO/i },
  { id: 'apagado', pattern: /3\.2\s+PROCEDIMIENTOS DE DESCONEXI/i },
  { id: 'detener_robot', pattern: /3\.3\s+M[EÉ]TODOS PARA DETENER/i },
  { id: 'nombres_ejes', pattern: /4\.1\.1\s+NOMBRES DE CADA EJE/i },
  { id: 'op_manual_6ejes', pattern: /4\.1\.2\s+PROCEDIMIENTO/i },
  { id: 'coord_eje', pattern: /4\.2\.1\s+MODO COORDENADAS DE EJE/i },
  { id: 'coord_base', pattern: /4\.2\.2\s+MODO COORDENADAS DE BASE/i },
  { id: 'coord_herramienta', pattern: /4\.2\.3\s+MODO COORDENADAS DE HERRAMIENTA/i },
  { id: 'instr_interpolacion', pattern: /5\.3\.1\s+INSTRUCCI[OÓ]N DE INTERPOLACI/i },
  { id: 'registrar_pose', pattern: /5\.4\s+REGISTRAR LOS DATOS DE POSE/i },
  { id: 'proc_ensenanza', pattern: /5\.5\.2\s+PROCEDIMIENTO DE ENSE[NÑ]ANZA/i },
  { id: 'crear_programa', pattern: /5\.6\.1\s+CREAR UN NUEVO PROGRAMA/i },
  { id: 'anadir_paso', pattern: /5\.6\.2\s+A[NÑ]ADIR UN PASO/i },
];

const found = {};
const data = new Uint8Array(await (await import('node:fs/promises')).readFile(PDF));
const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
console.log(`Páginas totales: ${doc.numPages}`);

// Saltamos las primeras páginas (portada, prefacios, índice).
const SKIP_FIRST = 22;
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
