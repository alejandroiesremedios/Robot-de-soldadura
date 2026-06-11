import { Link, useParams } from 'react-router-dom';
import { JOINTS, type LayerConfig, type WeavingSpec } from '../data/joints';
import JointDiagram from '../components/JointDiagram';
import WeavingCalculator from '../components/WeavingCalculator';
import ZoomableImage from '../components/ZoomableImage';
import type { StepRef } from '../data/procedures';

export default function JointDetail() {
  const { id } = useParams();
  const joint = JOINTS.find((j) => j.id === id);

  if (!joint) {
    return (
      <div className="space-y-4">
        <Link to="/uniones" className="text-accent text-sm">← Uniones</Link>
        <div className="card text-sm">Ficha no encontrada.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link to="/uniones" className="text-accent text-sm">← Uniones</Link>

      <header className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <span className="chip bg-teal-500/20 text-teal-100 border border-teal-400/40">
            {joint.soporte === 'chapa' ? 'Chapa' : 'Tubo'}
          </span>
          <span className="chip bg-indigo-500/20 text-indigo-100 border border-indigo-400/40">
            {joint.posicion.iso} · {joint.posicion.aws}
          </span>
        </div>
        <h1 className="text-2xl font-bold leading-tight">{joint.titulo}</h1>
        <p className="text-sm text-slate-300">{joint.posicion.descripcion}</p>
      </header>

      <JointDiagram />

      <section className="card text-sm space-y-1.5">
        <InfoRow label="Preparación" value={joint.preparacion} />
        <InfoRow label="Material base" value={joint.materialBase} />
        <InfoRow label="Consumible" value={joint.consumible} />
        <InfoRow label="Gas" value={joint.gas} />
      </section>

      <div className="space-y-4">
        {joint.capas.map((capa, i) => (
          <LayerCard key={capa.id} capa={capa} index={i} />
        ))}
      </div>

      {joint.notas && (
        <section className="card border-amber-500/40">
          <h3 className="font-semibold text-amber-300 mb-2 text-sm uppercase tracking-wide">Notas</h3>
          <ul className="list-disc list-inside text-sm text-slate-200 space-y-1">
            {joint.notas.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </section>
      )}

      {joint.source && <p className="text-xs text-slate-400 italic">Fuente: {joint.source}</p>}
    </div>
  );
}

function LayerCard({ capa, index }: { capa: LayerConfig; index: number }) {
  return (
    <section className="card space-y-3">
      <div className="flex gap-3 items-start">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-ink font-bold flex items-center justify-center text-sm">
          {index + 1}
        </span>
        <div>
          <h2 className="font-semibold text-lg leading-tight">{capa.nombre}</h2>
          <p className="text-sm text-slate-300 mt-1">{capa.proposito}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-sky-500/40 bg-sky-500/5 p-3 space-y-1.5 text-sm">
          <h3 className="font-semibold text-sky-300 text-xs uppercase tracking-wide">🤖 Robot (TP)</h3>
          <p className="leading-snug">{capa.robot.instrucciones}</p>
          <InfoRow label="Avance" value={capa.robot.velocidadAvance} />
          <WeavingRow weaving={capa.robot.weaving} />
          {capa.robot.notas?.map((n, i) => (
            <p key={i} className="text-xs text-slate-400 leading-snug">· {n}</p>
          ))}
        </div>

        <div className="rounded-xl border border-orange-500/40 bg-orange-500/5 p-3 space-y-1.5 text-sm">
          <h3 className="font-semibold text-orange-300 text-xs uppercase tracking-wide">⚡ EWM (panel)</h3>
          <InfoRow label="Programa" value={`${capa.ewm.programa} del JOB de acero`} />
          <InfoRow label="Modo" value={capa.ewm.modo} />
          <InfoRow label="Vel. hilo (WFS)" value={capa.ewm.wfs} />
          <InfoRow label="U-corr" value={capa.ewm.uCorr} />
          {capa.ewm.dinamica && <InfoRow label="Dinámica" value={capa.ewm.dinamica} />}
          {capa.ewm.notas?.map((n, i) => (
            <p key={i} className="text-xs text-slate-400 leading-snug">· {n}</p>
          ))}
        </div>
      </div>

      {capa.robot.weaving.tipo === 'personalizado' && (
        <WeavingCalculator defaults={capa.robot.weaving.calculadora} />
      )}

      <details className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3">
        <summary className="text-sm font-semibold text-rose-200 cursor-pointer select-none">
          Si algo falla — qué tocar y dónde
        </summary>
        <table className="w-full text-sm mt-2">
          <tbody>
            {capa.ajustes.map((a, i) => (
              <tr key={i} className="border-t border-slate-700/60 align-top">
                <td className="py-1.5 pr-2 text-slate-200">{a.sintoma}</td>
                <td className="py-1.5 px-2">
                  <span className={`chip ${a.donde === 'robot' ? 'bg-sky-500/20 text-sky-100' : 'bg-orange-500/20 text-orange-100'}`}>
                    {a.donde === 'robot' ? '🤖' : '⚡'} {a.donde}
                  </span>
                </td>
                <td className="py-1.5 pl-2 text-slate-300">{a.accion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      {capa.refs && capa.refs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {capa.refs.map((r: StepRef) => (
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

      {capa.image && (
        <figure className="overflow-hidden rounded-xl border border-slate-700/60">
          <ZoomableImage src={capa.image} alt={capa.caption ?? capa.nombre} className="w-full h-auto bg-white" />
          {capa.caption && (
            <figcaption className="text-xs text-slate-300 px-3 py-2 bg-slate-900/40">{capa.caption}</figcaption>
          )}
        </figure>
      )}
    </section>
  );
}

function WeavingRow({ weaving }: { weaving: WeavingSpec }) {
  if (weaving.tipo === 'ninguno') {
    return <InfoRow label="Weaving" value={weaving.motivo ? `Sin weaving — ${weaving.motivo}` : 'Sin weaving'} />;
  }
  if (weaving.tipo === 'estandar') {
    return (
      <InfoRow
        label="Weaving"
        value={`Estándar PN=${weaving.pn} · ${weaving.anchuraMm} mm · ${weaving.frecuenciaHz} Hz`}
      />
    );
  }
  return (
    <>
      <InfoRow label="Weaving" value={`Personalizado PN=${weaving.pnSugerido} · ${weaving.anchuraMm} mm`} />
      <p className="text-xs text-slate-300 leading-snug">{weaving.descripcion}</p>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="text-slate-400 flex-shrink-0">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
