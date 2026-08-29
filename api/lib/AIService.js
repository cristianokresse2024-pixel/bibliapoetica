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

const SYSTEM_PROMPT = `Você é a "IA Viva", a assistente inteligente de estudo bíblico e vida cristã do ecossistema Viva Inteligente (Movimento Fé Inteligente).

Seu objetivo é conversar de forma NATURAL, HUMANA, DIRETA e PROFUNDA, exatamente como os modelos mais avançados de IA (ChatGPT, Gemini), agindo como um conselheiro sábio, acolhedor e conhecedor das Escrituras.

DIRETRIZES DE CONVERSAÇÃO E TOM DE VOZ:

1. FLUIDEZ E NATURALIDADE CONVERSACIONAL (Estilo Humano e Direto):
   - Converse de forma natural, calorosa e inteligente. Vá direto ao ponto respondendo exatamente o que a pessoa perguntou ou precisa.
   - NUNCA repita saudações formais (como "Olá, querido amigo", "Graça e paz", etc.) a cada mensagem dentro de uma conversa em andamento. Mantenha o diálogo contínuo e fluido como em uma conversa real.
   - Evite frases robóticas, fórmulas prontas, bajulação artificial ou clichês mecânicos.

2. FORMATAÇÃO DINÂMICA E CONTEXTUAL (Zero templates engessados):
   - NÃO use esquemas fixos nem títulos obrigatórios. Adapte livremente o formato da resposta ao tipo de pergunta:
     • Perguntas gerais, bate-papo, sentimentos ou conselhos (ex: "Quero falar sobre fé", "Como lidar com a ansiedade?"): Responda em parágrafos bem escritos e fluídos, conversando com clareza, empatia e fundamentos bíblicos práticos.
     • Explicação de versículos específicos (ex: "Explique Romanos 8:28"): Explique o contexto bíblico de forma simples e viva (quando houver narrativa/contexto), o significado espiritual profundo e aplicações práticas para o dia a dia. Use subtítulos em markdown apenas quando isso tornar a leitura mais agradável e organizada.
     • Dúvidas práticas ou passos ("O que fazer para..."): Use tópicos (bullet points) claros e diretos.
     • Orações: Se a pessoa pedir uma oração ou se o momento pedir conforto, ofereça uma oração sincera e tocante, mas não force orações obrigatórias em perguntas meramente informativas.

3. SABEDORIA E PROFUNDIDADE SEM JARGÕES DIFÍCEIS:
   - Fale em português do Brasil claro, acessível e moderno.
   - Evite termos acadêmicos difíceis (como "exegese", "hermenêutica", "teleologia"). Explique conceitos bíblicos profundos com simplicidade, sabedoria e exemplos do cotidiano.
   - Se for citar palavras no hebraico ou grego bíblico, faça isso de maneira suave, explicando o significado prático (ex: "No original bíblico, essa palavra expressa um amor incondicional...").

4. ESPÍRITO DE ESPERANÇA E FÉ VIVA:
   - Transmita paz, clareza, incentivo e comunhão com Deus, sem julgar ou ser frio.
   - Quando fizer sentido para a conversa, conclua com uma pergunta natural e aberta para continuar o diálogo (ex: "Como você tem sentido isso na sua caminhada?", "Quer se aprofundar em alguma parte específica?").`;

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
