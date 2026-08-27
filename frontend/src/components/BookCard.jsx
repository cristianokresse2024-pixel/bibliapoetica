import { Link } from 'react-router-dom';
import { coverUrl, ART_COVERS } from '../lib/data.js';
import { themeFor, bookGradientCss } from '../lib/theme.js';
import { useProgress } from '../lib/progress.js';

export default function BookCard({ book }) {
  const state = useProgress();
  const theme = themeFor(book.category);
  const readCount = Object.keys(state.read).filter((k) => k.startsWith(book.abbrev + '.')).length;
  const done = readCount >= book.chapters;
  const pct = Math.round((readCount / book.chapters) * 100);
  const hasArt = ART_COVERS.has(book.abbrev);

  return (
    <Link to={`/ler/${book.abbrev}/1`} className="book" style={{ background: bookGradientCss(book.category) }}>
      {hasArt ? (
        <img className="art" src={coverUrl(book.abbrev)} alt={book.name} loading="lazy" />
      ) : (
        <div className="grad" style={{ background: bookGradientCss(book.category) }} />
      )}
      <div className="shade" />
      <span className="emoji">{theme.emoji}</span>
      {done ? (
        <span className="done">✓ Completo</span>
      ) : readCount > 0 ? (
        <span className="badge-art" style={{ background: 'rgba(0,0,0,.55)', color: '#fff' }}>{pct}%</span>
      ) : hasArt ? (
        <span className="badge-art">✦ Arte</span>
      ) : null}
      <div className="meta">
        <div className="name">{book.name}</div>
        <div className="info">{book.chapters} cap · {book.category}</div>
      </div>
    </Link>
  );
}
