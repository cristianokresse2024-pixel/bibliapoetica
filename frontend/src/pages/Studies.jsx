import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getUserUnlockedEntitlements } from '../lib/ambassadorEngine.js';
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
  const { user } = useAuth();
  const entitlements = getUserUnlockedEntitlements(user);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [completedState, setCompletedState] = useState(0);
  const toast = useToast();

  const selectedCourse = selectedCourseId ? getCourseById(selectedCourseId) : null;

  // Flatten lessons do curso selecionado (se houver)
  const allLessons = selectedCourse
    ? selectedCourse.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleTitle: m.title })))
    : [];

  const currentLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0] || null;

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

  const handleOpenCourse = (course) => {
    if (!course) return;
    setSelectedCourseId(course.id);
    const firstLesson = course.modules?.[0]?.lessons?.[0];
    if (firstLesson) setActiveLessonId(firstLesson.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ===========================================================================
  // MODO 1: SALA DE AULA (Quando um curso for selecionado)
  // ===========================================================================
  if (selectedCourse && currentLesson) {
    const isCurrentDone = isLessonCompleted(currentLesson.id);
    const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
    const hasNext = currentIndex < allLessons.length - 1;
    const hasPrev = currentIndex > 0;
    const embedUrl = getYoutubeEmbedUrl(currentLesson.youtubeUrl);

    // Permissão da aula atual
    const isCurrentLocked = !entitlements.canAccessAll && (currentIndex >= entitlements.allowedLessonsCount);

    const totalInCourse = getAllLessonsCount(selectedCourse);
    const doneInCourse = getCompletedLessonsCount(selectedCourse);
    const progressPercent = totalInCourse > 0 ? Math.round((doneInCourse / totalInCourse) * 100) : 0;

    return (
      <div className="fade-in member-classroom">
        <div className="classroom-topbar">
          <button
            className="btn ghost sm classroom-back-btn"
            onClick={() => setSelectedCourseId(null)}
          >
            ← Voltar ao Catálogo
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
          {/* Coluna Principal: Player e Detalhes da Aula */}
          <div className="classroom-main">
            <div className="classroom-video-wrap">
              {isCurrentLocked ? (
                <div className="classroom-video-placeholder" style={{ background: 'linear-gradient(135deg, #1c1438 0%, #0d091e 100%)', border: '1px solid rgba(251,191,36,0.3)' }}>
                  <div className="placeholder-icon">🔒</div>
                  <h3 style={{ color: '#fde68a' }}>Aula Exclusiva</h3>
                  <p style={{ maxWidth: 460 }}>
                    Você liberou as <strong>primeiras {entitlements.allowedLessonsCount} aulas</strong> através do sistema de indicações.
                    Para liberar este módulo completo ou todo o aplicativo, convide mais amigos ou torne-se assinante.
                  </p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
                    <Link to="/embaixadores" className="btn sm">
                      👥 Indicar Amigos
                    </Link>
                    <Link to="/perfil" className="btn ghost sm">
                      ⭐ Fazer Assinatura
                    </Link>
                  </div>
                </div>
              ) : embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={currentLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="classroom-iframe"
                />
              ) : (
                <div className="classroom-video-placeholder">
                  <div className="placeholder-icon">🎬</div>
                  <h3>Aula em Produção</h3>
                  <p>Esta aula está sendo gravada e será publicada em breve.</p>
                </div>
              )}
            </div>

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

              {!isCurrentLocked && (
                <button
                  type="button"
                  className={`btn sm ${isCurrentDone ? 'btn-done' : 'btn-complete'}`}
                  onClick={() => handleToggleComplete(currentLesson.id)}
                >
                  {isCurrentDone ? '✓ Aula Concluída' : 'Marcar como Assistida'}
                </button>
              )}
            </div>

            <div className="classroom-details-card">
              <span className="classroom-module-tag">{currentLesson.moduleTitle}</span>
              <h1 className="classroom-lesson-title">{currentLesson.title}</h1>
              {currentLesson.verses && (
                <div className="classroom-verses-box">
                  <strong>📖 Referências Bíblicas:</strong> {currentLesson.verses}
                </div>
              )}
              {currentLesson.desc && (
                <div className="classroom-desc">
                  <p>{currentLesson.desc}</p>
                </div>
              )}
            </div>
          </div>

          {/* Coluna Lateral: Grade de Módulos e Aulas */}
          <div className="classroom-sidebar">
            <h3 className="sidebar-title">Conteúdo do Curso</h3>
            <div className="classroom-modules-accordion">
              {selectedCourse.modules.map((mod, modIdx) => {
                return (
                  <div key={mod.id || modIdx} className="module-group">
                    <div className="module-header">
                      <h4>{mod.title}</h4>
                      {mod.desc && <p className="module-sub">{mod.desc}</p>}
                    </div>
                    <div className="module-lessons-list">
                      {mod.lessons.map((les) => {
                        const lesIdx = allLessons.findIndex((l) => l.id === les.id);
                        const isLocked = !entitlements.canAccessAll && (lesIdx >= entitlements.allowedLessonsCount);
                        const isDone = isLessonCompleted(les.id);
                        const isActive = les.id === currentLesson.id;

                        return (
                          <button
                            key={les.id}
                            type="button"
                            className={`lesson-item-btn ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                            onClick={() => {
                              setActiveLessonId(les.id);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            <div className="lesson-item-left">
                              <span className="lesson-check-icon">
                                {isLocked ? '🔒' : isDone ? '✓' : isActive ? '▶' : '🎬'}
                              </span>
                              <span className="lesson-item-text" style={{ fontSize: 13, color: isLocked ? 'var(--muted)' : undefined }}>
                                {les.title}
                              </span>
                            </div>
                            {isLocked && <span style={{ fontSize: 11, color: '#f59e0b' }}>Bloqueada</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // MODO 2: QUANDO AINDA NÃO HÁ AULAS CADASTRADAS (EM CONSTRUÇÃO)
  // ===========================================================================
  if (COURSES.length === 0) {
    return (
      <div className="fade-in studies-under-construction-wrap">
        {/* Cabeçalho */}
        <section className="section">
          <div className="row-between" style={{ alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '18px 0 4px' }}>
              🎓 Estudos & Formações
            </h2>
            {entitlements.badge && (
              <span className="sc-badge gold-badge" style={{ margin: '18px 0 4px' }}>
                {entitlements.badge} — {entitlements.label}
              </span>
            )}
          </div>
          <p className="sub">
            Área exclusiva de aulas em vídeo, trilhas de estudo e aprofundamento bíblico.
          </p>
        </section>

        {/* Card Principal: Em Produção */}
        <section className="section">
          <div
            className="secret-card"
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              background: 'linear-gradient(180deg, rgba(251,191,36,0.06) 0%, rgba(20,15,35,0.8) 100%)',
              border: '1px solid rgba(251,191,36,0.25)',
              borderRadius: 16,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'rgba(251,191,36,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 34,
                boxShadow: '0 0 24px rgba(251,191,36,0.2)',
              }}
            >
              🎬
            </div>

            <div>
              <span className="sc-badge gold-badge" style={{ marginBottom: 8, display: 'inline-block' }}>
                ⏳ Em Produção
              </span>
              <h3 style={{ margin: '8px 0 6px', fontSize: 22, color: '#fde68a' }}>
                Aulas e Cursos em Gravação
              </h3>
              <p className="muted" style={{ margin: '0 auto', maxWidth: 540, lineHeight: 1.6, fontSize: 14.5 }}>
                Estamos gravando e preparando aulas em vídeo exclusivas, trilhas temáticas e materiais de aprofundamento bíblico para você.
              </p>
            </div>

            {/* O que você encontrará em breve */}
            <div
              style={{
                width: '100%',
                maxWidth: 520,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '16px 20px',
                textAlign: 'left',
                margin: '12px 0 6px',
              }}
            >
              <h4 style={{ margin: '0 0 10px', fontSize: 14, color: '#c4b5fd' }}>
                ✨ O que você encontrará nesta área em breve:
              </h4>
              <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--text-sub)', fontSize: 13.5, lineHeight: 1.8 }}>
                <li>🎥 <strong>Vídeo Aulas Exclusivas:</strong> Conteúdos dinâmicos e práticos sobre os princípios do Reino.</li>
                <li>📜 <strong>Materiais de Apoio:</strong> Referências bíblicas e resumos para estudo individual.</li>
                <li>📊 <strong>Controle de Progresso:</strong> Marque aulas assistidas e acompanhe sua evolução.</li>
              </ul>
            </div>

            <p className="muted" style={{ fontSize: 13.5, margin: 0 }}>
              Enquanto as aulas estão sendo finalizadas, aproveite todo o poder da <strong>IA Viva</strong>, do <strong>Lugar Secreto</strong> e da <strong>Leitura Bíblica</strong>!
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 6 }}>
              <Link to="/ia" className="btn">
                💡 Conversar com a IA Viva →
              </Link>
              <Link to="/livros" className="btn ghost">
                📖 Ler a Bíblia
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ===========================================================================
  // MODO 3: CATÁLOGO DE CURSOS (Quando houver cursos cadastrados no futuro)
  // ===========================================================================
  return (
    <div className="fade-in member-area-catalog">
      <section className="section member-hero">
        <div className="member-hero-glow" />
        <div className="member-hero-content">
          <span className="sc-badge gold-badge">👑 Área de Membros</span>
          <h1 className="member-hero-title">Estudos e Aulas do Reino</h1>
          <p className="member-hero-desc">
            Assista às aulas exclusivas, aprofunde seus conhecimentos bíblicos e acompanhe sua evolução espiritual.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="member-courses-grid">
          {COURSES.map((course) => {
            const totalLessons = getAllLessonsCount(course);
            const doneLessons = getCompletedLessonsCount(course);
            const percent = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;

            return (
              <div key={course.id} className="member-course-card" onClick={() => handleOpenCourse(course)}>
                <div className="course-cover" style={{ background: course.coverBg || 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)' }}>
                  <span className="course-icon-badge">{course.icon || '🎓'}</span>
                  {course.badge && <span className="course-type-badge">{course.badge}</span>}
                </div>
                <div className="course-card-body">
                  <span className="course-category-tag">{course.category}</span>
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-desc">{course.desc}</p>
                  <div className="course-card-footer">
                    <span className="course-lessons-count">📚 {totalLessons} aulas</span>
                    <button type="button" className="btn sm">Acessar Curso →</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
