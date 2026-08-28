import { useState } from 'react';
import { Link } from 'react-router-dom';
import { coverUrl } from '../lib/data.js';
import { themeFor, bookGradientCss } from '../lib/theme.js';
import { useProgress } from '../lib/progress.js';

export default function BookCard({ book, index = 0 }) {
  const state = useProgress();
  const theme = themeFor(book.category);
  const [hasArt, setHasArt] = useState(true); // tenta carregar; onError cai no gradiente
  const readCount = Object.keys(state.read).filter((k) => k.startsWith(book.abbrev + '.')).length;
  const done = readCount >= book.chapters;
  const pct = Math.round((readCount / book.chapters) * 100);

  return (
    <Link
      to={`/ler/${book.abbrev}/1`}
      className="book"
      style={{ background: bookGradientCss(book.category), animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <img
        className="art"
        src={coverUrl(book.abbrev)}
        alt={book.name}
        loading="lazy"
        style={{ display: hasArt ? 'block' : 'none' }}
        onError={() => setHasArt(false)}
      />
      {!hasArt && <div className="grad" style={{ background: bookGradientCss(book.category) }} />}
      <div className="shade" />
      <span className="emoji">{theme.emoji}</span>

      {done ? (
        <span className="done">✓ Completo</span>
      ) : readCount > 0 ? (
        <span className="badge-progress">{pct}%</span>
      ) : null}

      <div className="meta">
        <div className="name">{book.name}</div>
        <div className="info">{book.chapters} capítulos</div>
        {readCount > 0 && !done && (
          <div className="mini-bar"><span style={{ width: pct + '%' }} /></div>
        )}
      </div>
    </Link>
  );
}
