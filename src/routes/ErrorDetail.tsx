import { Link } from 'react-router-dom';

export default function ErrorDetail() {
  return (
    <div className="space-y-4">
      <Link to="/errores" className="text-accent text-sm">
        ← Códigos de error
      </Link>
      <div className="card text-slate-300 text-sm">
        Detalle pendiente: aún no hay códigos cargados.
      </div>
    </div>
  );
}
