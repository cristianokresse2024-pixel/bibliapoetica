// =============================================================================
// CATÁLOGO E AGENDAMENTO DE DEVOCIONAIS EM ÁUDIO
// -----------------------------------------------------------------------------
// O sistema internamente verifica a data/hora atual (now) e libera automaticamente
// o devocional no horário programado em `releaseAt` (ex: 05:00 da manhã).
// =============================================================================

export const DEVOTIONALS = [
  {
    id: 'dia-46-fome-de-deus',
    title: 'A FOME QUE FAZ VOCÊ BUSCAR MAIS A DEUS',
    tag: '🔥 DIA 46 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 46 de 50 • Rumo ao Pentecostes',
    verse: '“Bem-aventurados os que têm fome e sede de justiça, porque serão fartos.”',
    verseRef: 'Mateus 5:6',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-46.mp3',
    // ⏰ AGENDADO PARA LIBERAÇÃO AUTOMÁTICA EM 15/09 ÀS 05:00 DA MANHÃ (Fuso de Brasília)
    releaseAt: '2026-09-15T05:00:00-03:00',
    reflection: 'Você ainda tem fome de Deus?\n\nExiste uma profunda diferença entre conhecer a Deus e continuar desejando conhecê-Lo mais. Quem tem fome espiritual de verdade não precisa ser convencido a procurar alimento: a fome cria movimento e a sede faz buscar água. Não permita que experiências do passado se tornem substitutas da busca no presente — o que Deus fez ontem foi maravilhoso, mas hoje ainda existe mais de Deus para você.\n\nCuidado com a saturação da alma: podemos estar cercados de conteúdo cristão e ainda assim estar espiritualmente famintos. Informação sobre Deus não é o mesmo que intimidade com Deus. Quem tem fome de Deus não se contenta com migalhas, busca o próprio coração do Pai e não apenas as Suas bênçãos.',
    challenge: 'Separe hoje um tempo maior e sem pressa para estar a sós com o Senhor. Desligue as distrações, abra a Bíblia, adore e pergunte: “Senhor, o que tem diminuído a minha fome por Ti? Desperta novamente em mim uma sede profunda pela Tua presença.”\n\n🔥 Propósito da Jornada: “Espírito Santo, prepara o meu coração e enche a minha vida da Tua presença.”',
    callToAction: 'Compartilhe essa mensagem com alguém que precisa reacender a chama e a fome pela presença do Espírito Santo!',
  },
  {
    id: 'dia-45-distracao-foco',
    title: 'NÃO DEIXE A DISTRAÇÃO ROUBAR O SEU FOCO',
    tag: '🔥 DIA 45 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 45 de 50 • Rumo ao Pentecostes',
    verse: '“Buscai, pois, em primeiro lugar o Reino de Deus e a sua justiça, e todas essas coisas vos serão acrescentadas.”',
    verseRef: 'Mateus 6:33',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-45.mp3',
    // ⏰ LIBERADO HOJE (14/09) ÀS 05:00 DA MANHÃ (Fuso de Brasília)
    releaseAt: '2026-09-14T05:00:00-03:00',
    reflection: 'O que tem ocupado o primeiro lugar no seu coração?\n\nFaltam apenas 5 dias para encerrar nossa jornada rumo ao Pentecostes. Muitas vezes não abandonamos a Deus, continuamos orando e indo à igreja, mas aos poucos outras coisas vão ocupando o espaço que pertencia somente ao Senhor: trabalho, dinheiro, redes sociais, preocupações e planos.\n\nDistração não precisa ser pecado para ser perigosa. O problema acontece quando coisas legítimas roubam o lugar do essencial. Jesus disse: “Buscai, pois, em primeiro lugar o Reino de Deus”. Colocar Deus no centro não é dar a Ele apenas o tempo que sobra na agenda, mas consultá-Lo antes de decidir, falar, agir ou se preocupar. Quando Deus está no primeiro lugar, você cuida da sua vida com a confiança de que Ele cuida de você.',
    challenge: 'Faça hoje uma faxina na sua rotina: escolha algo que tem roubado excessivamente o seu foco (redes sociais, vídeos, jogos ou conversas fúteis) e estabeleça um limite claro. Use esse tempo para estar no secreto com a Palavra e declare: “Senhor, eu Te coloco novamente no primeiro lugar da minha vida.”\n\n🔥 Propósito da Jornada: “Espírito Santo, prepara o meu coração e enche a minha vida da Tua presença.”',
    callToAction: 'Compartilhe esse devocional com alguém que precisa realinhar suas prioridades e manter o foco em Deus nesta reta final!',
  },
  {
    id: 'dia-30-surpreender',
    title: 'VOCÊ ESTÁ DISPOSTO A DEIXAR DEUS TE SURPREENDER?',
    tag: '🔥 DIA 30 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 30 de 50 • Rumo ao Pentecostes',
    verse: '“Porque os meus pensamentos não são os vossos pensamentos, nem os vossos caminhos os meus caminhos, diz o Senhor.”',
    verseRef: 'Isaías 55:8',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-30.mp3',
    // Liberado anteriormente
    releaseAt: '2026-08-30T05:00:00-03:00',
    reflection: 'Você consegue confiar em Deus quando Ele não faz as coisas do jeito que você imaginou?\n\nNo devocional de hoje, vamos conversar sobre confiança. Muitas vezes a gente entrega uma situação pra Deus, mas também quer determinar como Ele deve resolver. Só que os pensamentos e os caminhos de Deus são maiores que os nossos.',
    challenge: 'Ouça essa mensagem até o final e faça essa oração: “Senhor, eu não quero mais determinar como o Senhor vai fazer. Eu confio nos Teus caminhos.”\n\n🔥 Propósito da Jornada: “Espírito Santo, prepara o meu coração e enche a minha vida da Tua presença.”',
    callToAction: 'Compartilhe esse devocional com alguém que está passando por uma situação que não saiu como esperava. Deus continua no controle!',
  },
  {
    id: 'dia-25-fogo',
    title: 'PERMANEÇA ATÉ QUE O FOGO VENHA',
    tag: '🔥 DIA 25 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 25 de 50 • Rumo ao Pentecostes',
    verse: '“Também lhes contou Jesus uma parábola, para mostrar que deviam orar sempre e nunca desanimar.”',
    verseRef: 'Lucas 18:1',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-25.mp3',
    // Liberado anteriormente
    releaseAt: '2026-08-25T00:00:00-03:00',
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
  return list[0] || DEVOTIONALS[DEVOTIONALS.length - 1] || null;
}

/**
 * Retorna os devocionais anteriores já liberados (excluindo o devocional ativo principal)
 */
export function getPastDevotionals() {
  const list = getReleasedDevotionals();
  return list.slice(1);
}

/**
 * Retorna os devocionais futuros programados para liberação
 */
export function getUpcomingDevotionals() {
  const now = new Date();
  return DEVOTIONALS.filter((d) => {
    if (!d.releaseAt) return false;
    return new Date(d.releaseAt) > now;
  }).sort((a, b) => new Date(a.releaseAt) - new Date(b.releaseAt));
}

