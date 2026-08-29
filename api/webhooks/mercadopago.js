// =============================================================================
// WEBHOOK SERVERLESS OFICIAL — MERCADO PAGO + PROGRAMA DE EMBAIXADORES
// -----------------------------------------------------------------------------
// Endpoint: POST /api/webhooks/mercadopago
// 
// Responsabilidades:
// 1. Validação criptográfica de segurança (x-signature HMAC-SHA256).
// 2. Processamento idempotente de eventos de Assinaturas e Pagamentos Recorrentes.
// 3. Parsing do external_reference no formato estrito "userId:referralCode".
// 4. Atualização das tabelas: user_subscriptions, referrals e ambassador_profiles.
// 5. Conquista de meses grátis e Assinatura 100% Gratuita ao manter 10 indicados ativos.
// 6. Ativação da janela de tolerância de 30 dias (grace period) ao cair para 9 ativos.
// 7. Registro de auditoria em audit_logs e resposta HTTP 200 imediata.
// =============================================================================

import { MercadoPagoService } from '../lib/MercadoPagoService.js';
import { 
  AMBASSADOR_CONFIG, 
  calculateCurrentBenefit 
} from '../lib/AmbassadorEngine.js';

// ---- Configuração do Cliente Supabase REST Serverless ----
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Helper resiliente para consultas REST ao PostgREST do Supabase
 */
async function supabaseQuery(path, options = {}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.warn('[MercadoPago Webhook] SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausentes.');
    return { data: null, error: 'Chaves do Supabase não configuradas', isMock: true };
  }

  const cleanBase = SUPABASE_URL.replace(/\/$/, '');
  const url = `${cleanBase}/rest/v1/${path}`;
  const isPatch = options.method === 'PATCH';

  const headers = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': options.prefer || (isPatch ? 'return=minimal' : 'return=representation'),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      return { data: null, error: `Supabase Error (${res.status}): ${errText}` };
    }

    if (res.status === 204) return { data: null, error: null };

    const data = await res.json().catch(() => null);
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

/**
 * Extrai userId e referralCode do external_reference ("userId:referralCode")
 */
function parseExternalReference(extRef = '') {
  if (!extRef || typeof extRef !== 'string') {
    return { userId: null, referralCode: null };
  }

  const parts = extRef.split(':');
  const userId = parts[0]?.trim() || null;
  const rawCode = parts[1]?.trim() || null;
  const referralCode = rawCode && rawCode.toLowerCase() !== 'direct' ? rawCode.toUpperCase() : null;

  return { userId, referralCode };
}

/**
 * Handler Principal do Webhook Serverless
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Utilize POST.' });
  }

  const mpService = new MercadoPagoService();

  try {
    // 1. Validação Criptográfica do Cabeçalho x-signature
    const isValid = mpService.verifyWebhookSignature(req.headers, req.body);
    if (!isValid) {
      console.error('[MercadoPago Webhook] Assinatura do webhook inválida.');
      return res.status(401).json({ error: 'Assinatura inválida' });
    }

    const body = req.body || {};
    const { type, action, data } = body;
    const eventId = data?.id || req.query?.id || body.id;

    console.log(`[MercadoPago Webhook] Evento recebido: Tipo=${type || action}, ID=${eventId}`);

    if (!eventId) {
      return res.status(200).json({ received: true, message: 'Evento sem ID de dados.' });
    }

    // 2. Roteamento de Eventos de Assinatura (Preapproval)
    if (type === 'subscription_preapproval' || action === 'preapproval.authorized' || action === 'preapproval.cancelled') {
      const result = await handlePreapprovalEvent(mpService, eventId);
      return res.status(200).json({ received: true, processed: true, ...result });
    }

    // 3. Roteamento de Eventos de Pagamento Recorrente
    if (type === 'payment' || action === 'payment.created' || action === 'payment.updated') {
      const result = await handlePaymentEvent(mpService, eventId);
      return res.status(200).json({ received: true, processed: true, ...result });
    }

    return res.status(200).json({ received: true, message: `Evento ${type || action} registrado sem ação necessária.` });
  } catch (error) {
    console.error('[MercadoPago Webhook Error]:', error);
    return res.status(200).json({ received: true, error: error.message });
  }
}

/**
 * Trata eventos do ciclo de vida da Assinatura (Preapproval)
 */
