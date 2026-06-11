# Recetario de uniones — diseño

**Fecha:** 2026-06-11 · **Estado:** pendiente de revisión del usuario

## Objetivo

Nueva sección de la app que responde a la pregunta real de taller: *"para esta junta, en esta posición, ¿qué pongo en el robot y qué pongo en el EWM, capa por capa, y qué toco si algo sale mal?"*. Material fijo: acero al carbono (S235JR — 1.0038, UNE-EN 10025-2 — o similar), espesor de referencia ~10 mm, hilo G3Si1 (UNE-EN ISO 14341-A) / ER70S-6 (AWS A5.18) Ø1,0 mm, gas M21 (Ar + 18 % CO₂).

## Alcance v1

1. **Pantalla nueva "Uniones"** accesible desde el menú principal (botón con color propio, regla de grupos de botones).
2. **Ficha piloto**: a tope, preparación en V 60°, talón 1-2 mm, separación de raíz (gap) 4 mm, chapa 10 mm, posición **PF (UNE-EN ISO 6947) / 3G ascendente (AWS/ASME IX)**. Capas: raíz → refuerzo de raíz (hot pass) → relleno → peinado.
3. **Calculadora de weaving personalizado** (componente interactivo) embebida en la ficha y en el procedimiento `weaving-especial`.

Fichas futuras (fuera de v1, la estructura debe soportarlas): a tope V60 en PA/1G y PC/2G; filete en PB/2F y PF/3F ascendente; tubo a tope en PH/5G ascendente (con sectores de programa) y PC/2G eje vertical.

## Modelo de datos — `src/data/joints.ts`

```ts
type WeavingSpec =
  | { tipo: 'ninguno' }
  | { tipo: 'estandar'; pn: 1 | 2 | 3 | 4 | 5; anchuraMm: string; frecuenciaHz: string }
  | {
      tipo: 'personalizado';
      pnSugerido: 6 | 7 | 8 | 9 | 10;
      descripcion: string;            // qué forma y por qué
      hoja: WeavingPoint[];           // hoja Aux 1404-11 ya rellena
      calculadora?: boolean;          // mostrar WeavingCalculator precargada
    };

type WeavingPoint = {
  tiempoPct: number;                  // % acumulado del ciclo
  xPct: number; yPct: number; zPct: number;
  anguloDeg?: number;
  boostCorrientePct?: number; boostTensionPct?: number;
};

type LayerConfig = {
  id: string;                         // 'raiz' | 'hot-pass' | 'relleno' | 'peinado'
  nombre: string;
  proposito: string;                  // 1-2 frases: qué hace esta capa
  robot: {
    instrucciones: string;            // p. ej. "WS → WC(n) → WE, LINEAR"
    velocidadAvance: string;          // cm/min
    weaving: WeavingSpec;
    notas?: string[];
  };
  ewm: {
    programa: 'P1' | 'P2' | 'P3' | 'P4';
    modo: string;                     // short-arc / pulsado…
    wfs: string;                      // m/min
    uCorr: string;                    // ±V
    dinamica?: string;
    notas?: string[];
  };
  ajustes: { sintoma: string; donde: 'robot' | 'ewm'; accion: string }[];
  image?: string; caption?: string;   // figura del manual o croquis
  refs?: StepRef[];                   // chips a fundamentos/procedimientos (tipo ya existente)
};

type Joint = {
  id: string;
  titulo: string;
  posicion: { iso: string; aws: string; descripcion: string };
  soporte: 'chapa' | 'tubo';
  preparacion: string;                // "V 60°, talón 1-2 mm, gap 4 mm"
  materialBase: string; consumible: string; gas: string;
  capas: LayerConfig[];
  croquis?: { tipo: 'svg-junta' };    // diagrama propio acotado
  notas?: string[];
  source?: string;
};
```

**Convención fija en todas las fichas**: dentro del JOB de acero del EWM, **P1 = raíz, P2 = hot pass, P3 = relleno, P4 = peinado**. El robot llama JOB nº + Pn desde el estado de soldadura del WS de cada capa.

## UI

