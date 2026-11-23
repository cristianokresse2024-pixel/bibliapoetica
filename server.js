import express from 'express';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';

import askIAViva from './api/askIAViva.js';
import login from './api/auth/login.js';
import register from './api/auth/register.js';
import createSubscription from './api/subscriptions/create.js';
import progress from './api/user/progress.js';
import mercadoPagoWebhook from './api/webhooks/mercadopago.js';

const app = express();
const dist = fileURLToPath(new URL('./dist/', import.meta.url));
const onRender = process.env.RENDER === 'true';
const cookieName = 'viva_session';
const sessionLifetime = 7 * 24 * 60 * 60 * 1000;
const cookieOptions = { httpOnly: true, secure: onRender, sameSite: 'lax' };
const sessionSecret = process.env.SESSION_SECRET || randomBytes(32);

function signSession(payload) {
  return createHmac('sha256', sessionSecret).update(payload).digest('base64url');
}

function issueSession(handler) {
  return (req, res) => {
    const sendJson = res.json.bind(res);
    res.json = (data) => {
      if (data.ok && data.user?.id) {
        const identity = { id: data.user.id, expiresAt: Date.now() + sessionLifetime };
        const payload = Buffer.from(JSON.stringify(identity)).toString('base64url');
        res.cookie(cookieName, `${payload}.${signSession(payload)}`, { ...cookieOptions, maxAge: sessionLifetime });
      }
      return sendJson(data);
    };
    return handler(req, res);
  };
}

function sessionUserId(req) {
  const sessionCookie = req.headers.cookie?.match(/(?:^|;\s*)viva_session=([\w-]+)\.([\w-]+)(?:;|$)/);
  if (!sessionCookie) return null;
  const [, payload, signature] = sessionCookie;
  const expected = Buffer.from(signSession(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  const { id, expiresAt } = JSON.parse(Buffer.from(payload, 'base64url').toString());
  return expiresAt > Date.now() ? id : null;
}

function requireAccount(req, res, next) {
  const requestedId = req.method === 'GET' ? req.query.userId : req.body?.userId;
  const authenticatedId = sessionUserId(req);
  if (!authenticatedId || requestedId !== authenticatedId) {
    return res.status(401).json({ error: 'Entre na sua conta para continuar.' });
  }
  next();
}

app.disable('x-powered-by');
app.get('/healthz', (_req, res) => res.sendStatus(200));

const api = express.Router({ caseSensitive: true });
api.use(express.json());
if (onRender && (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.SESSION_SECRET)) {
  api.use(['/auth', '/subscriptions', '/user', '/webhooks'], (_req, res) => {
    res.status(503).json({ error: 'Serviço temporariamente indisponível.' });
  });
}
api.all('/admin/users', (_req, res) => res.status(503).json({ error: 'Diretório administrativo temporariamente indisponível.' }));
api.all('/askIAViva', askIAViva);
api.all('/auth/login', issueSession(login));
api.all('/auth/register', issueSession(register));
api.post('/auth/logout', (_req, res) => res.clearCookie(cookieName, cookieOptions).sendStatus(204));
api.post('/subscriptions/create', requireAccount, createSubscription);
api.get('/user/progress', requireAccount, progress);
api.post('/user/progress', requireAccount, progress);
api.all('/webhooks/mercadopago', mercadoPagoWebhook);
api.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));
api.use((error, _req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.status === 400 || error.status === 413 ? error.status : 500;
  res.status(status).json({ error: 'Não foi possível processar a solicitação.' });
});
app.use('/api', api);

app.use(express.static(dist));
app.get(/^(?!\/(?:assets|audio|bibles|covers|knowledge)\/).*/, (_req, res) => {
  res.sendFile('index.html', { root: dist });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, '0.0.0.0', () => console.log(`Viva Inteligente ouvindo na porta ${port}`));
