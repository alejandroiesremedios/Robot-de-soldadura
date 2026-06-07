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

- ✅ Encendido del robot (Serie E §3.1)
- ✅ Apagado del robot (Serie E §3.2)
- ✅ Parada de emergencia y recuperación (Serie E §3.3)
- ✅ Wire check (wire_check.pdf)
- ✅ Touch sensing (Touch_sensing.pdf)

### Robot — uso avanzado del teach pendant

- 🔵 Crear weaving / oscilación sobre un cordón (Arc Welding §5.5.12, §6.2, §10)
- ✅ Weaving triangular para 3F y 3G ascendente (GMAW, acero, hilo Ø1,0) — PN=2, parámetros orientativos
- ⬜ Programa de soldadura básico — AS / WS / WC / WE entre puntos (Arc Welding §4–§5)
- ⬜ Dar de alta una entrada en la base de datos de condiciones de soldadura (Aux 0420) (Arc Welding)
- ⬜ Crear / editar patrón especial de weaving (Aux 1404-11, opción) — **redactar con detalle extra** (Arc Welding §10.3–§10.4)
- ⬜ Copiar / mover / borrar pasos de un programa (Serie E §6 edición de programa)
- ⬜ REC vs MOD: modificar un punto ya grabado sin perder sus instrucciones (Serie E §5)
- ⬜ Modos de ejecución TEACH / CHECK / AUTO y override de velocidad (Serie E §3–§4)

### Soldadura EWM (Titan XQ 350 Plus)

Fuente: web oficial ewm-group.com (no hay PDF aportado todavía).

- ✅ Crear un programa dentro de un JOB — explicado como **subsección de Fundamentos "JOB (EWM)"** (concepto + tabla de familias de JOBs disponibles + ejemplo PB/PF con 4 programas en mismo JOB). _Pendiente añadir capturas reales del panel Expert XQ 2.0 cuando se hagan en el taller._
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
