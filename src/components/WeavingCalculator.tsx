import { useMemo, useState } from 'react';
import { buildWeavingSheet } from '../lib/weavingSheet';

type Props = {
  /** Valores iniciales (p. ej. los recomendados por la capa de una ficha). */
  defaults?: {
    frecuenciaHz?: number;
    paradaIzqS?: number;
    paradaDchaS?: number;
    paradaCentroS?: number;
    boostCorrientePct?: number;
  };
};

/**
 * Calculadora de patrón de weaving personalizado: convierte la intención
 * ("quiero que pare 0,3 s a la izquierda y 0,2 s a la derecha a 1 Hz") en
 * la hoja de puntos en % de ciclo lista para teclear en Aux 1404-11.
 */
export default function WeavingCalculator({ defaults }: Props) {
  const [frecuenciaHz, setFrecuenciaHz] = useState(defaults?.frecuenciaHz ?? 1);
  const [paradaIzqS, setParadaIzqS] = useState(defaults?.paradaIzqS ?? 0.2);
  const [paradaDchaS, setParadaDchaS] = useState(defaults?.paradaDchaS ?? 0.2);
  const [paradaCentroS, setParadaCentroS] = useState(defaults?.paradaCentroS ?? 0);
  const [boostCorrientePct, setBoostCorrientePct] = useState(defaults?.boostCorrientePct ?? 0);

  const result = useMemo(
    () =>
      buildWeavingSheet({
        frecuenciaHz,
        paradaIzqS,
        paradaDchaS,
        paradaCentroS,
        boostCorrientePct,
      }),
    [frecuenciaHz, paradaIzqS, paradaDchaS, paradaCentroS, boostCorrientePct],
  );

  const cicloS = frecuenciaHz > 0 ? 1 / frecuenciaHz : 0;

  return (
    <section className="card border-teal-500/40 space-y-3">
      <h3 className="font-semibold text-teal-300 text-sm uppercase tracking-wide">
        Calculadora de weaving personalizado (Aux 1404-11)
      </h3>
      <p className="text-xs text-slate-300 leading-snug">
        Patrón triangular con paradas. Introduce la frecuencia y cuánto quieres que el soplete se
        detenga en cada lado (en segundos); te devuelve la hoja de puntos en % de ciclo para
        teclearla en un PN libre (6..10). Convención: <strong>izquierda = Y +100 %</strong> mirando
        en el sentido de avance del cordón.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <NumField
          label="Frecuencia (Hz)"
          value={frecuenciaHz}
          step={0.1}
          min={0.1}
          onChange={setFrecuenciaHz}
          hint={cicloS > 0 ? `ciclo = ${cicloS.toFixed(2)} s` : undefined}
        />
        <NumField
          label="Boost corriente en paradas (%)"
          value={boostCorrientePct}
          step={5}
          min={0}
          onChange={setBoostCorrientePct}
          hint="0 = sin aumento"
        />
        <NumField
          label="Parada izquierda (s)"
          value={paradaIzqS}
          step={0.05}
          min={0}
          onChange={setParadaIzqS}
        />
        <NumField
          label="Parada derecha (s)"
          value={paradaDchaS}
          step={0.05}
          min={0}
          onChange={setParadaDchaS}
        />
        <NumField
          label="Parada central (s)"
          value={paradaCentroS}
          step={0.05}
          min={0}
          onChange={setParadaCentroS}
          hint="opcional"
        />
      </div>

      {result.error && (
        <p className="text-sm text-rose-300 border border-rose-500/40 rounded-xl px-3 py-2">
          {result.error}
        </p>
      )}
      {result.warnings.map((w, i) => (
        <p key={i} className="text-xs text-amber-300 border border-amber-500/40 rounded-xl px-3 py-2">
          {w}
        </p>
      ))}

      {!result.error && result.points.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-wide">
                <th className="py-1 pr-2 text-left">Punto</th>
                <th className="py-1 px-2">Tiempo (%)</th>
                <th className="py-1 px-2">Y lateral (%)</th>
                <th className="py-1 pl-2">+Corriente (%)</th>
              </tr>
            </thead>
            <tbody>
              {result.points.map((p, i) => (
                <tr key={i} className="border-t border-slate-700/60">
                  <td className="py-1.5 pr-2 text-left font-medium">{i + 1}</td>
                  <td className="py-1.5 px-2">{p.tiempoPct}</td>
                  <td className="py-1.5 px-2">
                    {p.yPct === 100 ? '+100 (izq.)' : p.yPct === -100 ? '−100 (dcha.)' : '0 (centro)'}
                  </td>
                  <td className="py-1.5 pl-2">{p.boostCorrientePct ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-slate-400 leading-snug">
        En el TP: &lt;AUX&gt; → 1404 → 11 «Special Pattern Weaving» → PN libre → introducir estos
        puntos (X y Z a 0 en este patrón). El boost de corriente requiere configurar antes Aux 1413.
        La anchura (mm) y la frecuencia reales se siguen poniendo en los datos auxiliares del WC/WE.
      </p>
    </section>
  );
}

function NumField({
  label,
  value,
  onChange,
  step,
  min,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step: number;
  min: number;
  hint?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-slate-400">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        value={Number.isFinite(value) ? value : ''}
        step={step}
        min={min}
        onChange={(e) => onChange(e.target.value === '' ? NaN : Number(e.target.value))}
        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-base outline-none focus:border-accent"
      />
      {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
    </label>
  );
}
