// =============================================================================
// Cloud Functions — Viva Inteligente
// -----------------------------------------------------------------------------
// Endpoint seguro da IA Viva. A chave do provedor (Groq) fica em SECRET no
// servidor e NUNCA é exposta ao frontend. Aplica limites de uso por dia e
// registra o consumo (tokens/custo) no Firestore.
// =============================================================================

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret, defineInt, defineString } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { generateAnswer } from './ai/AIService.js';

initializeApp();
const db = getFirestore();

// ---- Configuração (secrets e parâmetros ajustáveis sem editar código) ----
const GROQ_API_KEY = defineSecret('GROQ_API_KEY');
const AI_PROVIDER = defineString('AI_PROVIDER', { default: 'groq' });
const GROQ_MODEL = defineString('GROQ_MODEL', { default: 'openai/gpt-oss-120b' });
const FREE_DAILY_AI_LIMIT = defineInt('FREE_DAILY_AI_LIMIT', { default: 10 });
const PREMIUM_DAILY_AI_LIMIT = defineInt('PREMIUM_DAILY_AI_LIMIT', { default: 200 });

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export const askIAViva = onCall(
  {
    region: 'southamerica-east1',
    secrets: [GROQ_API_KEY],
    cors: true,
    // O frontend estático não impõe App Check; ative depois para reforçar.
  },
  async (request) => {
    // 1) Autenticação obrigatória (contas Firebase)
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError('unauthenticated', 'Faça login para usar a IA Viva.');
    }

    // 2) Validação de entrada
    const question = (request.data?.question || '').toString().trim();
    const history = Array.isArray(request.data?.history) ? request.data.history : [];
    if (!question) {
      throw new HttpsError('invalid-argument', 'Envie uma pergunta.');
    }
    if (question.length > 2000) {
      throw new HttpsError('invalid-argument', 'Pergunta muito longa (máx. 2000 caracteres).');
    }

    // 3) Descobrir se é Premium e aplicar limite diário
    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();
    const isPremium = userSnap.exists && userSnap.data()?.premium?.active === true;
    const limit = isPremium ? PREMIUM_DAILY_AI_LIMIT.value() : FREE_DAILY_AI_LIMIT.value();

    const day = todayKey();
    const usageRef = db.collection('users').doc(uid).collection('aiUsage').doc(day);
    const usageSnap = await usageRef.get();
    const used = usageSnap.exists ? usageSnap.data().count || 0 : 0;
    if (used >= limit) {
      throw new HttpsError(
        'resource-exhausted',
        isPremium
          ? 'Você atingiu o limite diário de uso da IA.'
          : 'Limite diário gratuito atingido. Assine o Premium para continuar.'
      );
    }

    // 4) Configurar provedor via env para o AIService
    process.env.AI_PROVIDER = AI_PROVIDER.value();
    process.env.GROQ_MODEL = GROQ_MODEL.value();
    process.env.GROQ_API_KEY = GROQ_API_KEY.value();

    // 5) Chamar a IA (RAG entra aqui em fase futura, via `context`)
    let answer;
    try {
      answer = await generateAnswer({ question, history });
    } catch (err) {
      console.error('Erro IA Viva:', err);
      throw new HttpsError('internal', 'A IA Viva está indisponível no momento. Tente novamente.');
    }

    // 6) Registrar consumo (contador do dia + log detalhado para custos)
    await usageRef.set(
      { count: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );
    await db.collection('aiLogs').add({
      uid,
      day,
      provider: answer.provider,
      model: answer.model,
      inputTokens: answer.inputTokens,
      outputTokens: answer.outputTokens,
      latencyMs: answer.latencyMs,
      questionLength: question.length,
      answerLength: answer.text.length,
      createdAt: FieldValue.serverTimestamp(),
    });

    return {
      text: answer.text,
      model: answer.model,
      remaining: Math.max(0, limit - used - 1),
      premium: isPremium,
    };
  }
);
