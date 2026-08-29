// =============================================================================
// PROGRAMA DE AFILIADOS E INDICAÇÃO — MOVIMENTO FÉ INTELIGENTE
// -----------------------------------------------------------------------------
// Permite que qualquer membro gere seu link de indicação exclusivo e ganhe
// comissão direta ao indicar novas assinaturas no aplicativo.
// =============================================================================

const REFERRED_BY_KEY = 'viva_referred_by_code';
const AFFILIATE_STATS_KEY = 'viva_affiliate_stats_v1';

export const COMMISSION_CONFIG = {
  fixedCommissionValue: 10.00, // R$ 10,00 por assinatura indicada
  commissionPercentage: 30, // ou 30% da primeira mensalidade
  planMonthlyPrice: 29.90,
};

/**
 * Gera ou recupera o código de afiliado único do usuário
 */
export function getAffiliateCode(user) {
  if (!user) return 'VIVA-CONVITE';
  if (user.affiliateCode) return user.affiliateCode;

  const prefix = (user.name || 'VIVA')
    .toUpperCase()
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
 * Gera o link de indicação completo
 */
export function getAffiliateLink(user) {
  const code = getAffiliateCode(user);
  const origin = window.location.origin + window.location.pathname;
  return `${origin}#/?ref=${code}`;
}

/**
 * Captura o código de indicação vindo da URL (se houver)
 */
export function captureReferralCode() {
  try {
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    let code = '';

    const urlParams = new URLSearchParams(search || hash.split('?')[1] || '');
    code = urlParams.get('ref');

    if (code) {
      localStorage.setItem(REFERRED_BY_KEY, code.toUpperCase().trim());
      return code.toUpperCase().trim();
    }
    return localStorage.getItem(REFERRED_BY_KEY);
  } catch {
    return null;
  }
}

/**
 * Recupera o resumo de indicações e saldo de comissões do usuário
 */
export function getAffiliateSummary(user) {
  const code = getAffiliateCode(user);
  try {
    const raw = localStorage.getItem(`${AFFILIATE_STATS_KEY}_${code}`);
    if (raw) return JSON.parse(raw);
  } catch {}

  // Estrutura padrão inicial
  return {
    code,
    totalClicks: 0,
    totalSignups: 0,
    totalActiveSubscribers: 0,
    totalEarned: 0.00,
    availableBalance: 0.00,
  };
}
