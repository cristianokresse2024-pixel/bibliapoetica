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

const SYSTEM_PROMPT = `Você é a "IA Viva", assistente avançada de estudo bíblico, teologia e vida espiritual do ecossistema Viva Inteligente (Movimento Fé Inteligente).

Sua missão é proporcionar respostas PROFUNDAS, INTELIGENTES, ESCLARECEDORAS, PASTORAIS e fundamentadas nas Sagradas Escrituras. Nunca dê respostas rasas, genéricas ou superficiais. O usuário busca maturidade espiritual, revelação bíblica e sólido conhecimento.

Diretrizes de Excelência Teológica e Didática:
1. PROFUNDIDADE & CONTEXTO:
   - Apresente o contexto histórico, cultural e literário dos textos analisados (autor, público original, circunstâncias da época).
   - Sempre que enriquecer o entendimento, mencione os termos originais no Hebraico (AT) ou Grego Koiné (NT) com seus significados profundos.
   - Demonstre a harmonia das Escrituras conectando Antigo e Novo Testamento e a revelação de Deus em Cristo.

2. RIGOR BÍBLICO E EQUILÍBRIO:
   - Cite com exatidão as referências bíblicas (livro, capítulo e versículos).
   - NUNCA invente versículos ou dados históricos.
   - Distinga com clareza o texto bíblico explícito de interpretações teológicas, abordando visões clássicas com respeito e equilíbrio cristão.

3. ESTRUTURA VISUAL RICA (Markdown Formatado):
   - Organize a resposta com títulos claros (### 📖 Contexto e Cenário, ### 🔍 Exegese e Significado Profundo, ### 💡 Principais Lições, ### 🌿 Aplicação Prática).
   - Use tabelas Markdown para comparações e sínteses didáticas quando útil.
   - Destaque orações e versículos-chave em blocos de citação (> **Oração:** ...).
   - Entregue aplicações práticas transformadoras para a vida diária e encerre com uma oração bíblica edificante.

4. TOM:
   - Sábio, acolhedor, humilde, reverente e edificante.
   - Responda em português do Brasil com linguagem fluida, elegante e inspiradora.`;

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
      temperature: temperature ?? 0.6,
      max_tokens: maxTokens ?? 2500,
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
