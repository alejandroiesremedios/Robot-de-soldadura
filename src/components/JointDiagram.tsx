/**
 * Croquis acotado de la junta a tope con preparación en V 60°, gap 4 mm,
 * espesor 10 mm, con las capas coloreadas (raíz / hot pass / relleno / peinado).
 * Sección transversal, escala aproximada 8 px/mm.
 */
const COLORS = {
  raiz: '#f59e0b', // ámbar
  hotPass: '#f97316', // naranja
  relleno: '#38bdf8', // cielo
  peinado: '#34d399', // esmeralda
};

export default function JointDiagram() {
  // Geometría: chapas de y=50 a y=130 (10 mm). Gap 32 px (4 mm) centrado en x=160.
  // Bisel 30° por chapa desde y=50 hasta y=118; talón vertical de y=118 a y=130.
  return (
    <figure className="card overflow-hidden p-0">
      <svg viewBox="0 0 320 196" className="w-full h-auto bg-slate-900" role="img" aria-label="Sección de la junta en V con sus capas">
        {/* Chapas */}
        <polygon points="20,50 105,50 144,118 144,130 20,130" fill="#475569" />
        <polygon points="300,50 215,50 176,118 176,130 300,130" fill="#475569" />

        {/* Capas de soldadura (de abajo arriba) */}
        {/* Raíz: fondo del gap + talones */}
        <polygon points="138,108 182,108 176,131 144,131" fill={COLORS.raiz} />
        {/* Hot pass */}
        <polygon points="132,90 188,90 182,108 138,108" fill={COLORS.hotPass} />
        {/* Relleno */}
        <polygon points="118,68 202,68 188,90 132,90" fill={COLORS.relleno} />
        {/* Peinado: sobrepasa 1-2 mm cada borde, con corona */}
        <path d="M 100 50 Q 160 30 220 50 L 202 68 L 118 68 Z" fill={COLORS.peinado} />

        {/* Cota espesor 10 mm */}
        <line x1="38" y1="50" x2="38" y2="130" stroke="#94a3b8" strokeWidth="1" />
        <line x1="33" y1="50" x2="43" y2="50" stroke="#94a3b8" strokeWidth="1" />
        <line x1="33" y1="130" x2="43" y2="130" stroke="#94a3b8" strokeWidth="1" />
        <text x="46" y="93" fill="#cbd5e1" fontSize="11">10 mm</text>

        {/* Cota gap 4 mm */}
        <line x1="144" y1="142" x2="176" y2="142" stroke="#94a3b8" strokeWidth="1" />
        <line x1="144" y1="131" x2="144" y2="147" stroke="#94a3b8" strokeWidth="0.75" />
        <line x1="176" y1="131" x2="176" y2="147" stroke="#94a3b8" strokeWidth="0.75" />
        <text x="160" y="156" fill="#cbd5e1" fontSize="11" textAnchor="middle">gap 4 mm</text>

        {/* Ángulo 60° */}
        <text x="160" y="46" fill="#cbd5e1" fontSize="11" textAnchor="middle">V 60°</text>

        {/* Talón */}
        <line x1="222" y1="124" x2="180" y2="124" stroke="#94a3b8" strokeWidth="0.75" />
        <text x="226" y="128" fill="#cbd5e1" fontSize="10">talón 1-2 mm</text>
      </svg>
      <figcaption className="text-xs text-slate-300 p-3 border-t border-slate-700/60">
        <span className="font-medium text-slate-100">Sección de la junta y reparto de capas.</span>{' '}
        <span className="inline-flex flex-wrap gap-x-3 gap-y-1 mt-1">
          <LegendDot color={COLORS.raiz} label="1 Raíz" />
          <LegendDot color={COLORS.hotPass} label="2 Hot pass" />
          <LegendDot color={COLORS.relleno} label="3 Relleno" />
          <LegendDot color={COLORS.peinado} label="4 Peinado" />
        </span>
      </figcaption>
    </figure>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
