// =============================================================================
// CHECKOUT SERVICE — CAPTURA DE INDICAÇÃO, GERAÇÃO DE LINK E CHECKOUT MERCADO PAGO
// =============================================================================

export const REFERRED_BY_KEY = 'viva_referred_by_code';

/**
 * Captura o código de indicação (?ref=CODE) da URL (lê querystring e rotas com hash)
 * e persiste no localStorage para uso no momento do cadastro/assinatura.
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
      const cleanCode = code.toUpperCase().trim();
      if (cleanCode && cleanCode !== 'DIRECT') {
        localStorage.setItem(REFERRED_BY_KEY, cleanCode);
        return cleanCode;
      }
    }

    return localStorage.getItem(REFERRED_BY_KEY) || null;
  } catch {
    return null;
  }
}

/**
 * Inicia o fluxo de checkout chamando /api/subscriptions/create e redirecionando
 * o usuário logado para o init_point retornado pelo Mercado Pago.
 */
export async function startSubscriptionCheckout(user) {
  if (!user || !user.id || !user.email) {
    throw new Error('Você precisa criar uma conta ou fazer login para assinar.');
  }

  // Resgata o código de indicação gravado na visita
  const savedRefCode = localStorage.getItem(REFERRED_BY_KEY) || 'direct';

  const res = await fetch('/api/subscriptions/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user.id,
      email: user.email,
      payerEmail: user.email,
      referralCode: savedRefCode,
      backUrl: `${window.location.origin}/#/perfil`,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Falha ao conectar com o servidor de pagamento.');
  }

  const data = await res.json();

  if (!data.init_point) {
    throw new Error('Link de pagamento não retornado pelo Mercado Pago.');
  }

  // Redireciona para o checkout seguro do Mercado Pago
  window.location.href = data.init_point;
  return data;
}
