import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listEntries, type JournalEntry } from '../db/journal';

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[] | null>(null);

  useEffect(() => {
    listEntries().then(setEntries);
  }, []);

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Diario de incidencias</h1>
          <p className="text-sm text-slate-300">Tus notas y soluciones del taller.</p>
        </div>
        <Link to="/diario/nuevo" className="btn-primary">
          + Nueva
        </Link>
      </header>

      {entries === null && (
        <div className="card text-sm text-slate-300">Cargando…</div>
      )}

      {entries && entries.length === 0 && (
        <div className="card text-sm text-slate-300">
          Aún no hay entradas. Pulsa <span className="text-accent font-semibold">+ Nueva</span> para
          añadir la primera.
        </div>
      )}

      {entries && entries.length > 0 && (
        <ul className="space-y-3">
          {entries.map((e) => (
            <li key={e.id}>
              <Link to={`/diario/${e.id}`} className="card block active:scale-[0.99]">
                <div className="flex justify-between items-baseline gap-2">
                  <h2 className="font-semibold truncate">{e.title || '(sin título)'}</h2>
                  <time className="text-xs text-slate-400 flex-shrink-0">
                    {new Date(e.createdAt).toLocaleDateString()}
                  </time>
                </div>
                {e.errorCode && <span className="chip mt-1">Cód. {e.errorCode}</span>}
                <p className="text-sm text-slate-300 mt-2 line-clamp-2">{e.body}</p>
                {e.photos.length > 0 && (
                  <p className="text-xs text-slate-400 mt-1">
                    {e.photos.length} foto{e.photos.length > 1 ? 's' : ''}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
