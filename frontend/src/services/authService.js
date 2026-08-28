// Autenticação (Firebase Auth). Degradação graciosa: se o Firebase não estiver
// configurado, tudo retorna "sem usuário" e o app segue funcionando.
import { isFirebaseConfigured } from '../config/firebase.js';
import { getAuthClient } from './firebaseClient.js';

export function authReady() {
  return isFirebaseConfigured();
}

export async function onAuth(callback) {
  const auth = await getAuthClient();
  if (!auth) { callback(null); return () => {}; }
  const { onAuthStateChanged } = await import('firebase/auth');
  return onAuthStateChanged(auth, callback);
}

export async function signInWithGoogle() {
  const auth = await getAuthClient();
  if (!auth) throw new Error('NOT_CONFIGURED');
  const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  return cred.user;
}

export async function signOutUser() {
  const auth = await getAuthClient();
  if (!auth) return;
  const { signOut } = await import('firebase/auth');
  await signOut(auth);
}
