// =============================================================================
// AMBASSADOR CLIENT ENGINE — GERENCIADOR DO PROGRAMA DE EMBAIXADORES (FRONTEND)
// =============================================================================

export const AMBASSADOR_CONFIG = {
  SUBSCRIPTION_PRICE: 29.90,
  AMBASSADOR_THRESHOLD: 10,
  GRACE_PERIOD_DAYS: 30,
};

export const MILESTONES = [
  { minActive: 10, level: 'EMBAIXADOR', benefit: 'Assinatura 100% Gratuita', key: 'free_subscription', badge: '👑 Embaixador' },
  { minActive: 5,  level: 'PARTICIPANTE', benefit: '6 meses grátis',         key: '6_months',          badge: '⭐ Ouro' },
  { minActive: 3,  level: 'PARTICIPANTE', benefit: '3 meses grátis',         key: '3_months',          badge: '🥈 Prata' },
  { minActive: 2,  level: 'PARTICIPANTE', benefit: '2 meses grátis',         key: '2_months',          badge: '🥉 Bronze' },
  { minActive: 1,  level: 'PARTICIPANTE', benefit: '1 mês grátis',           key: '1_month',           badge: '🌱 Semente' },
];

export const REFERRED_BY_KEY = 'viva_referred_by_code';
const STORAGE_PREFIX = 'viva_ambassador_v3';

/**
 * Constrói o código único de indicação do usuário
 */
export function getReferralCode(user) {
  if (!user) return 'VIVA-CONVITE';
  if (user.referralCode) return user.referralCode;
  if (user.referral_code) return user.referral_code;

  const prefix = (user.name || user.email?.split('@')[0] || 'VIVA')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z]/g, '')
    .slice(0, 4) || 'VIVA';

  const hash = Math.abs(
    (user.id || user.email || '123')
      .split('')
      .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
  ).toString().slice(0, 4);

  return `${prefix}-${hash}`;
}

/**
 * Gera o link limpo e compartilhável de indicação
 */
export function getShareableReferralLink(user) {
  const code = getReferralCode(user);
  const origin = window.location.origin;
  return `${origin}/?ref=${code}`;
}

/**
 * Captura o código da URL (?ref=CODE)
 */
export function captureReferralFromUrl() {
  try {
    const search = window.location.search || '';
    const hash = window.location.hash || '';

    const searchParams = new URLSearchParams(search);
    let code = searchParams.get('ref');

    if (!code && hash.includes('?')) {
      const hashQuery = hash.split('?')[1];
      const hashParams = new URLSearchParams(hashQuery);
      code = hashParams.get('ref');
    }

    if (code) {
      const clean = code.toUpperCase().trim();
      if (clean && clean !== 'DIRECT') {
        localStorage.setItem(REFERRED_BY_KEY, clean);
        return clean;
      }
    }
    return localStorage.getItem(REFERRED_BY_KEY) || null;
  } catch {
    return null;
  }
}

/**
 * Carrega a lista de indicados do usuário
 */
export function getUserReferrals(userId) {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}_referrals_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Salva a lista de indicados
 */
