// =============================================================================
// TESTE AUTOMATIZADO DOS CENÁRIOS DA NOVA RÉGUA DO PROGRAMA DE INDICAÇÕES
// =============================================================================

import {
  calculateCurrentBenefit,
  evaluateAmbassadorStatus,
  getNextGoal,
  validateReferralAttribution,
  AMBASSADOR_CONFIG,
  MILESTONES,
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
console.log('TESTANDO SUITE OFICIAL: NOVA RÉGUA DE RECOMPENSAS & EMBAIXADORES');
console.log('=================================================================\n');

// -----------------------------------------------------------------------------
// CENÁRIO 1: 0 a 3 Indicados -> Sem benefício ativo, rumo a 4 aulas
// -----------------------------------------------------------------------------
console.log('📌 Cenário 1: 0 a 3 indicações (Início)');
{
  const activeCount = 2;
  const benefit = calculateCurrentBenefit(activeCount);
  const next = getNextGoal(activeCount);

  assert(benefit.benefit === 'Nenhum benefício ativo', 'Sem benefício ativo antes de 4 indicações');
  assert(benefit.key === 'none', 'Chave é none');
  assert(next.target === 4, 'Próxima meta são 4 indicações');
  assert(next.missing === 2, 'Faltam 2 indicações para liberar 4 aulas');
  assert(next.benefit === '4 Aulas Liberadas', 'Próximo benefício são 4 aulas');
}

// -----------------------------------------------------------------------------
// CENÁRIO 2: 4 Indicados -> 4 Aulas Liberadas
// -----------------------------------------------------------------------------
console.log('\n📌 Cenário 2: 4 indicações -> 4 Aulas');
{
  const activeCount = 4;
  const benefit = calculateCurrentBenefit(activeCount);
  const next = getNextGoal(activeCount);

  assert(benefit.benefit === '4 Aulas Liberadas', 'Benefício é 4 Aulas Liberadas');
  assert(benefit.key === '4_lessons', 'Chave é 4_lessons');
  assert(benefit.isAmbassador === false, 'Ainda não é embaixador');
  assert(next.target === 5, 'Próxima meta são 5 indicações');
  assert(next.missing === 1, 'Falta 1 indicação para 1 módulo');
  assert(next.benefit === '1 Módulo de Estudos', 'Próximo benefício é 1 Módulo de Estudos');
}

// -----------------------------------------------------------------------------
// CENÁRIO 3: 5 Indicados -> 1 Módulo de Estudos Liberado
// -----------------------------------------------------------------------------
console.log('\n📌 Cenário 3: 5 indicações -> 1 Módulo de Estudos');
{
  const activeCount = 5;
  const benefit = calculateCurrentBenefit(activeCount);
  const next = getNextGoal(activeCount);

  assert(benefit.benefit === '1 Módulo de Estudos', 'Benefício é 1 Módulo de Estudos');
  assert(benefit.key === '1_module', 'Chave é 1_module');
  assert(next.target === 6, 'Próxima meta são 6 indicados');
  assert(next.missing === 1, 'Falta 1 indicado para 1 mês grátis geral');
  assert(next.benefit === '1 Mês Grátis Geral', 'Próximo benefício é 1 Mês Grátis Geral');
}

// -----------------------------------------------------------------------------
// CENÁRIO 4: 6 Indicados Ativos -> 1 Mês Grátis Geral
// -----------------------------------------------------------------------------
console.log('\n📌 Cenário 4: 6 assinantes ativos -> 1 Mês Grátis Geral');
{
  const activeCount = 6;
  const benefit = calculateCurrentBenefit(activeCount);
  const next = getNextGoal(activeCount);

  assert(benefit.benefit === '1 Mês Grátis Geral', 'Benefício é 1 Mês Grátis Geral');
  assert(benefit.key === '1_month', 'Chave é 1_month');
  assert(next.target === 7, 'Próxima meta são 7 indicados');
  assert(next.missing === 1, 'Falta 1 indicado para 2 meses grátis');
  assert(next.benefit === '2 Meses Grátis Geral', 'Próximo benefício são 2 Meses Grátis Geral');
}

// -----------------------------------------------------------------------------
// CENÁRIO 5: 7 Indicados Ativos -> 2 Meses Grátis Geral
// -----------------------------------------------------------------------------
console.log('\n📌 Cenário 5: 7 assinantes ativos -> 2 Meses Grátis Geral');
{
  const activeCount = 7;
  const benefit = calculateCurrentBenefit(activeCount);
  const next = getNextGoal(activeCount);

  assert(benefit.benefit === '2 Meses Grátis Geral', 'Benefício são 2 Meses Grátis Geral');
  assert(benefit.key === '2_months', 'Chave é 2_months');
  assert(next.target === 10, 'Próxima meta são 10 indicados para Embaixador');
  assert(next.missing === 3, 'Faltam 3 indicados para Embaixador');
}

// -----------------------------------------------------------------------------
// CENÁRIO 6: 10 Indicados Ativos -> Embaixador e Assinatura Gratuita Permanente
// -----------------------------------------------------------------------------
console.log('\n📌 Cenário 6: 10 assinantes ativos -> 👑 Embaixador Oficial');
{
  const activeCount = 10;
  const benefit = calculateCurrentBenefit(activeCount);
  const status = evaluateAmbassadorStatus(activeCount, false);
  const next = getNextGoal(activeCount);

  assert(benefit.isAmbassador === true, 'Alcançou o nível EMBAIXADOR');
  assert(benefit.key === 'free_subscription', 'Chave é free_subscription');
  assert(status.isFreeSubscriptionActive === true, 'Assinatura 100% gratuita ativada');
  assert(status.status === 'active', 'Status ativo');
  assert(next.missing === 0, 'Nível máximo atingido (0 faltantes)');
}

// -----------------------------------------------------------------------------
// CENÁRIO 7: Queda de 10 para 9 Ativos -> Janela de tolerância de 30 dias
// -----------------------------------------------------------------------------
console.log('\n📌 Cenário 7: Queda para 9 ativos com janela de tolerância de 30 dias');
{
  const activeCount = 9;
  const wasAmbassador = true;
  const status = evaluateAmbassadorStatus(activeCount, wasAmbassador);

  assert(status.level === 'EMBAIXADOR', 'Mantém status de embaixador durante tolerância');
  assert(status.benefitStatus === 'in_grace_period', 'Status é in_grace_period');
  assert(status.isFreeSubscriptionActive === true, 'Assinatura continua gratuita durante a tolerância');
  assert(status.graceDaysRemaining === 30, 'Janela de tolerância de 30 dias informada');
  assert(status.message.includes('9 de 10 indicados ativos'), 'Mensagem amigável de tolerância');
}

// -----------------------------------------------------------------------------
// CENÁRIO 8: Antifraude: Auto-indicação e Re-atribuição
// -----------------------------------------------------------------------------
console.log('\n📌 Cenário 8: Validações Antifraude');
{
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
