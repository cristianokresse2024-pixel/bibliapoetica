// =============================================================================
// ENDPOINT SERVERLESS — CADASTRO CENTRALIZADO DE USUÁRIOS NO SUPABASE
// -----------------------------------------------------------------------------
// Rota: POST /api/auth/register
// =============================================================================

import {
  getUserByEmail,
  upsertUserProfile,
  supabaseQuery,
} from '../../server-lib/SupabaseClient.js';

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
    const { id, name, email, password, referralCode } = req.body || {};

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Por favor, informe seu nome completo.' });
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Por favor, informe um e-mail válido.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await getUserByEmail(cleanEmail);

    if (existing) {
      return res.status(409).json({ error: 'Este e-mail já está cadastrado. Faça login para continuar.' });
    }

    const isVip =
      cleanEmail === 'cristianokresse2024@gmail.com' ||
      cleanEmail === 'jheisyellen91@gmail.com';

    const userId = id || 'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);

    // Gera código de indicação do novo usuário
    const prefix = (name || 'VIVA')
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z]/g, '')
      .slice(0, 4) || 'VIVA';
    const hash = Math.abs(
      (userId + cleanEmail)
        .split('')
        .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
    ).toString().slice(0, 4);
    const userReferralCode = `${prefix}-${hash}`;

    const cleanRefUsed = referralCode && referralCode.toUpperCase() !== 'DIRECT' ? referralCode.toUpperCase().trim() : null;

    const newUserPayload = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      password_hash: password,
      plan: isVip ? 'vip_lifetime' : 'free',
      role: isVip ? 'admin' : 'user',
      referral_code: userReferralCode,
      referred_by: cleanRefUsed,
      created_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    };

    // 1. Salva no banco central Supabase (user_profiles)
    await upsertUserProfile(newUserPayload);

    // 2. Inicializa o perfil de embaixador no banco Supabase
    await supabaseQuery('ambassador_profiles', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=minimal',
      body: {
        user_id: userId,
        user_email: cleanEmail,
        user_name: name.trim(),
        referral_code: userReferralCode,
        level: 'PARTICIPANTE',
        active_referrals_count: 0,
        total_referrals_count: 0,
      },
    });

    // 3. Se foi indicado por alguém, registra o vínculo no banco Supabase
    if (cleanRefUsed) {
      const { data: referrers } = await supabaseQuery(
        `user_profiles?referral_code=eq.${encodeURIComponent(cleanRefUsed)}&select=*`
      );
      const referrer = referrers?.[0];

      if (referrer && referrer.id !== userId) {
        await supabaseQuery('referrals', {
          method: 'POST',
          prefer: 'resolution=merge-duplicates,return=minimal',
          body: {
            referrer_user_id: referrer.id,
            referred_user_id: userId,
            referred_user_name: name.trim(),
            referred_user_email: cleanEmail,
            referral_code_used: cleanRefUsed,
            status: 'free_user', // Cadastro gratuito registrado
            created_at: new Date().toISOString(),
          },
        });

        // Atualiza a contagem total de indicações do indicador
        const { data: allRefs } = await supabaseQuery(
          `referrals?referrer_user_id=eq.${encodeURIComponent(referrer.id)}&select=id`
        );
        const countTotal = allRefs?.length || 1;

        await supabaseQuery(`ambassador_profiles?user_id=eq.${encodeURIComponent(referrer.id)}`, {
          method: 'PATCH',
          body: { total_referrals_count: countTotal, updated_at: new Date().toISOString() },
        });
      }
    }

    // 4. Inicializa registro de progresso vazio para o usuário
    await supabaseQuery('user_progress', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=minimal',
      body: {
        user_id: userId,
        read_chapters: {},
        read_count: 0,
        streak: { count: 0, last: null },
        xp: 0,
        level: 1,
        favorites: [],
        notes: {},
        achievements: {},
        prayer_data: { totalSeconds: 0, sessions: 0, history: [] },
        fast_data: { completed: 0, totalHours: 0, history: [] },
        gratitude_data: [],
        created_at: new Date().toISOString(),
      },
    });

    return res.status(200).json({
      ok: true,
      user: {
        id: userId,
        name: name.trim(),
        email: cleanEmail,
        plan: isVip ? 'vip_lifetime' : 'free',
        role: isVip ? 'admin' : 'user',
        referralCode: userReferralCode,
        referredBy: cleanRefUsed,
        createdAt: newUserPayload.created_at,
      },
    });
  } catch (error) {
    console.error('[API Register Error]:', error);
    return res.status(500).json({ error: error.message || 'Erro interno ao cadastrar usuário.' });
  }
}
