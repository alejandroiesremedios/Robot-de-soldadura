import { Link } from 'react-router-dom';

const sections = [
  {
    to: '/fundamentos',
    title: 'Instrucciones fundamentales',
    desc: 'Conceptos previos: partes del robot y del teach pendant, instrucciones del punto, interpolaciones.',
    accent: 'from-indigo-500/30 to-indigo-700/10',
    fullWidth: true,
  },
  {
    to: '/procedimientos',
    title: 'Procedimientos',
    desc: 'Guías paso a paso: arranque, touch sensing, wire check, etc.',
    accent: 'from-sky-500/30 to-sky-700/10',
  },
  {
    to: '/uniones',
    title: 'Uniones',
    desc: 'Recetas por junta y posición: robot + EWM capa a capa (raíz, hot pass, relleno, peinado).',
    accent: 'from-teal-500/30 to-teal-700/10',
  },
  {
    to: '/parametros',
    title: 'Parámetros recomendados',
    desc: 'Recomendaciones por material, espesor y posición.',
    accent: 'from-amber-500/30 to-amber-700/10',
  },
  {
    to: '/errores',
    title: 'Códigos de error',
    desc: 'Busca el error del robot o de la fuente y mira la solución.',
    accent: 'from-rose-500/30 to-rose-700/10',
  },
  {
    to: '/diario',
    title: 'Diario',
    desc: 'Apunta lo que pasa en el taller y cómo lo resolviste.',
    accent: 'from-emerald-500/30 to-emerald-700/10',
  },
  {
    to: '/faq',
    title: 'Preguntas frecuentes',
    desc: 'Dudas habituales sobre la operación del robot y la fuente.',
    accent: 'from-violet-500/30 to-violet-700/10',
  },
];

export default function Menu() {
  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold leading-tight">Menú principal</h1>
        <p className="text-sm text-slate-300">Elige una sección.</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {sections.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className={`card bg-gradient-to-br ${s.accent} active:scale-[0.98] transition ${
              s.fullWidth ? 'col-span-2' : ''
            }`}
          >
            <h2 className="font-semibold text-lg leading-tight">{s.title}</h2>
            <p className="mt-1 text-xs text-slate-300 leading-snug">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
