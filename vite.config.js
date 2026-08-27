import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

// Código-fonte fica em frontend/. O build é gerado na RAIZ do repositório,
// que é onde o GitHub Pages desta branch está configurado para servir.
export default defineConfig({
  root: 'frontend',
  plugins: [react()],
  base: '/bibliapoetica/',
  build: {
    outDir: repoRoot,
    emptyOutDir: false, // NÃO apagar os arquivos-fonte da raiz
    rollupOptions: {
      output: { manualChunks: undefined },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
});
