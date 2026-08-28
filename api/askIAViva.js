import { generateAnswer } from './lib/AIService.js';

// =============================================================================
// Endpoint serverless da IA Viva (Vercel) — chave do Groq protegida no backend.
// -----------------------------------------------------------------------------
// A IA fica aberta (sem login) por decisão de produto. Para NÃO deixar a cota do
// Groq exposta a abuso, aplicamos duas proteções em memória:
//   1) Rate limit por IP  (RL_PER_IP requisições por RL_WINDOW_MS)
//   2) Teto global diário  (DAILY_GLOBAL_LIMIT requisições/dia no total)
// Obs.: memória da função é efêmera/por instância — é uma barreira de bom-senso,
// não uma trava perfeita. Para limites rígidos por usuário, adicionar login +
// armazenamento (ex.: Vercel KV) numa fase futura.
// =============================================================================

const RL_WINDOW_MS = 60 * 1000;                 // janela de 1 minuto
const RL_PER_IP = Number(process.env.RL_PER_IP || 8);        // por IP / minuto
const DAILY_GLOBAL_LIMIT = Number(process.env.DAILY_GLOBAL_LIMIT || 2000); // total/dia

// Estado em memória (por instância da função)
const ipHits = new Map();          // ip -> { count, resetAt }
let globalDay = todayKey();
let globalCount = 0;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length) return xff.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

// Origens permitidas (evita que outros sites usem seu endpoint via navegador).
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ||
  'https://viva-inteligente.vercel.app')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export default async function handler(req, res) {
  const origin = req.headers.origin;
  // CORS: só liberar origens conhecidas (permite chamadas do próprio app).
  const allowOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido. Use POST.' });
    return;
  }

  // ---- Proteção 1: teto global diário ----
  const day = todayKey();
  if (day !== globalDay) { globalDay = day; globalCount = 0; }
  if (globalCount >= DAILY_GLOBAL_LIMIT) {
    res.status(429).json({ error: 'A IA Viva atingiu o limite de uso de hoje. Tente novamente amanhã. 🙏' });
    return;
  }

  // ---- Proteção 2: rate limit por IP ----
  const ip = getIp(req);
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RL_WINDOW_MS });
  } else {
    entry.count += 1;
    if (entry.count > RL_PER_IP) {
      const wait = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(wait));
      res.status(429).json({ error: `Muitas perguntas em pouco tempo. Aguarde ${wait}s e tente de novo.` });
      return;
    }
  }
  // limpeza ocasional do mapa para não crescer indefinidamente
  if (ipHits.size > 5000) {
    for (const [k, v] of ipHits) if (now > v.resetAt) ipHits.delete(k);
  }

  try {
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch {} }
    const { question, history } = body || {};

    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Pergunta obrigatória.' });
      return;
    }
    if (question.length > 2000) {
      res.status(400).json({ error: 'Pergunta muito longa (máximo 2000 caracteres).' });
      return;
    }

    const safeHistory = Array.isArray(history) ? history.slice(-8) : [];
    const answer = await generateAnswer({ question, history: safeHistory });

    globalCount += 1;
    res.status(200).json({
      text: answer.text,
      model: answer.model,
      provider: answer.provider,
    });
  } catch (error) {
    // Não expor detalhes internos ao público (só log no servidor).
    console.error('Erro na API IA Viva:', error);
    res.status(500).json({ error: 'A IA Viva está indisponível no momento. Tente novamente.' });
  }
}
