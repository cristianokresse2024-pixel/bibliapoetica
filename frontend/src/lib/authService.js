import { isVipEmail } from '../config/vipList.js';
import { hydrateProgressFromCloud, triggerDebouncedCloudSync } from './progress.js';

const STORAGE_USERS_KEY = 'viva_users_v1';
const STORAGE_SESSION_KEY = 'viva_session_v1';
const REFERRED_BY_KEY = 'viva_referred_by_code';

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
 * Cadastrar novo usuário com sincronização instantânea no banco de dados Supabase
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
  const savedRefCode = localStorage.getItem(REFERRED_BY_KEY) || null;

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        email: cleanEmail,
        password,
        referralCode: savedRefCode,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Falha ao registrar usuário no servidor.');
    }

    const registeredUser = data.user;

    // Cache local e sessão
    saveSession(registeredUser);

    const users = getStoredUsers().filter((u) => u.email.toLowerCase() !== cleanEmail);
    users.push(registeredUser);
    saveUsers(users);

    // Dispara sincronização inicial do progresso para a nuvem
    setTimeout(() => {
      triggerDebouncedCloudSync();
    }, 500);

    return registeredUser;
  } catch (error) {
    // Se a API falhar por problemas de rede, faz o registro local seguro como fallback
    console.warn('[Register] API remota inacessível, utilizando fallback local:', error.message);

    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('Este e-mail já está cadastrado. Faça login para continuar.');
    }

    const isVip = isVipEmail(cleanEmail);
    const fallbackUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      name: name.trim(),
      email: cleanEmail,
      plan: isVip ? 'vip_lifetime' : 'free',
      role: isVip ? 'admin' : 'user',
      referredBy: savedRefCode,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    users.push(fallbackUser);
    saveUsers(users);
    saveSession(fallbackUser);

    return fallbackUser;
  }
}

/**
 * Realizar login com recuperação instantânea de dados e progresso do Supabase
 */
export async function loginUser({ email, password }) {
  if (!email || !email.includes('@')) {
    throw new Error('Por favor, informe um e-mail válido.');
  }
  if (!password) {
    throw new Error('Por favor, informe sua senha.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const isVip = isVipEmail(cleanEmail);

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (isVip) {
        return autoProvisionVipUser(cleanEmail, password);
      }
      throw new Error(data.error || 'Credenciais inválidas.');
    }

    const loggedUser = data.user;

    // 1. Salva a sessão ativa
    saveSession(loggedUser);

    // 2. Se houver progresso na nuvem, restaura imediatamente para o dispositivo
    if (data.progress) {
      hydrateProgressFromCloud(data.progress);
    }

    // 3. Atualiza cache local de usuários
    const users = getStoredUsers().filter((u) => u.email.toLowerCase() !== cleanEmail);
    users.push(loggedUser);
    saveUsers(users);

    return loggedUser;
  } catch (error) {
    // Fallback local se estiver offline ou primeiro login no dispositivo
    console.warn('[Login] Fallback de autenticação:', error.message);

    const users = getStoredUsers();
    let user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user && isVip) {
      return autoProvisionVipUser(cleanEmail, password);
    }

    if (!user) {
      throw new Error('Usuário não encontrado. Verifique seu e-mail ou crie uma conta.');
    }

    if (user.password && user.password !== password && !isVip) {
      throw new Error('Senha incorreta. Tente novamente.');
    }

    if (isVip) {
      user.plan = 'vip_lifetime';
      user.role = 'admin';
    }

    user.lastLoginAt = new Date().toISOString();
    saveUsers(users);
    saveSession(user);

    return user;
  }
}

function autoProvisionVipUser(email, password) {
  const users = getStoredUsers().filter((u) => u.email.toLowerCase() !== email.toLowerCase());
  const vipUser = {
    id: 'usr_vip_' + email.replace(/[^a-z0-9]/gi, '_'),
    name: email.includes('cristiano') ? 'Pr. Cristiano Kresse (Dono)' : 'VIP Vitalício',
    email: email.toLowerCase().trim(),
    password: password || '',
    plan: 'vip_lifetime',
    role: 'admin',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
  users.push(vipUser);
  saveUsers(users);
  saveSession(vipUser);
  return vipUser;
}

/**
 * Logout
 */
export function logoutUser() {
  saveSession(null);
}
