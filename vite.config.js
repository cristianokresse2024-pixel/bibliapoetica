import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base '/bibliapoetica/' para funcionar no GitHub Pages (usuario.github.io/bibliapoetica/)
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || '/bibliapoetica/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
