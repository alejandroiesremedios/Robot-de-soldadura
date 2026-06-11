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

// Lista de páginas concretas que usa la app (las no referenciadas se
// eliminan: con import.meta.glob eager toda página renderizada se embebe
// en el bundle y en el standalone aunque nadie la use).
const JOBS = [
  { pdf: 'Touch_sensing.pdf', id: 'touch_sensing', pages: [2, 3, 4, 5, 6, 7] },
  { pdf: 'wire_check.pdf', id: 'wire_check', pages: [2, 3, 4] },
  {
    pdf: '90203-1104DSB_Operation Manual (E series)_Spanish.pdf',
    id: 'serie_e',
    // Páginas localizadas con find-pdf-pages.mjs (+ vecinas cuando interesa la
    // figura siguiente o la tabla continúa).
    //   24       2.1 Apariencia del control
    //   26       Panel de operación / panel opcional
    //   29       2.3 Apariencia del mando manual (TP)
    //   30-31    2.4 Teclado del TP (tabla de funciones de teclas)
    //   37       2.5 Pantallas del TP
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
      24, 26, 29, 30, 31, 37, 94, 95, 96, 98, 101, 103, 105, 114, 125,
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
    //   61   5.7.2 Estado de soldadura — qué son datos auxiliares y estado
    //   62   5.7.2.2 Tabla de tipos de condiciones de soldadura
    //   65   5.8.3 Figura 5.1 — P0..P5 con punto de escape
    //   66   5.8.3 Figura 5.2 — pantalla del programa pg10 + tabla pasos
    //   67   5.8.3 Paso 1 (P0) — jog + AC + Figura 5.3
    //   68   5.8.3 Paso 2 (P1) — WS, ángulo soplete 45°
    //   69   5.8.3 Paso 3 (P2) — WC con escape Z- en herramienta
    //   70   5.8.3 Paso 4 (P3) — WE, cráter
    //   71   5.8.3 Paso 5 (P4-P5) — AC + escape Z-
    //   78   Indicador "Weaving OFF" en pantalla cuando weld está disable
    //  213   Cap. 10 — Tabla de patrones estándar registrados (PN=1..5)
    //  216   10.2 Direcciones (vertical / lateral / horizontal) + anchura WV
    //  219   PN=2 Triangular — movimiento + relación temporal del ciclo
    //  220   PN=3 Triangular recíproco con parada en ambos extremos + centro
    //  227   10.4.1 Sistema de coordenadas X/Y/Z + ángulo del soplete
    //  230   10.4.2 Diagrama de flujo (5 pasos) para crear un patrón
    //  233   Caso 1 — diagrama de expansión con tiempos de parada 26 % / 26 %
    //  234   Caso 2 — bisel V 22,5° con separación de raíz 4 mm
    //  235   Caso 2 — tabla de cumplimentación punto a punto (Tiempo / X / Y / Z / Áng / Cor / Tens)
    //  302   Apéndice 3 — Triangular con parada en ambos extremos (hoja completa)
    //  306   Apéndice 3 — Triangular horizontal para ranura bisel único 22,5°
    //  312   Apéndice 3 — Triangular con paradas + aumento de corriente 20 % en extremos
    pages: [
      46, 48, 49, 51, 56, 60, 61, 62, 65, 66, 67, 68, 69, 70, 71, 78,
      213, 216, 219, 220, 227, 230, 233, 234, 235, 302, 306, 312,
    ],
  },
  {
    pdf: 'K-ROSET Instruction Manual_EN.pdf',
    id: 'k_roset',
    // Sección 4.1.1.2 Virtual Teach Pendant (VTP) — captura del TP virtual con
    // panel de operación + hard keys, que es la imagen clara que falta en
    // Fundamentos → Teach pendant.
    // OJO: el PDF tiene 6 páginas de cubierta antes de empezar la numeración
    // impresa, por lo que PDF page = printed page + 6.
    //  164 (impresa 158)  Position Change of Hard Key (captura del VTP)
    pages: [164],
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
