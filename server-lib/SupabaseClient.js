// =============================================================================
// SUPABASE CLIENT & REST HELPER — BACKEND SERVERLESS OFICIAL
// -----------------------------------------------------------------------------
// Fornece conexão resiliente via PostgREST para autenticação, progressão e admin.
// Inclui fallback em memória para desenvolvimento e testes automatizados.
// =============================================================================

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

// Armazenamento em memória para ambiente local / offline de testes
const memStore = {
  user_profiles: new Map(),
  user_progress: new Map(),
  ambassador_profiles: new Map(),
  referrals: new Map(),
};

/**
 * Consulta genérica ao PostgREST do Supabase (com fallback local transparente)
 */
export async function supabaseQuery(path, options = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return handleLocalFallback(path, options);
  }

  const cleanBase = SUPABASE_URL.replace(/\/$/, '');
  const url = `${cleanBase}/rest/v1/${path}`;
  const isPatch = options.method === 'PATCH';

  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: options.prefer || (isPatch ? 'return=representation' : 'return=representation'),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      return { data: null, error: `Supabase Error (${res.status}): ${errText}` };
    }

    if (res.status === 204) return { data: null, error: null };

    const data = await res.json().catch(() => null);
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

/**
 * Fallback em memória para testes e desenvolvimento sem credenciais configuradas
 */
