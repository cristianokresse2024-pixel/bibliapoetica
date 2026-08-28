// Serviço de IA do frontend — fala com a Cloud Function `askIAViva`.
// NUNCA contém chaves de API. A chamada é autenticada e a chave fica no backend.
import { isFirebaseConfigured } from '../config/firebase.js';
import { getFunctionsClient } from './firebaseClient.js';

export function aiReady() {
  return isFirebaseConfigured();
}

/**
 * Envia uma pergunta para a IA Viva.
 * @param {string} question
 * @param {Array<{role:'user'|'assistant', content:string}>} history
 * @returns {Promise<{text:string, remaining?:number, premium?:boolean}>}
 */
export async function askIAViva(question, history = []) {
  if (!isFirebaseConfigured()) {
    throw new Error('NOT_CONFIGURED');
  }
  const functions = await getFunctionsClient();
  const { httpsCallable } = await import('firebase/functions');
  const fn = httpsCallable(functions, 'askIAViva');
  const res = await fn({ question, history });
  return res.data;
}
