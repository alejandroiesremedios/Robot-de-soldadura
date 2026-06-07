import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  assetsInclude: ['**/*.bmp'],
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon.svg'],
      manifest: {
        name: 'Robot Soldadura — Kawasaki BA006L + EWM Titan XQ 350',
        short_name: 'Robot Soldadura',
        description:
          'Asistente de consulta para operar el robot Kawasaki BA006L con fuente EWM Titan XQ 350 Plus.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,ico,webp}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
    }),
  ],
});
