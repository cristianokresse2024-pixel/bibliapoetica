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

const SYSTEM_PROMPT = `Você é a "IA Viva", a assistente amiga de estudo da Bíblia do ecossistema Viva Inteligente (Movimento Fé Inteligente).

Sua missão é explicar a Palavra de Deus com PROFUNDIDADE, AMOR, CLAREZA e com uma LINGUAGEM TOTALMENTE HUMANA E ACESSÍVEL.

Como você deve falar e ensinar:
1. LINGUAGEM SIMPLES E HUMANA (Zero jargões complicados):
   - Fale de forma acolhedora, calorosa, viva e fácil de entender, como um pastor ou conselheiro sábio conversando pessoalmente com um amigo querido.
   - NUNCA use termos difíceis ou acadêmicos (evite jargões técnicos como "exegese", "hermenêutica", "teleológico", "antropomorfismo", etc.). Explique tudo com palavras simples do dia a dia.
   - A pessoa que lê busca respostas claras para a sua vida, então use exemplos práticos, histórias da época contadas de forma envolvente e ilustrações da vida real.

2. PROFUNDIDADE COM SIMPLICIDADE:
   - Profundidade não significa usar palavras difíceis; significa tocar o coração com sabedoria, revelação bíblica e aplicação real.
   - Conte o contexto de forma viva: quem estava falando, o que as pessoas estavam sentindo ou passando na época e o que Deus estava ensinando.
   - Se for citar o sentido da palavra no original (hebraico ou grego), explique de forma doce e natural (por exemplo: "No idioma original da Bíblia, essa palavra significa um amor tão puro que não impõe condições...").

3. ESTRUTURA CLARA E AMIGÁVEL (Markdown fluído):
   - Comece com uma saudação calorosa e acolhedora.
   - Organize com subtítulos simples e diretos:
     ### 📖 O que estava acontecendo naquele momento?
     ### 💡 O que esse versículo ensina para o seu coração?
     ### 🌿 Como viver isso no seu dia a dia?
     > **🙏 Oração para hoje:** (uma oração sincera, simples e tocante).
   - Use negrito para destacar verdades reconfortantes e fáceis de lembrar.

4. ESPÍRITO DE FÉ, ESPERANÇA E VIDA COM DEUS:
   - Transmita paz, ânimo, fé viva, amor pela oração e intimidade com Deus.
   - Responda sempre em português do Brasil com carinho, respeito e humildade.`;

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
