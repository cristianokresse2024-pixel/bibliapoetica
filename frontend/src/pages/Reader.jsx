import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { loadBook, coverUrl } from '../lib/data.js';
import { bookGradientCss, themeFor } from '../lib/theme.js';
import {
  useProgress, markChapterRead, isChapterRead, toggleFavorite, isFavorite,
  setNote, setLastRead, setVersion, setFontScale,
} from '../lib/progress.js';
import { useToast } from '../lib/toast.jsx';
import { INTROS } from '../lib/intros.js';
import BookIntro from '../components/BookIntro.jsx';

const SEEN_KEY = 'biblia-poetica:intros-vistas';
function getSeen() { try { return JSON.parse(localStorage.getItem(SEEN_KEY)) || {}; } catch { return {}; } }
function markSeen(abbrev) { const s = getSeen(); s[abbrev] = true; try { localStorage.setItem(SEEN_KEY, JSON.stringify(s)); } catch {} }

export default function Reader({ index }) {
  const { abbrev, chapter } = useParams();
  const ch = parseInt(chapter, 10) || 1;
  const nav = useNavigate();
  const state = useProgress();
  const toast = useToast();
  const [verses, setVerses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openNote, setOpenNote] = useState(null);
  const [hasArt, setHasArt] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const topRef = useRef(null);

  const book = useMemo(() => index.books.find((b) => b.abbrev === abbrev), [index, abbrev]);
  const theme = book ? themeFor(book.category) : themeFor();

  useEffect(() => { setHasArt(true); }, [abbrev]);

  // Abre a introdução automaticamente na primeira vez que se entra no cap. 1 de um livro
  useEffect(() => {
    if (book && ch === 1 && INTROS[abbrev] && !getSeen()[abbrev]) {
      setShowIntro(true);
      markSeen(abbrev);
    }
  }, [abbrev, ch, book]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    loadBook(state.version, abbrev)
      .then((chs) => {
        if (!alive) return;
        setVerses(chs[ch - 1] || []);
        setLoading(false);
      })
      .catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [state.version, abbrev, ch]);

  useEffect(() => {
    if (book) setLastRead({ version: state.version, abbrev, chapter: ch, name: book.name });
    if (topRef.current) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [abbrev, ch, book]);

  if (!book) return <div className="empty"><div className="big">📖</div><p>Livro não encontrado.</p></div>;

  const read = isChapterRead(abbrev, ch);
  const hasPrev = ch > 1;
  const hasNext = ch < book.chapters;

  function go(n) { nav(`/ler/${abbrev}/${n}`); }

  function handleMarkRead() {
    const res = markChapterRead(abbrev, ch, verses?.length || 0);
    toast({ icon: '✅', title: `+${10} XP`, desc: `${book.name} ${ch} concluído!` });
    res.newAchievements?.forEach((a, i) => {
      setTimeout(() => toast({ icon: a.icon, title: 'Conquista desbloqueada!', desc: a.name }), 500 * (i + 1));
    });
    if (hasNext) setTimeout(() => go(ch + 1), 350);
  }

  function fav(vIdx) {
    const ref = `${abbrev}.${ch}.${vIdx + 1}`;
    const was = isFavorite(ref);
    toggleFavorite(ref);
    if (!was) toast({ icon: '⭐', title: 'Versículo favoritado', desc: `${book.name} ${ch}:${vIdx + 1}` });
  }

  async function share(vIdx) {
    const ref = `${book.name} ${ch}:${vIdx + 1}`;
    const text = `“${verses[vIdx]}”\n— ${ref} (${state.version.toUpperCase()})`;
    try {
      if (navigator.share) await navigator.share({ text });
      else { await navigator.clipboard.writeText(text); toast({ icon: '📋', title: 'Copiado!', desc: ref }); }
    } catch {}
  }

  return (
    <div className="reader fade-in" ref={topRef}>
      {showIntro && (
        <BookIntro
          book={book}
          onClose={() => setShowIntro(false)}
          onStart={() => setShowIntro(false)}
        />
      )}
      {/* Cabeçalho ilustrado */}
      <div className="reader-head" style={{ background: bookGradientCss(book.category) }}>
        {hasArt && <img className="art" src={coverUrl(abbrev)} alt="" onError={() => setHasArt(false)} />}
        <div className="veil" />
        <div className="inner">
          <div className="crumbs"><Link to="/livros">Livros</Link> · {book.category} · {theme.emoji}</div>
          <h1>{book.name}</h1>
          <div className="muted">Capítulo {ch} de {book.chapters}</div>
          {INTROS[abbrev] && (
            <button className="intro-btn" onClick={() => setShowIntro(true)}>ℹ️ Sobre este livro</button>
          )}
        </div>
      </div>

      {/* Ferramentas */}
      <div className="rtools">
        <select className="select" value={state.version} onChange={(e) => setVersion(e.target.value)}>
          {index.versions.map((v) => <option key={v.id} value={v.id}>{v.short} — {v.name}</option>)}
        </select>
        <div className="pill" style={{ gap: 4 }}>
          <button className="vtool" onClick={() => setFontScale(Math.max(0.8, +(state.fontScale - 0.1).toFixed(2)))}>A−</button>
          <button className="vtool" onClick={() => setFontScale(Math.min(1.6, +(state.fontScale + 0.1).toFixed(2)))}>A+</button>
        </div>
        <div className="spacer" style={{ flex: 1 }} />
        {read && <span className="pill" style={{ color: '#86efac' }}>✓ Lido</span>}
      </div>

      {/* Navegação de capítulos */}
      <div className="chapter-nav">
        {Array.from({ length: book.chapters }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            className={`${n === ch ? 'active' : ''} ${isChapterRead(abbrev, n) ? 'read' : ''}`}
            onClick={() => go(n)}
          >{n}</button>
        ))}
      </div>

      {/* Versículos */}
      {loading ? (
        <div className="spin" />
      ) : (
        <div className="verses" style={{ '--font-scale': state.fontScale }}>
          {verses.map((text, i) => {
            const ref = `${abbrev}.${ch}.${i + 1}`;
            const favd = isFavorite(ref);
            const note = state.notes[ref];
            return (
              <div key={i} className={`verse ${favd ? 'fav' : ''}`} id={`v${i + 1}`}>
                <span className="num">{i + 1}</span>
                {text}
                <span className="vtools">
                  <button className={`vtool ${favd ? 'on' : ''}`} title="Favoritar" onClick={() => fav(i)}>{favd ? '★' : '☆'}</button>
                  <button className="vtool" title="Anotar" onClick={() => setOpenNote(openNote === i ? null : i)}>✎</button>
                  <button className="vtool" title="Compartilhar" onClick={() => share(i)}>↗</button>
                </span>
                {(openNote === i || note) && (
                  <textarea
                    className="note-box"
                    placeholder="Sua anotação sobre este versículo..."
                    defaultValue={note || ''}
                    onBlur={(e) => setNote(ref, e.target.value)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Rodapé de navegação */}
      <div className="reader-foot">
        <button className="btn ghost" disabled={!hasPrev} style={{ opacity: hasPrev ? 1 : 0.4 }} onClick={() => hasPrev && go(ch - 1)}>← Anterior</button>
        {!read ? (
          <button className="btn" onClick={handleMarkRead}>✓ Marcar como lido</button>
        ) : hasNext ? (
          <button className="btn" onClick={() => go(ch + 1)}>Próximo →</button>
        ) : (
          <Link className="btn" to="/livros">📚 Escolher livro</Link>
        )}
        <button className="btn ghost" disabled={!hasNext} style={{ opacity: hasNext ? 1 : 0.4 }} onClick={() => hasNext && go(ch + 1)}>Próximo →</button>
      </div>
    </div>
  );
}
