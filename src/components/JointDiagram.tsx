/**
 * Croquis acotados de las juntas del recetario, en sección transversal,
 * con las capas coloreadas. Dos variantes:
 *  - 'tope-v':   a tope con preparación en V 60°, gap 4 mm, espesor 10 mm.
 *  - 'filete-t': unión en T sin preparación, cordón en ángulo (garganta 6-8 mm).
 */
const COLORS = {
  raiz: '#f59e0b', // ámbar
  hotPass: '#f97316', // naranja
  relleno: '#38bdf8', // cielo
  peinado: '#34d399', // esmeralda
};

export type JointDiagramKind = 'tope-v' | 'filete-t';

export default function JointDiagram({ tipo }: { tipo: JointDiagramKind }) {
  return tipo === 'tope-v' ? <TopeV /> : <FileteT />;
}

function TopeV() {
  // Chapas de y=50 a y=130 (10 mm, ~8 px/mm). Gap 32 px (4 mm) centrado en x=160.
  // Bisel 30° por chapa desde y=50 hasta y=118; talón vertical de y=118 a y=130.
  return (
    <Frame
      legend={[
        { color: COLORS.raiz, label: '1 Raíz' },
        { color: COLORS.hotPass, label: '2 Hot pass' },
        { color: COLORS.relleno, label: '3 Relleno' },
        { color: COLORS.peinado, label: '4 Peinado' },
      ]}
      ariaLabel="Sección de la junta en V con sus capas"
    >
      {/* Chapas */}
      <polygon points="20,50 105,50 144,118 144,130 20,130" fill="#475569" />
      <polygon points="300,50 215,50 176,118 176,130 300,130" fill="#475569" />

      {/* Capas de soldadura (de abajo arriba) */}
      <polygon points="138,108 182,108 176,131 144,131" fill={COLORS.raiz} />
      <polygon points="132,90 188,90 182,108 138,108" fill={COLORS.hotPass} />
      <polygon points="118,68 202,68 188,90 132,90" fill={COLORS.relleno} />
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
      <text x="226" y="128" fill="#cbd5e1" fontSize="10">talón 2 mm</text>
    </Frame>
  );
}

function FileteT() {
  // Unión en T (~4 px/mm): chapa base horizontal de 10 mm (y=130..170) y chapa
  // vertical de 10 mm (x=120..160). El cordón en ángulo va en el rincón derecho.
  // En 3F/PF el eje del cordón es vertical (perpendicular al papel: el cordón sube).
  return (
    <Frame
      legend={[
        { color: COLORS.raiz, label: '1 Raíz (o pasada única)' },
        { color: COLORS.peinado, label: '2 Peinado (si a ≥ 8 mm)' },
      ]}
      ariaLabel="Sección de la unión en T con el cordón en ángulo y sus capas"
    >
      {/* Chapas */}
      <rect x="30" y="130" width="260" height="40" fill="#475569" />
      <rect x="120" y="20" width="40" height="110" fill="#475569" />

      {/* Peinado (debajo, triángulo grande cateto ~34 px ≈ 8,5 mm) */}
      <path d="M 160 96 Q 172 118 194 130 L 160 130 Z" fill={COLORS.peinado} />
      {/* Raíz (encima, triángulo pequeño cateto ~22 px ≈ 5,5 mm) */}
      <polygon points="160,108 182,130 160,130" fill={COLORS.raiz} />

      {/* Cota garganta a (desde el rincón, bisectriz a 45°) */}
      <line x1="160" y1="130" x2="184" y2="106" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" />
      <text x="188" y="102" fill="#cbd5e1" fontSize="11">a = 6-8 mm</text>

      {/* Cota cateto z */}
      <line x1="160" y1="180" x2="194" y2="180" stroke="#94a3b8" strokeWidth="1" />
      <line x1="160" y1="174" x2="160" y2="186" stroke="#94a3b8" strokeWidth="0.75" />
      <line x1="194" y1="174" x2="194" y2="186" stroke="#94a3b8" strokeWidth="0.75" />
      <text x="200" y="184" fill="#cbd5e1" fontSize="10">z ≈ 8-11 mm</text>

      {/* Espesores */}
      <text x="34" y="124" fill="#cbd5e1" fontSize="10">chapas 10 mm</text>

      {/* Sentido del cordón */}
      <circle cx="262" cy="60" r="11" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <circle cx="262" cy="60" r="2" fill="#94a3b8" />
      <text x="262" y="86" fill="#cbd5e1" fontSize="10" textAnchor="middle">el cordón sube</text>
      <text x="262" y="97" fill="#cbd5e1" fontSize="10" textAnchor="middle">(hacia ti)</text>
    </Frame>
  );
}

function Frame({
  children,
  legend,
  ariaLabel,
}: {
  children: React.ReactNode;
  legend: { color: string; label: string }[];
  ariaLabel: string;
}) {
  return (
    <figure className="card overflow-hidden p-0">
      <svg viewBox="0 0 320 196" className="w-full h-auto bg-slate-900" role="img" aria-label={ariaLabel}>
        {children}
      </svg>
      <figcaption className="text-xs text-slate-300 p-3 border-t border-slate-700/60">
        <span className="font-medium text-slate-100">Sección de la junta y reparto de capas.</span>{' '}
        <span className="inline-flex flex-wrap gap-x-3 gap-y-1 mt-1">
          {legend.map((l) => (
            <span key={l.label} className="inline-flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
              {l.label}
            </span>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
