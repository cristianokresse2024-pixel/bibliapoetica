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
  { minActive: 7,  level: 'PARTICIPANTE', benefit: '2 Meses Grátis Geral',   key: '2_months',          badge: '🥈 Prata' },
  { minActive: 6,  level: 'PARTICIPANTE', benefit: '1 Mês Grátis Geral',     key: '1_month',           badge: '🥉 Bronze' },
  { minActive: 5,  level: 'PARTICIPANTE', benefit: '1 Módulo de Estudos',    key: '1_module',          badge: '📚 Módulo Completo' },
  { minActive: 4,  level: 'PARTICIPANTE', benefit: '4 Aulas Liberadas',      key: '4_lessons',         badge: '🎬 4 Aulas' },
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
 * Carrega o livro razão de comissões
 */
export function getUserLedger(userId) {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}_ledger_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Salva o livro razão de comissões
 */
export function saveUserLedger(userId, ledger) {
  if (!userId) return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}_ledger_${userId}`, JSON.stringify(ledger));
  } catch (e) {
    console.error('Erro ao salvar ledger:', e);
  }
}

/**
 * Retorna os direitos de acesso e aulas desbloqueadas pelo usuário
 */
export function getUserUnlockedEntitlements(user) {
  if (!user) {
    return {
      canAccessAll: false,
      canAccessStudies: false,
      canAccessIA: false,
      allowedLessonsCount: 0,
      allowedModulesCount: 0,
      badge: 'Visitante',
      label: 'Nenhum benefício ativo',
    };
  }

  const isVip = user.email === 'cristianokresse2024@gmail.com' || user.email === 'jheisyellen91@gmail.com' || user.plan === 'vip_lifetime';
  const isPaid = user.plan === 'subscriber' || user.plan === 'premium' || user.status === 'active';
  const isAmbassadorFree = user.plan === 'ambassador_free';

  if (isVip || isPaid || isAmbassadorFree) {
    return {
      canAccessAll: true,
      canAccessStudies: true,
      canAccessIA: true,
      allowedLessonsCount: Infinity,
      allowedModulesCount: Infinity,
      badge: isVip ? '👑 VIP Vitalício' : '⭐ Assinante',
      label: 'Acesso Total Liberado',
    };
  }

  const userId = user.id || user.email;
  const referrals = getUserReferrals(userId);
  const activeReferrals = referrals.filter((r) => r.status === 'active_subscriber');
  const activeCount = activeReferrals.length;
  const totalCount = referrals.length;

  // 10 ativos -> Acesso Gratuito Total de Embaixador
  if (activeCount >= 10 || user.wasAmbassador) {
    return {
      canAccessAll: true,
      canAccessStudies: true,
      canAccessIA: true,
      allowedLessonsCount: Infinity,
      allowedModulesCount: Infinity,
      badge: '👑 Embaixador Oficial',
      label: 'Assinatura 100% Gratuita (10 Ativos)',
    };
  }

  // 7 indicados -> 2 Meses Grátis Geral
  if (activeCount >= 7) {
    return {
      canAccessAll: true,
      canAccessStudies: true,
      canAccessIA: true,
      allowedLessonsCount: Infinity,
      allowedModulesCount: Infinity,
      badge: '🥈 Prata',
      label: '2 Meses Grátis Geral Liberados',
    };
  }

  // 6 indicados -> 1 Mês Grátis Geral
  if (activeCount >= 6) {
    return {
      canAccessAll: true,
      canAccessStudies: true,
      canAccessIA: true,
      allowedLessonsCount: Infinity,
      allowedModulesCount: Infinity,
      badge: '🥉 Bronze',
      label: '1 Mês Grátis Geral Liberado',
    };
  }

  // 5 indicados (total ou ativos) -> 1 Módulo Inteiro de Estudos
  if (activeCount >= 5 || totalCount >= 5) {
    return {
      canAccessAll: false,
      canAccessStudies: true,
      canAccessIA: false,
      allowedLessonsCount: Infinity,
      allowedModulesCount: 1,
      badge: '📚 Módulo Completo',
      label: '1 Módulo Inteiro de Estudos Liberado',
    };
  }

  // 4 indicados (total ou ativos) -> 4 Aulas Liberadas
  if (activeCount >= 4 || totalCount >= 4) {
    return {
      canAccessAll: false,
      canAccessStudies: true,
      canAccessIA: false,
      allowedLessonsCount: 4,
      allowedModulesCount: 1,
      badge: '🎬 4 Aulas',
      label: '4 Aulas de Estudos Liberadas',
    };
  }

  return {
    canAccessAll: false,
    canAccessStudies: false,
    canAccessIA: false,
    allowedLessonsCount: 0,
    allowedModulesCount: 0,
    badge: '🌱 Participante',
    label: 'Nenhum benefício ativo',
  };
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
      currentBenefit: 'Nenhum benefício ativo',
      nextGoal: { target: 4, benefit: '4 Aulas Liberadas', missing: 4, text: 'Faltam 4 indicações para liberar 4 aulas' },
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
    if (activeCount >= m.minActive || (m.minActive <= 5 && totalCount >= m.minActive)) {
      currentBenefit = m.benefit;
      level = m.level;
      badge = m.badge;
      break;
    }
  }

  // 2. Próximo Objetivo
  let nextGoal = null;
  const basisCount = Math.max(activeCount, totalCount);

  if (basisCount < 4) {
    const missing = 4 - basisCount;
    nextGoal = {
      target: 4,
      benefit: '4 Aulas Liberadas',
      missing,
      text: `Falta${missing > 1 ? 'm' : ''} ${missing} indicação(ões) para liberar 4 aulas exclusivas`
    };
  } else if (basisCount < 5) {
    nextGoal = {
      target: 5,
      benefit: '1 Módulo de Estudos',
      missing: 1,
      text: 'Falta 1 indicação para liberar 1 módulo inteiro de estudos'
    };
  } else if (activeCount < 6) {
    const missing = 6 - activeCount;
    nextGoal = {
      target: 6,
      benefit: '1 Mês Grátis Geral',
      missing,
      text: `Falta${missing > 1 ? 'm' : ''} ${missing} assinante(s) ativo(s) para 1 mês grátis total no app`
    };
  } else if (activeCount < 7) {
    nextGoal = {
      target: 7,
      benefit: '2 Meses Grátis Geral',
      missing: 1,
      text: 'Falta 1 assinante ativo para ganhar +1 mês grátis (total 2 meses)'
    };
  } else if (activeCount < 10) {
    const missing = 10 - activeCount;
    nextGoal = {
      target: 10,
      benefit: '👑 Embaixador (Assinatura Gratuita)',
      missing,
      text: `Faltam ${missing} assinantes ativos para ter o app 100% grátis permanente!`
    };
  } else {
    nextGoal = {
      target: 10,
      benefit: '👑 Nível Máximo Alcançado!',
      missing: 0,
      text: 'Você tem assinatura 100% gratuita enquanto mantiver 10 ativos!'
    };
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
