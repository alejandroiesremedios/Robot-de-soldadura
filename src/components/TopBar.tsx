import { Link, useLocation, useNavigate } from 'react-router-dom';

// Barra superior con botón Atrás + atajo al Menú.
// Se oculta en la pantalla de Inicio porque ahí no hay "atrás" lógico.
export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/') return null;

  const showMenuLink = location.pathname !== '/menu';

  function goBack() {
    // Si hay historial dentro de la propia app, volver una entrada.
    // Si no (entrada directa por URL/PWA arranque), ir al menú.
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/menu');
    }
  }

  return (
    <div
      className="sticky top-0 z-20 bg-ink/95 backdrop-blur border-b border-slate-800"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-2">
        <button
          type="button"
          onClick={goBack}
          className="text-accent text-sm font-medium flex items-center gap-1 active:scale-95"
          aria-label="Volver"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Atrás
        </button>
        {showMenuLink && (
          <Link to="/menu" className="text-slate-300 text-sm font-medium">
            Menú
          </Link>
        )}
      </div>
    </div>
  );
}
