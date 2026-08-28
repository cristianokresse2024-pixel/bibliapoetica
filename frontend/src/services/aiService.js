// Serviço de IA do frontend — fala com o endpoint serverless seguro /api/askIAViva.
// NUNCA contém chaves de API. A chave (GROQ_API_KEY) fica protegida no backend (Vercel).

// Em produção (Vercel) e em dev (middleware do Vite), o endpoint vive na MESMA
// origem, então usamos um caminho relativo. Dá para sobrescrever com VITE_AI_API_URL
// caso um dia o backend fique em outro domínio.
const API_URL = import.meta.env.VITE_AI_API_URL || '/api/askIAViva';

export function aiReady() {
  return true;
}

/**
 * Envia uma pergunta para a IA Viva.
 * @param {string} question
 * @param {Array<{role:'user'|'assistant', content:string}>} history
 * @returns {Promise<{text:string, model?:string, provider?:string}>}
 */
export async function askIAViva(question, history = []) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, history }),
  });

  if (!res.ok) {
    let errData = {};
    try { errData = await res.json(); } catch {}
    const err = new Error(errData.error || 'Erro ao processar resposta da IA Viva.');
    err.status = res.status;
    throw err;
  }

  return await res.json();
}
