// =============================================================================
// ENDPOINT SERVERLESS — LOGIN CENTRALIZADO & RECUPERAÇÃO DE PROGRESSO
// -----------------------------------------------------------------------------
// Rota: POST /api/auth/login
// =============================================================================

import {
  getUserByEmail,
  getUserProgress,
  supabaseQuery,
} from '../lib/SupabaseClient.js';

const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ||
  'https://vivainteligente.app.br,https://www.vivainteligente.app.br,https://viva-inteligente.vercel.app'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export default async function handler(req, res) {
  const origin = req.headers.origin;
  const allowOrigin =
    origin && (ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes('*'))
      ? origin
      : ALLOWED_ORIGINS[0] || '*';

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Utilize POST.' });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Por favor, informe um e-mail válido.' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Por favor, informe sua senha.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await getUserByEmail(cleanEmail);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado. Verifique seu e-mail ou crie uma conta.' });
    }

    if (user.password_hash && user.password_hash !== password) {
      return res.status(401).json({ error: 'Senha incorreta. Tente novamente.' });
    }

    const isVip =
      cleanEmail === 'cristianokresse2024@gmail.com' ||
      cleanEmail === 'jheisyellen91@gmail.com';

    let currentPlan = user.plan || (isVip ? 'vip_lifetime' : 'free');
    let currentRole = isVip ? 'admin' : user.role || 'user';

    if (isVip && user.plan !== 'vip_lifetime') {
      currentPlan = 'vip_lifetime';
      currentRole = 'admin';
    }

    // Atualiza último login no Supabase
    await supabaseQuery(`user_profiles?id=eq.${encodeURIComponent(user.id)}`, {
      method: 'PATCH',
      body: {
        last_login_at: new Date().toISOString(),
        plan: currentPlan,
        role: currentRole,
      },
    });

    // 2. Busca progresso espiritual salvo na nuvem
    const cloudProgress = await getUserProgress(user.id);

    return res.status(200).json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: currentPlan,
        role: currentRole,
        referralCode: user.referral_code,
        referredBy: user.referred_by,
        createdAt: user.created_at,
        lastLoginAt: new Date().toISOString(),
      },
      progress: cloudProgress ? {
        read: cloudProgress.read_chapters || {},
        streak: cloudProgress.streak || { count: 0, last: null },
        xp: cloudProgress.xp || 0,
        level: cloudProgress.level || 1,
        favorites: cloudProgress.favorites || [],
        notes: cloudProgress.notes || {},
        achievements: cloudProgress.achievements || {},
        prayer: cloudProgress.prayer_data || { totalSeconds: 0, sessions: 0, history: [] },
        fast: cloudProgress.fast_data || { completed: 0, totalHours: 0, history: [] },
        gratitude: cloudProgress.gratitude_data || [],
        prayerReminder: cloudProgress.prayer_reminder || { enabled: false, time: '07:00', lastNotified: null },
        lastRead: cloudProgress.last_read || null,
        dailyGoal: cloudProgress.daily_goal || 3,
        fontScale: cloudProgress.font_scale || 1.0,
        version: cloudProgress.bible_version || 'nvi',
      } : null,
    });
  } catch (error) {
    console.error('[API Login Error]:', error);
    return res.status(500).json({ error: error.message || 'Erro interno ao realizar login.' });
  }
}
