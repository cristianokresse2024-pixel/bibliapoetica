import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

// Carrega variáveis do functions/.env e .env.local para o dev server local
for (const envPath of ['api/.env', '.env.local', '.env']) {
  try {
    const fullPath = path.resolve(repoRoot, envPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [k, ...v] = trimmed.split('=');
          const key = k.trim();
          const val = v.join('=').trim();
          if (key && !process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  } catch {}
}

// Em desenvolvimento, reusamos EXATAMENTE o mesmo handler serverless de produção
// (api/askIAViva.js), com um pequeno adaptador que dá ao `res` do Node os métodos
// .status()/.json() que o handler espera. Assim dev == produção (mesma validação
// e mesma proteção anti-abuso), sem duplicar lógica.
function localApiPlugin() {
  return {
    name: 'local-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/askIAViva')) return next();

        // adaptador estilo Express/Vercel
        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (obj) => {
          if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(obj));
          return res;
        };

        // coletar corpo JSON
        let body = '';
        req.on('data', (c) => { body += c; });
        await new Promise((r) => req.on('end', r));
        try { req.body = body ? JSON.parse(body) : {}; } catch { req.body = {}; }

        try {
          const { default: handler } = await import('./api/askIAViva.js');
          await handler(req, res);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'A IA Viva está indisponível no momento.' }));
        }
      });
    },
  };
}

const base = process.env.VITE_BASE_PATH || '/';
const outDir = path.resolve(repoRoot, 'dist');

export default defineConfig({
  root: 'frontend',
  plugins: [react(), localApiPlugin()],
  base,
  build: {
    outDir,
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
});
