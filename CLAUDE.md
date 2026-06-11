# CLAUDE.md

Documento de contexto para Claude Code. Mantén este archivo actualizado al final de cada sesión.

## Resumen del proyecto

PWA de **consulta y asistencia** para uso personal del usuario mientras opera un robot de soldadura Kawasaki **BA006L** con fuente **EWM Titan XQ 350 Plus**. **No controla el hardware** — el robot se opera con su teach pendant. La app sirve para consultar procedimientos, códigos de error, parámetros recomendados y llevar un diario de incidencias desde el móvil en el taller.

## Stack y herramientas

- **Tipo de app:** PWA (Progressive Web App) instalable en Android.
- **Plataforma destino:** Android (móvil del usuario en el taller). Por ser PWA es accesible también desde cualquier navegador.
- **Lenguaje / runtime:** _(pendiente de confirmar — propuesta: React/Vite + TypeScript, o similar ligero)_
- **Persistencia:** _(pendiente — IndexedDB local para diario; contenido estático embebido)_
- **Conectividad:** Wi-Fi/4G estable en el taller, pero la PWA debe cachear lo esencial (service worker) por buena práctica.
- **Tests:** _(pendiente)_

## Hardware de referencia (no controlado por la app)

- **Robot:** Kawasaki BA006L (brazo articulado de 6 ejes). Ya en operación con su controladora.
- **Fuente de soldadura:** EWM Titan XQ 350 Plus (multiproceso MIG/MAG, pulsado, sinérgico). Ya conectada al robot y operativa.

## Alcance funcional v1

1. **Códigos de error** del robot Kawasaki y de la fuente EWM con descripción y solución (buscador por código).
2. **Procedimientos paso a paso**: arranque, parada, cambio de hilo, cambio de boquilla, calibración TCP, homing, etc.
3. **Parámetros de soldadura recomendados**: tabla por material/espesor/posición (corriente, tensión, velocidad de hilo, JOB del EWM).
4. **Diario de incidencias y notas propias**: registro libre con fotos, búsqueda y vinculación a códigos de error.

## Inventario de procedimientos

Listado maestro de procedimientos que deben existir en la app (pantalla Procedimientos). Marcas: ✅ hecho · 🟡 esbozo · 🔵 en curso · ⬜ pendiente. Entre paréntesis, fuente principal.

### Robot — operación general

- ✅ Encendido del robot — **movido a Fundamentos → Modos del robot y arranque/parada** (Serie E §3.1)
- ✅ Apagado del robot — **movido a Fundamentos → Modos del robot y arranque/parada** (Serie E §3.2)
- ✅ Parada de emergencia y recuperación (Serie E §3.3)
- ✅ Wire check (wire_check.pdf)
- ✅ Touch sensing (Touch_sensing.pdf)

### Robot — uso avanzado del teach pendant

- ✅ Crear weaving / oscilación sobre un cordón — patrones estándar PN=1..5 (Arc Welding §5.5.12, §6.2, §10)
- ✅ Weaving triangular para 3F y 3G ascendente (GMAW, acero, hilo Ø1,0) — PN=2, parámetros orientativos
- ✅ Programa de soldadura básico — AC / WS / WC / WE entre puntos (Arc Welding §5.6–§5.8, figura 5.1)
- ⬜ Dar de alta una entrada en la base de datos de condiciones de soldadura (Aux 0420) (Arc Welding)
- ✅ Crear / editar patrón especial de weaving (Aux 1404-11) — modificar tiempos y paradas en vértices, con caso aplicado a unión a tope vertical ascendente (Arc Welding §10.3–§10.4 + Apéndice 3)
- ⬜ Copiar / mover / borrar pasos de un programa (Serie E §6 edición de programa)
- ⬜ REC vs MOD: modificar un punto ya grabado sin perder sus instrucciones (Serie E §5)
- ⬜ Modos de ejecución TEACH / CHECK / AUTO y override de velocidad (Serie E §3–§4)

### Soldadura EWM (Titan XQ 350 Plus)

Fuente: web oficial ewm-group.com (no hay PDF aportado todavía).

