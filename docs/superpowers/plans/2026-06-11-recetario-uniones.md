# Recetario de uniones — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pantalla "Uniones" con fichas por junta+posición (robot + EWM capa a capa), ficha piloto a tope V60° PF/3G ascendente y calculadora de weaving personalizado (Aux 1404-11).

**Architecture:** Datos estáticos en `src/data/joints.ts` (mismo patrón que `procedures.ts`), lógica pura de la calculadora en `src/lib/weavingSheet.ts` (testeada con vitest), UI en dos rutas nuevas (`/uniones`, `/uniones/:id`) que reutilizan los componentes existentes (chips `StepRef`, `ZoomableImage`, estilo card).

**Tech Stack:** React 18 + TS + Tailwind (existente), vitest (nuevo, solo devDep).

**Spec:** `docs/superpowers/specs/2026-06-11-recetario-uniones-design.md`

---

### Task 1: Lógica pura de la hoja de weaving (`weavingSheet`) con TDD

**Files:**
- Modify: `package.json` (devDep `vitest`, script `test`)
- Create: `src/lib/weavingSheet.ts`
- Test: `src/lib/weavingSheet.test.ts`

- [ ] **Step 1:** `npm i -D vitest` y añadir `"test": "vitest run"` a scripts.
- [ ] **Step 2:** Escribir tests que fallan (`src/lib/weavingSheet.test.ts`):

```ts
import { describe, expect, it } from 'vitest';
import { buildWeavingSheet } from './weavingSheet';

describe('buildWeavingSheet — triangular con paradas', () => {
  it('caso simétrico 1 Hz, 0,2 s por lado → paradas del 20 % y tiempos 0/15/35/65/85/100', () => {
    const r = buildWeavingSheet({ frecuenciaHz: 1, paradaIzqS: 0.2, paradaDchaS: 0.2 });
    expect(r.error).toBeUndefined();
    expect(r.points.map((p) => p.tiempoPct)).toEqual([0, 15, 35, 65, 85, 100]);
    expect(r.points.map((p) => p.yPct)).toEqual([0, 100, 100, -100, -100, 0]);
  });

  it('asimétrico +0,1 s a la izquierda (1 Hz): parada izquierda 30 %, derecha 20 %', () => {
    const r = buildWeavingSheet({ frecuenciaHz: 1, paradaIzqS: 0.3, paradaDchaS: 0.2 });
    const t = r.points.map((p) => p.tiempoPct);
    expect(t[2] - t[1]).toBe(30); // parada izquierda
    expect(t[4] - t[3]).toBe(20); // parada derecha
    expect(t[0]).toBe(0);
    expect(t[5]).toBe(100);
  });

  it('a 0,8 Hz un ciclo dura 1,25 s → 0,1 s = 8 % de parada', () => {
    const r = buildWeavingSheet({ frecuenciaHz: 0.8, paradaIzqS: 0.1, paradaDchaS: 0 });
    const t = r.points.map((p) => p.tiempoPct);
    expect(t[2] - t[1]).toBe(8);
  });

  it('paradas que no caben en el ciclo → error', () => {
    const r = buildWeavingSheet({ frecuenciaHz: 1, paradaIzqS: 0.6, paradaDchaS: 0.6 });
    expect(r.error).toBeDefined();
  });

  it('boost de corriente solo en los puntos de parada', () => {
    const r = buildWeavingSheet({
      frecuenciaHz: 1, paradaIzqS: 0.2, paradaDchaS: 0.2, boostCorrientePct: 20,
    });
    expect(r.points.map((p) => p.boostCorrientePct ?? 0)).toEqual([0, 20, 20, 20, 20, 0]);
  });

  it('parada central opcional inserta dos puntos a Y=0 entre izquierda y derecha', () => {
    const r = buildWeavingSheet({
      frecuenciaHz: 1, paradaIzqS: 0.2, paradaDchaS: 0.2, paradaCentroS: 0.1,
    });
    expect(r.points).toHaveLength(8);
    const centro = r.points.slice(3, 5);
    expect(centro.map((p) => p.yPct)).toEqual([0, 0]);
    expect(centro[1].tiempoPct - centro[0].tiempoPct).toBe(10);
  });

  it('aviso (no error) si las paradas superan el 60 % del ciclo', () => {
    const r = buildWeavingSheet({ frecuenciaHz: 1, paradaIzqS: 0.35, paradaDchaS: 0.35 });
    expect(r.error).toBeUndefined();
    expect(r.warnings.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 3:** `npx vitest run` → FAIL (módulo no existe).
- [ ] **Step 4:** Implementar `src/lib/weavingSheet.ts`:

```ts
// Genera la hoja de puntos de un patrón triangular con paradas para
// Aux 1404-11 (Special Pattern Weaving). Convención: Y +100 % = extremo
// izquierdo del weaving visto en el sentido de avance; -100 % = derecho.
// El ciclo empieza y termina en el centro con amplitud 0 (requisito del
// controlador para que el patrón cierre y se repita).

