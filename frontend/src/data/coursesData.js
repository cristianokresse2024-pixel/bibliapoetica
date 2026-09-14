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
// -----------------------------------------------------------------------------
export const COURSES = [
  {
    id: 'fundamentos-fe-inteligente',
    title: 'Fundamentos da Fé Inteligente',
    category: 'Formação Bíblica & Espiritual',
    desc: 'Trilha estruturada para quem deseja aprofundar sua vida de oração, entendimento bíblico e princípios práticos do Reino de Deus.',
    icon: '📖',
    badge: 'Formação Oficial',
    coverBg: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
    modules: [
      {
        id: 'mod-1',
        title: 'Módulo 1: Princípios e Fundamentos do Reino',
        desc: 'As 4 primeiras aulas fundamentais da sua jornada de fé e renovação mental.',
        lessons: [
          {
            id: 'aula-1',
            title: 'Aula 1: O Despertar Espiritual e o Chamado',
            desc: 'Compreenda a transição do religioso para uma vida espiritual viva, conectada e frutífera.',
            verses: 'Romanos 12:1-2, Efésios 5:14',
            youtubeUrl: '',
          },
          {
            id: 'aula-2',
            title: 'Aula 2: A Mente Renovada pela Palavra',
            desc: 'Como blindar seus pensamentos através da meditação diária nas Escrituras.',
            verses: 'Filipenses 4:8, Josué 1:8',
            youtubeUrl: '',
          },
          {
            id: 'aula-3',
            title: 'Aula 3: O Poder do Lugar Secreto e Oração Contínua',
            desc: 'Descubra a dinâmica da intimidade com Deus no secreto e seus frutos públicos.',
            verses: 'Mateus 6:6, Salmos 91:1',
            youtubeUrl: '',
          },
          {
            id: 'aula-4',
            title: 'Aula 4: Autoridade Espiritual e Caminhar na Fé',
            desc: 'Princípios bíblicos para viver com firmeza e propósito no seu dia a dia.',
            verses: 'Hebreus 11:1, Lucas 10:19',
            youtubeUrl: '',
          },
        ],
      },
      {
        id: 'mod-2',
        title: 'Módulo 2: Vida e Aprofundamento no Espírito',
        desc: 'Módulo avançado sobre dons, discernimento espiritual e ministério no Reino.',
        lessons: [
          {
            id: 'aula-5',
            title: 'Aula 5: Frutos e Dons do Espírito Santo',
            desc: 'Como manifestar o caráter de Cristo e o poder do Espírito em todas as áreas.',
            verses: 'Gálatas 5:22-23, 1 Coríntios 12:4-11',
            youtubeUrl: '',
          },
          {
            id: 'aula-6',
            title: 'Aula 6: Discernimento Bíblico no Cotidiano',
            desc: 'Tomando decisões sábias alinhadas à vontade soberana de Deus.',
            verses: 'Provérbios 3:5-6, Tiago 1:5',
            youtubeUrl: '',
          },
          {
            id: 'aula-7',
            title: 'Aula 7: Fidelidade e Semeadura no Reino',
            desc: 'Entendendo a mordomia cristã e a generosidade como estilo de vida.',
            verses: '2 Coríntios 9:6-8, Malaquias 3:10',
            youtubeUrl: '',
          },
          {
            id: 'aula-8',
            title: 'Aula 8: O Ministério da Reconciliação e Missão',
            desc: 'Seja uma testemunha viva e influencie sua família e comunidade para Cristo.',
            verses: '2 Coríntios 5:18-20, Mateus 28:19-20',
            youtubeUrl: '',
          },
        ],
      },
    ],
  },
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
