import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Workaround Windows: pdf-to-png-converter v3/v4 entrega rutas tipo
// "C:\...\cmaps\" pero pdfjs-dist v6 espera una URL terminada en "/".
// Parcheamos normalizePath antes de cargar pdfToPng.
const require = createRequire(import.meta.url);
const normalizePathFile = require.resolve('pdf-to-png-converter').replace(
  /pdfToPng\.js$/,
  'normalizePath.js',
);
const normalizePathMod = require(normalizePathFile);
const originalNormalize = normalizePathMod.normalizePath;
normalizePathMod.normalizePath = function patchedNormalizePath(p) {
  const result = originalNormalize(p);
  const asUrl = pathToFileURL(result).href;
  return asUrl.endsWith('/') ? asUrl : `${asUrl}/`;
};

const { pdfToPng } = await import('pdf-to-png-converter');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.resolve(ROOT, 'src/assets/pdf');

// PDFs cortos: renderizamos todas las páginas (son fichas autocontenidas).
// PDFs largos: lista de páginas concretas que nos interesan.
const JOBS = [
  { pdf: 'Touch_sensing.pdf', id: 'touch_sensing', pages: null },
  { pdf: 'wire_check.pdf', id: 'wire_check', pages: null },
  {
    pdf: '90203-1104DSB_Operation Manual (E series)_Spanish.pdf',
    id: 'serie_e',
    // Páginas localizadas con find-pdf-pages.mjs (+ vecinas cuando interesa la
    // figura siguiente o la tabla continúa).
    //   24       2.1 Apariencia del control
    //   25-26    Panel de operación / panel opcional
    //   29       2.3 Apariencia del mando manual (TP)
    //   30-36    2.4 Teclado del TP (tabla de funciones de teclas)
    //   37-38    2.5 Pantallas del TP
    //   94       3.1 Procedimiento de encendido
    //   95       3.2 Procedimiento de desconexión
    //   96       3.3 Métodos para detener el robot
    //   98       4.1.1 Nombres de cada eje / 4.1.2 Operación manual 6 ejes
    //  101       4.2.1 Modo coordenadas de eje
    //  103       4.2.2 Modo coordenadas de base
    //  105       4.2.3 Modo coordenadas de herramienta
    //  114       5.3.1 Instrucción de interpolación
    //  125       5.4 Registrar los datos de pose
    //  127       5.5.2 Procedimiento de enseñanza
    //  132       5.6.1 Crear un nuevo programa
    //  137       5.6.2 Añadir un paso
    //  214       AUX. 0402 Posición de inicio (HOME) — pantalla menú
    //  215       Ajuste numérico de la pose HOME (valores por eje)
    pages: [
      24, 25, 26, 29, 30, 31, 37, 38, 94, 95, 96, 98, 101, 103, 105, 114, 125,
      127, 132, 137, 214, 215,
    ],
  },
  {
    pdf: '90203-1036DSB_Arc Welding Operation Manual (E series)_Spanish.pdf',
    id: 'arc_welding',
    // Páginas localizadas con find-pdf-pages-arc.mjs / find-weaving-pages.mjs.
    //   46   5.4 Configuración de la pantalla de aprendizaje (layout pantalla)
    //   48   5.5 Instrucción de elemento y parámetros (introducción)
    //   49   Tabla de tipos de punto de enseñanza: AC, WS, WC, WE y datos aux.
    //   51   5.5.2 Tabla de interpolaciones (JOINT/LINEAR/CIRCULAR + AC/WS/AS)
    //   56   5.5.12 Datos de desplazamiento lateral (weaving en WC/WE)
    //   60   5.7.1 Flujo básico: figura P0→P3 de soldadura horizontal
    //   65   5.8.3 Figura 5.1 — P0..P5 con punto de escape
    //   77   6.2 Movimiento de weaving con soldadura desactivada
    //   78   Indicador "Weaving OFF" en pantalla cuando weld está disable
    //  213   Cap. 10 — Tabla de patrones estándar registrados (PN=1..5)
    //  216   10.2 Direcciones (vertical / lateral / horizontal) + anchura WV
    //  217   10.2 Relación frecuencia-ciclo + ejemplo PN=1
    pages: [46, 48, 49, 51, 56, 60, 65, 77, 78, 213, 216, 217],
  },
];

const ONLY = process.argv.slice(2);
const filteredJobs = ONLY.length ? JOBS.filter((j) => ONLY.includes(j.id)) : JOBS;

for (const job of filteredJobs) {
  const src = path.join(ROOT, job.pdf);
  const dst = path.join(OUT_DIR, job.id);
  await fs.mkdir(dst, { recursive: true });
  // pdf-to-png-converter v3 hace path.join(process.cwd(), outputFolder),
  // así que le pasamos la ruta relativa al cwd.
  const dstRelative = path.relative(process.cwd(), dst);
  // eslint-disable-next-line no-console
  console.log(`[render] ${job.pdf} -> ${dst}`);
  const opts = {
    viewportScale: 2.0,
    outputFolder: dstRelative,
    outputFileMaskFunc: (i) => `page-${String(i).padStart(2, '0')}.png`,
  };
  if (job.pages) opts.pagesToProcess = job.pages;
  const pages = await pdfToPng(src, opts);
  // eslint-disable-next-line no-console
  console.log(`[ok] ${job.id}: ${pages.length} páginas`);
}