function handleLocalFallback(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const [tableName, queryString] = path.split('?');
  const store = memStore[tableName] || new Map();
  const body = options.body;

  if (method === 'POST') {
    if (body) {
      const id = body.id || body.user_id || `rec_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const existing = store.get(id) || {};
      const record = { ...existing, ...body, id };
      store.set(id, record);
      return { data: [record], error: null };
    }
  }

  if (method === 'PATCH') {
    const idParam = queryString?.match(/(?:id|user_id)=eq\.([^&]+)/)?.[1];
    const id = idParam ? decodeURIComponent(idParam) : null;
    if (id && store.has(id)) {
      const existing = store.get(id);
      const updated = { ...existing, ...body, updated_at: new Date().toISOString() };
      store.set(id, updated);
      return { data: [updated], error: null };
    }
    return { data: [], error: null };
  }

  if (method === 'GET') {
    let list = Array.from(store.values());

    if (queryString) {
      const emailParam = queryString.match(/email=eq\.([^&]+)/)?.[1];
      if (emailParam) {
        const email = decodeURIComponent(emailParam).toLowerCase();
        list = list.filter((item) => (item.email || item.user_email || '').toLowerCase() === email);
      }

      const idParam = queryString.match(/(?:id|user_id)=eq\.([^&]+)/)?.[1];
      if (idParam) {
        const id = decodeURIComponent(idParam);
        list = list.filter((item) => item.id === id || item.user_id === id);
      }

      const refCodeParam = queryString.match(/referral_code=eq\.([^&]+)/)?.[1];
      if (refCodeParam) {
        const code = decodeURIComponent(refCodeParam);
        list = list.filter((item) => item.referral_code === code);
      }

      const refUserParam = queryString.match(/referrer_user_id=eq\.([^&]+)/)?.[1];
      if (refUserParam) {
        const refId = decodeURIComponent(refUserParam);
        list = list.filter((item) => item.referrer_user_id === refId);
      }
    }

    return { data: list, error: null };
  }

  return { data: [], error: null };
}

/**
 * Busca usuário por e-mail
 */
export async function getUserByEmail(email) {
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();
  const { data, error } = await supabaseQuery(`user_profiles?email=eq.${encodeURIComponent(cleanEmail)}&select=*`);
  if (error || !data || data.length === 0) return null;
  return data[0];
}

/**
 * Busca usuário por ID
 */
export async function getUserById(id) {
  if (!id) return null;
  const { data, error } = await supabaseQuery(`user_profiles?id=eq.${encodeURIComponent(id)}&select=*`);
  if (error || !data || data.length === 0) return null;
  return data[0];
}

/**
 * Cria ou atualiza perfil de usuário (upsert)
 */
export async function upsertUserProfile(user) {
  if (!user || !user.id || !user.email) {
    throw new Error('user.id e user.email são obrigatórios.');
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email.toLowerCase().trim(),
    password_hash: user.password || user.password_hash || null,
    plan: user.plan || 'free',
    role: user.role || 'user',
    referral_code: user.referral_code || user.referralCode || null,
    referred_by: user.referred_by || user.referredBy || null,
    last_login_at: user.last_login_at || new Date().toISOString(),
    created_at: user.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseQuery('user_profiles', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=representation',
    body: payload,
  });

  if (error) {
    console.error('[SupabaseClient] Erro ao salvar perfil:', error);
    throw new Error(error);
  }

  return data?.[0] || payload;
}

/**
 * Busca todos os usuários com dados de progresso e embaixador (Exclusivo Dono)
 */
export async function getAllUsersWithStats() {
  const { data: users, error: usersErr } = await supabaseQuery('user_profiles?select=*&order=created_at.desc');
  if (usersErr) {
    console.error('[SupabaseClient] Erro ao listar usuários:', usersErr);
    return [];
  }

  const { data: progressList } = await supabaseQuery('user_progress?select=*');
  const { data: ambassadors } = await supabaseQuery('ambassador_profiles?select=*');

  const progressMap = new Map((progressList || []).map((p) => [p.user_id, p]));
  const ambassadorMap = new Map((ambassadors || []).map((a) => [a.user_id, a]));

  return (users || []).map((u) => {
    const prog = progressMap.get(u.id) || {};
    const amb = ambassadorMap.get(u.id) || {};

    const readChapters = prog.read_chapters || {};
    const readCount = Object.keys(readChapters).length || prog.read_count || 0;

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      plan: u.plan,
      role: u.role,
      referralCode: u.referral_code,
      referredBy: u.referred_by || 'Direto',
      createdAt: u.created_at,
      lastLoginAt: u.last_login_at,
      readCount,
      xp: prog.xp || 0,
      level: prog.level || 1,
      streak: prog.streak?.count || 0,
      activeReferralsCount: amb.active_referrals_count || 0,
      totalReferralsCount: amb.total_referrals_count || 0,
      isAmbassador: (amb.active_referrals_count || 0) >= 10,
    };
  });
}

/**
 * Busca o progresso do usuário no Supabase
 */
export async function getUserProgress(userId) {
  if (!userId) return null;
  const { data, error } = await supabaseQuery(`user_progress?user_id=eq.${encodeURIComponent(userId)}&select=*`);
  if (error || !data || data.length === 0) return null;
  return data[0];
}

/**
 * Salva o progresso espiritual do usuário no Supabase
 */
export async function saveUserProgress(userId, progressData) {
  if (!userId) return null;

  const payload = {
    user_id: userId,
    read_chapters: progressData.read || progressData.read_chapters || {},
    read_count: Object.keys(progressData.read || progressData.read_chapters || {}).length,
    streak: progressData.streak || { count: 0, last: null },
    xp: progressData.xp || 0,
    level: progressData.level?.level || progressData.level || 1,
    favorites: progressData.favorites || [],
    notes: progressData.notes || {},
    achievements: progressData.achievements || {},
    prayer_data: progressData.prayer || progressData.prayer_data || {},
    fast_data: progressData.fast || progressData.fast_data || {},
    gratitude_data: progressData.gratitude || progressData.gratitude_data || [],
    prayer_reminder: progressData.prayerReminder || progressData.prayer_reminder || {},
    last_read: progressData.lastRead || progressData.last_read || null,
    daily_goal: progressData.dailyGoal || 3,
    font_scale: progressData.fontScale || 1.0,
    bible_version: progressData.version || 'nvi',
    synced_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseQuery('user_progress', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=representation',
    body: payload,
  });

  if (error) {
    console.error('[SupabaseClient] Erro ao salvar progresso:', error);
    throw new Error(error);
  }

  return data?.[0] || payload;
}