- **Rutas**: `/uniones` (lista de fichas con filtro por posición y chapa/tubo) y `/uniones/:id` (detalle).
- **Menú**: nuevo botón "Uniones" con acento de color propio (p. ej. teal) — descripción "Recetas completas por junta y posición: robot + EWM capa a capa".
- **Detalle de ficha**: cabecera (croquis SVG de la junta acotado + posición dual ISO/AWS + consumible/gas) y una **tarjeta por capa**. Cada tarjeta: bloque 🤖 Robot y bloque ⚡ EWM en columnas gemelas (apiladas en móvil), bloque desplegable "Si algo falla" (tabla síntoma → dónde → acción) y chips `refs` reutilizando el componente de `ProcedureDetail`.
- **Croquis**: componente `JointDiagram` (SVG Tailwind, estilo de `PositionsDiagram`) con la V acotada: 60°, talón, gap 4, espesor 10, y las capas coloreadas (raíz/hot pass/relleno/peinado) — la imagen obligatoria de la regla "contenidos siempre con imágenes". Las figuras del manual Arc Welding ya renderizadas (234, 235, 302, 306, 312) ilustran las hojas de weaving.

## Calculadora de weaving — `src/components/WeavingCalculator.tsx`

Convierte la intención del soldador en la hoja de puntos de Aux 1404-11:

- **Entradas**: frecuencia (Hz), parada izquierda (s), parada derecha (s), parada central (s, opcional), forma (triangular / zigzag), boost de corriente en paradas (%).
- **Salida**: tabla punto a punto (Tiempo % / X / Y / Z / boost) lista para teclear en el TP, con validaciones: los % suman 100, primer y último punto a amplitud 0, aviso si una parada pide más % del que cabe en el ciclo.
- **Lógica clave** (el ejemplo del usuario): a 1 Hz el ciclo dura 1 s → 0,1 s extra de parada izquierda = +10 puntos porcentuales en la diferencia de tiempos del vértice izquierdo, recortados proporcionalmente de los tramos de desplazamiento.
- Sin persistencia en v1 (es una ayuda de cálculo; los valores definitivos viven en la ficha o en el TP).

## Contenido de la ficha piloto (valores de partida, a calibrar con probeta)

| Capa | EWM (JOB acero) | Robot |
|---|---|---|
| **Raíz (P1)** | short-arc, WFS 3,5-4,5 m/min, U-corr −1..0 V | avance 8-10 cm/min, sin weaving o péndulo leve (PN=1, WV 2-3 mm) para puentear el gap de 4 mm |
| **Hot pass (P2)** | pulsado, WFS 5,5-6,5, U-corr 0 | avance 10-12 cm/min, triangular suave PN=2, WV 4-5 mm, 1,2 Hz |
| **Relleno (P3)** | pulsado, WFS 6,0-7,0, U-corr −1 V | avance 6-9 cm/min, **patrón personalizado PN=6**: triangular, paradas 20-25 % por flanco, +15-20 % corriente en paradas |
| **Peinado (P4)** | pulsado, WFS 6,5-7,5, U-corr 0 | avance 5-7 cm/min, **patrón personalizado PN=7**: ancho = chaflán + 2 mm, paradas asimétricas ajustables (ejemplo guiado: +0,1 s a la izquierda con la calculadora) |

Cada capa lleva su tabla de ajustes (descuelgue, falta de fusión en flanco, mordedura, exceso de sobre-espesor…). La ficha marca explícitamente que los valores EWM son orientativos hasta calibrar en banco (no hay PDF de EWM; fuente: práctica GMAW + manual Arc Welding para el lado robot).

## Qué NO cambia

- Los procedimientos existentes (`programa-basico`, `weaving-especial`, `job-ewm`, `weaving-3f-3g`) quedan como están; la ficha enlaza a ellos para el "cómo se teclea". Única adición permitida: chip inverso desde `weaving-especial` hacia la calculadora.
- Parámetros, Errores, Diario y Fundamentos no se tocan.

## Verificación

- `npm run build` y `npm run build:standalone` verdes.
- Todos los `refs` y `pdfImage` de la ficha resuelven (sin chips rotos — lección del bug corregido hoy).
- Calculadora: casos de prueba manuales — triangular 1 Hz simétrico 20/20 %, asimétrico +0,1 s izquierda, frecuencia 0,8 Hz (0,1 s = 8 puntos porcentuales).
- Revisión en móvil del layout de tarjetas por capa.
