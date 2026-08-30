// =============================================================================
// ENDPOINT SERVERLESS — SINCRONIZAÇÃO DE PROGRESSO ESPIRITUAL (SUPABASE)
// -----------------------------------------------------------------------------
// Rota: GET & POST /api/user/progress
// =============================================================================

import {
  getUserProgress,
  saveUserProgress,
} from '../lib/SupabaseClient.js';

const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ||
  'https://vivainteligente.app.br,https://www.vivainteligente.app.br,https://viva-inteligente.vercel.app'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export default async function handler(req, res) {
  const origin = req.headers.origin;
  const allowOrigin =
    origin && (ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes('*'))
      ? origin
      : ALLOWED_ORIGINS[0] || '*';

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET: Retorna o progresso do usuário da nuvem
  if (req.method === 'GET') {
    try {
      const userId = req.query?.userId;
      if (!userId) {
        return res.status(400).json({ error: 'Parâmetro userId é obrigatório.' });
      }

      const progress = await getUserProgress(userId);
      return res.status(200).json({ ok: true, progress });
    } catch (err) {
      console.error('[API User Progress GET Error]:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // 2. POST: Salva o progresso do usuário na nuvem
  if (req.method === 'POST') {
    try {
      const { userId, progress } = req.body || {};
      if (!userId || !progress) {
        return res.status(400).json({ error: 'userId e progress são obrigatórios.' });
      }

      const saved = await saveUserProgress(userId, progress);
      return res.status(200).json({ ok: true, saved: true, data: saved });
    } catch (err) {
      console.error('[API User Progress POST Error]:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Método não permitido.' });
}
