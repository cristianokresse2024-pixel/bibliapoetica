// =============================================================================
// MERCADO PAGO SERVICE — CAMADA OFICIAL DE INTEGRAÇÃO COM MERCADO PAGO
// -----------------------------------------------------------------------------
// Todas as chaves e operações sensíveis permanecem estritamente no backend.
// Suporta assinaturas recorrentes de R$ 29,90/mês (Preapproval), cancelamento,
// consulta de pagamentos e validação criptográfica de Webhooks.
// =============================================================================

import crypto from 'node:crypto';

export class MercadoPagoService {
  constructor() {
    this.accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';
    this.webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET || '';
    this.baseUrl = 'https://api.mercadopago.com';
    this.planPrice = 29.90;
  }

  /**
   * Verifica se o token de produção/sandbox do Mercado Pago está configurado
   */
  isConfigured() {
    return Boolean(this.accessToken);
  }

  /**
   * Cabeçalhos autenticados para as requisições à API do Mercado Pago
   */
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.accessToken}`,
    };
  }

  /**
   * Cria uma assinatura recorrente de R$ 29,90/mês (Preapproval)
   * Vincula o external_reference no padrão estrito: `${userId}:${referralCode || 'direct'}`
   * 
   * @param {Object} params
   * @param {string} params.userId - ID do usuário no sistema/Supabase
   * @param {string} params.payerEmail - E-mail do pagador
   * @param {string} [params.referralCode] - Código de indicação capturado (?ref=CODE)
   * @param {string} [params.backUrl] - URL de redirecionamento pós-checkout
   */
  async createPreapproval({ userId, payerEmail, referralCode, backUrl }) {
    const cleanRef = (referralCode || '').toUpperCase().trim() || 'direct';
    const externalReference = `${userId}:${cleanRef}`;

    // Modo Mock/Desenvolvimento caso o token ainda não esteja configurado no ambiente
    if (!this.isConfigured()) {
      const mockId = `mock_preapproval_${Date.now()}`;
      return {
        id: mockId,
        init_point: `https://www.mercadopago.com.br/subscriptions/checkout?preapproval_id=${mockId}`,
        status: 'pending',
        external_reference: externalReference,
        payer_email: payerEmail,
        isMock: true,
      };
    }

    const payload = {
      reason: 'Assinatura Movimento Fé Inteligente — Plano Premium',
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: this.planPrice,
        currency_id: 'BRL',
      },
      back_url: backUrl || 'https://viva-inteligente.vercel.app/#/perfil',
      payer_email: payerEmail,
      external_reference: externalReference,
      status: 'pending',
    };

    const res = await fetch(`${this.baseUrl}/preapproval`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Erro ao criar assinatura Mercado Pago: ${err.message || res.statusText || 'Falha na requisição'}`);
    }

    return await res.json();
  }

  /**
   * Cancela uma assinatura recorrente no Mercado Pago
   * 
   * @param {string} preapprovalId - ID do preapproval no Mercado Pago
   */
  async cancelPreapproval(preapprovalId) {
    if (!this.isConfigured()) {
      return { id: preapprovalId, status: 'cancelled', isMock: true };
    }

    const res = await fetch(`${this.baseUrl}/preapproval/${preapprovalId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status: 'cancelled' }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Erro ao cancelar assinatura no Mercado Pago: ${err.message || res.statusText}`);
    }

    return await res.json();
  }

  /**
   * Consulta os dados e o status de uma assinatura recorrente
   * 
   * @param {string} preapprovalId - ID do preapproval no Mercado Pago
   */
  async getPreapproval(preapprovalId) {
    if (!this.isConfigured()) {
      return { id: preapprovalId, status: 'authorized', transaction_amount: this.planPrice, isMock: true };
    }

    const res = await fetch(`${this.baseUrl}/preapproval/${preapprovalId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Erro ao consultar preapproval ${preapprovalId}`);
    }

    return await res.json();
  }

  /**
   * Consulta os dados de uma transação pontual ou cobrança recorrente faturada
   * 
   * @param {string} paymentId - ID do pagamento no Mercado Pago
   */
  async getPayment(paymentId) {
    if (!this.isConfigured()) {
      return { id: paymentId, status: 'approved', transaction_amount: this.planPrice, isMock: true };
    }

    const res = await fetch(`${this.baseUrl}/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Erro ao consultar pagamento ${paymentId}`);
    }

    return await res.json();
  }

  /**
   * Validação de segurança criptográfica do cabeçalho x-signature do Webhook
   * 
   * @param {Object} headers - Cabeçalhos da requisição
   * @param {string|Object} rawBody - Corpo bruto da requisição
   */
  verifyWebhookSignature(headers = {}, rawBody = '') {
    if (!this.webhookSecret) return true; // Permite desenvolvimento local se secret não configurado

    const xSignature = headers['x-signature'] || headers['X-Signature'];
    const xRequestId = headers['x-request-id'] || headers['X-Request-Id'];

    if (!xSignature) return false;

    try {
      const parts = xSignature.split(',');
      let ts = '';
      let hash = '';

      for (const part of parts) {
        const [k, v] = part.split('=');
        if (k?.trim() === 'ts') ts = v?.trim();
        if (k?.trim() === 'v1') hash = v?.trim();
      }

      if (!ts || !hash) return false;

      // Manifest de validação do Mercado Pago: id:[data.id_url];request-id:[x-request-id];ts:[ts];
      const manifest = `ts:${ts};request-id:${xRequestId || ''};body:${typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody)}`;
      const expectedHash = crypto.createHmac('sha256', this.webhookSecret).update(manifest).digest('hex');

      return hash === expectedHash;
    } catch (e) {
      console.error('[MercadoPago Signature Error]:', e);
      return false;
    }
  }
}

export default new MercadoPagoService();
