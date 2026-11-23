import express from 'express';
import { fileURLToPath } from 'node:url';

import adminUsers from './api/admin/users.js';
import askIAViva from './api/askIAViva.js';
import login from './api/auth/login.js';
import register from './api/auth/register.js';
import createSubscription from './api/subscriptions/create.js';
import progress from './api/user/progress.js';
import mercadoPagoWebhook from './api/webhooks/mercadopago.js';

const app = express();
const dist = fileURLToPath(new URL('./dist/', import.meta.url));

app.disable('x-powered-by');
app.get('/healthz', (_req, res) => res.sendStatus(200));

const api = express.Router({ caseSensitive: true });
api.use(express.json());
api.all('/admin/users', adminUsers);
api.all('/askIAViva', askIAViva);
api.all('/auth/login', login);
api.all('/auth/register', register);
api.all('/subscriptions/create', createSubscription);
api.all('/user/progress', progress);
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
