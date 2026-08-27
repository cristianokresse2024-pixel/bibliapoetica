import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadBook } from '../lib/data.js';
import { useProgress, toggleFavorite } from '../lib/progress.js';

export default function Favorites({ index }) {
  const state = useProgress();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const out = [];
      for (const ref of state.favorites) {
        const [abbrev, ch, v] = ref.split('.');
        const book = index.books.find((b) => b.abbrev === abbrev);
        if (!book) continue;
        try {
          const chs = await loadBook(state.version, abbrev);
          const text = chs?.[ch - 1]?.[v - 1];
          out.push({ ref, abbrev, ch: +ch, v: +v, name: book.name, text });
        } catch {}
      }
      if (alive) { setItems(out); setLoading(false); }
    })();
    return () => { alive = false; };
  }, [state.favorites, state.version, index]);

  const notes = Object.entries(state.notes);

  return (
    <div className="fade-in">
      <section className="section">
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '18px 0 4px' }}>Favoritos & Notas ⭐</h2>
        <p className="sub">Seus versículos marcados e anotações pessoais.</p>
      </section>

      <section className="section">
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>Versículos favoritos ({items.length})</h2>
        {loading ? <div className="spin" /> : items.length === 0 ? (
          <div className="empty"><div className="big">☆</div><p>Você ainda não favoritou versículos.<br />Toque na estrela ao lado de um versículo enquanto lê.</p></div>
        ) : (
          <div className="book-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
            {items.map((it) => (
              <div className="fav-card" key={it.ref}>
                <Link to={`/ler/${it.abbrev}/${it.ch}`} className="q">“{it.text}”</Link>
                <div className="row-between">
                  <Link to={`/ler/${it.abbrev}/${it.ch}`} className="r">{it.name} {it.ch}:{it.v}</Link>
                  <button className="vtool on" title="Remover" onClick={() => toggleFavorite(it.ref)}>★</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {notes.length > 0 && (
        <section className="section">
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>Suas anotações ({notes.length})</h2>
          <div className="book-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
            {notes.map(([ref, txt]) => {
              const [abbrev, ch, v] = ref.split('.');
              const book = index.books.find((b) => b.abbrev === abbrev);
              return (
                <div className="fav-card" key={ref}>
                  <div className="q" style={{ fontFamily: 'var(--sans)', fontSize: 15 }}>✎ {txt}</div>
                  <Link to={`/ler/${abbrev}/${ch}`} className="r">{book?.name} {ch}:{v}</Link>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
