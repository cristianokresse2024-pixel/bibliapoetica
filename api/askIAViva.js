import { generateAnswer } from '../functions/ai/AIService.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
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

  try {
    const { question, history } = req.body || {};
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
