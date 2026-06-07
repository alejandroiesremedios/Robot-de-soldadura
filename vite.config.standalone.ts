import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Copia dist-standalone/index.html a la raíz como "Robot Soldadura.html"
// tras cada build (también en modo watch).
function copyStandaloneToRoot(): Plugin {
  return {
    name: 'copy-standalone-to-root',
    apply: 'build',
    async closeBundle() {
      const from = resolve(__dirname, 'dist-standalone/index.html');
      const to = resolve(__dirname, 'Robot Soldadura.html');
      try {
        await copyFile(from, to);
        // eslint-disable-next-line no-console
        console.log(`[standalone] Actualizado: ${to}`);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[standalone] No se pudo copiar el HTML:', err);
      }
    },
  };
}

// Build autocontenido en un único HTML para abrir con doble click (file://).
// Embebe JS, CSS e imágenes. Sin PWA / service worker (no aplica en file://).
export default defineConfig({
  base: './',
  assetsInclude: ['**/*.bmp'],
  plugins: [
    react(),
    VitePWA({ disable: true }),
    viteSingleFile(),
    copyStandaloneToRoot(),
  ],
  build: {
    outDir: 'dist-standalone',
    target: 'es2020',
    assetsInlineLimit: 100 * 1024 * 1024,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
