import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export default function ZoomableImage({ src, alt, className }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${className ?? ''} cursor-zoom-in`}
        loading="lazy"
        onClick={() => setOpen(true)}
      />
      {open && <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  );
}

const MIN_SCALE = 1;
const MAX_SCALE = 6;

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{
    startDist: number;
    startScale: number;
    startMid: { x: number; y: number };
    startTx: number;
    startTy: number;
  } | null>(null);
  const lastTap = useRef(0);

  // Bloquear scroll del body mientras el lightbox está abierto.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Cerrar con Escape o botón "atrás" del navegador.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    // Empujar un estado al historial para que el "atrás" cierre la imagen
    // en lugar de salir de la pantalla.
    window.history.pushState({ lightbox: true }, '');
    const onPop = () => onClose();
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('popstate', onPop);
      // Si seguimos en el estado del lightbox, retrocedemos para limpiar.
      if (window.history.state?.lightbox) window.history.back();
    };
  }, [onClose]);

  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

  const reset = useCallback(() => {
    setScale(1);
    setTx(0);
    setTy(0);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      gesture.current = {
        startDist: Math.hypot(dx, dy),
        startScale: scale,
        startMid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
        startTx: tx,
        startTy: ty,
      };
    } else if (pointers.current.size === 1) {
      // Detectar doble tap.
      const now = Date.now();
      if (now - lastTap.current < 300) {
        if (scale > 1) reset();
        else setScale(2);
        lastTap.current = 0;
      } else {
        lastTap.current = now;
      }
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    const prev = pointers.current.get(e.pointerId)!;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && gesture.current) {
      const [a, b] = Array.from(pointers.current.values());
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      const newScale = clamp(
        gesture.current.startScale * (dist / gesture.current.startDist),
        MIN_SCALE,
        MAX_SCALE,
      );
      setScale(newScale);
      // Pan: media de los dos punteros menos su origen, escalado por la nueva escala.
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      setTx(gesture.current.startTx + (midX - gesture.current.startMid.x));
      setTy(gesture.current.startTy + (midY - gesture.current.startMid.y));
    } else if (pointers.current.size === 1 && scale > 1) {
      // Pan con un dedo cuando está zoomed.
      setTx((v) => v + (e.clientX - prev.x));
      setTy((v) => v + (e.clientY - prev.y));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) gesture.current = null;
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    setScale((s) => clamp(s * factor, MIN_SCALE, MAX_SCALE));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ touchAction: 'none' }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-slate-900/80 text-slate-100 text-xl font-bold flex items-center justify-center active:scale-95"
      >
        ×
      </button>
      <div className="absolute bottom-3 right-3 z-10 flex gap-2">
        <button
          type="button"
          onClick={() => setScale((s) => clamp(s / 1.25, MIN_SCALE, MAX_SCALE))}
          aria-label="Alejar"
          className="w-10 h-10 rounded-full bg-slate-900/80 text-slate-100 text-xl font-bold flex items-center justify-center active:scale-95"
        >
          −
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="Ajustar"
          className="px-3 h-10 rounded-full bg-slate-900/80 text-slate-100 text-xs font-semibold flex items-center justify-center active:scale-95"
        >
          1:1
        </button>
        <button
          type="button"
          onClick={() => setScale((s) => clamp(s * 1.25, MIN_SCALE, MAX_SCALE))}
          aria-label="Acercar"
          className="w-10 h-10 rounded-full bg-slate-900/80 text-slate-100 text-xl font-bold flex items-center justify-center active:scale-95"
        >
          +
        </button>
      </div>
      <div
        ref={containerRef}
        className="w-full h-full overflow-hidden flex items-center justify-center"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="max-w-full max-h-full"
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: pointers.current.size === 0 ? 'transform 120ms ease-out' : 'none',
            willChange: 'transform',
          }}
        />
      </div>
    </div>
  );
}
