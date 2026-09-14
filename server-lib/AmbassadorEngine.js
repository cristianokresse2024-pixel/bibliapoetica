// =============================================================================
// AMBASSADOR ENGINE — REGRAS DE NEGÓCIO OFICIAIS DO PROGRAMA DE EMBAIXADORES
// -----------------------------------------------------------------------------
// Nova Régua Oficial:
// 4 indicados        -> 4 aulas liberadas
// 5 indicados        -> 1 módulo inteiro de estudos liberado
// 6 indicados        -> 1 mês grátis de acesso a todas as funções
// 7 indicados        -> +1 mês grátis (total 2 meses grátis)
// 10 indicados ativos-> 👑 Assinatura 100% Gratuita permanente enquanto mantiver 10 ativos
// Tolerância de 30 dias se os ativos caírem abaixo de 10 para quem atingiu o nível.
// =============================================================================

export const AMBASSADOR_CONFIG = {
  SUBSCRIPTION_PRICE: 29.90,
  AMBASSADOR_THRESHOLD: 10,
  GRACE_PERIOD_DAYS: 30,
};

/**
 * Escala de Benefícios do Aplicativo (Não-cumulativos: considera o maior alcançado)
 */
export const MILESTONES = [
  { minActive: 10, level: 'EMBAIXADOR', benefit: 'Assinatura 100% Gratuita', key: 'free_subscription', badge: '👑 Embaixador' },
  { minActive: 7,  level: 'PARTICIPANTE', benefit: '2 Meses Grátis Geral',   key: '2_months',          badge: '🥈 Prata' },
  { minActive: 6,  level: 'PARTICIPANTE', benefit: '1 Mês Grátis Geral',     key: '1_month',           badge: '🥉 Bronze' },
  { minActive: 5,  level: 'PARTICIPANTE', benefit: '1 Módulo de Estudos',    key: '1_module',          badge: '📚 Módulo Completo' },
  { minActive: 4,  level: 'PARTICIPANTE', benefit: '4 Aulas Liberadas',      key: '4_lessons',         badge: '🎬 4 Aulas' },
];

/**
 * Calcula o maior benefício alcançado com base no número de indicados ativos
 */
export function calculateCurrentBenefit(activeCount) {
  const count = Math.max(0, parseInt(activeCount, 10) || 0);

  for (const milestone of MILESTONES) {
    if (count >= milestone.minActive) {
      return {
        level: milestone.level,
        benefit: milestone.benefit,
        key: milestone.key,
        badge: milestone.badge,
        isAmbassador: count >= AMBASSADOR_CONFIG.AMBASSADOR_THRESHOLD,
      };
    }
  }

  return {
    level: 'PARTICIPANTE',
    benefit: 'Nenhum benefício ativo',
    key: 'none',
    badge: '🌱 Participante',
    isAmbassador: false,
  };
}

/**
 * Identifica o próximo objetivo a ser conquistado na escala
 */
export function getNextGoal(activeCount) {
  const count = Math.max(0, parseInt(activeCount, 10) || 0);

  if (count < 4) {
    const missing = 4 - count;
    return {
      target: 4,
      benefit: '4 Aulas Liberadas',
      missing,
      description: `Falta${missing > 1 ? 'm' : ''} ${missing} indicação(ões) para liberar 4 aulas exclusivas.`
    };
  }
  if (count < 5) {
    return {
      target: 5,
      benefit: '1 Módulo de Estudos',
      missing: 1,
      description: 'Falta 1 indicação para liberar 1 módulo inteiro de estudos.'
    };
  }
  if (count < 6) {
    return {
      target: 6,
      benefit: '1 Mês Grátis Geral',
      missing: 1,
      description: 'Falta 1 indicação para ganhar 1 mês grátis com acesso a todas as funções.'
    };
  }
  if (count < 7) {
    return {
      target: 7,
      benefit: '2 Meses Grátis Geral',
      missing: 1,
      description: 'Falta 1 indicação para ganhar +1 mês grátis (totalizando 2 meses).'
    };
  }
  if (count < 10) {
    const missing = 10 - count;
    return {
      target: 10,
      benefit: '👑 Embaixador e Assinatura 100% Gratuita',
      missing,
      description: `Faltam ${missing} indicados ativos para se tornar Embaixador e ter o app 100% grátis permanente!`
    };
  }

  return {
    target: 10,
    benefit: '👑 Nível Máximo: Assinatura 100% Gratuita',
    missing: 0,
    description: 'Parabéns! Você alcançou o nível máximo de Embaixador. Mantenha 10 indicados ativos para manter sua assinatura gratuita.',
  };
}

