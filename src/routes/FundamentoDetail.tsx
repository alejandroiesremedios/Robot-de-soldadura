import { Link, useParams } from 'react-router-dom';
import { FUNDAMENTOS_DETAILS } from './Fundamentos';

export default function FundamentoDetail() {
  const { id } = useParams();
  const detail = id ? FUNDAMENTOS_DETAILS[id] : undefined;

  if (!detail) {
    return (
      <div className="space-y-4">
        <Link to="/fundamentos" className="text-accent text-sm">
          ← Instrucciones fundamentales
        </Link>
        <div className="card text-sm">Sección no encontrada.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link to="/fundamentos" className="text-accent text-sm">
        ← Instrucciones fundamentales
      </Link>
      <header>
        <h1 className="text-2xl font-bold leading-tight">{detail.title}</h1>
      </header>
      <article className="card">{detail.body}</article>
    </div>
  );
}
