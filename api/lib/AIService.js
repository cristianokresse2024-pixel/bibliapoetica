// =============================================================================
// AIService — camada de IA agnóstica de provedor.
// -----------------------------------------------------------------------------
// A aplicação NUNCA fala direto com o provedor: fala com o AIService. Assim o
// modelo/provedor pode ser trocado (Groq, Gemini, etc.) sem reescrever o app.
//
// Provedor inicial: GROQ. Configure por variáveis de ambiente (Vercel/.env):
//   AI_PROVIDER   (default: "groq")
//   GROQ_API_KEY  (SEGREDO — só no backend, nunca no código nem no frontend)
//   GROQ_MODEL    (default: "openai/gpt-oss-120b")
// =============================================================================

const SYSTEM_PROMPT = `Você é a "IA Viva", assistente de estudo bíblico do ecossistema cristão Viva Inteligente (Movimento Fé Inteligente).

Como você responde:
- De forma clara, respeitosa, didática, cristã e equilibrada.
- Sem arrogância. Com humildade e acolhimento.
- NUNCA invente referências bíblicas, versículos ou citações. Se não tiver certeza, diga que não tem certeza.
- Distinga claramente o que é o texto bíblico do que é interpretação. Não afirme como certeza absoluta aquilo que é interpretação teológica; quando houver visões diferentes entre cristãos, reconheça isso com respeito.
- Sempre que possível, apresente as referências bíblicas usadas (livro, capítulo e versículo).
- Incentive a pessoa a ler e estudar a própria Bíblia, a orar e a buscar sua comunidade/igreja e liderança espiritual.
- Você é uma ferramenta de APOIO ao estudo. Você NÃO substitui a Bíblia, a oração, a comunhão com Deus, a igreja ou a liderança espiritual.
- Responda em português do Brasil.
- Seja conciso quando a pergunta for simples; aprofunde quando for pedido um estudo.

Quando o usuário pedir um estudo bíblico, organize em: tema, texto-base (referências), contexto, principais ensinos, aplicação prática e uma oração breve.`;

// ---- Adaptador Groq (API compatível com OpenAI Chat Completions) ----
async function callGroq({ apiKey, model, messages, temperature, maxTokens }) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: temperature ?? 0.5,
      max_tokens: maxTokens ?? 1024,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Groq API ${res.status}: ${detail.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim() || '';
  const usage = data?.usage || {};
  return {
    text,
    model,
    inputTokens: usage.prompt_tokens ?? null,
    outputTokens: usage.completion_tokens ?? null,
  };
}

/**
 * Gera uma resposta da IA Viva.
 * @param {Object} opts
 * @param {string} opts.question   Pergunta do usuário.
 * @param {Array}  [opts.history]  Histórico [{role:'user'|'assistant', content}] (opcional).
 * @param {string} [opts.context]  Contexto recuperado da base (RAG) (opcional).
 * @returns {Promise<{text, model, inputTokens, outputTokens, latencyMs, provider}>}
 */
export async function generateAnswer({ question, history = [], context = '' }) {
  const provider = process.env.AI_PROVIDER || 'groq';
  const started = Date.now();

  const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

  if (context) {
    messages.push({
      role: 'system',
      content:
        'Use PRIORITARIAMENTE o conteúdo abaixo (materiais do Viva Inteligente) para responder. ' +
        'Se ele não for suficiente, deixe claro e responda com cautela, sem inventar. ' +
        'Quando usar esse conteúdo, indique a origem: "Fonte: material do Viva Inteligente".\n\n' +
        context,
    });
  }

  for (const h of history.slice(-8)) {
    if (h && (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string') {
      messages.push({ role: h.role, content: h.content.slice(0, 4000) });
    }
  }
  messages.push({ role: 'user', content: String(question).slice(0, 4000) });

  let result;
  if (provider === 'groq') {
    result = await callGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
      messages,
    });
  } else {
    throw new Error(`Provedor de IA não suportado: ${provider}`);
  }

  return { ...result, provider, latencyMs: Date.now() - started };
}

export { SYSTEM_PROMPT };
