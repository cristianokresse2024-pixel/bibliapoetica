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
// Quando você gravar as aulas e enviar os links/imagens, elas serão inseridas aqui.
// Por padrão, inicializado como array vazio até a publicação dos primeiros cursos.
// =============================================================================
export const COURSES = [];

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
