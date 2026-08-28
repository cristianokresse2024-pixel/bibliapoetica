import { generateAnswer } from '../functions/ai/AIService.js';

// In-memory rate limiting counters (per serverless instance)
const ipRequestHistory = new Map();
let dailyGlobalCount = 0;
let lastResetDay = new Date().getUTCDate();

function checkRateLimits(req) {
  const now = Date.now();
  const currentDay = new Date().getUTCDate();

  // Reset daily global count on new UTC day
  if (currentDay !== lastResetDay) {
    dailyGlobalCount = 0;
    lastResetDay = currentDay;
  }

  // 1. Global Daily Limit
  const maxGlobal = parseInt(process.env.DAILY_GLOBAL_LIMIT || '2000', 10);
  if (dailyGlobalCount >= maxGlobal) {
    return { limited: true, reason: 'Limite diário global atingido. Tente novamente mais tarde.' };
  }

  // 2. IP Rate Limit (Sliding 60s window)
  const maxPerIp = parseInt(process.env.RL_PER_IP || '8', 10);
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  const windowMs = 60 * 1000; // 1 minuto
  const history = ipRequestHistory.get(ip) || [];
  const recentHistory = history.filter((timestamp) => now - timestamp < windowMs);

  if (recentHistory.length >= maxPerIp) {
    return { limited: true, reason: 'Você atingiu o limite de requisições por minuto. Aguarde um instante.' };
  }

  recentHistory.push(now);
  ipRequestHistory.set(ip, recentHistory);
  dailyGlobalCount++;

  return { limited: false };
}

export default async function handler(req, res) {
  // CORS & Allowed Origins
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;
  const requestOrigin = req.headers.origin;

  let allowOrigin = '*';
  if (allowedOriginsEnv) {
    const allowedList = allowedOriginsEnv.split(',').map((o) => o.trim());
    if (requestOrigin && (allowedList.includes(requestOrigin) || allowedList.includes('*'))) {
      allowOrigin = requestOrigin;
    } else if (allowedList.length === 1 && allowedList[0] !== '*') {
      allowOrigin = allowedList[0];
    }
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido. Use POST.' });
    return;
  }

  // Rate Limiting Check
  const rateLimitResult = checkRateLimits(req);
  if (rateLimitResult.limited) {
    res.status(429).json({ error: rateLimitResult.reason });
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {}
    }
    const { question, history } = body || {};
    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Pergunta obrigatória.' });
      return;
    }

    if (question.length > 2000) {
      res.status(400).json({ error: 'Pergunta muito longa (máximo 2000 caracteres).' });
      return;
    }

    const answer = await generateAnswer({ question, history: history || [] });

    res.status(200).json({
      text: answer.text,
      model: answer.model,
      provider: answer.provider,
      latencyMs: answer.latencyMs,
    });
  } catch (error) {
    console.error('Erro na API IA Viva:', error);
    res.status(500).json({
      error: 'A IA Viva está indisponível no momento. Tente novamente.',
      details: error.message,
    });
  }
}
