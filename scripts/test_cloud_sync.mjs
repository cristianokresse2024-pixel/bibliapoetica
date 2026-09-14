// =============================================================================
// TESTE AUTOMATIZADO: SINCRONIZAÇÃO EM NUVEM DE USUÁRIOS E PROGRESSO (SUPABASE)
// =============================================================================

import registerHandler from '../api/auth/register.js';
import loginHandler from '../api/auth/login.js';
import progressHandler from '../api/user/progress.js';
import adminUsersHandler from '../api/admin/users.js';

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(k, v) {
      this.headers[k] = v;
      return this;
    },
    json(obj) {
      this.body = obj;
      return this;
    },
    end(val) {
      this.body = val;
      return this;
    },
  };
  return res;
}

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

async function runTests() {
  console.log('=================================================================');
  console.log('TESTANDO SUITE DE SINCRONIZAÇÃO EM NUVEM E DIRETÓRIO DO PROPRIETÁRIO');
  console.log('=================================================================\n');

  const testUser = {
    name: 'Membro Teste Nuvem',
    email: `membro_nuvem_${Date.now()}@teste.com`,
    password: 'senhaSegura123',
    referralCode: 'CRIS-1234',
  };

  // 1. Teste de Cadastro
  console.log('📌 Cenário 1: Cadastro de Novo Usuário (/api/auth/register)');
  const regReq = {
    method: 'POST',
    headers: { origin: 'http://localhost:5173' },
    body: testUser,
  };
  const regRes = createMockRes();
  await registerHandler(regReq, regRes);

  assert(regRes.statusCode === 200, 'Cadastro retorna status HTTP 200');
  assert(regRes.body?.ok === true, 'Resposta contém ok = true');
  assert(regRes.body?.user?.email === testUser.email, 'Usuário cadastrado com e-mail correto');
  assert(Boolean(regRes.body?.user?.id), 'ID único de usuário gerado');
  assert(Boolean(regRes.body?.user?.referralCode), 'Código de indicação exclusivo gerado');

  const registeredUserId = regRes.body?.user?.id;

  // 2. Teste de Sincronização de Progresso (Leitura de 5 capítulos + Oração)
  console.log('\n📌 Cenário 2: Sincronização de Progresso Espiritual (/api/user/progress)');
  const progReq = {
    method: 'POST',
    headers: { origin: 'http://localhost:5173' },
    body: {
      userId: registeredUserId,
      progress: {
        read: {
          'gn.1': Date.now(),
          'gn.2': Date.now(),
          'gn.3': Date.now(),
          'jo.1': Date.now(),
          'sl.23': Date.now(),
        },
        streak: { count: 3, last: '2026-08-30' },
        xp: 150,
        level: { level: 2 },
        prayer: {
          totalSeconds: 1800,
          sessions: 3,
          history: [{ date: '2026-08-30', seconds: 600, goalMin: 10 }],
        },
        gratitude: [{ id: 'grat_1', text: 'Grato pelo dia de hoje!' }],
      },
    },
  };
  const progRes = createMockRes();
  await progressHandler(progReq, progRes);

  assert(progRes.statusCode === 200, 'Salvar progresso retorna HTTP 200');
  assert(progRes.body?.saved === true, 'Progresso salvo com sucesso');

  // 3. Teste de Login e Hidratação em Novo Dispositivo
  console.log('\n📌 Cenário 3: Login e Restauração em Novo Dispositivo (/api/auth/login)');
  const loginReq = {
    method: 'POST',
    headers: { origin: 'http://localhost:5173' },
    body: {
      email: testUser.email,
      password: testUser.password,
    },
  };
  const loginRes = createMockRes();
  await loginHandler(loginReq, loginRes);

  assert(loginRes.statusCode === 200, 'Login retorna HTTP 200');
  assert(loginRes.body?.user?.email === testUser.email, 'Usuário autenticado corretamente');
  assert(loginRes.body?.progress !== null, 'Progresso retornado na resposta do login');
  assert(Object.keys(loginRes.body?.progress?.read || {}).length === 5, '5 capítulos lidos restaurados da nuvem');
  assert(loginRes.body?.progress?.streak?.count === 3, 'Sequência de 3 dias restaurada');
  assert(loginRes.body?.progress?.prayer?.totalSeconds === 1800, '30 minutos de oração restaurados');

  // 4. Teste do Painel do Dono do Aplicativo
  console.log('\n📌 Cenário 4: Consulta pelo Dono do Aplicativo (/api/admin/users)');
  const adminReq = {
    method: 'GET',
    headers: { origin: 'http://localhost:5173' },
    query: { email: 'cristianokresse2024@gmail.com' },
  };
  const adminRes = createMockRes();
  await adminUsersHandler(adminReq, adminRes);

  assert(adminRes.statusCode === 200, 'Painel do Dono retorna HTTP 200');
  assert(adminRes.body?.ok === true, 'Consulta de usuários bem sucedida');
  assert(Array.isArray(adminRes.body?.users), 'Lista de usuários retornada em array');
  assert(adminRes.body?.users?.some((u) => u.email === testUser.email), 'Novo usuário cadastrado aparece na lista do Dono');
  
  const foundUserInAdmin = adminRes.body?.users?.find((u) => u.email === testUser.email);
  assert(foundUserInAdmin?.readCount === 5, 'Dono consegue ver exatamente os 5 capítulos lidos pelo usuário');
  assert(foundUserInAdmin?.xp === 150, 'Dono consegue ver a pontuação e engajamento do usuário');

  console.log('\n=================================================================');
  console.log(`RESULTADO DOS TESTES: ${passed} PASSADOS, ${failed} FALHOS`);
  console.log('=================================================================');

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Erro na execução dos testes:', err);
  process.exit(1);
});
