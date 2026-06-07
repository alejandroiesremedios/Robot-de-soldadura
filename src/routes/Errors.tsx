import { useState } from 'react';

export default function Errors() {
  const [q, setQ] = useState('');
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Códigos de error</h1>
        <p className="text-sm text-slate-300">
          Busca un código del robot Kawasaki o de la fuente EWM Titan XQ 350 Plus.
        </p>
      </header>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        inputMode="search"
        placeholder="Código o palabra clave"
        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-base outline-none focus:border-accent"
      />

      <div className="card text-slate-300 text-sm">
        <p className="font-semibold text-slate-100 mb-1">Contenido pendiente</p>
        <p>
          Aún no se han cargado los códigos de error. Se extraerán del manual del controlador Serie E
          (sección 2.10 “Pantalla para error” y 2.11 “Pantalla para advertencias”) y de la
          documentación oficial de EWM.
        </p>
      </div>
    </div>
  );
}
