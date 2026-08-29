// =============================================================================
// CATÁLOGO E AGENDAMENTO DE DEVOCIONAIS EM ÁUDIO
// -----------------------------------------------------------------------------
// O sistema internamente verifica a data/hora atual (now) e libera automaticamente
// o devocional no horário programado em `releaseAt` (ex: 05:00 da manhã).
// =============================================================================

export const DEVOTIONALS = [
  {
    id: 'dia-25-fogo',
    title: 'PERMANEÇA ATÉ QUE O FOGO VENHA',
    tag: '🔥 DIA 25 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 25 de 50 • Rumo ao Pentecostes',
    verse: '“Também lhes contou Jesus uma parábola, para mostrar que deviam orar sempre e nunca desanimar.”',
    verseRef: 'Lucas 18:1',
    author: 'Pr. Cristiano Garofano Kresse',
    audioFileName: 'devocional-dia-25.mp3',
    // Liberado imediatamente para acesso hoje
    releaseAt: '2026-08-01T00:00:00-03:00',
    reflection: 'É fácil orar quando o coração está queimando. Mas o que você faz quando não sente mais nada? Quando o céu parece de bronze e a resposta parece demorar?\n\nNo Dia 25 da nossa jornada, o Espírito Santo nos chama à PERSEVERANÇA. Os discípulos não receberam o fogo no primeiro dia de oração, eles permaneceram no cenáculo até a promessa se cumprir. O fogo não cai sobre quem apenas começa, o fogo cai sobre quem permanece!',
    challenge: 'Volte hoje ao secreto e ore por pelo menos 15 minutos, MESMO QUE NÃO SINTA NADA. Não busque arrepios, busque a presença. Apenas permaneça e diga: "Senhor, estou aqui porque Te amo e confio em Ti."',
    callToAction: 'Compartilhe esse devocional com alguém que pensou em desistir essa semana. Deus ainda está trabalhando no secreto!',
  }
];

/**
 * Retorna as URLs de áudio em CDN Global de alta velocidade com fallback
 */
export function getDevotionalAudioUrls(audioFileName) {
  if (!audioFileName) return [];
  return [
    `https://cdn.jsdelivr.net/gh/cristianokresse2024-pixel/bibliapoetica@main/audio/devocionais/${audioFileName}`,
    `https://raw.githubusercontent.com/cristianokresse2024-pixel/bibliapoetica/main/audio/devocionais/${audioFileName}`,
    `./audio/devocionais/${audioFileName}`,
    `/audio/devocionais/${audioFileName}`
  ];
}

/**
 * Retorna apenas os devocionais que já atingiram o horário de liberação (releaseAt <= now).
 * Ordenados do mais recente para o mais antigo.
 */
export function getReleasedDevotionals() {
  const now = new Date();
  return DEVOTIONALS.filter((d) => {
    if (!d.releaseAt) return true;
    return new Date(d.releaseAt) <= now;
  }).sort((a, b) => new Date(b.releaseAt) - new Date(a.releaseAt));
}

/**
 * Retorna o Devocional Ativo de Hoje (o mais recente já liberado)
 */
export function getActiveDevotional() {
  const list = getReleasedDevotionals();
  return list[0] || DEVOTIONALS[0] || null;
}

/**
 * Retorna os devocionais anteriores já liberados (excluindo o devocional ativo principal)
 */
export function getPastDevotionals() {
  const list = getReleasedDevotionals();
  return list.slice(1);
}