- ✅ Crear un programa dentro de un JOB (Procedimientos → `job-ewm`) — concepto de JOB, definición de curva sinérgica, estructura P0..P15 y receta paso a paso para guardar P1..P15 sobre el mismo JOB. _Pendiente añadir capturas reales del panel Expert XQ 2.0 cuando se hagan en el taller._
- ⬜ Modo Expert — estructura general de menús
- ⬜ Cargar JOB desde el robot por número (interfaz Kawasaki ↔ EWM)
- ⬜ Ajustar curva sinérgica (material / gas / diámetro de hilo)
- ⬜ Arc force / dynamics / corrección de longitud de arco
- ⬜ Modos de proceso: estándar, pulsado, forceArc, coldArc, rootArc, superPuls

### Mantenimiento

- ✅ Cambio de bobina de hilo
- ✅ Cambio de boquilla / tobera

### Fuera de inventario (decisiones tomadas)

Estos temas se descartaron expresamente; si vuelven a salir, recordarlo antes de proponer:

- Calibración del TCP de la antorcha
- Bloques y subprogramas (CALL / JUMP)
- Configuración de detección de errores de soldadura (Aux 1411)
- Linealización de la antorcha
- Backup / restore de JOBs por USB
- Códigos de error del EWM como procedimiento (irán a la pantalla **Errores**, no a Procedimientos)

## Estructura de archivos

```
Robot de soldadura/
└── CLAUDE.md          (este archivo)
```

_(El proyecto aún no tiene código. Se irá completando.)_

## Cómo ejecutar / desarrollar

- **Arrancar:** _(pendiente — depende del stack elegido)_
- **Build:** _(pendiente)_
- **Tests:** _(pendiente)_

## Convenciones y decisiones

- Idioma de la documentación e interfaz: **español**.
- Uso interno personal: no hay multiusuario, login ni cloud sync en v1.
- Nomenclatura de soldadura: usar siempre criterio normativo riguroso (consultar skill `welding-standards-lookup` para AWS/ISO cuando aplique).
- La app **nunca** se comunica con el hardware. Solo es referencia y registro.
- La información que el modelo no tenga sobre el robot/fuente se buscará en web; además el usuario aportará PDFs del robot.
- **UI — botones en grupo**: cuando se crea una serie de botones (por ejemplo el menú principal o cualquier conjunto de acciones agrupadas), cada botón debe llevar un **color distinto**. Un grupo monocromo cansa la vista, todo se ve igual y se pierde la atención del usuario; los colores diferenciados dan jerarquía visual y ayudan a reconocer la opción de un vistazo.
- **Contenidos siempre con imágenes**: el texto solo no basta. Todo procedimiento o sección de fundamentos debe ir acompañado de las imágenes/diagramas del PDF de referencia. Aplica también a contenidos futuros (no solo a los ya hechos).
- **Push a GitHub — recordatorio proactivo**: nunca pushear/desplegar sin que el usuario lo pida, pero **sí preguntárselo proactivamente** cada cierto tiempo y tras avances importantes (procedimiento terminado, refactor cerrado, build verde tras un cambio grande, fin natural de un bloque de trabajo). Una sola pregunta corta, sin perseverar si dice que no.
- **Standalone HTML (`Robot Soldadura.html`) — regenerar tras cada cambio**: el usuario consulta la app haciendo doble click en `Robot Soldadura.html` (un único fichero autocontenido en la raíz del proyecto). Ese fichero se genera con `npm run build:standalone` y **no se actualiza solo**: si no se regenera, el usuario sigue viendo la versión vieja por más que el código esté actualizado. Por tanto, **al terminar cualquier cambio que toque el contenido visible (procedimientos, fundamentos, imágenes, estilos)**, ejecutar `npm run build:standalone` antes de dar la tarea por cerrada. Alternativa para sesiones largas: dejar corriendo `npm run watch:standalone` en segundo plano para que se regenere automáticamente con cada save.

## Metodología para poblar contenido (a aplicar a cada apartado)

Patrón ya validado en el procedimiento de **wire check** y en las secciones de **Fundamentos** (partes-robot, teach-pendant, grabar-punto, interpolaciones). Reutilizarlo siempre que se añada o complete contenido:

