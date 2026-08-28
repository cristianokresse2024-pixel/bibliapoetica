import { useProgress, computeStats, ACHIEVEMENTS, setDailyGoal } from '../lib/progress.js';

export default function Journey({ index }) {
  const state = useProgress();
  const stats = computeStats(index);
  const unlocked = Object.keys(state.achievements).length;

  // progresso por testamento
  const byTest = ['VT', 'NT'].map((t) => {
    const books = index.books.filter((b) => b.testament === t);
    const totalCh = books.reduce((s, b) => s + b.chapters, 0);
    const readCh = books.reduce((s, b) => s + Object.keys(state.read).filter((k) => k.startsWith(b.abbrev + '.')).length, 0);
    return { t, label: t === 'VT' ? 'Antigo Testamento' : 'Novo Testamento', totalCh, readCh };
  });

  return (
    <div className="fade-in">
      <section className="section">
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '18px 0 4px' }}>Sua Jornada 🏆</h2>
        <p className="sub">Acompanhe seu progresso, mantenha a sequência e desbloqueie conquistas.</p>
      </section>

      {/* Nível */}
      <section className="section">
        <div className="progress-card">
          <div className="row-between" style={{ marginBottom: 10 }}>
            <div><strong style={{ fontSize: 20 }}>Nível {stats.level.level}</strong> <span className="muted">· {stats.xp} XP total</span></div>
            <span className="muted">{stats.level.into}/{stats.level.span} até o próximo</span>
          </div>
          <div className="bar"><span style={{ width: Math.round((stats.level.into / stats.level.span) * 100) + '%' }} /></div>
        </div>
      </section>

      {/* Stats grandes */}
      <section className="section">
        <div className="stat-grid">
          <div className="stat"><div className="big gold">{stats.readCount}</div><div className="lbl">Capítulos</div></div>
          <div className="stat"><div className="big">{stats.percent}%</div><div className="lbl">Concluído</div></div>
          <div className="stat"><div className="big">🔥 {stats.streak}</div><div className="lbl">Sequência</div></div>
          <div className="stat"><div className="big">{unlocked}/{ACHIEVEMENTS.length}</div><div className="lbl">Medalhas</div></div>
        </div>
      </section>

      {/* Vida espiritual */}
      <section className="section">
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>Vida espiritual</h2>
        <div className="stat-grid">
          <div className="stat"><div className="big">🕊️ {stats.prayerSessions}</div><div className="lbl">Orações</div></div>
          <div className="stat"><div className="big">{stats.prayerMinutes}</div><div className="lbl">Min. orando</div></div>
          <div className="stat"><div className="big">🌙 {stats.fastCompleted}</div><div className="lbl">Jejuns</div></div>
          <div className="stat"><div className="big">{state.fast.totalHours}h</div><div className="lbl">Jejuados</div></div>
        </div>
      </section>

      {/* Meta diária */}
      <section className="section">
        <div className="progress-card">
          <div className="row-between" style={{ marginBottom: 8 }}>
            <strong>Meta diária: {state.dailyGoal} capítulos</strong>
            <span className="muted">hoje: {stats.todayRead}</span>
          </div>
          <input className="range" type="range" min="1" max="10" value={state.dailyGoal} style={{ width: '100%' }}
            onChange={(e) => setDailyGoal(parseInt(e.target.value, 10))} />
        </div>
      </section>

      {/* Progresso por testamento */}
      <section className="section">
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>Progresso da leitura</h2>
        {byTest.map((x) => (
          <div className="progress-card" key={x.t} style={{ marginBottom: 12 }}>
            <div className="row-between" style={{ marginBottom: 8 }}>
              <strong>{x.label}</strong>
              <span className="muted">{x.readCh}/{x.totalCh} cap</span>
            </div>
            <div className="bar thin"><span style={{ width: Math.round((x.readCh / x.totalCh) * 100) + '%' }} /></div>
          </div>
        ))}
      </section>

      {/* Conquistas */}
      <section className="section">
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>Medalhas</h2>
        <div className="ach-grid">
          {ACHIEVEMENTS.map((a) => {
            const on = !!state.achievements[a.id];
            return (
              <div key={a.id} className={`ach ${on ? 'unlocked' : ''}`}>
                <div className="ico">{on ? a.icon : '🔒'}</div>
                <div className="n">{a.name}</div>
                <div className="d">{a.desc}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
