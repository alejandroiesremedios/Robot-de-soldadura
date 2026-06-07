import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  deleteEntry,
  getEntry,
  saveEntry,
  type JournalEntry as TJournalEntry,
} from '../db/journal';

export default function JournalEntry() {
  const { id } = useParams();
  const nav = useNavigate();
  const editingId = id ? Number(id) : undefined;

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(editingId === undefined);

  useEffect(() => {
    if (editingId === undefined) return;
    getEntry(editingId).then((e) => {
      if (e) {
        setTitle(e.title);
        setBody(e.body);
        setErrorCode(e.errorCode ?? '');
        setPhotos(e.photos);
      }
      setLoaded(true);
    });
  }, [editingId]);

  async function onSave() {
    const entry: TJournalEntry = {
      id: editingId,
      createdAt: editingId ? (await getEntry(editingId))?.createdAt ?? Date.now() : Date.now(),
      title: title.trim(),
      body: body.trim(),
      errorCode: errorCode.trim() || undefined,
      photos,
    };
    await saveEntry(entry);
    nav('/diario');
  }

  async function onDelete() {
    if (editingId === undefined) return;
    if (!confirm('¿Eliminar esta entrada?')) return;
    await deleteEntry(editingId);
    nav('/diario');
  }

  function onPickPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    Promise.all(
      files.map(
        (f) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(f);
          }),
      ),
    ).then((urls) => setPhotos((prev) => [...prev, ...urls]));
    e.target.value = '';
  }

  function removePhoto(idx: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  }

  if (!loaded) return <div className="card text-sm text-slate-300">Cargando…</div>;

  return (
    <div className="space-y-4">
      <Link to="/diario" className="text-accent text-sm">
        ← Diario
      </Link>
      <h1 className="text-2xl font-bold">
        {editingId !== undefined ? 'Editar entrada' : 'Nueva entrada'}
      </h1>

      <div className="space-y-3">
        <Field label="Título">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-accent"
            placeholder="P. ej. Error E1234 cambio de boquilla"
          />
        </Field>

        <Field label="Código de error (opcional)">
          <input
            value={errorCode}
            onChange={(e) => setErrorCode(e.target.value)}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-accent"
            placeholder="P. ej. E0123"
          />
        </Field>

        <Field label="Descripción / solución">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-accent resize-y"
            placeholder="Qué pasó, qué hiciste, qué deberías recordar la próxima vez…"
          />
        </Field>

        <Field label="Fotos">
          <label className="btn-primary cursor-pointer w-full">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              className="hidden"
              onChange={onPickPhotos}
            />
            Añadir fotos
          </label>
          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {photos.map((p, i) => (
                <div key={i} className="relative">
                  <img src={p} alt="" className="w-full h-24 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6 text-xs"
                    aria-label="Quitar foto"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </Field>
      </div>

      <div className="flex gap-2">
        <button onClick={onSave} className="btn-primary flex-1">
          Guardar
        </button>
        {editingId !== undefined && (
          <button
            onClick={onDelete}
            className="rounded-xl bg-rose-600/80 text-white px-4 py-3 font-semibold"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs uppercase tracking-wide text-slate-400">{label}</span>
      {children}
    </label>
  );
}
