import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PROCEDURES } from '../data/procedures';
import { categoryChipClass, categoryFilterClass } from '../lib/categoryColors';

const CATEGORIES = ['Todos', 'Robot', 'Soldadura', 'Mantenimiento'] as const;

export default function Procedures() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('Todos');

  const list = useMemo(() => {
    const norm = q.trim().toLowerCase();
    return PROCEDURES.filter((p) => {
      if (cat !== 'Todos' && p.category !== cat) return false;
      if (!norm) return true;
      return (
        p.title.toLowerCase().includes(norm) ||
        p.summary.toLowerCase().includes(norm) ||
        p.steps.some((s) => (typeof s === 'string' ? s : s.text).toLowerCase().includes(norm))
      );
    });
  }, [q, cat]);

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Procedimientos</h1>
        <p className="text-sm text-slate-300">Guías paso a paso para operación y mantenimiento.</p>
      </header>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        inputMode="search"
        placeholder="Buscar procedimiento"
        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-base outline-none focus:border-accent"
      />

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`chip whitespace-nowrap ${categoryFilterClass(c, cat === c)}`}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {list.map((p) => (
          <li key={p.id}>
            <Link to={`/procedimientos/${p.id}`} className="card block active:scale-[0.99]">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold">{p.title}</h2>
                <span className={`chip ${categoryChipClass(p.category)}`}>{p.category}</span>
              </div>
              <p className="text-sm text-slate-300 mt-1">{p.summary}</p>
            </Link>
          </li>
        ))}
        {list.length === 0 && (
          <li className="card text-sm text-slate-300">Sin resultados.</li>
        )}
      </ul>
    </div>
  );
}