/**
 * Avalia o status de manutenção do Embaixador e a tolerância de 30 dias
 */
export function evaluateAmbassadorStatus(optsOrCount, legacyWasAmbassador = false) {
  let count = 0;
  let isFormerAmbassador = false;
  let gracePeriodEndsAt = null;

  if (typeof optsOrCount === 'object' && optsOrCount !== null) {
    count = Math.max(0, parseInt(optsOrCount.activeCount, 10) || 0);
    isFormerAmbassador = optsOrCount.currentLevel === 'EMBAIXADOR' || Boolean(optsOrCount.wasAmbassador);
    gracePeriodEndsAt = optsOrCount.gracePeriodEndsAt || null;
  } else {
    count = Math.max(0, parseInt(optsOrCount, 10) || 0);
    isFormerAmbassador = Boolean(legacyWasAmbassador);
  }

  const now = new Date();
  const currentBenefit = calculateCurrentBenefit(count);

  // Caso 1: Mantém 10 ou mais indicados ativos -> Embaixador Pleno
  if (count >= AMBASSADOR_CONFIG.AMBASSADOR_THRESHOLD) {
    return {
      status: 'active',
      benefitStatus: 'active',
      level: 'EMBAIXADOR',
      isAmbassador: true,
      hasFreeSubscription: true,
      isFreeSubscriptionActive: true,
      gracePeriodActive: false,
      gracePeriodEndsAt: null,
      graceDaysRemaining: 0,
      benefit: currentBenefit.benefit,
      message: 'Sua assinatura gratuita está 100% ativa como Embaixador Oficial!',
    };
  }

  // Caso 2: Já era Embaixador e caiu para menos de 10 indicados
  if (isFormerAmbassador) {
    let graceEnd = gracePeriodEndsAt ? new Date(gracePeriodEndsAt) : null;

    if (!graceEnd) {
      graceEnd = new Date(now.getTime() + AMBASSADOR_CONFIG.GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);
    }

    // Ainda está dentro da janela de tolerância de 30 dias
    if (now < graceEnd) {
      const daysRemaining = Math.max(1, Math.ceil((graceEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      return {
        status: 'in_grace_period',
        benefitStatus: 'in_grace_period',
        level: 'EMBAIXADOR',
        isAmbassador: true,
        hasFreeSubscription: true,
        isFreeSubscriptionActive: true,
        gracePeriodActive: true,
        gracePeriodEndsAt: graceEnd.toISOString(),
        graceDaysRemaining: daysRemaining,
        benefit: '👑 Assinatura Gratuita (Janela de Tolerância)',
        message: `Atenção: você está com ${count} de 10 indicados ativos. Você tem ${daysRemaining} dias de tolerância para reativar 10 indicados antes de perder a gratuidade.`,
      };
    }

    // Janela de tolerância expirou
    return {
      status: 'suspended',
      benefitStatus: 'suspended',
      level: currentBenefit.level,
      isAmbassador: false,
      hasFreeSubscription: false,
      isFreeSubscriptionActive: false,
      gracePeriodActive: false,
      gracePeriodEndsAt: null,
      graceDaysRemaining: 0,
      benefit: currentBenefit.benefit,
      message: `Período de tolerância encerrado. Seu benefício foi ajustado para: ${currentBenefit.benefit}.`,
    };
  }

  // Caso 3: Usuário em níveis intermediários (0 a 9 indicados sem ter sido embaixador)
  return {
    status: 'active',
    benefitStatus: 'active',
    level: currentBenefit.level,
    isAmbassador: false,
    hasFreeSubscription: false,
    isFreeSubscriptionActive: false,
    gracePeriodActive: false,
    gracePeriodEndsAt: null,
    graceDaysRemaining: 0,
    benefit: currentBenefit.benefit,
    message: `Benefício atual: ${currentBenefit.benefit}.`,
  };
}

/**
 * Validação de antifraude para novo vínculo de indicação
 */
export function validateReferralAttribution(referrerId, referredId, existingReferrals = []) {
  if (!referrerId || !referredId) {
    return { valid: false, error: 'Identificadores de indicador e indicado são obrigatórios.' };
  }

  // 1. Anti auto-indicação
  if (referrerId.toString().trim() === referredId.toString().trim()) {
    return { valid: false, error: 'Um usuário não pode indicar a si mesmo.' };
  }

  // 2. Anti re-atribuição (usuário já indicado anteriormente)
  const alreadyReferred = existingReferrals.some(
    (r) => r.referred_user_id?.toString().trim() === referredId.toString().trim()
  );
  if (alreadyReferred) {
    return { valid: false, error: 'Este usuário já possui um indicador registrado previamente.' };
  }

  return { valid: true };
}
