import { Link, useParams } from 'react-router-dom';
import { PROCEDURES, type ProcedureStep, type StepRef } from '../data/procedures';
import { categoryChipClass } from '../lib/categoryColors';
import ZoomableImage from '../components/ZoomableImage';

function normalizeStep(s: ProcedureStep): {
  text: string;
  image?: string;
  caption?: string;
  refs?: StepRef[];
} {
  return typeof s === 'string' ? { text: s } : s;
}

export default function ProcedureDetail() {
  const { id } = useParams();
  const proc = PROCEDURES.find((p) => p.id === id);

  if (!proc) {
    return (
      <div className="space-y-4">
        <Link to="/procedimientos" className="text-accent text-sm">
          ← Procedimientos
        </Link>
        <div className="card text-sm">Procedimiento no encontrado.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link to="/procedimientos" className="text-accent text-sm">
        ← Procedimientos
      </Link>

      <header className="space-y-1">
        <span className={`chip ${categoryChipClass(proc.category)}`}>{proc.category}</span>
        <h1 className="text-2xl font-bold mt-2">{proc.title}</h1>
        <p className="text-sm text-slate-300">{proc.summary}</p>
      </header>

      {proc.cover && (
        <figure className="card overflow-hidden p-0">
          <ZoomableImage
            src={proc.cover.src}
            alt={proc.cover.caption ?? proc.title}
            className="w-full h-auto bg-white"
          />
          {proc.cover.caption && (
            <figcaption className="text-xs text-slate-300 p-3 border-t border-slate-700/60">
              {proc.cover.caption}
            </figcaption>
          )}
        </figure>
      )}

      <ol className="space-y-3">
        {proc.steps.map((raw, i) => {
          const step = normalizeStep(raw);
          return (
            <li key={i} className="card space-y-3">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-ink font-bold flex items-center justify-center text-sm">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed">{step.text}</p>
              </div>
              {step.refs && step.refs.length > 0 && (
                <div className="flex flex-wrap gap-2 pl-10">
                  {step.refs.map((r) => (
                    <Link
                      key={`${r.to}-${r.label}`}
                      to={`/${r.kind === 'procedimiento' ? 'procedimientos' : 'fundamentos'}/${r.to}`}
                      className="chip bg-indigo-500/20 text-indigo-100 border border-indigo-400/40 active:scale-[0.97]"
                    >
                      → {r.label}
                    </Link>
                  ))}
                </div>
              )}
              {step.image && (
                <figure className="overflow-hidden rounded-xl border border-slate-700/60">
                  <ZoomableImage
                    src={step.image}
                    alt={step.caption ?? `Paso ${i + 1}`}
                    className="w-full h-auto bg-white"
                  />
                  {step.caption && (
                    <figcaption className="text-xs text-slate-300 px-3 py-2 bg-slate-900/40">
                      {step.caption}
                    </figcaption>
                  )}
                </figure>
              )}
            </li>
          );
        })}
      </ol>

      {proc.notes && proc.notes.length > 0 && (
        <section className="card border-amber-500/40">
          <h3 className="font-semibold text-amber-300 mb-2 text-sm uppercase tracking-wide">
            Notas
          </h3>
          <ul className="list-disc list-inside text-sm text-slate-200 space-y-1">
            {proc.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </section>
      )}

      {proc.source && (
        <p className="text-xs text-slate-400 italic">Fuente: {proc.source}</p>
      )}
    </div>
  );
}
