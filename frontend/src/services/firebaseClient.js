// Inicialização preguiçosa (lazy) do Firebase no cliente.
// Só carrega os SDKs quando realmente for usado, e apenas se estiver configurado.
import { firebaseConfig, isFirebaseConfigured } from '../config/firebase.js';

let _app = null;

async function getApp() {
  if (!isFirebaseConfigured()) return null;
  if (_app) return _app;
  const { initializeApp, getApps } = await import('firebase/app');
  _app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  return _app;
}

export async function getAuthClient() {
  const app = await getApp();
  if (!app) return null;
  const { getAuth } = await import('firebase/auth');
  return getAuth(app);
}

export async function getFunctionsClient() {
  const app = await getApp();
  if (!app) return null;
  const { getFunctions } = await import('firebase/functions');
  const { FUNCTIONS_REGION } = await import('../config/firebase.js');
  return getFunctions(app, FUNCTIONS_REGION);
}
