// =============================================================================
// TESTE AUTOMATIZADO DOS 9 CENÁRIOS OFICIAIS DO PROGRAMA DE EMBAIXADORES
// =============================================================================

import {
  calculateCurrentBenefit,
  calculateCommissions,
  evaluateAmbassadorStatus,
  getNextGoal,
  validateReferralAttribution,
  AMBASSADOR_CONFIG,
} from '../api/lib/AmbassadorEngine.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('=================================================================');
console.log('TESTANDO SUITE DE CENÁRIOS DO PROGRAMA DE EMBAIXADORES');
console.log('=================================================================\n');

// -----------------------------------------------------------------------------
// CENÁRIO 1: 1 Indicado Ativo -> 1 mês grátis
// -----------------------------------------------------------------------------
console.log('📌 Cenário 1: 1 indicado ativo');
{
  const activeCount = 1;
  const benefit = calculateCurrentBenefit(activeCount);
  const comm = calculateCommissions(activeCount);
  const next = getNextGoal(activeCount);

  assert(benefit.benefit === '1 mês grátis', 'Benefício é exatamente 1 mês grátis');
  assert(benefit.isAmbassador === false, 'Ainda não é embaixador');
  assert(comm.monthlyCommission === 0.00, 'Sem comissão financeira (<= 10)');
  assert(next.target === 2 && next.benefit === '2 meses grátis', 'Próximo objetivo é 2 meses grátis');
}

// -----------------------------------------------------------------------------
// CENÁRIO 2: 3 Indicados Ativos -> 3 meses grátis (Não cumulativo!)
// -----------------------------------------------------------------------------
console.log('\n📌 Cenário 2: 3 indicados ativos');
{
  const activeCount = 3;
  const benefit = calculateCurrentBenefit(activeCount);
  const comm = calculateCommissions(activeCount);
  const next = getNextGoal(activeCount);

  assert(benefit.benefit === '3 meses grátis', 'Benefício é 3 meses grátis (não somado 1+2+3)');
  assert(comm.commissionableCount === 0, 'Zero indicados comissionáveis');
  assert(next.target === 5 && next.benefit === '6 meses grátis', 'Próximo objetivo é 6 meses grátis');
}

// -----------------------------------------------------------------------------
// CENÁRIO 3: 5 Indicados Ativos -> 6 meses grátis
// -----------------------------------------------------------------------------
console.log('\n📌 Cenário 3: 5 indicados ativos');
{
  const activeCount = 5;
  const benefit = calculateCurrentBenefit(activeCount);
  const comm = calculateCommissions(activeCount);
  const next = getNextGoal(activeCount);

  assert(benefit.benefit === '6 meses grátis', 'Benefício é 6 meses grátis');
  assert(next.target === 10, 'Próximo alvo são 10 indicados para Embaixador');
  assert(next.missing === 5, 'Faltam 5 indicados para Embaixador');
}

// -----------------------------------------------------------------------------
// CENÁRIO 4: 10 Indicados Ativos -> Embaixador e Assinatura Gratuita
// -----------------------------------------------------------------------------
console.log('\n📌 Cenário 4: 10 indicados ativos');
{
  const activeCount = 10;
  const benefit = calculateCurrentBenefit(activeCount);
  const status = evaluateAmbassadorStatus(activeCount, false);
  const comm = calculateCommissions(activeCount);

  assert(benefit.isAmbassador === true, 'Alcançou o nível EMBAIXADOR');
  assert(status.isFreeSubscriptionActive === true, 'Assinatura gratuita ativada');
  assert(comm.commissionableCount === 0, '10 indicados estão alocados para a gratuidade (0 comissionáveis)');
  assert(comm.monthlyCommission === 0.00, 'Comissão financeira inicia a partir do 11º');
}