export function saveUserReferrals(userId, referrals) {
  if (!userId) return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}_referrals_${userId}`, JSON.stringify(referrals));
  } catch (e) {
    console.error('Erro ao salvar indicados:', e);
  }
}

/**
 * Calcula todas as métricas do painel do Embaixador
 */
export function getAmbassadorDashboardData(user) {
  if (!user) {
    return {
      isLoggedIn: false,
      code: 'VIVA-CONVITE',
      level: 'PARTICIPANTE',
      activeCount: 0,
      totalCount: 0,
      inactiveCount: 0,
      currentBenefit: 'Nenhum',
      nextGoal: { target: 1, benefit: '1 mês grátis', missing: 1, text: 'Falta 1 indicação para 1 mês grátis' },
      referrals: [],
      isAmbassador: false,
      isFreeSubscriptionActive: false,
      maintenanceMessage: '',
      warning: null,
    };
  }

  const userId = user.id || user.email;
  const referrals = getUserReferrals(userId);

  const activeReferrals = referrals.filter((r) => r.status === 'active_subscriber');
  const inactiveReferrals = referrals.filter((r) => r.status !== 'active_subscriber');

  const activeCount = activeReferrals.length;
  const totalCount = referrals.length;
  const inactiveCount = inactiveReferrals.length;

  // 1. Cálculo de Benefício Atual (Não-cumulativo)
  let currentBenefit = 'Nenhum benefício ativo';
  let level = 'PARTICIPANTE';
  let badge = '🌱 Participante';
  let isAmbassador = activeCount >= AMBASSADOR_CONFIG.AMBASSADOR_THRESHOLD;

  for (const m of MILESTONES) {
    if (activeCount >= m.minActive) {
      currentBenefit = m.benefit;
      level = m.level;
      badge = m.badge;
      break;
    }
  }

  // 2. Próximo Objetivo
  let nextGoal = null;
  if (activeCount < 1) {
    nextGoal = { target: 1, benefit: '1 mês grátis', missing: 1, text: 'Falta 1 indicação ativa para ganhar 1 mês grátis' };
  } else if (activeCount < 2) {
    nextGoal = { target: 2, benefit: '2 meses grátis', missing: 1, text: 'Falta 1 indicação ativa para 2 meses grátis' };
  } else if (activeCount < 3) {
    nextGoal = { target: 3, benefit: '3 meses grátis', missing: 1, text: 'Falta 1 indicação ativa para 3 meses grátis' };
  } else if (activeCount < 5) {
    const missing = 5 - activeCount;
    nextGoal = { target: 5, benefit: '6 meses grátis', missing, text: `Faltam ${missing} indicação(ões) para 6 meses grátis` };
  } else if (activeCount < 10) {
    const missing = 10 - activeCount;
    nextGoal = { target: 10, benefit: '👑 Embaixador (Assinatura Gratuita)', missing, text: `Faltam ${missing} indicados ativos para ter o app 100% grátis` };
  } else {
    nextGoal = { target: 10, benefit: '👑 Nível Máximo Alcançado!', missing: 0, text: 'Você tem assinatura 100% gratuita enquanto mantiver 10 ativos!' };
  }

  // 3. Tolerância e Manutenção
  let maintenanceMessage = '';
  let warning = null;
  let isFreeSubscriptionActive = false;

  if (activeCount >= 10) {
    isFreeSubscriptionActive = true;
    maintenanceMessage = `Parabéns! Você possui ${activeCount}/10 indicados ativos. 👑 Sua assinatura é 100% gratuita.`;
  } else if (user.wasAmbassador || referrals.some(r => r.wasOnceAmbassadorTrigger)) {
    isFreeSubscriptionActive = true; // tolerância
    warning = `⚠️ Você está com ${activeCount} de 10 indicados ativos. Conquiste mais ${10 - activeCount} indicado(s) ativo(s) para manter sua gratuidade (Janela de tolerância de 30 dias).`;
  }

  return {
    isLoggedIn: true,
    code: getReferralCode(user),
    level,
    badge,
    activeCount,
    totalCount,
    inactiveCount,
    currentBenefit,
    nextGoal,
    referrals,
    isAmbassador,
    isFreeSubscriptionActive,
    maintenanceMessage,
    warning,
  };
}

/**
 * Função executiva do Proprietário do Aplicativo (cristianokresse2024@gmail.com)
 * Consolida dados de todos os usuários, faturamento do mês e gestão de assinantes
 */
export function getOwnerFinancialOverview() {
  try {
    const rawUsers = localStorage.getItem('viva_users_v1');
    const users = rawUsers ? JSON.parse(rawUsers) : [];

    let totalSubscribers = 0;
    let totalFreeUsers = 0;
    let totalAmbassadorsFree = 0;
    let pendingPayments = 0;

    const subscriberList = users.map((u) => {
      const isPaid = u.plan === 'subscriber' || u.plan === 'premium' || u.status === 'active';
      const isVip = u.email === 'cristianokresse2024@gmail.com' || u.email === 'jheisyellen91@gmail.com' || u.plan === 'vip_lifetime';
      const isAmbassadorFree = u.plan === 'ambassador_free';

      if (isPaid && !isVip && !isAmbassadorFree) {
        totalSubscribers++;
      } else if (isAmbassadorFree) {
        totalAmbassadorsFree++;
      } else {
        totalFreeUsers++;
      }

      return {
        id: u.id || u.email,
        name: u.name || 'Usuário Viva',
        email: u.email,
        createdAt: u.createdAt || new Date().toISOString(),
        plan: isVip ? '👑 VIP Vitalício (Dono)' : isAmbassadorFree ? '👑 Embaixador (Grátis 10 Ativos)' : isPaid ? '⭐ Assinante Pagante (R$ 29,90)' : 'Gratuito',
        status: isPaid || isVip || isAmbassadorFree ? 'Ativo' : 'Não Assinante',
        referrerCode: u.referredBy || 'Direto (Sem indicação)',
        amountMonthly: isPaid && !isVip && !isAmbassadorFree ? AMBASSADOR_CONFIG.SUBSCRIPTION_PRICE : 0,
      };
    });

    const monthlyGrossRevenue = totalSubscribers * AMBASSADOR_CONFIG.SUBSCRIPTION_PRICE;

    return {
      totalUsers: users.length,
      totalSubscribers,
      totalFreeUsers,
      totalAmbassadorsFree,
      monthlyGrossRevenue,
      formattedRevenue: `R$ ${monthlyGrossRevenue.toFixed(2).replace('.', ',')}`,
      subscriberList,
    };
  } catch (e) {
    console.error('Erro ao calcular métricas do dono:', e);
    return {
      totalUsers: 0,
      totalSubscribers: 0,
      totalFreeUsers: 0,
      totalAmbassadorsFree: 0,
      monthlyGrossRevenue: 0,
      formattedRevenue: 'R$ 0,00',
      subscriberList: [],
    };
  }
}

/**
 * Adiciona uma indicação (Simulação e Produção)
 */
export function addReferralRecord(user, { name, email, status = 'active_subscriber' }) {
  if (!user) return null;
  const userId = user.id || user.email;
  const referrals = getUserReferrals(userId);

  // Anti auto-indicação
  if (email.toLowerCase().trim() === user.email?.toLowerCase().trim()) {
    throw new Error('Você não pode indicar a si mesmo.');
  }

  // Anti re-atribuição
  const exists = referrals.find((r) => r.referred_user_email?.toLowerCase() === email.toLowerCase().trim());
  if (exists) {
    throw new Error('Este e-mail já foi indicado anteriormente nesta conta.');
  }

  const newRef = {
    id: 'ref_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    referrer_user_id: userId,
    referred_user_id: 'usr_' + Math.random().toString(36).slice(2, 8),
    referred_user_name: name || 'Novo Membro',
    referred_user_email: email,
    referral_code_used: getReferralCode(user),
    status: status, // 'active_subscriber' | 'free_user' | 'cancelled'
    subscription_started_at: status === 'active_subscriber' ? new Date().toISOString() : null,
    subscription_cancelled_at: null,
    created_at: new Date().toISOString(),
  };

  referrals.push(newRef);
  saveUserReferrals(userId, referrals);

  // Se for assinante ativo e ultrapassar 10, gera lançamento no ledger
  syncLedgerForUser(user);

  return newRef;
}

/**
 * Alterna o status de um indicado (para simular cancelamentos e reativações)
 */
export function toggleReferralStatusRecord(user, referralId) {
  if (!user) return;
  const userId = user.id || user.email;
  const referrals = getUserReferrals(userId);
  const ref = referrals.find((r) => r.id === referralId);

  if (ref) {
    if (ref.status === 'active_subscriber') {
      ref.status = 'cancelled';
      ref.subscription_cancelled_at = new Date().toISOString();
    } else {
      ref.status = 'active_subscriber';
      ref.subscription_started_at = new Date().toISOString();
      ref.subscription_cancelled_at = null;
    }
    saveUserReferrals(userId, referrals);
    syncLedgerForUser(user);
  }
}

/**
 * Sincroniza o livro razão de comissões com os indicados comissionáveis ativos
 */
export function syncLedgerForUser(user) {
  if (!user) return;
  const userId = user.id || user.email;
  const referrals = getUserReferrals(userId);
  const ledger = getUserLedger(userId);

  const active = referrals.filter((r) => r.status === 'active_subscriber');
  const currentCycle = new Date().toISOString().slice(0, 7); // Ex: '2026-08'

  // Os primeiros 10 não geram comissão. A partir do 11º geram R$ 8.97
  if (active.length > AMBASSADOR_CONFIG.AMBASSADOR_THRESHOLD) {
    const commissionable = active.slice(AMBASSADOR_CONFIG.AMBASSADOR_THRESHOLD);

    commissionable.forEach((ref) => {
      const alreadyLogged = ledger.find(
        (entry) => entry.referred_user_id === ref.referred_user_id && entry.billing_cycle === currentCycle
      );

      if (!alreadyLogged) {
        ledger.push({
          id: 'ledg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
          referrer_user_id: userId,
          referred_user_id: ref.referred_user_id,
          referred_user_name: ref.referred_user_name,
          billing_cycle: currentCycle,
          gross_amount: 29.90,
          commission_amount: 8.97,
          status: 'pending',
          competence_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
        });
      }
    });
  }

  saveUserLedger(userId, ledger);
}
