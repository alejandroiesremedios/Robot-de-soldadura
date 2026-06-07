// Importa todas las páginas renderizadas de los PDFs (PNG) como módulos Vite.
// El bundler las convierte en URL en build normal y en data: URI en standalone.
const modules = import.meta.glob('../assets/pdf/**/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

// Indexa por clave "<grupo>/page-NN" → URL final.
const byKey: Record<string, string> = {};
for (const fullPath of Object.keys(modules)) {
  // p. ej. ../assets/pdf/wire_check/page-03.png → wire_check/page-03
  const m = fullPath.match(/assets\/pdf\/([^/]+)\/([^/]+)\.png$/);
  if (m) byKey[`${m[1]}/${m[2]}`] = modules[fullPath];
}

export function pdfImage(group: string, page: number): string {
  const key = `${group}/page-${String(page).padStart(2, '0')}`;
  const url = byKey[key];
  if (!url) {
    // En desarrollo lanzamos para detectar referencias rotas en datos.
    // eslint-disable-next-line no-console
    console.warn(`[pdfImage] No existe ${key}`);
    return '';
  }
  return url;
}