export type SheetPoint = {
  tiempoPct: number;
  yPct: number;
  boostCorrientePct?: number;
};

export type SheetOptions = {
  frecuenciaHz: number;
  paradaIzqS: number;
  paradaDchaS: number;
  paradaCentroS?: number;
  boostCorrientePct?: number;
};

export type SheetResult = {
  points: SheetPoint[];
  warnings: string[];
  error?: string;
};

export function buildWeavingSheet(opts: SheetOptions): SheetResult {
  const { frecuenciaHz, paradaIzqS, paradaDchaS, paradaCentroS = 0, boostCorrientePct } = opts;
  const warnings: string[] = [];
  if (frecuenciaHz <= 0) return { points: [], warnings, error: 'La frecuencia debe ser > 0.' };
  const cicloS = 1 / frecuenciaHz;
  const toPct = (s: number) => (s / cicloS) * 100;
  const dIzq = toPct(paradaIzqS);
  const dDcha = toPct(paradaDchaS);
  const dCentro = toPct(paradaCentroS);
  const dwellTotal = dIzq + dDcha + dCentro;
  if (dwellTotal >= 100) {
    return {
      points: [], warnings,
      error: `Las paradas suman ${Math.round(dwellTotal)} % del ciclo: no queda tiempo para moverse. Baja la frecuencia o acorta las paradas.`,
    };
  }
  if (dwellTotal > 60) {
    warnings.push(
      `Las paradas ocupan el ${Math.round(dwellTotal)} % del ciclo: el desplazamiento será muy brusco. Considera bajar la frecuencia.`,
    );
  }
  // Tiempo de viaje repartido por distancia: centro→izq (1), izq→dcha (2), dcha→centro (1).
  const travel = 100 - dwellTotal;
  const t1 = travel / 4;       // centro → izquierda
  const tCruce = travel / 2;   // izquierda → derecha (se parte en dos si hay parada central)
  const boost = boostCorrientePct && boostCorrientePct > 0 ? boostCorrientePct : undefined;

  const pts: SheetPoint[] = [];
  let t = 0;
  pts.push({ tiempoPct: 0, yPct: 0 });
  t += t1;
  pts.push({ tiempoPct: t, yPct: 100, boostCorrientePct: boost });
  t += dIzq;
  pts.push({ tiempoPct: t, yPct: 100, boostCorrientePct: boost });
  if (dCentro > 0) {
    t += tCruce / 2;
    pts.push({ tiempoPct: t, yPct: 0 });
    t += dCentro;
    pts.push({ tiempoPct: t, yPct: 0 });
    t += tCruce / 2;
  } else {
    t += tCruce;
  }
  pts.push({ tiempoPct: t, yPct: -100, boostCorrientePct: boost });
  t += dDcha;
  pts.push({ tiempoPct: t, yPct: -100, boostCorrientePct: boost });
  pts.push({ tiempoPct: 100, yPct: 0 });

  // Redondeo a enteros (como las hojas del manual) preservando el orden.
  const rounded = pts.map((p) => ({ ...p, tiempoPct: Math.round(p.tiempoPct) }));
  for (let i = 1; i < rounded.length; i++) {
    if (rounded[i].tiempoPct <= rounded[i - 1].tiempoPct) {
      rounded[i].tiempoPct = rounded[i - 1].tiempoPct + 1;
    }
  }
  rounded[rounded.length - 1].tiempoPct = 100;
  if (rounded.length > 15) {
    return { points: [], warnings, error: 'El patrón supera los 15 puntos que admite el controlador.' };
  }
  return { points: rounded, warnings };
}
```

- [ ] **Step 5:** `npx vitest run` → PASS (7 tests).
- [ ] **Step 6:** Commit: `feat: lógica de hoja de weaving personalizado con tests`.

### Task 2: Componente `WeavingCalculator`

**Files:**
- Create: `src/components/WeavingCalculator.tsx`

- [ ] **Step 1:** Componente con 4 entradas numéricas (frecuencia Hz, parada izq s, parada dcha s, parada centro s, boost %) y tabla de salida (Punto / Tiempo % / Y % / +I %). Mensajes de `error` en rojo y `warnings` en ámbar. Texto fijo de convención ("izquierda = +Y mirando en el sentido de avance") y nota de uso ("teclear estos puntos en Aux 1404-11, PN libre 6..10"). Estilo: cards y clases existentes.
- [ ] **Step 2:** `npm run build` → verde.
- [ ] **Step 3:** Commit.

### Task 3: Datos de uniones + croquis SVG

**Files:**
- Create: `src/data/joints.ts` (tipos del spec + ficha piloto `tope-v60-pf` con 4 capas, valores de la tabla del spec, tabla de ajustes por capa, imágenes `arc_welding` 219/233/235/306/312 donde aplique, refs a `programa-basico`/`weaving-especial`/`job-ewm`/`estado-soldadura`)
- Create: `src/components/JointDiagram.tsx` (SVG: V 60° acotada — talón 1-2, gap 4, espesor 10 — con las capas coloreadas y leyenda raíz/hot pass/relleno/peinado)

- [ ] **Step 1:** Tipos exactamente como en el spec (reutilizando `StepRef` de `procedures.ts`).
- [ ] **Step 2:** Ficha piloto completa (contenido por capa según tabla del spec, sin placeholders, con notas de "valores orientativos hasta calibrar").
- [ ] **Step 3:** `JointDiagram` con viewBox horizontal, dos chapas con bisel 30° cada una, cotas y 4 zonas de relleno coloreadas (raíz ámbar, hot pass naranja, relleno cielo, peinado esmeralda) + leyenda.
- [ ] **Step 4:** `npm run build` → verde. Commit.

### Task 4: Rutas y menú

**Files:**
- Create: `src/routes/Joints.tsx` (lista con filtro chapa/tubo y por posición)
- Create: `src/routes/JointDetail.tsx` (cabecera + JointDiagram + tarjeta por capa con bloques 🤖/⚡, desplegable "Si algo falla", calculadora si la capa la pide, chips refs)
- Modify: `src/App.tsx` (rutas `/uniones` y `/uniones/:id`)
- Modify: `src/routes/Menu.tsx` (botón "Uniones" acento teal, tras Procedimientos)

- [ ] **Step 1:** Lista + detalle (detalle reutiliza el patrón de chips de `ProcedureDetail`, `<details>` nativo para los ajustes).
- [ ] **Step 2:** Rutas + botón de menú.
- [ ] **Step 3:** `npm run build` → verde. Commit.

### Task 5: Calculadora en `weaving-especial`

**Files:**
- Modify: `src/data/procedures.ts` (campo opcional `widgets?: ('weaving-calculator')[]` en `Procedure`; añadirlo a `weaving-especial`)
- Modify: `src/routes/ProcedureDetail.tsx` (renderizar `WeavingCalculator` tras los pasos si `widgets` lo incluye)

- [ ] **Step 1:** Campo + render. `npm run build` → verde. Commit.

### Task 6: Cierre

**Files:**
- Modify: `CLAUDE.md` (sesión 2026-06-11, inventario, estructura)

- [ ] **Step 1:** `npx vitest run` + `npm run build` + `npm run build:standalone` → todo verde.
- [ ] **Step 2:** Actualizar CLAUDE.md (registro de sesión + nueva pantalla en alcance + convención P1..P4).
- [ ] **Step 3:** Commit + push (autorizado por el usuario en esta sesión).

## Self-review

- Cobertura del spec: pantalla nueva ✓ (T4), ficha piloto ✓ (T3), calculadora ✓ (T1-T2), integración weaving-especial ✓ (T5), convención P1..P4 ✓ (contenido T3), croquis ✓ (T3), verificación ✓ (T6).
- Sin placeholders en lógica/tests; los componentes UI se describen con contrato concreto y reutilizan patrones existentes del repo.
- Tipos coherentes: `SheetPoint/SheetOptions/SheetResult` (T1) son los que consume `WeavingCalculator` (T2); `joints.ts` usa `StepRef` existente.
