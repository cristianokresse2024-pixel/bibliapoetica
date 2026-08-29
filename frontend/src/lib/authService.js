import { isVipEmail } from '../config/vipList.js';

const STORAGE_USERS_KEY = 'viva_users_v1';
const STORAGE_SESSION_KEY = 'viva_session_v1';

function getStoredUsers() {
  try {
    const data = localStorage.getItem(STORAGE_USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Erro ao salvar usuários:', e);
  }
}

export function getCurrentSession() {
  try {
    const session = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!session) return null;
    const user = JSON.parse(session);
    
    // Auto-atualização de VIP se o e-mail estiver na lista VIP
    if (isVipEmail(user.email) && user.plan !== 'vip_lifetime') {
      user.plan = 'vip_lifetime';
      user.role = 'admin';
      saveSession(user);
    }
    return user;
  } catch {
    return null;
  }
}

export function saveSession(user) {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } else {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Erro ao salvar sessão:', e);
  }
}

/**
 * Cadastrar novo usuário
 */
export async function registerUser({ name, email, password }) {
  if (!name || name.trim().length < 2) {
    throw new Error('Por favor, informe seu nome completo.');
  }
  if (!email || !email.includes('@') || !email.includes('.')) {
    throw new Error('Por favor, informe um e-mail válido.');
  }
  if (!password || password.length < 6) {
    throw new Error('A senha deve ter no mínimo 6 caracteres.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const users = getStoredUsers();

  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error('Este e-mail já está cadastrado. Faça login ou use outro e-mail.');
  }

  const isVip = isVipEmail(cleanEmail);
  const newUser = {
    id: 'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    name: name.trim(),
    email: cleanEmail,
    password: password, // Em produção com Supabase/backend é enviado via SSL com hash bcrypt
    plan: isVip ? 'vip_lifetime' : 'free',
    role: isVip ? 'admin' : 'user',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  saveSession(newUser);

  return newUser;
}

/**
 * Realizar login
 */
export async function loginUser({ email, password }) {
  if (!email || !email.includes('@')) {
    throw new Error('Por favor, informe um e-mail válido.');
  }
  if (!password) {
    throw new Error('Por favor, informe sua senha.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const users = getStoredUsers();

  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    throw new Error('Usuário não encontrado. Verifique seu e-mail ou crie uma conta.');
  }

  if (user.password !== password) {
    throw new Error('Senha incorreta. Tente novamente.');
  }

  // Verifica se o e-mail virou VIP recentemente
  if (isVipEmail(cleanEmail)) {
    user.plan = 'vip_lifetime';
    user.role = 'admin';
  }

  user.lastLoginAt = new Date().toISOString();
  saveUsers(users);
  saveSession(user);

  return user;
}

/**
 * Logout
 */
export function logoutUser() {
  saveSession(null);
}
