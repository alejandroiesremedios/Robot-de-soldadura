// Genera la hoja de puntos de un patrón triangular con paradas para
// Aux 1404-11 (Special Pattern Weaving). Convención: Y +100 % = extremo
// izquierdo del weaving visto en el sentido de avance; -100 % = derecho.
// El ciclo empieza y termina en el centro con amplitud 0 (requisito del
// controlador para que el patrón cierre y se repita limpio).

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
  if (![frecuenciaHz, paradaIzqS, paradaDchaS, paradaCentroS].every(Number.isFinite)) {
    return { points: [], warnings, error: 'Rellena todos los campos con números.' };
  }
  if (frecuenciaHz <= 0) return { points: [], warnings, error: 'La frecuencia debe ser mayor que 0.' };
  if (paradaIzqS < 0 || paradaDchaS < 0 || paradaCentroS < 0) {
    return { points: [], warnings, error: 'Las paradas no pueden ser negativas.' };
  }
  const cicloS = 1 / frecuenciaHz;
  const toPct = (s: number) => (s / cicloS) * 100;
  const dIzq = toPct(paradaIzqS);
  const dDcha = toPct(paradaDchaS);
  const dCentro = toPct(paradaCentroS);
  const dwellTotal = dIzq + dDcha + dCentro;
  if (dwellTotal >= 100) {
    return {
      points: [],
      warnings,
      error: `Las paradas suman el ${Math.round(dwellTotal)} % del ciclo: no queda tiempo para moverse. Baja la frecuencia o acorta las paradas.`,
    };
  }
  if (dwellTotal > 60) {
    warnings.push(
      `Las paradas ocupan el ${Math.round(dwellTotal)} % del ciclo: el desplazamiento entre extremos será muy brusco. Considera bajar la frecuencia.`,
    );
  }

  // Tiempo de viaje repartido por distancia recorrida:
  // centro→izquierda (1), izquierda→derecha (2), derecha→centro (1).
  const travel = 100 - dwellTotal;
  const t1 = travel / 4;
  const tCruce = travel / 2;
  const boost = boostCorrientePct && boostCorrientePct > 0 ? boostCorrientePct : undefined;

  const pts: SheetPoint[] = [];
  let t = 0;
  pts.push({ tiempoPct: 0, yPct: 0 });
  t += t1;
  pts.push({ tiempoPct: t, yPct: 100, boostCorrientePct: boost });
  if (dIzq > 0) {
    t += dIzq;
    pts.push({ tiempoPct: t, yPct: 100, boostCorrientePct: boost });
  }
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
  if (dDcha > 0) {
    t += dDcha;
    pts.push({ tiempoPct: t, yPct: -100, boostCorrientePct: boost });
  }
  pts.push({ tiempoPct: 100, yPct: 0 });

  // Redondeo a enteros (como las hojas del manual) preservando el orden creciente.
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
