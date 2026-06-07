import { Link } from 'react-router-dom';
import robotImg from '../assets/robot.webp';
import logoIes from '../assets/logo-ies.bmp';

export default function Home() {
  return (
    <div className="space-y-5 min-h-[calc(100vh-7rem)] flex flex-col">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-accent font-semibold">
          Kawasaki BA006L · EWM Titan XQ 350 Plus
        </p>
        <h1 className="text-3xl font-bold leading-tight">Robot de soldadura</h1>
      </header>

      <figure className="card overflow-hidden p-0 relative w-3/4 mx-auto">
        <img
          src={robotImg}
          alt="Robot Kawasaki BA006L con antorcha EWM en el taller"
          className="w-full aspect-[3/4] object-cover object-center"
          loading="eager"
        />
        <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink/90 to-transparent p-3 text-xs text-slate-200">
          Célula de soldadura — Kawasaki BA006L
        </figcaption>
      </figure>

      <div className="flex-1 flex flex-col justify-end gap-5">
        <Link
          to="/menu"
          className="btn-primary w-full text-lg py-4"
        >
          Comenzar
        </Link>

        <footer className="flex items-center justify-center gap-3">
          <img
            src={logoIes}
            alt="IES Nuestra Señora de los Remedios"
            className="h-16 w-auto rounded-md bg-white/95 p-1 object-contain flex-shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          <p className="text-sm text-slate-300 leading-snug">
            IES Nuestra Señora<br />de los Remedios
          </p>
        </footer>
      </div>
    </div>
  );
}