1. **Identificar el PDF de referencia** y el rango aproximado de páginas (capítulos/secciones que cubren el tema). Texto plano por PDF disponible en `tools/extracted/*.txt`.
2. **Localizar las páginas exactas** con `tools/find-pdf-pages.mjs`. Definir un patrón regex por sección dentro del array `TARGETS` (usar grupos amplios — espacios `\s+`, mayúsculas opcionales). Ajustar `SKIP_FIRST` si el índice del PDF aparece en las primeras páginas.
3. **Verificar el contenido** de las páginas dudosas con `tools/dump-pdf-pages.mjs FROM TO` (vuelca los primeros 800 caracteres de cada página) antes de renderizar — evita renderizar la página equivocada.
4. **Renderizar a PNG** con `node tools/render-pdf-pages.mjs <id>` (acepta filtro por id del job: `serie_e`, `wire_check`, `touch_sensing`, etc.). Las imágenes van a `src/assets/pdf/<id>/page-NN.png`. Para añadir un PDF nuevo, registrarlo en el array `JOBS` con `pdf`, `id` y `pages` (lista de páginas; `null` para renderizar todas).
5. **Insertar las imágenes** en el JSX con `pdfImage('<id>', <pagina>)` y el componente `PdfFigure` (en `src/routes/Fundamentos.tsx`) o el campo `image`/`caption` de los pasos en `src/data/procedures.ts`. Vite las importa eager con `import.meta.glob` (ver `src/data/pdfImages.ts`), así que funcionan en dev, en build normal y en standalone.
6. **Coherencia terminológica**: si un paso menciona un concepto (AC, HOME, JOG, REC…), asegurar que existe la sección en Fundamentos y enlazarla desde el paso con `refs: [{ to: '<id-fundamento>', label: '...' }]`. Si la sección no existe todavía, crearla antes de usar el término.
7. **Pie de figura siempre presente**: cada `PdfFigure` lleva un `caption` que indica qué muestra y la referencia exacta del manual (p. ej. "Serie E §4.1.1"). No usar imágenes sin explicar.
8. **Build de verificación**: `npm run build` después de añadir contenido para confirmar que los imports de imágenes y los enlaces siguen sanos.

## UI / pantalla de inicio

- La pantalla de inicio debe mostrar **una imagen del robot** (la subirá el usuario a la carpeta del proyecto). Usar esa imagen como portada/hero del home.

## Cambios realizados por sesión

### 2026-06-06

