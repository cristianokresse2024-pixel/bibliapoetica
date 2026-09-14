// =============================================================================
// ENDPOINT SERVERLESS — DIRETÓRIO CENTRAL DE USUÁRIOS (EXCLUSIVO PROPRIETÁRIO)
// -----------------------------------------------------------------------------
// Rota: GET /api/admin/users
// =============================================================================

import {
  getAllUsersWithStats,
  supabaseQuery,
} from '../../server-lib/SupabaseClient.js';
import { AMBASSADOR_CONFIG } from '../../server-lib/AmbassadorEngine.js';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido. Utilize GET.' });
  }

  try {
    const requesterEmail = req.query?.email || req.headers['x-user-email'];

    // Lista consolidada de todos os usuários cadastrados no banco
    const users = await getAllUsersWithStats();

    let totalSubscribers = 0;
    let totalFreeUsers = 0;
    let totalAmbassadors = 0;

    const formattedList = users.map((u) => {
      const isPaid = u.plan === 'subscriber' || u.plan === 'premium';
      const isVip = u.email === 'cristianokresse2024@gmail.com' || u.email === 'jheisyellen91@gmail.com' || u.plan === 'vip_lifetime';
      const isAmbassador = u.isAmbassador || u.plan === 'ambassador_free';

      if (isPaid && !isVip && !isAmbassador) {
        totalSubscribers++;
      } else if (isAmbassador) {
        totalAmbassadors++;
      } else {
        totalFreeUsers++;
      }

      return {
        id: u.id,
        name: u.name || 'Usuário Viva',
        email: u.email,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
        plan: isVip ? '👑 VIP Vitalício (Dono)' : isAmbassador ? '👑 Embaixador (10 Ativos)' : isPaid ? '⭐ Assinante (R$ 29,90)' : 'Gratuito',
        status: isPaid || isVip || isAmbassador ? 'Ativo' : 'Cadastrado',
        referredBy: u.referredBy || 'Direto',
        referralCode: u.referralCode,
        readCount: u.readCount || 0,
        xp: u.xp || 0,
        level: u.level || 1,
        activeReferralsCount: u.activeReferralsCount || 0,
        totalReferralsCount: u.totalReferralsCount || 0,
        amountMonthly: isPaid && !isVip && !isAmbassador ? AMBASSADOR_CONFIG.SUBSCRIPTION_PRICE : 0,
      };
    });

    const monthlyGrossRevenue = totalSubscribers * AMBASSADOR_CONFIG.SUBSCRIPTION_PRICE;

    return res.status(200).json({
      ok: true,
      totals: {
        totalUsers: users.length,
        totalSubscribers,
        totalFreeUsers,
        totalAmbassadors,
        monthlyGrossRevenue,
        formattedRevenue: `R$ ${monthlyGrossRevenue.toFixed(2).replace('.', ',')}`,
      },
      users: formattedList,
    });
  } catch (error) {
    console.error('[API Admin Users Error]:', error);
    return res.status(500).json({ error: error.message || 'Erro interno ao consultar diretório de usuários.' });
  }
}
