import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

// Carrega variáveis do functions/.env e .env.local para o dev server local
for (const envPath of ['functions/.env', '.env.local', '.env']) {
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

function localApiPlugin() {
  return {
    name: 'local-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/askIAViva')) {
          if (req.method === 'OPTIONS') {
            res.writeHead(200, {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST,OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
            });
            return res.end();
          }
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', async () => {
              try {
                const data = JSON.parse(body || '{}');
                const { generateAnswer } = await import('./functions/ai/AIService.js');
                const answer = await generateAnswer({
                  question: data.question,
                  history: data.history || [],
                });
                res.writeHead(200, {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                });
                res.end(
                  JSON.stringify({
                    text: answer.text,
                    model: answer.model,
                    provider: answer.provider,
                    latencyMs: answer.latencyMs,
                  })
                );
              } catch (err) {
                res.writeHead(500, {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                });
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
        }
        next();
      });
    },
  };
}

// Código-fonte fica em frontend/. O build é gerado na RAIZ do repositório,
// que é onde o GitHub Pages desta branch está configurado para servir.
export default defineConfig({
  root: 'frontend',
  plugins: [react(), localApiPlugin()],
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
