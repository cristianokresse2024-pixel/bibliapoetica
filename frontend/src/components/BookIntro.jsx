import { useEffect } from 'react';
import { coverUrl } from '../lib/data.js';
import { bookGradientCss, themeFor } from '../lib/theme.js';
import { INTROS } from '../lib/intros.js';

export default function BookIntro({ book, onClose, onStart }) {
  const intro = INTROS[book.abbrev];
  const theme = themeFor(book.category);

  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onEsc); document.body.style.overflow = ''; };
  }, [onClose]);

  if (!intro) return null;

  const facts = [
    { icon: '✍️', label: 'Autor', value: intro.autor },
    { icon: '📅', label: 'Quando foi escrito', value: intro.data },
    { icon: '🏛️', label: 'Período', value: intro.periodo },
    { icon: '📖', label: 'Categoria', value: `${theme.emoji} ${book.category} · ${book.chapters} capítulos` },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="intro-modal" onClick={(e) => e.stopPropagation()}>
        {/* Capa */}
        <div className="intro-hero" style={{ background: bookGradientCss(book.category) }}>
          <img className="art" src={coverUrl(book.abbrev)} alt={book.name} onError={(e) => (e.target.style.display = 'none')} />
          <div className="veil" />
          <button className="intro-close" onClick={onClose} aria-label="Fechar">✕</button>
          <div className="intro-hero-in">
            <div className="intro-eyebrow">{theme.emoji} Introdução ao livro</div>
            <h1>{book.name}</h1>
            <p className="intro-tema">“{intro.tema}”</p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="intro-body">
          <div className="fact-grid">
            {facts.map((f) => (
              <div className="fact" key={f.label}>
                <div className="fact-ic">{f.icon}</div>
                <div>
                  <div className="fact-lbl">{f.label}</div>
                  <div className="fact-val">{f.value}</div>
                </div>
              </div>
            ))}
          </div>

          <section className="intro-sec">
            <h3>📜 Contexto histórico</h3>
            <p>{intro.contexto}</p>
          </section>

          <section className="intro-sec">
            <h3>🌍 Cultura e época</h3>
            <p>{intro.cultura}</p>
          </section>

          <section className="intro-sec verse-highlight">
            <h3>✦ Versículo-chave</h3>
            <p className="intro-verse">{intro.versiculo}</p>
          </section>

          <section className="intro-sec curiosity">
            <h3>💡 Você sabia?</h3>
            <p>{intro.curiosidade}</p>
          </section>

          <div className="intro-actions">
            <button className="btn" onClick={onStart}>▶ Começar a leitura</button>
            <button className="btn ghost" onClick={onClose}>Fechar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