- Creación inicial de `CLAUDE.md` con contexto del proyecto (robot Kawasaki BA006L + EWM Titan XQ 350 Plus).
- Pivote de alcance: la app **no controla** el hardware; es PWA Android de consulta y diario en el móvil.
- Decidido stack base: PWA, Android, conectividad estable.
- Decidido alcance v1: códigos de error + procedimientos + parámetros recomendados + diario de incidencias.
- Decidido que la pantalla de inicio mostrará una imagen del robot que aportará el usuario.
- Decidido alojamiento: GitHub Pages.
- Decidido que el contenido se extrae de los PDFs aportados y de las webs oficiales de EWM y Kawasaki como fuentes prioritarias.
- Mapeado el contenido de los 4 PDFs aportados (manual Serie E general, manual arc welding, touch sensing, wire check).
- Añadido `tools/extract-pdfs.mjs` con `pdf-parse` para volcar texto de PDFs a `tools/extracted/*.txt`.
- Montado esqueleto Vite + React + TS + Tailwind + vite-plugin-pwa + react-router + idb (IndexedDB).
- Implementadas pantallas: Home (con imagen del robot y pie con logo IES), Errores (buscador vacío), Procedimientos (con buscador, filtro por categoría y detalle paso a paso), Parámetros (tabla filtrable por material), Diario (lista + alta/edición/borrado + fotos con cámara).
- Datos seed: 7 procedimientos (encendido, apagado, parada de emergencia, wire check, touch sensing, cambio de bobina, cambio de boquilla) y 6 sets de parámetros MIG/MAG.
- Códigos de error y diario: sin datos precargados (a petición del usuario).
- PWA configurada: manifest, service worker (Workbox), icon.svg, instalable en Android.
- Build de producción OK (`npm run build`).
- Añadido botón "Instrucciones fundamentales" como primer ítem del menú con secciones: Partes del robot, Teach pendant, Grabar un punto, HOME, Instrucciones del punto (AC/WS/WC/WE/AS), Interpolaciones y Touch sensing vs wire check.
- Procedimiento de wire check rediseñado con imagen por paso (extraídas de `wire_check.pdf`) y chips de "→" que enlazan a la sección correspondiente de Fundamentos para mantener coherencia terminológica.
- Renderizadas 20 páginas del manual Serie E (24, 25, 26, 29, 30, 31, 37, 38, 94-96, 98, 101, 103, 105, 114, 125, 127, 132, 137) e insertadas en Fundamentos: Partes del robot (24/26/98), Teach pendant (29/30/31/37), Grabar un punto (125/127/132/137) e Interpolaciones (101/103/105/114).
- Añadidas páginas 214 y 215 del Serie E (AUX 0402 — Posición de inicio) al apartado "Posición HOME".
- Renderizadas 6 páginas del manual Arc Welding (46, 48, 49, 51, 60, 65) e insertadas en Fundamentos: layout pantalla de aprendizaje (p46) en Grabar un punto; tabla AC/WS/WC/WE (p49), pantalla de instrucción de elemento (p48), flujo P0→P3 (p60) y figura 5.1 con punto de escape (p65) en Instrucciones del punto; tabla de interpolaciones JOINT/Linear/Circular1/Circular2 (p51) en Interpolaciones.
- Nuevo componente `src/components/ZoomableImage.tsx`: lightbox a pantalla completa con pinch-zoom de 2 dedos, pan al arrastrar, doble tap para alternar 1x/2x, rueda del ratón en escritorio, botones +/−/1:1, cierre con backdrop, botón ×, tecla Escape y botón "atrás" del navegador. Aplicado a todas las figuras de `Fundamentos.tsx` (PdfFigure + figuras inline de touch-sensing/wire-check) y a `ProcedureDetail.tsx` (cover + imágenes de pasos).
- Optimizada `robot.jpg` (3,4 MB) → `robot.webp` (132 kB, -96 %) con `sharp` (devDep nueva) y nuevo script `tools/optimize-images.mjs` (resize a 1200 px + WebP q82). Borrado el duplicado `public/robot.jpg` que se servía sin uso. Precache PWA bajó de 17,4 MiB a 10,7 MiB.
- Añadidos `tools/find-pdf-pages.mjs` (localiza páginas por contenido) y `tools/dump-pdf-pages.mjs` (vuelca texto plano por página) para preparar selecciones futuras.
- `tools/render-pdf-pages.mjs` acepta filtro por id en argv (`node render-pdf-pages.mjs serie_e`) para no re-renderizar todo.

### 2026-06-08 (continuación)

- Nuevo procedimiento **"Programa de soldadura básico — un cordón entre dos puntos (AC / WS / WC / WE)"** (id `programa-basico`) en `src/data/procedures.ts`. 14 pasos cubriendo: planificar trayectoria (P0..P5), elegir interpolaciones, decidir estado de soldadura (directo vs por número), entender condiciones disponibles, crear/abrir programa, paso 1 (AC en P0), paso 2 (WS en P1 con ajuste de ángulo del soplete), paso 3 (WC en P2 con técnica de escape Z- en herramienta), paso 4 (WE en P3 con cráter), paso 5 (AC en P4), cierre con retorno a HOME, verificación en CHECK (sin arco, con arco), paso a AUTO. 6 notas con la regla AC/WS/WC/WE, estado igual en el cordón, tratamiento de cráter solo en WE, weaving solo en WC/WE, REC vs MOD, semántica de velocidades. Insertado antes del weaving porque es el procedimiento estructural sobre el que se apoyan los demás. Marcado ✅ en el inventario.
- Renderizadas 8 páginas nuevas del manual Arc Welding: 61 (§5.7.2 datos auxiliares vs estado), 62 (tabla tipos de condiciones), 66 (Figura 5.2 pantalla pg10), 67 (paso 1 P0/AC + Figura 5.3), 68 (paso 2 P1/WS con ángulo soplete 45°), 69 (paso 3 P2/WC con escape Z-), 70 (paso 4 P3/WE), 71 (paso 5 P4/AC + Figura 5.7).
- Inventario `arc_welding` ampliado a 30 páginas (22 → 30).
- Build OK (`npm run build`, 79 entries / 17,8 MiB precache).