async function handlePreapprovalEvent(mpService, preapprovalId) {
  const preapproval = await mpService.getPreapproval(preapprovalId);
  if (!preapproval) return { skipped: true, reason: 'Preapproval não localizado' };

  const { status, external_reference } = preapproval;
  const { userId, referralCode } = parseExternalReference(external_reference);

  console.log(`[MercadoPago Webhook] Preapproval ${preapprovalId}: Status=${status}, User=${userId}, Ref=${referralCode}`);

  if (userId) {
    const isCancelled = status === 'cancelled' || status === 'paused';
    const subStatus = isCancelled ? 'canceled' : status === 'authorized' ? 'active' : 'pending';

    await supabaseQuery('user_subscriptions', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=representation',
      body: {
        user_id: userId,
        mp_preapproval_id: String(preapprovalId),
        mp_external_reference: external_reference,
        referrer_code: referralCode,
        status: subStatus,
        canceled_at: isCancelled ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
    });

    if (isCancelled && referralCode) {
      await processReferralCancellation(userId, referralCode, preapprovalId);
    }
  }

  return { status, userId, referralCode };
}

/**
 * Trata eventos de faturamento de pagamento recorrente (Payment)
 */
async function handlePaymentEvent(mpService, paymentId) {
  const payment = await mpService.getPayment(paymentId);
  if (!payment) return { skipped: true, reason: 'Pagamento não localizado' };

  const { status: paymentStatus, external_reference, payer, transaction_amount, date_approved } = payment;
  const { userId, referralCode } = parseExternalReference(external_reference);

  console.log(`[MercadoPago Webhook] Pagamento ${paymentId}: Status=${paymentStatus}, User=${userId}, Valor=${transaction_amount}`);

  // Pagamento Aprovado
  if (paymentStatus === 'approved') {
    const approvedAt = date_approved || new Date().toISOString();
    const billingCycle = approvedAt.slice(0, 7); // 'YYYY-MM'
    const periodEnd = new Date(new Date(approvedAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    if (userId) {
      // 1. Atualiza vigência em user_subscriptions
      await supabaseQuery('user_subscriptions', {
        method: 'POST',
        prefer: 'resolution=merge-duplicates,return=representation',
        body: {
          user_id: userId,
          status: 'active',
          current_period_start: approvedAt,
          current_period_end: periodEnd,
          updated_at: new Date().toISOString(),
        },
      });

      // 2. Processa indicação se houver código de embaixador
      if (referralCode) {
        await processSuccessfulReferralPayment({
          referredUserId: userId,
          referredUserEmail: payer?.email || 'assinante@viva.app',
          referralCode,
        });
      }

      // 3. Auditoria
      await supabaseQuery('audit_logs', {
        method: 'POST',
        body: {
          user_id: userId,
          event_type: 'PAYMENT_APPROVED',
          description: `Pagamento de R$ ${transaction_amount || 29.90} aprovado (Ciclo ${billingCycle}).`,
          metadata: { paymentId, billingCycle, referralCode },
        },
      });
    }

    return { status: 'approved', paymentId };
  }

  // Pagamento Estornado ou Cancelado
  if (paymentStatus === 'refunded' || paymentStatus === 'charged_back') {
    if (userId && referralCode) {
      await processReferralCancellation(userId, referralCode, String(paymentId));
    }

    return { status: paymentStatus, paymentId };
  }

  return { status: paymentStatus, paymentId };
}

/**
 * Processa a ativação da indicação e recalculação dos benefícios do embaixador
 */
async function processSuccessfulReferralPayment({
  referredUserId,
  referredUserEmail,
  referralCode,
}) {
  // 1. Localiza o embaixador pelo código
  const { data: ambassadors } = await supabaseQuery(`ambassador_profiles?referral_code=eq.${referralCode}&select=*`);
  const ambassador = ambassadors?.[0];

  if (!ambassador) {
    console.warn(`[MercadoPago Webhook] Embaixador com código ${referralCode} não encontrado.`);
    return;
  }

  // Antifraude: Bloqueia auto-indicação
  if (ambassador.user_id === referredUserId) {
    console.warn(`[MercadoPago Webhook] Bloqueada auto-indicação do usuário ${referredUserId}.`);
    return;
  }

  const referrerUserId = ambassador.user_id;

  // 2. PRIMEIRO: Registra/Atualiza o indicado como 'active_subscriber' em referrals
  await supabaseQuery('referrals', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=representation',
    body: {
      referrer_user_id: referrerUserId,
      referred_user_id: referredUserId,
      referred_user_email: referredUserEmail,
      referral_code_used: referralCode,
      status: 'active_subscriber',
      updated_at: new Date().toISOString(),
    },
  });

  // 3. DEPOIS: Consulta a contagem exata e atualizada de indicados ativos
  const { data: activeReferrals } = await supabaseQuery(
    `referrals?referrer_user_id=eq.${referrerUserId}&status=eq.active_subscriber&select=id`
  );
  const activeCount = activeReferrals?.length || 0;

  // 4. Avalia benefícios do embaixador
  const benefitInfo = calculateCurrentBenefit(activeCount);
  if (!benefitInfo) return;

  const hasReached10 = activeCount >= AMBASSADOR_CONFIG.AMBASSADOR_THRESHOLD;

  // 5. Atualiza o perfil do embaixador com o novo nível e contagem de ativos
  await supabaseQuery(`ambassador_profiles?user_id=eq.${referrerUserId}`, {
    method: 'PATCH',
    body: {
      level: benefitInfo.level,
      active_referrals_count: activeCount,
      current_benefit_type: benefitInfo.key,
      benefit_status: 'active',
      is_free_subscription_active: hasReached10,
      grace_period_ends_at: null, // Limpa tolerância se estiver com 10 ativos
      updated_at: new Date().toISOString(),
    },
  });

  console.log(`[MercadoPago Webhook] Embaixador ${referrerUserId}: ${activeCount} ativos (Nível: ${benefitInfo.level}, Grátis: ${hasReached10})`);
}

/**
 * Processa cancelamento ou estorno de uma indicação (com gestão da janela de tolerância de 30 dias)
 */
async function processReferralCancellation(referredUserId, referralCode, reasonId) {
  const { data: ambassadors } = await supabaseQuery(`ambassador_profiles?referral_code=eq.${referralCode}&select=*`);
  const ambassador = ambassadors?.[0];
  if (!ambassador) return;

  const referrerUserId = ambassador.user_id;

  // 1. Marca o indicado como cancelado em referrals
  await supabaseQuery(`referrals?referrer_user_id=eq.${referrerUserId}&referred_user_id=eq.${referredUserId}`, {
    method: 'PATCH',
    body: {
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    },
  });

  // 2. Re-calcula a contagem de ativos
  const { data: activeReferrals } = await supabaseQuery(
    `referrals?referrer_user_id=eq.${referrerUserId}&status=eq.active_subscriber&select=id`
  );
  const newActiveCount = activeReferrals?.length || 0;
  const benefitInfo = calculateCurrentBenefit(newActiveCount);

  // 3. Verifica se era Embaixador e caiu abaixo de 10 ativos -> Dispara tolerância de 30 dias
  let gracePeriodEndsAt = ambassador.grace_period_ends_at;
  let isFreeActive = newActiveCount >= AMBASSADOR_CONFIG.AMBASSADOR_THRESHOLD;

  if (ambassador.level === 'EMBAIXADOR' && newActiveCount < AMBASSADOR_CONFIG.AMBASSADOR_THRESHOLD) {
    if (!gracePeriodEndsAt) {
      // Inicia a janela de 30 dias de tolerância
      gracePeriodEndsAt = new Date(Date.now() + AMBASSADOR_CONFIG.GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000).toISOString();
      isFreeActive = true; // Mantém a gratuidade durante a janela de 30 dias
    }
  }

  // 4. Atualiza o perfil do embaixador
  await supabaseQuery(`ambassador_profiles?user_id=eq.${referrerUserId}`, {
    method: 'PATCH',
    body: {
      level: benefitInfo.level,
      active_referrals_count: newActiveCount,
      current_benefit_type: benefitInfo.key,
      benefit_status: gracePeriodEndsAt ? 'in_grace_period' : 'active',
      is_free_subscription_active: isFreeActive,
      grace_period_ends_at: gracePeriodEndsAt,
      updated_at: new Date().toISOString(),
    },
  });

  console.log(`[MercadoPago Webhook] Cancelamento processado: Indicador ${referrerUserId}, Ativos=${newActiveCount}, Tolerância=${gracePeriodEndsAt || 'N/A'}`);
}
