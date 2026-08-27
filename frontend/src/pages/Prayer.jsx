import { useEffect, useRef, useState } from 'react';
import { useProgress, recordPrayer, setPrayerGoal } from '../lib/progress.js';
import { useToast } from '../lib/toast.jsx';
import { beep, fmtHMS, ensureNotifyPermission, notify } from '../lib/notify.js';

// Vídeo/fundo musical enviado pelo usuário
const YT_ID = 'gJiE359iht4';
const PRESETS = [5, 10, 15, 20, 30, 45, 60];

export default function Prayer() {
  const state = useProgress();
  const toast = useToast();
  const [goalMin, setGoalMin] = useState(state.prayer.lastGoalMin || 15);
  const [phase, setPhase] = useState('setup'); // setup | praying | done
  const [remaining, setRemaining] = useState(goalMin * 60);
  const [elapsed, setElapsed] = useState(0);
  const [music, setMusic] = useState(true);
  const [ytOn, setYtOn] = useState(false);
  const tickRef = useRef(null);
  const endRef = useRef(0);

  useEffect(() => () => clearInterval(tickRef.current), []);

  async function start() {
    await ensureNotifyPermission();
    const total = goalMin * 60;
    setPrayerGoal(goalMin);
    setRemaining(total);
    setElapsed(0);
    setPhase('praying');
    if (music) setYtOn(true);
    endRef.current = Date.now() + total * 1000;
    const startTs = Date.now();
    clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      const now = Date.now();
      const rem = Math.round((endRef.current - now) / 1000);
      setElapsed(Math.round((now - startTs) / 1000));
      setRemaining(rem);
      if (rem <= 0) {
        clearInterval(tickRef.current);
        beep(3);
        notify('🕊️ Tempo de oração concluído', 'Amém! Você completou seu tempo no Lugar Secreto.', 'prayer-end');
        finish(total, true);
      }
    }, 250);
  }

  function finish(seconds, completedFull) {
    clearInterval(tickRef.current);
    setYtOn(false);
    setPhase('done');
    const res = recordPrayer(seconds, goalMin);
    toast({ icon: '🙏', title: `+${5 + res.mins} XP`, desc: `Oração de ${res.mins} min registrada!` });
    res.newAchievements?.forEach((a, i) =>
      setTimeout(() => toast({ icon: a.icon, title: 'Conquista desbloqueada!', desc: a.name }), 600 * (i + 1))
    );
  }

  function stopEarly() {
    if (elapsed < 30) {
      // muito curto: descarta
      clearInterval(tickRef.current);
      setYtOn(false);
      setPhase('setup');
      toast({ icon: '⏹️', title: 'Oração encerrada', desc: 'Tempo muito curto para registrar.' });
      return;
    }
    finish(elapsed, false);
  }

  const progress = phase === 'praying' ? (elapsed / (goalMin * 60)) * 100 : 0;
  const circ = 2 * Math.PI * 130;

  return (
    <div className="fade-in prayer-page">
      <section className="section">
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '18px 0 4px' }}>🕊️ Lugar Secreto</h2>
        <p className="sub">“Tu, porém, quando orares, entra no teu quarto e, fechada a porta, orarás a teu Pai em secreto.” — Mateus 6:6</p>
      </section>

      {phase === 'setup' && (
        <section className="section prayer-setup fade-in">
          <div className="secret-card">
            <h3 style={{ marginTop: 0 }}>Quanto tempo você vai orar?</h3>
            <div className="preset-grid">
              {PRESETS.map((m) => (
                <button key={m} className={`preset ${goalMin === m ? 'active' : ''}`} onClick={() => setGoalMin(m)}>
                  {m} min
                </button>
              ))}
            </div>
            <div className="custom-row">
              <label>Personalizado:</label>
              <input type="number" min="1" max="240" value={goalMin}
                onChange={(e) => setGoalMin(Math.max(1, Math.min(240, parseInt(e.target.value || '1', 10))))}
                className="select" style={{ width: 90 }} />
              <span className="muted">minutos</span>
            </div>

            <label className="music-toggle">
              <input type="checkbox" checked={music} onChange={(e) => setMusic(e.target.checked)} />
              <span>🎵 Tocar fundo musical (inicia com o cronômetro)</span>
            </label>

            <button className="btn big-btn" onClick={start}>🙏 Entrar no Lugar Secreto</button>
          </div>
        </section>
      )}

      {phase === 'praying' && (
        <section className="section fade-in">
          <div className="secret-card praying-card">
            <div className="timer-ring">
              <svg viewBox="0 0 300 300" width="280" height="280">
                <defs>
                  <linearGradient id="goldgrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#fbbf24" />
                    <stop offset="1" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <circle cx="150" cy="150" r="130" className="ring-bg" />
                <circle cx="150" cy="150" r="130" className="ring-fg"
                  style={{ stroke: 'url(#goldgrad)', strokeDasharray: circ, strokeDashoffset: circ - (circ * progress) / 100 }} />
              </svg>
              <div className="timer-center">
                <div className="timer-big">{fmtHMS(Math.max(0, remaining))}</div>
                <div className="timer-sub">restante · orando há {fmtHMS(elapsed)}</div>
              </div>
            </div>

            {ytOn && (
              <div className="yt-wrap">
                <iframe
                  title="Fundo musical de oração"
                  width="100%" height="120"
                  src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&loop=1&playlist=${YT_ID}&controls=1&modestbranding=1&rel=0`}
                  frameBorder="0"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                />
                <div className="yt-hint">
                  🎵 Se a música não iniciar, toque em ▶ acima.{' '}
                  <a href={`https://www.youtube.com/watch?v=${YT_ID}&list=RD${YT_ID}&start_radio=1`} target="_blank" rel="noreferrer">Abrir no YouTube</a>
                </div>
              </div>
            )}

            <p className="muted" style={{ textAlign: 'center', maxWidth: 420, margin: '4px auto 0' }}>
              Aquiete o coração. Fale com Deus como se fala a um amigo. Ele está aqui, no secreto.
            </p>

            <button className="btn ghost big-btn" onClick={stopEarly}>Concluir oração</button>
          </div>
        </section>
      )}

      {phase === 'done' && (
        <section className="section fade-in">
          <div className="secret-card done-card">
            <div style={{ fontSize: 56 }}>🕊️</div>
            <h3>Amém!</h3>
            <p className="muted">Você orou por <strong style={{ color: 'var(--gold)' }}>{Math.max(1, Math.round(elapsed / 60))} minutos</strong>. Que a paz de Deus guarde seu coração.</p>
            <div className="mini-stats">
              <div><div className="ms-big">{state.prayer.sessions}</div><div className="ms-lbl">Orações</div></div>
              <div><div className="ms-big">{Math.round(state.prayer.totalSeconds / 60)}</div><div className="ms-lbl">Minutos totais</div></div>
              <div><div className="ms-big">{fmtHMS(state.prayer.longest)}</div><div className="ms-lbl">Maior sessão</div></div>
            </div>
            <button className="btn big-btn" onClick={() => { setPhase('setup'); setElapsed(0); }}>Orar novamente</button>
          </div>
        </section>
      )}

      {/* Resumo de oração */}
      {phase === 'setup' && state.prayer.sessions > 0 && (
        <section className="section">
          <h3 style={{ fontSize: 18, marginBottom: 12 }}>Sua vida de oração</h3>
          <div className="stat-grid">
            <div className="stat"><div className="big gold">{state.prayer.sessions}</div><div className="lbl">Orações</div></div>
            <div className="stat"><div className="big">{Math.round(state.prayer.totalSeconds / 60)}</div><div className="lbl">Minutos totais</div></div>
            <div className="stat"><div className="big">{fmtHMS(state.prayer.longest)}</div><div className="lbl">Maior sessão</div></div>
            <div className="stat"><div className="big">{Object.keys(state.prayer.log).length}</div><div className="lbl">Dias orando</div></div>
          </div>
        </section>
      )}
    </div>
  );
}
