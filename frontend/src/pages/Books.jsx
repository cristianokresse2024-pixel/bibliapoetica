import { useMemo, useState } from 'react';
import BookCard from '../components/BookCard.jsx';

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'VT', label: 'Antigo Testamento' },
  { id: 'NT', label: 'Novo Testamento' },
];

export default function Books({ index }) {
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');

  const books = useMemo(() => {
    let list = index.books;
    if (filter !== 'all') list = list.filter((b) => b.testament === filter);
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      list = list.filter((b) => b.name.toLowerCase().includes(s));
    }
    return list;
  }, [index, filter, q]);

  // agrupa por categoria mantendo ordem canônica
  const groups = useMemo(() => {
    const map = new Map();
    for (const b of books) {
      if (!map.has(b.category)) map.set(b.category, []);
      map.get(b.category).push(b);
    }
    return [...map.entries()];
  }, [books]);

  return (
    <div className="fade-in">
      <section className="section">
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '18px 0 4px' }}>Biblioteca Sagrada</h2>
        <p className="sub">66 livros · 1.189 capítulos · 31.105 versículos</p>

        <div className="filters">
          {FILTERS.map((f) => (
            <button key={f.id} className={`chip ${filter === f.id ? 'active' : ''}`} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
          <input
            className="select"
            style={{ marginLeft: 'auto', minWidth: 180 }}
            placeholder="🔍 Buscar livro..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </section>

      {groups.map(([cat, list]) => (
        <section className="section" key={cat}>
          <div className="sec-head">
            <h2 style={{ fontSize: 20 }}>{cat}</h2>
            <span className="muted" style={{ fontSize: 13 }}>{list.length} livros</span>
          </div>
          <div className="book-grid">
            {list.map((b, i) => <BookCard key={b.abbrev} book={b} index={i} />)}
          </div>
        </section>
      ))}

      {books.length === 0 && <div className="empty"><div className="big">🔍</div><p>Nenhum livro encontrado.</p></div>}
    </div>
  );
}
