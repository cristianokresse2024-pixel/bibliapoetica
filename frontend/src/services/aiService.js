// Serviço de IA do frontend — fala com o backend seguro (Serverless ou Cloud Function `askIAViva`).
// NUNCA contém chaves de API. A chave fica protegida no backend.
import { isFirebaseConfigured } from '../config/firebase.js';
import { getFunctionsClient } from './firebaseClient.js';

const PROD_API_URL = 'https://viva-inteligente.vercel.app/api/askIAViva';

export function aiReady() {
  return true;
}

/**
 * Envia uma pergunta para a IA Viva.
 * @param {string} question
 * @param {Array<{role:'user'|'assistant', content:string}>} history
 * @returns {Promise<{text:string, remaining?:number, premium?:boolean}>}
 */
export async function askIAViva(question, history = []) {
  const apiUrl =
    import.meta.env.VITE_AI_API_URL ||
    (typeof window !== 'undefined' && window.location.hostname.includes('localhost')
      ? '/api/askIAViva'
      : PROD_API_URL);

  if (apiUrl) {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, history }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Erro ao processar resposta da IA Viva.');
    }

    return await res.json();
  }

  if (!isFirebaseConfigured()) {
    throw new Error('NOT_CONFIGURED');
  }
  const functions = await getFunctionsClient();
  const { httpsCallable } = await import('firebase/functions');
  const fn = httpsCallable(functions, 'askIAViva');
  const res = await fn({ question, history });
  return res.data;
}
