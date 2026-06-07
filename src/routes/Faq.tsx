export default function Faq() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Preguntas frecuentes</h1>
        <p className="text-sm text-slate-300">
          Dudas habituales sobre la operación del robot y la fuente.
        </p>
      </header>

      <div className="card text-slate-300 text-sm">
        <p className="font-semibold text-slate-100 mb-1">Contenido pendiente</p>
        <p>Aún no se han añadido preguntas. Se irán incorporando con el uso.</p>
      </div>
    </div>
  );
}
