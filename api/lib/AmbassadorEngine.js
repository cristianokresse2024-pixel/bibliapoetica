// =============================================================================
// AMBASSADOR ENGINE — REGRAS DE NEGÓCIO OFICIAIS DO PROGRAMA DE EMBAIXADORES
// -----------------------------------------------------------------------------
// Modelo focado em benefícios e gamificação do próprio aplicativo:
// 1 indicado ativo  -> 1 mês grátis
// 2 indicados ativos -> 2 meses grátis
// 3 indicados ativos -> 3 meses grátis
// 5 indicados ativos -> 6 meses grátis
// 10 indicados ativos -> 👑 Assinatura 100% Gratuita permanente enquanto mantiver os 10.
// Tolerância de 30 dias se os ativos caírem para 9.
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
  { minActive: 5,  level: 'PARTICIPANTE', benefit: '6 meses grátis',         key: '6_months',          badge: '⭐ Ouro' },
  { minActive: 3,  level: 'PARTICIPANTE', benefit: '3 meses grátis',         key: '3_months',          badge: '🥈 Prata' },
  { minActive: 2,  level: 'PARTICIPANTE', benefit: '2 meses grátis',         key: '2_months',          badge: '🥉 Bronze' },
  { minActive: 1,  level: 'PARTICIPANTE', benefit: '1 mês grátis',           key: '1_month',           badge: '🌱 Semente' },
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
    badge: 'Participante',
    isAmbassador: false,
  };
}

/**
 * Identifica o próximo objetivo a ser conquistado na escala
 */
export function getNextGoal(activeCount) {
  const count = Math.max(0, parseInt(activeCount, 10) || 0);

  if (count < 1) {
    return { target: 1, benefit: '1 mês grátis', missing: 1, description: 'Falta 1 indicado ativo para ganhar 1 mês grátis.' };
  }
  if (count < 2) {
    return { target: 2, benefit: '2 meses grátis', missing: 1, description: 'Falta 1 indicado ativo para subir para 2 meses grátis.' };
  }
  if (count < 3) {
    return { target: 3, benefit: '3 meses grátis', missing: 1, description: 'Falta 1 indicado ativo para subir para 3 meses grátis.' };
  }
  if (count < 5) {
    const missing = 5 - count;
    return { target: 5, benefit: '6 meses grátis', missing, description: `Faltam ${missing} indicação(ões) para 6 meses grátis.` };
  }
  if (count < 10) {
    const missing = 10 - count;
    return { target: 10, benefit: '👑 Embaixador e Assinatura 100% Gratuita', missing, description: `Faltam ${missing} indicados ativos para se tornar Embaixador e ter o app grátis!` };
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
export function evaluateAmbassadorStatus({ currentLevel, activeCount, gracePeriodEndsAt }) {
  const count = Math.max(0, parseInt(activeCount, 10) || 0);
  const now = new Date();

  // Caso 1: Mantém 10 ou mais indicados ativos -> Embaixador Pleno
  if (count >= AMBASSADOR_CONFIG.AMBASSADOR_THRESHOLD) {
    return {
      status: 'active',
      isAmbassador: true,
      hasFreeSubscription: true,
      gracePeriodActive: false,
      gracePeriodEndsAt: null,
      message: 'Sua assinatura gratuita está 100% ativa como Embaixador Oficial!',
    };
  }

  // Caso 2: Já era Embaixador e caiu para menos de 10 indicados
  if (currentLevel === 'EMBAIXADOR') {
    let graceEnd = gracePeriodEndsAt ? new Date(gracePeriodEndsAt) : null;

    if (!graceEnd) {
      graceEnd = new Date(now.getTime() + AMBASSADOR_CONFIG.GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);
    }

    // Ainda está dentro da janela de tolerância de 30 dias
    if (now < graceEnd) {
      const daysRemaining = Math.ceil((graceEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        status: 'in_grace_period',
        isAmbassador: true,
        hasFreeSubscription: true,
        gracePeriodActive: true,
        gracePeriodEndsAt: graceEnd.toISOString(),
        daysRemaining,
        message: `Atenção: seus indicados ativos caíram para ${count}. Você tem ${daysRemaining} dias de tolerância para reativar 10 indicados antes de perder a gratuidade.`,
      };
    }

    // Janela de tolerância expirou
    const fallbackBenefit = calculateCurrentBenefit(count);
    return {
      status: 'suspended',
      isAmbassador: false,
      hasFreeSubscription: false,
      gracePeriodActive: false,
      gracePeriodEndsAt: null,
      message: `Período de tolerância encerrado. Seu benefício foi ajustado para: ${fallbackBenefit.benefit}.`,
    };
  }

  // Caso 3: Usuário em níveis intermediários (1 a 5 indicados)
  const currentBenefit = calculateCurrentBenefit(count);
  return {
    status: 'active',
    isAmbassador: false,
    hasFreeSubscription: false,
    gracePeriodActive: false,
    gracePeriodEndsAt: null,
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
