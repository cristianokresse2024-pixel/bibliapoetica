// =============================================================================
// ÁREA DE MEMBROS — CURSOS, MÓDULOS E AULAS
// -----------------------------------------------------------------------------
// Toda aula do YouTube (privada/não listada) pode ser inserida aqui facilmente.
// A função helper extrai o ID do vídeo automaticamente de qualquer formato de link.
// =============================================================================

/**
 * Converte qualquer link do YouTube (comum, shorts, youtu.be, embed, não listado)
 * em uma URL de embed limpa e segura para a Área de Membros.
 */
export function extractYoutubeId(urlOrId) {
  if (!urlOrId) return '';
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;

  const match = urlOrId.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : urlOrId;
}

export function getYoutubeEmbedUrl(urlOrId) {
  const id = extractYoutubeId(urlOrId);
  return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&autoplay=0` : '';
}

// Progresso de aulas salvas no navegador
const COMPLETED_LESSONS_KEY = 'viva_completed_lessons_v1';

export function getCompletedLessons() {
  try {
    const data = localStorage.getItem(COMPLETED_LESSONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleLessonCompletion(lessonId) {
  try {
    const list = getCompletedLessons();
    const index = list.indexOf(lessonId);
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.push(lessonId);
    }
    localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(list));
    return list.includes(lessonId);
  } catch {
    return false;
  }
}

export function isLessonCompleted(lessonId) {
  const list = getCompletedLessons();
  return list.includes(lessonId);
}

// =============================================================================
// CATÁLOGO OFICIAL DE ESTUDOS E AULAS
// =============================================================================
export const COURSES = [
  {
    id: 'fe-inteligente',
    title: 'Mentoria Fé Inteligente',
    category: 'Fundamentos da Fé',
    badge: 'Curso Principal',
    instructor: 'Movimento Fé Inteligente',
    desc: 'A jornada central de crescimento espiritual: uma fé lúcida, fundamentada nas Escrituras e com autoridade para transformar todas as áreas da sua vida.',
    icon: '💡',
    coverBg: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
    modules: [
      {
        id: 'mod-1',
        title: 'Módulo 1: O Despertar da Fé Consciente',
        desc: 'Compreendendo o fundamento bíblico da fé inteligente e como romper com a religiosidade estéril.',
        lessons: [
          {
            id: 'fe-101',
            title: 'Aula 1: A Essência e o Poder da Fé Inteligente',
            duration: 'Vídeo Aula',
            youtubeUrl: '', // Coloque o link ou ID do vídeo do YouTube aqui
            desc: 'Nesta aula inaugural, exploramos o que a Bíblia ensina sobre uma fé viva e fundamentada na Rocha.',
            verses: 'Hebreus 11:1; Romanos 10:17',
          },
          {
            id: 'fe-102',
            title: 'Aula 2: Renovando a Mente para a Perspectiva de Deus',
            duration: 'Vídeo Aula',
            youtubeUrl: '',
            desc: 'Como a renovação da mente desativa bloqueios emocionais e ativa o discernimento espiritual.',
            verses: 'Romanos 12:2; Efésios 4:23',
          },
          {
            id: 'fe-103',
            title: 'Aula 3: A Palavra como Fonte Inesgotável de Autoridade',
            duration: 'Vídeo Aula',
            youtubeUrl: '',
            desc: 'Como declarar a Palavra com convicção e autoridade apostólica.',
            verses: 'Josué 1:8; Isaías 55:11',
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Módulo 2: Oração Eficaz e Lugar Secreto',
        desc: 'Princípios práticos para uma vida de intimidade, revelação e poder espiritual diário.',
        lessons: [
          {
            id: 'fe-201',
            title: 'Aula 4: Os Códigos da Oração que Prevalece',
            duration: 'Vídeo Aula',
            youtubeUrl: '',
            desc: 'Entendendo a oração que toca o coração de Deus e move montanhas.',
            verses: 'Tiago 5:16; Mateus 6:6',
          },
          {
            id: 'fe-202',
            title: 'Aula 5: O Jejum Bíblico e o Alinhamento Espiritual',
            duration: 'Vídeo Aula',
            youtubeUrl: '',
            desc: 'O jejum como instrumento de purificação, quebrantamento e vitória nas batalhas invisíveis.',
            verses: 'Isaías 58; Mateus 17:21',
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Módulo 3: Vida Transformada e Frutificação',
        desc: 'Como viver o sobrenatural no trabalho, nas finanças, na família e no ministério.',
        lessons: [
          {
            id: 'fe-301',
            title: 'Aula 6: Autoridade Espiritual e Cura no Cotidiano',
            duration: 'Vídeo Aula',
            youtubeUrl: '',
            desc: 'Exercendo o sacerdócio de todos os santos com mansidão e ousadia no Reino de Deus.',
            verses: 'Marcos 16:17-18; 1 Pedro 2:9',
          }
        ]
      }
    ]
  },
  {
    id: 'lugar-secreto-avancado',
    title: 'A Chave do Lugar Secreto',
    category: 'Oração e Intimidade',
    badge: 'Imersão',
    instructor: 'Movimento Fé Inteligente',
    desc: 'Aprenda a construir um altar diário de oração, discernir a voz de Deus e manter aceso o fogo do Espírito.',
    icon: '🕊️',
    coverBg: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    modules: [
      {
        id: 'ls-mod-1',
        title: 'Módulo 1: O Altar Pessoal',
        desc: 'Fundamentos práticos para manter a chama do Espírito acesa diariamente.',
        lessons: [
          {
            id: 'ls-101',
            title: 'Aula 1: O Princípio do Tabernáculo de Davi',
            duration: 'Vídeo Aula',
            youtubeUrl: '',
            desc: 'Como a presença contínua de Deus transforma a atmosfera do seu lar e da sua mente.',
            verses: 'Atos 15:16; Salmo 27:4',
          }
        ]
      }
    ]
  },
  {
    id: 'exegese-champlin',
    title: 'Exegese e Teologia Bíblica',
    category: 'Estudo Profundo',
    badge: 'Teologia',
    instructor: 'Movimento Fé Inteligente',
    desc: 'Mergulho nos contextos históricos, linguísticos e doutrinários do Antigo e Novo Testamento.',
    icon: '📖',
    coverBg: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    modules: [
      {
        id: 'exe-mod-1',
        title: 'Módulo 1: As Epístolas Paulinas e o Grego Koiné',
        desc: 'Estudo dos termos originais e da teologia da Graça e Justificação.',
        lessons: [
          {
            id: 'exe-101',
            title: 'Aula 1: A Visão Paulina em Romanos e Gálatas',
            duration: 'Vídeo Aula',
            youtubeUrl: '',
            desc: 'Análise detalhada de Romanos à luz da justificação pela fé e reconciliação.',
            verses: 'Romanos 5:1; Gálatas 2:20',
          }
        ]
      }
    ]
  }
];

export function getCourseById(courseId) {
  return COURSES.find((c) => c.id === courseId) || null;
}

export function getAllLessonsCount(course) {
  if (!course || !course.modules) return 0;
  return course.modules.reduce((acc, m) => acc + (m.lessons ? m.lessons.length : 0), 0);
}

export function getCompletedLessonsCount(course) {
  if (!course || !course.modules) return 0;
  const completed = getCompletedLessons();
  let count = 0;
  for (const mod of course.modules) {
    if (mod.lessons) {
      for (const les of mod.lessons) {
        if (completed.includes(les.id)) count++;
      }
    }
  }
  return count;
}
