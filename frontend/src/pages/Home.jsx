import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { heroUrl, loadBook } from '../lib/data.js';
import { useProgress, computeStats } from '../lib/progress.js';
import { votdForToday } from '../lib/votd.js';
import BookCard from '../components/BookCard.jsx';

const BASE = import.meta.env.BASE_URL;

export default function Home({ index }) {
  const state = useProgress();
  const stats = computeStats(index);
  const nav = useNavigate();
  const [votd, setVotd] = useState(null);
  const votdRef = votdForToday();

  useEffect(() => {
    loadBook(state.version, votdRef.abbrev)
      .then((chs) => {
        const text = chs?.[votdRef.ch - 1]?.[votdRef.v - 1];
        if (text) setVotd(text);
      })
      .catch(() => {});
  }, [state.version, votdRef.abbrev, votdRef.ch, votdRef.v]);

  const featured = ['gn', 'sl', 'jo', 'ap'].map((a) => index.books.find((b) => b.abbrev === a)).filter(Boolean);
  const goalPct = Math.min(100, Math.round((stats.todayRead / (state.dailyGoal || 1)) * 100));

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="hero">
        <img className="bg" src={heroUrl('hero')} alt="" />
        <div className="veil" />
        <div className="inner">
          <h1>Uma jornada na Palavra</h1>
          <p>Leia a Bíblia inteira como nunca: ilustrada, interativa e viva. Ganhe experiência, conquiste medalhas e cultive o hábito diário.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {state.lastRead ? (
              <button className="btn" onClick={() => nav(`/ler/${state.lastRead.abbrev}/${state.lastRead.chapter}`)}>
                ▶ Continuar: {state.lastRead.name} {state.lastRead.chapter}
              </button>
            ) : (
              <Link className="btn" to="/ler/gn/1">▶ Começar por Gênesis</Link>
            )}
            <Link className="btn ghost" to="/livros">📚 Explorar livros</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section">
        <div className="stat-grid">
          <div className="stat"><div className="big gold">{stats.readCount}</div><div className="lbl">Capítulos lidos</div></div>
          <div className="stat"><div className="big">{stats.percent}%</div><div className="lbl">Da Bíblia</div></div>
          <div className="stat"><div className="big">🔥 {stats.streak}</div><div className="lbl">Dias seguidos</div></div>
          <div className="stat"><div className="big">⭐ {stats.level.level}</div><div className="lbl">Nível</div></div>
        </div>
      </section>

      {/* Meta diária + XP */}
      <section className="section grid-2">
        <div className="progress-card">
          <div className="row-between" style={{ marginBottom: 10 }}>
            <strong>Meta de hoje</strong>
            <span className="muted">{stats.todayRead}/{state.dailyGoal} capítulos</span>
          </div>
          <div className="bar"><span style={{ width: goalPct + '%' }} /></div>
          <p className="muted" style={{ marginBottom: 0, marginTop: 12, fontSize: 14 }}>
            {goalPct >= 100 ? '🎉 Meta concluída! Que a Palavra continue guiando seu dia.' : 'Leia mais um capítulo para avançar na sua jornada.'}
          </p>
        </div>
        <div className="progress-card">
          <div className="row-between" style={{ marginBottom: 10 }}>
            <strong>Nível {stats.level.level}</strong>
            <span className="muted">{stats.level.into}/{stats.level.span} XP</span>
          </div>
          <div className="bar"><span style={{ width: Math.round((stats.level.into / stats.level.span) * 100) + '%' }} /></div>
          <p className="muted" style={{ marginBottom: 0, marginTop: 12, fontSize: 14 }}>
            Ganhe XP lendo capítulos e desbloqueando medalhas.
          </p>
        </div>
      </section>

      {/* Atalhos espirituais */}
      <section className="section">
        <div className="sec-head"><h2>Vida espiritual</h2></div>
        <div className="shortcut-grid">
          <Link to="/oracao" className="shortcut sc-prayer">
            <span className="sc-ic">🕊️</span>
            <span className="sc-title">Lugar Secreto</span>
            <span className="sc-desc">Ore com cronômetro e música</span>
            {stats.prayerSessions > 0 && <span className="sc-badge">{stats.prayerSessions} orações · {stats.prayerMinutes} min</span>}
          </Link>
          <Link to="/jejum" className="shortcut sc-fast">
            <span className="sc-ic">🌙</span>
            <span className="sc-title">Jejum</span>
            <span className="sc-desc">{stats.fastActive ? 'Jejum em andamento…' : 'Consagre um tempo a Deus'}</span>
            {stats.fastActive ? <span className="sc-badge live">● {stats.fastActive.label}</span>
              : stats.fastCompleted > 0 && <span className="sc-badge">{stats.fastCompleted} concluídos</span>}
          </Link>
        </div>
      </section>

      {/* Versículo do dia */}
      <section className="section">
        <div className="votd">
          <div className="muted" style={{ marginBottom: 6, letterSpacing: 1, fontSize: 12, textTransform: 'uppercase' }}>✦ Versículo do dia</div>
          <p className="quote">“{votd || '...'}”</p>
          <div className="row-between">
            <span className="ref">{votdRef.name} {votdRef.ch}:{votdRef.v}</span>
            <Link className="btn sm ghost" to={`/ler/${votdRef.abbrev}/${votdRef.ch}`}>Ler capítulo →</Link>
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="section">
        <div className="sec-head">
          <h2>Destaques ilustrados</h2>
          <Link className="muted" to="/livros" style={{ marginLeft: 'auto', fontSize: 14 }}>ver todos →</Link>
        </div>
        <div className="book-grid">
          {featured.map((b, i) => <BookCard key={b.abbrev} book={b} index={i} />)}
        </div>
      </section>
    </div>
  );
}
