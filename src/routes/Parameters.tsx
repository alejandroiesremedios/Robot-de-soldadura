import { useMemo, useState } from 'react';
import { PARAMETERS } from '../data/parameters';

const MATERIALS = ['Todos', 'Acero al carbono', 'Acero inox', 'Aluminio'] as const;
type Material = (typeof MATERIALS)[number];

const MATERIAL_IDLE: Record<Material, string> = {
  Todos: 'bg-slate-700/70 text-slate-100 border border-slate-500/40',
  'Acero al carbono': 'bg-orange-500/15 text-orange-100 border border-orange-400/40',
  'Acero inox': 'bg-cyan-500/15 text-cyan-100 border border-cyan-400/40',
  Aluminio: 'bg-fuchsia-500/15 text-fuchsia-100 border border-fuchsia-400/40',
};
const MATERIAL_ACTIVE: Record<Material, string> = {
  Todos: 'bg-slate-200 text-ink border border-slate-200',
  'Acero al carbono': 'bg-orange-400 text-ink border border-orange-300',
  'Acero inox': 'bg-cyan-400 text-ink border border-cyan-300',
  Aluminio: 'bg-fuchsia-400 text-ink border border-fuchsia-300',
};

export default function Parameters() {
  const [material, setMaterial] = useState<(typeof MATERIALS)[number]>('Todos');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const norm = q.trim().toLowerCase();
    return PARAMETERS.filter((p) => {
      if (material !== 'Todos' && p.material !== material) return false;
      if (!norm) return true;
      return (
        p.material.toLowerCase().includes(norm) ||
        p.position.toLowerCase().includes(norm) ||
        p.thicknessMm.toLowerCase().includes(norm) ||
        p.process.toLowerCase().includes(norm)
      );
    });
  }, [q, material]);

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Parámetros de soldadura</h1>
        <p className="text-sm text-slate-300">
          Valores orientativos. Ajustar según ensayos en la célula.
        </p>
      </header>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        inputMode="search"
        placeholder="Buscar (posición, espesor, proceso…)"
        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-base outline-none focus:border-accent"
      />

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {MATERIALS.map((m) => (
          <button
            key={m}
            onClick={() => setMaterial(m)}
            className={`chip whitespace-nowrap ${material === m ? MATERIAL_ACTIVE[m] : MATERIAL_IDLE[m]}`}
          >
            {m}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {list.map((p) => (
          <li key={p.id} className="card space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">{p.material}</span>
              <span className="chip">{p.process}</span>
              <span className="chip">Ø{p.wireDiameter} mm</span>
              <span className="chip">{p.position}</span>
              <span className="chip">{p.thicknessMm} mm</span>
            </div>
            <Row label="Gas" value={p.shieldingGas} />
            <Row label="Intensidad" value={`${p.currentA} A`} />
            <Row label="Tensión" value={`${p.voltageV} V`} />
            <Row label="Velocidad hilo" value={`${p.wireFeedMmin} m/min`} />
            <Row label="Velocidad de avance" value={`${p.travelSpeedCmMin} cm/min`} />
            {p.ewmJob && p.ewmJob !== '—' && <Row label="JOB EWM" value={p.ewmJob} />}
            {p.notes && <p className="text-xs text-slate-300 italic">{p.notes}</p>}
          </li>
        ))}
        {list.length === 0 && (
          <li className="card text-sm text-slate-300">Sin resultados.</li>
        )}
      </ul>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