// -----------------------------------------------------------------------------
// CENÁRIO 5: 11 Indicados Ativos -> 1 comissionável = R$ 8,97/mês
// -----------------------------------------------------------------------------
console.log('\n📌 Cenário 5: 11 indicados ativos');
{
  const activeCount = 11;
  const comm = calculateCommissions(activeCount);
  const status = evaluateAmbassadorStatus(activeCount, true);

  assert(comm.commissionableCount === 1, 'Exatamente 1 indicado comissionável (11 - 10)');
  assert(comm.monthlyCommission === 8.97, 'Comissão mensal exata de R$ 8,97 (30% de 29,90)');
  assert(status.isFreeSubscriptionActive === true, 'Assinatura continua gratuita');
}

// -----------------------------------------------------------------------------
// CENÁRIO 6: 20 Indicados Ativos -> 10 comissionáveis = R$ 89,70/mês
// -----------------------------------------------------------------------------
console.log('\n📌 Cenário 6: 20 indicados ativos');
{
  const activeCount = 20;
  const comm = calculateCommissions(activeCount);

  assert(comm.commissionableCount === 10, '10 indicados comissionáveis (20 - 10)');
  assert(comm.monthlyCommission === 89.70, 'Comissão mensal exata de R$ 89,70 (10 x 8,97)');
}

// -----------------------------------------------------------------------------
// CENÁRIO 7: 1 dos 10 primeiros cancela -> 9 ativos, alerta de manutenção
// -----------------------------------------------------------------------------
console.log('\n📌 Cenário 7: Queda para 9 ativos com janela de tolerância de 30 dias');
{
  const activeCount = 9;
  const wasAmbassador = true;
  const status = evaluateAmbassadorStatus(activeCount, wasAmbassador);

  assert(status.level === 'EMBAIXADOR', 'Mantém status temporário de embaixador na tolerância');
  assert(status.benefitStatus === 'in_grace_period', 'Status é in_grace_period');
  assert(status.isFreeSubscriptionActive === true, 'Assinatura NÃO é cancelada silenciosamente na tolerância');
  assert(status.graceDaysRemaining === 30, 'Janela de tolerância de 30 dias');
  assert(status.message.includes('9 de 10 indicados ativos'), 'Mensagem clara de alerta ao usuário');
}

// -----------------------------------------------------------------------------
// CENÁRIO 8: 1 indicado comissionável cancela -> comissão cessa
// -----------------------------------------------------------------------------
console.log('\n📌 Cenário 8: Cancelamento de indicado comissionável (de 20 para 19 ativos)');
{
  const prevCount = 20;
  const newCount = 19;
  const prevComm = calculateCommissions(prevCount);
  const newComm = calculateCommissions(newCount);

  assert(prevComm.monthlyCommission === 89.70, 'Anterior: 10 comissionáveis = R$ 89,70');
  assert(newComm.commissionableCount === 9, 'Novo: 9 comissionáveis (19 - 10)');
  assert(newComm.monthlyCommission === 80.73, 'Novo valor: R$ 80,73/mês (cessou R$ 8,97 do cancelado)');
}

// -----------------------------------------------------------------------------
// CENÁRIO 9: Indicado volta a assinar -> reativação sem duplicidade
// -----------------------------------------------------------------------------
console.log('\n📌 Cenário 9: Reativação de assinatura');
{
  const restoredCount = 20;
  const restoredComm = calculateCommissions(restoredCount);

  assert(restoredComm.commissionableCount === 10, 'Volta a 10 comissionáveis');
  assert(restoredComm.monthlyCommission === 89.70, 'Comissão volta para R$ 89,70');

  // Teste de antifraude: auto-indicação
  const selfRefCheck = validateReferralAttribution('usr_123', 'usr_123');
  assert(selfRefCheck.valid === false, 'Antifraude bloqueia auto-indicação');

  // Teste de antifraude: re-atribuição
  const reAttributionCheck = validateReferralAttribution('usr_123', 'usr_456', [{ referred_user_id: 'usr_456' }]);
  assert(reAttributionCheck.valid === false, 'Antifraude bloqueia re-atribuição');
}

console.log('\n=================================================================');
console.log(`RESULTADO DOS TESTES: ${passed} PASSADOS, ${failed} FALHOS`);
console.log('=================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
