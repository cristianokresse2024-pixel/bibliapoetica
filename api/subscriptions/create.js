// =============================================================================
// ENDPOINT SERVERLESS — CRIAÇÃO DE ASSINATURA RECORRENTE MERCADO PAGO
// -----------------------------------------------------------------------------
// Rota: POST /api/subscriptions/create
// Recebe: userId, payerEmail (ou email), referralCode (opcional), backUrl (opcional)
// Retorna: { ok: true, id, init_point, status, external_reference }
// =============================================================================

import { MercadoPagoService } from '../../server-lib/MercadoPagoService.js';

const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ||
  'https://vivainteligente.app.br,https://www.vivainteligente.app.br,https://viva-inteligente.vercel.app'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export default async function handler(req, res) {
  // Configuração de CORS
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
    const { userId, email, payerEmail, referralCode, refCode, backUrl } = req.body || {};
    const finalEmail = payerEmail || email;
    const finalRefCode = referralCode || refCode;

    if (!userId) {
      return res.status(400).json({ error: 'Parâmetro obrigatório ausente: userId' });
    }

    if (!finalEmail) {
      return res.status(400).json({ error: 'Parâmetro obrigatório ausente: payerEmail (ou email)' });
    }

    const mpService = new MercadoPagoService();

    // Cria a assinatura no Mercado Pago vinculando userId e referralCode no external_reference
    const result = await mpService.createPreapproval({
      userId,
      payerEmail: finalEmail,
      referralCode: finalRefCode,
      backUrl,
    });

    return res.status(200).json({
      ok: true,
      id: result.id,
      init_point: result.init_point,
      status: result.status,
      external_reference: result.external_reference,
      isMock: Boolean(result.isMock),
    });
  } catch (error) {
    console.error('[API Subscriptions Create Error]:', error);
    return res.status(500).json({
      error: error.message || 'Erro interno ao gerar assinatura no Mercado Pago',
    });
  }
}