### 2026-06-09

- Reestructurado **Fundamentos** para que contenga solo conceptos verdaderamente fundamentales (a petición del usuario: "en fundamentos solo tiene que estar lo fundamental"):
  - **Añadidas** tres secciones nuevas: **Modos del robot y arranque/parada** (TEACH/REPEAT/CHECK + override + encendido + apagado + métodos de parada, con figuras Serie E §3.1-§3.3), **Estado de soldadura (Weld condition N.º)** (Aux 0420, con figuras Arc Welding §5.7.2) y **Posiciones de soldadura** (AWS A3.0 1F-4F/1G-6G + ISO 6947 PA-PG, con `PositionsDiagram` — 6 tarjetas SVG con pictogramas).
  - **Eliminada** la sección **Weaving** de Fundamentos (no era conceptual; el material está en los procedimientos `weaving` y `weaving-especial`).
  - **Eliminada** la sección **JOB (EWM)** de Fundamentos y migrada a Procedimientos como `job-ewm` (ver siguiente bullet).
- Nuevo procedimiento **"Crear un programa dentro de un JOB (EWM)"** (id `job-ewm`) en `src/data/procedures.ts`. 10 pasos: qué es un JOB, qué es la curva sinérgica (relación I-U-WFS calibrada por EWM, mando único de WFS + U-corr), familias disponibles en el Titan XQ 350 Plus, seleccionar JOB en panel Expert XQ 2.0, estructura P0..P15 (P0 manual, P1..P15 recetas), crear P1, guardar, repetir para P2..P4 con ejemplo PB/PF, llamar el programa desde el TP (par JOB nº + Pnº por interfaz robot↔EWM), verificación en banco. 4 notas (qué NO cambia el programa, curva pertenece al JOB, P0 = MANUAL, capturas del panel pendientes). _Pendiente añadir capturas reales del panel Expert XQ 2.0._
- **Encendido y apagado movidos** de Procedimientos a Fundamentos (a petición del usuario: "encendido y apagado pasan a fundamentales"). Los pasos ahora viven dentro de la sección **Modos del robot y arranque/parada** como listas numeradas, con las figuras del Serie E (§3.1, §3.2) que ya estaban. Eliminados los procedimientos `encendido` y `apagado` de `src/data/procedures.ts` (parada-emergencia se queda como procedimiento al ser un caso de recuperación, no un modo).
- Componente `JobDiagram` (cabecera + rejilla 4×4 P0..P15) eliminado de `Fundamentos.tsx` al borrar la sección JOB. La explicación equivalente vive ahora en el procedimiento `job-ewm` en formato de pasos.
- Refs rotos `to: 'job-ewm'` (4 ocurrencias en `procedures.ts`) reapuntados a `to: 'estado-soldadura'` — encajan mejor con el contenido de cada paso y mantienen el chip de fundamento útil.
- Link interno `/fundamentos/job-ewm` en la sección `estado-soldadura` reapuntado a `/procedimientos/job-ewm`.
- Build OK (`npm run build`, 79 entries / 17,8 MiB precache).

### 2026-06-08

