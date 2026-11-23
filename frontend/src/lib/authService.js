import { hydrateProgressFromCloud } from './progress.js';

const STORAGE_SESSION_KEY = 'viva_session_v1';
const REFERRED_BY_KEY = 'viva_referred_by_code';

export function getCurrentSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_SESSION_KEY));
  } catch {
    return null;
  }
}

export function saveSession(user) {
  try {
    if (user) localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_SESSION_KEY);
  } catch (error) {
    console.error('Erro ao salvar sessão:', error);
  }
}

async function authenticate(path, credentials) {
  let response;
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  } catch {
    throw new Error('Não foi possível conectar ao Viva Inteligente. Tente novamente.');
  }

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.user) {
    throw new Error(data?.error || 'Não foi possível autenticar sua conta. Tente novamente.');
  }

  saveSession(data.user);
  hydrateProgressFromCloud(data.progress);
  return data.user;
}

export function registerUser({ name, email, password }) {
  if (!name || name.trim().length < 2) {
    throw new Error('Por favor, informe seu nome completo.');
  }
  if (!email || !email.includes('@') || !email.includes('.')) {
    throw new Error('Por favor, informe um e-mail válido.');
  }
  if (!password || password.length < 6) {
    throw new Error('A senha deve ter no mínimo 6 caracteres.');
  }

  return authenticate('/api/auth/register', {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    referralCode: localStorage.getItem(REFERRED_BY_KEY) || null,
  });
}

export function loginUser({ email, password }) {
  if (!email || !email.includes('@')) {
    throw new Error('Por favor, informe um e-mail válido.');
  }
  if (!password) {
    throw new Error('Por favor, informe sua senha.');
  }

  return authenticate('/api/auth/login', { email: email.trim().toLowerCase(), password });
}

export function logoutUser() {
  saveSession(null);
  fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
}
