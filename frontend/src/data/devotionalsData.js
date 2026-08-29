// =============================================================================
// CATÁLOGO E AGENDAMENTO DE DEVOCIONAIS EM ÁUDIO
// -----------------------------------------------------------------------------
// O sistema internamente verifica a data/hora atual (now) e libera automaticamente
// o devocional no horário programado em `releaseAt` (ex: 05:00 da manhã).
// =============================================================================

export const DEVOTIONALS = [
  {
    id: 'devocional-hoje',
    title: 'O Poder da Fé e a Renovação da Mente',
    verse: '“Não vos conformeis com este século, mas transformai-vos pela renovação da vossa mente, para que experimenteis qual seja a boa, agradável e perfeita vontade de Deus.”',
    verseRef: 'Romanos 12:2',
    author: 'Pr. Cristiano Garofano Kresse',
    dateFormatted: 'Devocional Oficial',
    audioFileName: 'devocional-hoje.mp3',
    // Já liberado para teste imediato
    releaseAt: '2026-08-01T00:00:00-03:00',
    desc: 'Uma reflexão profunda para alinhar seus pensamentos ao coração de Deus e começar o dia com autoridade e paz.',
  }
];

/**
 * Retorna a URL de áudio em CDN Global de alta velocidade com fallback
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
