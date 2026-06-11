import { Link } from 'react-router-dom';
import { JOINTS } from '../data/joints';

export default function Joints() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Uniones</h1>
        <p className="text-sm text-slate-300">
          Recetas completas por junta y posición: qué poner en el robot y en el EWM, capa a capa
          (raíz → hot pass → relleno → peinado), y qué ajustar si algo falla.
        </p>
      </header>

      <ul className="space-y-3">
        {JOINTS.map((j) => (
          <li key={j.id}>
            <Link to={`/uniones/${j.id}`} className="card block space-y-2 active:scale-[0.99] transition">
              <div className="flex flex-wrap gap-2">
                <span className="chip bg-teal-500/20 text-teal-100 border border-teal-400/40">
                  {j.soporte === 'chapa' ? 'Chapa' : 'Tubo'}
                </span>
                <span className="chip bg-indigo-500/20 text-indigo-100 border border-indigo-400/40">
                  {j.posicion.iso.split(' ')[0]} / {j.posicion.aws.split(' ')[0]}
                </span>
                <span className="chip">{j.capas.length} capas</span>
              </div>
              <h2 className="font-semibold text-lg leading-tight">{j.titulo}</h2>
              <p className="text-xs text-slate-300">{j.preparacion}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="card text-xs text-slate-400">
        Próximas fichas: a tope V60 en PA/1G y PC/2G · filete en PB/2F y PF/3F ascendente · tubo en
        PH/5G ascendente y PC/2G. Material siempre acero (~10 mm).
      </div>
    </div>
  );
}
