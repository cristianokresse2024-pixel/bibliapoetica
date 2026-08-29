import { useState } from 'react';
import {
  COURSES,
  getCourseById,
  getAllLessonsCount,
  getCompletedLessonsCount,
  isLessonCompleted,
  toggleLessonCompletion,
  getYoutubeEmbedUrl,
} from '../data/coursesData.js';
import { BRAND } from '../config/brand.js';
import { useToast } from '../lib/toast.jsx';

export default function Studies() {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [completedState, setCompletedState] = useState(0); // Trigger re-render ao mudar status
  const toast = useToast();

  const selectedCourse = selectedCourseId ? getCourseById(selectedCourseId) : null;

  // Flatten lessons do curso selecionado
  const allLessons = selectedCourse
    ? selectedCourse.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleTitle: m.title })))
    : [];

  const currentLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0] || null;

  const handleOpenCourse = (course) => {
    setSelectedCourseId(course.id);
    if (course.modules?.[0]?.lessons?.[0]) {
      setActiveLessonId(course.modules[0].lessons[0].id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleComplete = (lessonId) => {
    const isNowDone = toggleLessonCompletion(lessonId);
    setCompletedState((prev) => prev + 1);
    toast({
      icon: isNowDone ? '✅' : '↩️',
      title: isNowDone ? 'Aula Concluída!' : 'Desmarcada',
      desc: isNowDone ? 'Seu progresso foi salvo com sucesso.' : 'Status da aula atualizado.',
    });
  };

  const handleNextLesson = () => {
    if (!currentLesson) return;
    const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
    if (currentIndex < allLessons.length - 1) {
      setActiveLessonId(allLessons[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevLesson = () => {
    if (!currentLesson) return;
    const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
    if (currentIndex > 0) {
      setActiveLessonId(allLessons[currentIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const categories = ['Todos', ...new Set(COURSES.map((c) => c.category))];
  const filteredCourses = selectedCategory === 'Todos'
    ? COURSES
    : COURSES.filter((c) => c.category === selectedCategory);

  // ===========================================================================
  // MODO 1: SALA DE AULA / PLAYER DO CURSO
  // ===========================================================================
  if (selectedCourse && currentLesson) {
    const isCurrentDone = isLessonCompleted(currentLesson.id);
    const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
    const hasNext = currentIndex < allLessons.length - 1;
    const hasPrev = currentIndex > 0;
    const embedUrl = getYoutubeEmbedUrl(currentLesson.youtubeUrl);

    const totalInCourse = getAllLessonsCount(selectedCourse);
    const doneInCourse = getCompletedLessonsCount(selectedCourse);
    const progressPercent = totalInCourse > 0 ? Math.round((doneInCourse / totalInCourse) * 100) : 0;

    return (
      <div className="fade-in member-classroom">
        {/* Barra superior de navegação da aula */}
        <div className="classroom-topbar">
          <button
            className="btn ghost sm classroom-back-btn"
            onClick={() => setSelectedCourseId(null)}
          >
            ← Voltar aos Cursos
          </button>
          <div className="classroom-course-info">
            <span className="classroom-badge">{selectedCourse.badge || 'Curso'}</span>
            <h2 className="classroom-course-title">{selectedCourse.title}</h2>
          </div>
          <div className="classroom-progress-pill">
            <span>{doneInCourse}/{totalInCourse} aulas ({progressPercent}%)</span>
          </div>
        </div>

        <div className="classroom-layout">
          {/* Coluna Principal: Player e Detalhes */}
          <div className="classroom-main">
            <div className="classroom-player-wrapper">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={currentLesson.title}
                  className="classroom-iframe"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="classroom-video-placeholder">
                  <div className="placeholder-icon">📹</div>
                  <h3>{currentLesson.title}</h3>
                  <p>
                    Esta aula está sendo preparada e será publicada no canal exclusivo do Movimento Fé Inteligente.
                  </p>
                  <span className="placeholder-tag">Módulo: {currentLesson.moduleTitle}</span>
                </div>
              )}
            </div>

            {/* Controles da Aula */}
            <div className="classroom-action-bar">
              <div className="classroom-nav-btns">
                <button
                  className="btn ghost sm"
                  onClick={handlePrevLesson}
                  disabled={!hasPrev}
                >
                  ← Anterior
                </button>
                <button
                  className="btn sm"
                  onClick={handleNextLesson}
                  disabled={!hasNext}
                >
                  Próxima Aula →
                </button>
              </div>

              <button
                type="button"
                className={`btn sm ${isCurrentDone ? 'btn-done' : 'btn-complete'}`}
                onClick={() => handleToggleComplete(currentLesson.id)}
              >
                {isCurrentDone ? '✓ Aula Concluída' : 'Marcar como Assistida'}
              </button>
            </div>

            {/* Detalhes do Conteúdo */}
            <div className="classroom-details-card">
              <span className="classroom-module-tag">{currentLesson.moduleTitle}</span>
              <h1 className="classroom-lesson-title">{currentLesson.title}</h1>
              
              {currentLesson.verses && (
                <div className="classroom-verses-box">
                  <strong>📖 Referências Bíblicas:</strong> {currentLesson.verses}
                </div>
              )}

              <div className="classroom-desc">
                <p>{currentLesson.desc}</p>
              </div>
            </div>
          </div>

          {/* Coluna Lateral: Grade de Módulos e Aulas */}
          <div className="classroom-sidebar">
            <h3 className="sidebar-title">Conteúdo do Curso</h3>
            <div className="classroom-modules-accordion">
              {selectedCourse.modules.map((mod, modIdx) => (
                <div key={mod.id} className="module-group">
                  <div className="module-header">
                    <h4>{mod.title}</h4>
                    {mod.desc && <p className="module-sub">{mod.desc}</p>}
                  </div>
                  <div className="module-lessons-list">
                    {mod.lessons.map((les, lesIdx) => {
                      const isSelected = les.id === currentLesson.id;
                      const isDone = isLessonCompleted(les.id);
                      return (
                        <button
                          key={les.id}
                          type="button"
                          className={`lesson-item-btn ${isSelected ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                          onClick={() => {
                            setActiveLessonId(les.id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          <div className="lesson-item-left">
                            <span className="lesson-check-icon">
                              {isDone ? '✓' : '▶'}
                            </span>
                            <div className="lesson-item-text">
                              <span className="lesson-name">{les.title}</span>
                              <span className="lesson-dur">{les.duration || 'Vídeo'}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // MODO 2: CATÁLOGO DE CURSOS / ÁREA DE MEMBROS
  // ===========================================================================
  return (
    <div className="fade-in member-area-catalog">
      {/* Hero Header */}
      <section className="section member-hero">
        <div className="member-hero-glow" />
        <div className="member-hero-content">
          <span className="sc-badge gold-badge">👑 Área de Membros</span>
          <h1 className="member-hero-title">Estudos e Aulas do Reino</h1>
          <p className="member-hero-desc">
            Assista às aulas exclusivas da Mentoria Fé Inteligente, aprofunde seus conhecimentos bíblicos e acompanhe sua evolução espiritual.
          </p>
        </div>
      </section>

      {/* Filtro por Categoria */}
      <section className="section">
        <div className="member-category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grade de Cursos */}
      <section className="section">
        <div className="member-courses-grid">
          {filteredCourses.map((course) => {
            const totalLessons = getAllLessonsCount(course);
            const doneLessons = getCompletedLessonsCount(course);
            const percent = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;

            return (
              <div key={course.id} className="member-course-card">
                <div
                  className="member-course-cover"
                  style={{ background: course.coverBg || 'linear-gradient(135deg, #1e1b4b, #312e81)' }}
                >
                  <span className="course-icon">{course.icon || '🎓'}</span>
                  {course.badge && <span className="course-badge">{course.badge}</span>}
                </div>

                <div className="member-course-body">
                  <span className="course-cat">{course.category}</span>
                  <h3 className="course-name">{course.title}</h3>
                  <p className="course-desc">{course.desc}</p>

                  {/* Barra de Progresso */}
                  <div className="course-progress-box">
                    <div className="row-between" style={{ fontSize: 12, marginBottom: 4, color: '#c4b5fd' }}>
                      <span>{doneLessons} de {totalLessons} aulas</span>
                      <strong>{percent}%</strong>
                    </div>
                    <div className="course-progress-bar">
                      <div className="course-progress-fill" style={{ width: `${percent}%` }} />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn member-access-btn"
                    onClick={() => handleOpenCourse(course)}
                  >
                    {doneLessons > 0 ? '▶ Continuar Assistindo' : '▶ Começar Estudo'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="note-box" style={{ marginTop: 26 }}>
          💡 <strong>Novas aulas toda semana:</strong> Os links das aulas gravadas no YouTube são inseridos diretamente em cada módulo do curso para você assistir no seu ritmo.
        </div>
      </section>
    </div>
  );
}
