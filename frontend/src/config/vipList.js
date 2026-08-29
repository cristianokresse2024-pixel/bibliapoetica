// =============================================================================
// LISTA OFICIAL DE E-MAILS COM ACESSO VIP VITALÍCIO GRATUITO
// -----------------------------------------------------------------------------
// Os e-mails cadastrados aqui recebem acesso ILIMITADO a todas as áreas pagas
// (IA Viva, Aulas/Estudos, Comunidade e futuras ferramentas) sem precisar pagar.
// =============================================================================

export const VIP_EMAILS = [
  // E-mails Oficiais do Proprietário e Esposa
  'cristianokresse2024@gmail.com',
  'jheisyellen91@gmail.com',
  'cristianokresse@gmail.com',
  'contato@vivainteligente.com.br',
  'admin@vivainteligente.com.br',
];

/**
 * Verifica se um determinado e-mail pertence à lista VIP
 * @param {string} email
 * @returns {boolean}
 */
export function isVipEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const normalized = email.trim().toLowerCase();
  return VIP_EMAILS.some((vip) => vip.trim().toLowerCase() === normalized);
}

export default VIP_EMAILS;