- Nuevo procedimiento **"Crear patrón especial de weaving (Aux 1404-11) — modificar tiempos y paradas en vértices"** (id `weaving-especial`) en `src/data/procedures.ts`. 14 pasos con foco en: diferencia con patrones estándar, comprobar opción instalada, sistema de coordenadas X/Y/Z + ángulo del soplete, diagrama de flujo de los 5 pasos, dibujar ciclo + origen + anchura, diagrama de expansión por direcciones, rellenar hoja punto a punto, aumento de corriente/tensión en paradas, carga en Aux 1404-11, aplicación a unión a tope vertical ascendente (3G), referencia simple para coger soltura (horizontal plana), verificación en CHECK y ajuste fino por probeta. 6 notas (requiere opción, máx. 15 puntos, cómo crear una parada con dos puntos consecutivos, ángulo importa tanto como tiempos, Aux 1413 para el boost, calificación normativa). Marcado ✅ en el inventario.
- Renderizadas 10 páginas nuevas del manual Arc Welding para soportar el procedimiento: 219 (PN=2 estándar), 220 (PN=3 estándar con paradas), 227 (sistema de coordenadas §10.4.1), 230 (diagrama de flujo §10.4.2), 233 (diagrama de expansión Caso 1 con paradas 26%/26%), 234 (Caso 2 — bisel V 22,5° con separación raíz 4 mm), 235 (hoja de cumplimentación punto a punto), 302 (Apéndice 3 — triangular con paradas horizontal plana), 306 (Apéndice 3 — triangular para ranura bisel único), 312 (Apéndice 3 — triangular con paradas + aumento corriente 20%).
- Actualizada nota en `weaving-3f-3g` para enlazar al nuevo procedimiento desde la sugerencia de "considerar patrón personalizado".
- `tools/dump-pdf-pages.mjs` ampliado para aceptar el id del PDF como tercer argumento (`serie_e` | `arc_welding` | `k_roset`), no solo Serie E.
- `tools/render-pdf-pages.mjs`: comentarios y array `pages` del job `arc_welding` ampliados con las 10 páginas nuevas (12 → 22 páginas).
- Build OK (`npm run build`, 71 entries / 15,3 MiB precache).

### 2026-06-07

- Nueva subsección **JOB (EWM)** en Fundamentos: concepto (metáfora del menú), tabla de qué fija el JOB vs qué fija el programa, ejemplo PB/PF con 4 programas (P1–P4) sobre el mismo JOB, lista de "lo que NO puedes hacer" y tabla de familias de JOBs disponibles en el Titan XQ 350 Plus (acero, inox, aluminio, CuSi/CuAl, tubular FCAW, JOBs de usuario). Añadido componente `JobDiagram` (Tailwind) con cabecera del JOB + rejilla 4×4 de programas P0..P15 (P0 manual, P1–P4 con recetas ejemplo, P5–P15 libres).
- Añadido **K-ROSET Instruction Manual_EN.pdf** (manual del simulador de Kawasaki) como 5ª fuente. Detectado el offset `PDF page = printed page + 6` (6 páginas de cubierta) y documentado en `tools/render-pdf-pages.mjs`. Renderizadas las páginas 163–165 (impresas 157–159) con la captura del Virtual Teach Pendant a color.
- Sección **Teach pendant** mejorada: imagen del VTP de K-ROSET (p.164) como visual principal — mucho más clara que los diagramas en gris del Serie E — con párrafos explicando las dos zonas (Operation Screen y Hard Key) antes de las figuras del Serie E.
- Nuevo procedimiento **"Weaving triangular para 3F y 3G ascendente (GMAW, acero, hilo Ø1,0)"** en `src/data/procedures.ts`: cover con la tabla de patrones estándar (Arc Welding §10.1.1), 8 pasos (nomenclatura AWS/ISO, material/junta, selección de patrón PN=2, parámetros 3F, parámetros 3G por pasada raíz/relleno/cap, configuración en el TP, ensayos de prueba, calificación WPS por EN ISO 15614-1) y 4 notas. Hilo G3Si1/ER70S-6 Ø1,0 + gas M21 (Ar+18%CO₂). Marcado como ✅ en el inventario.
- Pipeline PDF→PNG ampliado: `tools/extract-pdfs.mjs` ahora incluye K-ROSET (411 págs, 390 k chars); `tools/render-pdf-pages.mjs` con nuevo job `k_roset` (pages 163–165).
- Build estándar OK (`npm run build`, 61 entries / 12,97 MiB precache). Standalone HTML (`Robot Soldadura.html`) regenerado por el watch en segundo plano. Tracking en git de `K-ROSET Instruction Manual_EN.pdf` y `src/assets/pdf/k_roset/` (consistente con los otros PDFs ya versionados).
- Push a `main` (commit `9ee8881`) y `npm run deploy` → GitHub Pages publicado.

