import { useEffect, useRef, useState } from 'react';
import { useProgress, recordPrayer, setPrayerGoal, setPrayerReminder } from '../lib/progress.js';
import { useToast } from '../lib/toast.jsx';
import { beep, fmtHMS, ensureNotifyPermission, notify } from '../lib/notify.js';

const PRESETS = [5, 10, 15, 20, 30, 45, 60];

const AUDIO_SOURCES = [
  './audio/lugar-secreto.mp3',
  '/audio/lugar-secreto.mp3',
  './lugar-secreto.mp3',
  '/lugar-secreto.mp3'
];

export default function Prayer() {
  const state = useProgress();
  const toast = useToast();
  const [goalMin, setGoalMin] = useState(state.prayer.lastGoalMin || 15);
  const [phase, setPhase] = useState('setup'); // setup | praying | done
  const [remaining, setRemaining] = useState(goalMin * 60);
  const [elapsed, setElapsed] = useState(0);
  const [musicMode, setMusicMode] = useState('music'); // 'music' | 'none'
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [audioStatusText, setAudioStatusText] = useState('Pronto para tocar');
  const [sourceIndex, setSourceIndex] = useState(0);

  const tickRef = useRef(null);
  const endRef = useRef(0);
  const audioRef = useRef(null);

  // Sincroniza volume com elemento de áudio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Limpeza ao desmontar
  useEffect(() => {
    return () => {
      clearInterval(tickRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  function playAudioDirectly() {
    if (!audioRef.current) return;
    setAudioStatusText('Carregando áudio...');
    audioRef.current.volume = volume;
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setAudioStatusText('Tocando áudio');
        })
        .catch((err) => {
          console.warn('[Audio play failed/blocked]:', err);
          setIsPlaying(false);
          setAudioStatusText('Toque em ▶ Tocar para iniciar');
        });
    }
  }

  function start() {
    // 1. Toca o áudio de forma síncrona no clique para autorizar o navegador (sem bloqueio de autoplay)
    if (musicMode === 'music') {
      playAudioDirectly();
    } else if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    // 2. Notificações (em segundo plano sem travar o clique)
    ensureNotifyPermission().catch(() => {});

    // 3. Inicialização do cronômetro
    const total = goalMin * 60;
    setPrayerGoal(goalMin);
    setRemaining(total);
    setElapsed(0);
    setPhase('praying');

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

  function handleToggleAudio() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setAudioStatusText('Em Pausa');
    } else {
      playAudioDirectly();
    }
  }

  function handleAudioError(e) {
    console.warn(`[Audio error on source: ${AUDIO_SOURCES[sourceIndex]}]:`, e);
    if (sourceIndex < AUDIO_SOURCES.length - 1) {
      const nextIdx = sourceIndex + 1;
      setSourceIndex(nextIdx);
      if (audioRef.current) {
        audioRef.current.src = AUDIO_SOURCES[nextIdx];
        if (phase === 'praying' && musicMode === 'music') {
          audioRef.current.play().catch(() => {});
        }
      }
    } else {
      setAudioStatusText('Não foi possível carregar o arquivo de áudio.');
    }
  }

  function finish(seconds, completedFull) {
    clearInterval(tickRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
    setPhase('done');
    const res = recordPrayer(seconds, goalMin);
    toast({ icon: '🙏', title: `+${5 + res.mins} XP`, desc: `Oração de ${res.mins} min registrada!` });
    res.newAchievements?.forEach((a, i) =>
      setTimeout(() => toast({ icon: a.icon, title: 'Conquista desbloqueada!', desc: a.name }), 600 * (i + 1))
    );
  }

  function stopEarly() {
    if (elapsed < 30) {
      clearInterval(tickRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
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
      {/* Elemento de Áudio Nativo HTML5 */}
      <audio
        ref={audioRef}
        src={AUDIO_SOURCES[sourceIndex]}
        loop
        preload="auto"
        onPlay={() => { setIsPlaying(true); setAudioStatusText('Tocando'); }}
        onPause={() => { setIsPlaying(false); setAudioStatusText('Em Pausa'); }}
        onPlaying={() => { setIsPlaying(true); setAudioStatusText('Tocando'); }}
        onError={handleAudioError}
      />

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
              <input
                type="number"
                min="1"
                max="240"
                value={goalMin}
                onChange={(e) => setGoalMin(Math.max(1, Math.min(240, parseInt(e.target.value || '1', 10))))}
                className="select"
                style={{ width: 90 }}
              />
              <span className="muted">minutos</span>
            </div>

            <h3 style={{ marginBottom: 8, marginTop: 16 }}>🎵 Fundo musical de oração</h3>
            <div className="music-modes" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
              <button
                type="button"
                className={`music-mode ${musicMode === 'music' ? 'active' : ''}`}
                onClick={() => setMusicMode('music')}
              >
                <span className="mm-ic">🎶</span>
                <span className="mm-name">Fundo Musical</span>
                <span className="mm-desc">Suave, contínuo e sem anúncios</span>
              </button>
              <button
                type="button"
                className={`music-mode ${musicMode === 'none' ? 'active' : ''}`}
                onClick={() => setMusicMode('none')}
              >
                <span className="mm-ic">🔇</span>
                <span className="mm-name">Silêncio</span>
                <span className="mm-desc">Sem música</span>
              </button>
            </div>

            <button className="btn big-btn" onClick={start} style={{ marginTop: 14 }}>
              🙏 Entrar no Lugar Secreto
            </button>
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
                <circle
                  cx="150"
                  cy="150"
                  r="130"
                  className="ring-fg"
                  style={{ stroke: 'url(#goldgrad)', strokeDasharray: circ, strokeDashoffset: circ - (circ * progress) / 100 }}
                />
              </svg>
              <div className="timer-center">
                <div className="timer-big">{fmtHMS(Math.max(0, remaining))}</div>
                <div className="timer-sub">restante · orando há {fmtHMS(elapsed)}</div>
              </div>
            </div>

            {/* Painel do Fundo Musical Durante a Oração */}
            {musicMode === 'music' && (
              <div
                style={{
                  background: 'rgba(251,191,36,0.06)',
                  border: '1px solid rgba(251,191,36,0.2)',
                  borderRadius: 12,
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  maxWidth: 380,
                  margin: '12px auto 0',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    type="button"
                    className="btn ghost sm"
                    onClick={handleToggleAudio}
                    style={{ padding: '6px 12px', fontSize: 13, background: 'rgba(255,255,255,0.08)' }}
                  >
                    {isPlaying ? '⏸ Pausar' : '▶ Tocar'}
                  </button>
                  <span style={{ fontSize: 13, color: isPlaying ? '#fde68a' : 'var(--text-sub)' }}>
                    {isPlaying ? '🎵 Tocando Música' : audioStatusText}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12 }} className="muted">🔊</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    style={{ width: 70 }}
                  />
                </div>
              </div>
            )}

            <p className="muted" style={{ textAlign: 'center', maxWidth: 420, margin: '14px auto 0' }}>
              Aquiete o coração. Fale com Deus como se fala a um amigo. Ele está aqui, no secreto.
            </p>

            <button className="btn ghost big-btn" onClick={stopEarly}>
              Concluir oração
            </button>
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

      {/* Lembrete de oração */}
      {phase === 'setup' && (
        <section className="section">
          <div className="secret-card" style={{ gap: 12 }}>
            <div className="row-between">
              <h3 style={{ margin: 0 }}>🔔 Lembrete diário de oração</h3>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={state.prayerReminder.enabled}
                  onChange={async (e) => {
                    if (e.target.checked) { await ensureNotifyPermission(); }
                    setPrayerReminder({ enabled: e.target.checked });
                    if (e.target.checked) toast({ icon: '🔔', title: 'Lembrete ativado!', desc: `Todo dia às ${state.prayerReminder.time}` });
                  }}
                />
                <span className="slider" />
              </label>
            </div>
            <p className="muted" style={{ margin: 0, fontSize: 13.5 }}>
              Receba um aviso todos os dias no horário escolhido para separar um tempo com Deus. (Mantenha o app aberto ou instalado para receber.)
            </p>
            {state.prayerReminder.enabled && (
              <div className="custom-row">
                <label>Horário:</label>
                <input
                  type="time"
                  className="select"
                  value={state.prayerReminder.time}
                  onChange={(e) => setPrayerReminder({ time: e.target.value })}
                />
              </div>
            )}
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
