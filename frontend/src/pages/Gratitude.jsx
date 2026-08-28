import { useState } from 'react';
import { useProgress, addGratitude, removeGratitude } from '../lib/progress.js';
import { useToast } from '../lib/toast.jsx';

const PROMPTS = [
  'Pelo que você é grato hoje?',
  'Que bênção você recebeu nesta semana?',
  'Quem Deus usou para te abençoar?',
  'Que oração foi respondida?',
  'Qual pequeno detalhe alegrou seu dia?',
];

function fmtDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function Gratitude() {
  const state = useProgress();
  const toast = useToast();
  const [text, setText] = useState('');
  const prompt = PROMPTS[new Date().getDate() % PROMPTS.length];

  function save() {
    if (!text.trim()) return;
    const res = addGratitude(text);
    toast({ icon: '🌻', title: '+5 XP', desc: 'Gratidão registrada!' });
    res.newAchievements?.forEach((a, i) =>
      setTimeout(() => toast({ icon: a.icon, title: 'Conquista desbloqueada!', desc: a.name }), 600 * (i + 1))
    );
    setText('');
  }

  // agrupa por data
  const groups = [];
  const map = new Map();
  for (const g of state.gratitude) {
    if (!map.has(g.date)) { map.set(g.date, []); groups.push(g.date); }
    map.get(g.date).push(g);
  }

  return (
    <div className="fade-in">
      <section className="section">
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '18px 0 4px' }}>🌻 Diário de Gratidão</h2>
        <p className="sub">“Em tudo dai graças, porque esta é a vontade de Deus.” — 1 Tessalonicenses 5:18</p>
      </section>

      <section className="section">
        <div className="secret-card" style={{ gap: 12 }}>
          <h3 style={{ margin: 0 }}>{prompt}</h3>
          <textarea
            className="note-box"
            style={{ minHeight: 90, fontSize: 16 }}
            placeholder="Sou grato(a) por..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn big-btn" onClick={save} disabled={!text.trim()} style={{ opacity: text.trim() ? 1 : 0.5 }}>
            🌻 Registrar gratidão
          </button>
        </div>
      </section>

      {state.gratitude.length > 0 ? (
        <section className="section">
          <div className="row-between" style={{ marginBottom: 12 }}>
            <h3 style={{ fontSize: 18, margin: 0 }}>Suas gratidões</h3>
            <span className="muted" style={{ fontSize: 13 }}>{state.gratitude.length} registros</span>
          </div>
          {groups.map((date) => (
            <div key={date} style={{ marginBottom: 20 }}>
              <div className="gratitude-date">{fmtDate(date)}</div>
              <div className="gratitude-list">
                {map.get(date).map((g) => (
                  <div className="gratitude-item" key={g.id}>
                    <span className="gi-mark">🌻</span>
                    <span className="gi-text">{g.text}</span>
                    <button className="gi-del" title="Remover" onClick={() => removeGratitude(g.id)}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : (
        <div className="empty"><div className="big">🌻</div><p>Comece hoje: registre uma coisa boa pela qual você é grato.</p></div>
      )}
    </div>
  );
}