## Pendientes

- **Códigos de error**: el usuario decidió no poblarlos todavía. Cuando dé luz verde, extraer del manual Serie E (§2.10 y §2.11) y de EWM.
- **Configurar deploy a GitHub Pages**: crear repo en GitHub, conectar y publicar (script `npm run deploy` ya disponible con `gh-pages`). _No hacer push hasta que el usuario lo pida._
- **Recopilar de la web de EWM/Kawasaki** lo que falte.
- **Conectar Firebase** (cuenta `alejandrofuentes@iesremedios.es`) para los datos que la app necesite persistir/sincronizar. Nombre del proyecto Firebase: **"Robot de soldadura"** (mismo nombre que el repo). _No hacer nada todavía._ Cuando se aborde: (1) decidir primero qué datos van a Firebase (¿diario de incidencias para tenerlo en varios dispositivos?, ¿parámetros editables?, ¿códigos de error?) vs. qué se queda en IndexedDB local; (2) crear proyecto Firebase desde la consola web (firebase.google.com) con esa cuenta — no es un repo de GitHub, es un proyecto independiente en Google Cloud / Firebase; (3) habilitar Firestore y/o Auth según necesidad; (4) instalar SDK `firebase` y añadir config (claves vía variables de entorno `VITE_FIREBASE_*`, nunca commit directo).

## Cómo desarrollar / construir

- `npm install` — instalar dependencias (ya hecho).
- `npm run dev` — servidor de desarrollo en `http://localhost:5173`.
- `npm run build` — build de producción en `dist/`.
- `npm run preview` — sirve la build local para probar la PWA real.
- `npm run deploy` — build + publicar en rama `gh-pages` (requiere repo de GitHub configurado).
- Probar en el móvil: `npm run dev -- --host`, abrir `http://IP_DEL_PC:5173` desde el móvil en la misma red.

## Fuentes de información priorizadas

1. PDFs aportados por el usuario (manual del robot).
2. Web oficial de **EWM** (ewm-group.com) para todo lo relativo al Titan XQ 350 Plus.
3. Web oficial de **Kawasaki Robotics** para lo que falte del BA006L.
4. Búsqueda general solo como último recurso.

## PDFs aportados (mapeados)

Localización: raíz del proyecto. Texto extraído en `tools/extracted/*.txt` mediante `tools/extract-pdfs.mjs` (Node + pdf-parse).

1. **`90203-1104DSB_Operation Manual (E series)_Spanish.pdf`** (446 págs) — Manual de operaciones del **controlador Serie E**. Contiene: encendido/apagado, modos manual/automático, enseñanza, pantallas del TP, sección **2.10 Pantalla para error** y **2.11 Pantalla para advertencias** (fuente de códigos de error/aviso del robot).
2. **`90203-1036DSB_Arc Welding Operation Manual (E series)_Spanish.pdf`** (318 págs) — Manual de **soldadura por arco** para Serie E. Contiene: configuración de soplete, datos de estado de soldadura, base de datos de condiciones, detección de errores de soldadura (Aux 1411), linealización, JOB EWM, parámetros.
3. **`Touch_sensing.pdf`** (8 págs) — Procedimiento específico de touch sensing (LARRAIOZ).
4. **`wire_check.pdf`** (5 págs) — Procedimiento específico de wire check (LARRAIOZ).
5. **`K-ROSET Instruction Manual_EN.pdf`** (411 págs, EN) — Manual del simulador **K-ROSET** de Kawasaki. Contiene capturas a color del **Virtual Teach Pendant (VTP)** (sección 4.1.1.2, impresa p.157-159 ≈ PDF 163-165) que son la mejor imagen disponible del TP. Útil también para layout, programación offline y simulación. **Ojo offset:** PDF page = printed page + 6.

**Controlador identificado:** Kawasaki **Serie E** (los manuales son de esta serie). El robot es BA006L con controlador Serie E.

## Alojamiento

- **GitHub Pages**, repo público. URL https accesible desde el móvil para instalar como PWA.
