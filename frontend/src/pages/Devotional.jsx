import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getActiveDevotional,
  getPastDevotionals,
  getDevotionalAudioUrls,
} from '../data/devotionalsData.js';
import { useToast } from '../lib/toast.jsx';

function fmtTime(sec) {
  if (isNaN(sec) || sec < 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function Devotional() {
  const toast = useToast();
  const [currentDevotional, setCurrentDevotional] = useState(getActiveDevotional());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [sourceIdx, setSourceIdx] = useState(0);
  const [audioStateText, setAudioStateText] = useState('Pronto para ouvir');

  const audioRef = useRef(null);
  const sources = currentDevotional ? getDevotionalAudioUrls(currentDevotional.audioFileName) : [];
  const pastList = getPastDevotionals();

  // Troca de devocional
  const handleSelectDevotional = (dev) => {
    setCurrentDevotional(dev);
    setSourceIdx(0);
    setCurrentTime(0);
    setIsPlaying(false);
    setAudioStateText('Carregando áudio...');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ajusta velocidade de reprodução
  const handleRateChange = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // Pular 15s
  const handleSkip = (seconds) => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Seek na barra
  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const seekTo = parseFloat(e.target.value);
    audioRef.current.currentTime = seekTo;
    setCurrentTime(seekTo);
  };

  // Play / Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setAudioStateText('Em Pausa');
    } else {
      setAudioStateText('Carregando...');
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setAudioStateText('Tocando');
        })
        .catch((err) => {
          console.warn('[Devotional Audio Blocked/Error]:', err);
          setIsPlaying(false);
          setAudioStateText('Toque em ▶ para iniciar');
        });
    }
  };

  // Fallback de URL de áudio em caso de erro na CDN primária
  const handleAudioError = () => {
    if (sourceIdx < sources.length - 1) {
      const next = sourceIdx + 1;
      setSourceIdx(next);
      if (audioRef.current) {
        audioRef.current.src = sources[next];
        if (isPlaying) {
          audioRef.current.play().catch(() => {});
        }
      }
    } else {
      setAudioStateText('Áudio em processamento na nuvem.');
    }
  };

  // Compartilhar no WhatsApp
  const handleShare = () => {
    if (!currentDevotional) return;
    const shareText = `🎙️ *Devocional Diário — ${currentDevotional.title}*\n\n📖 _${currentDevotional.verse}_ (${currentDevotional.verseRef})\n\nOuça o devocional em áudio gratuitamente no app Viva Inteligente:\nhttps://vivainteligente.app.br/#/devocional`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  if (!currentDevotional) {
    return (
      <div className="fade-in section" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 48 }}>🎙️</div>
        <h2>Devocionais em Preparação</h2>
        <p className="muted">O primeiro devocional diário será publicado em breve!</p>
        <Link to="/" className="btn" style={{ marginTop: 12 }}>← Voltar para a Página Inicial</Link>
      </div>
    );
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fade-in devotional-page">
      {/* Elemento de áudio nativo */}
      <audio
        ref={audioRef}
        src={sources[sourceIdx]}
        preload="metadata"
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setAudioStateText('Concluído');
        }}
        onError={handleAudioError}
      />

      {/* Cabeçalho */}
      <section className="section">
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '18px 0 4px' }}>
          🎙️ Devocional Diário em Áudio
        </h2>
        <p className="sub">
          Comece o seu dia ouvindo uma palavra de fé, sabedoria e direção bíblica para a sua vida.
        </p>
      </section>

      {/* Player Principal do Devocional */}
      <section className="section">
        <div
          className="secret-card"
          style={{
            background: 'linear-gradient(180deg, rgba(251,191,36,0.08) 0%, rgba(20,15,35,0.9) 100%)',
            border: '1px solid rgba(251,191,36,0.25)',
            borderRadius: 18,
            padding: '30px 24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Header do Card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            <span className="sc-badge gold-badge" style={{ fontSize: 12 }}>
              🌟 {currentDevotional.dateFormatted || 'Devocional de Hoje'}
            </span>
            <span style={{ fontSize: 13, color: '#c4b5fd' }}>
              🎙️ {currentDevotional.author || 'Ministério Fé Inteligente'}
            </span>
          </div>

          {/* Título da Mensagem */}
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 24, margin: '0 0 14px', color: '#fde68a', lineHeight: 1.3 }}>
            {currentDevotional.title}
          </h1>

          {/* Versículo Bíblico do Dia */}
          {currentDevotional.verse && (
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderLeft: '3px solid var(--gold)',
                borderRadius: '0 10px 10px 0',
                padding: '14px 18px',
                margin: '12px 0 20px',
                fontStyle: 'italic',
                color: '#e2e8f0',
                fontSize: 14.5,
                lineHeight: 1.6,
              }}
            >
              <p style={{ margin: 0 }}>{currentDevotional.verse}</p>
              {currentDevotional.verseRef && (
                <div style={{ textAlign: 'right', marginTop: 6, fontWeight: 'bold', color: 'var(--gold)', fontStyle: 'normal', fontSize: 13 }}>
                  — {currentDevotional.verseRef}
                </div>
              )}
            </div>
          )}

          {/* Player Controls Container */}
          <div
            style={{
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              padding: '20px',
              marginTop: 10,
            }}
          >
            {/* Barra de Progresso Interativa */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                style={{ width: '100%', cursor: 'pointer', accentColor: '#fbbf24' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-sub)' }}>
                <span>{fmtTime(currentTime)}</span>
                <span style={{ color: isPlaying ? '#fde68a' : 'inherit' }}>
                  {isPlaying ? '🎵 Reproduzindo' : audioStateText}
                </span>
                <span>{fmtTime(duration)}</span>
              </div>
            </div>

            {/* Botões de Ação do Player */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              {/* Voltar 15s */}
              <button
                type="button"
                className="btn ghost sm"
                onClick={() => handleSkip(-15)}
                title="Voltar 15 segundos"
                style={{ padding: '8px 12px', fontSize: 13 }}
              >
                ⏪ -15s
              </button>

              {/* Botão Play / Pause Gigante */}
              <button
                type="button"
                onClick={togglePlay}
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#0f0a1e',
                  border: 'none',
                  fontSize: 22,
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(251,191,36,0.35)',
                  transition: 'transform 0.15s ease',
                }}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>

              {/* Avançar 15s */}
              <button
                type="button"
                className="btn ghost sm"
                onClick={() => handleSkip(15)}
                title="Avançar 15 segundos"
                style={{ padding: '8px 12px', fontSize: 13 }}
              >
                +15s ⏩
              </button>
            </div>

            {/* Controles Secundários: Velocidade & Compartilhar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
                marginTop: 20,
                paddingTop: 14,
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Seletor de Velocidade */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--text-sub)' }}>Velocidade:</span>
                {[1, 1.25, 1.5, 2].map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`btn ghost sm ${playbackRate === r ? 'active' : ''}`}
                    onClick={() => handleRateChange(r)}
                    style={{
                      padding: '4px 8px',
                      fontSize: 11.5,
                      background: playbackRate === r ? 'rgba(251,191,36,0.2)' : 'transparent',
                      border: playbackRate === r ? '1px solid rgba(251,191,36,0.4)' : '1px solid rgba(255,255,255,0.1)',
                      color: playbackRate === r ? '#fde68a' : 'var(--text-sub)',
                    }}
                  >
                    {r}x
                  </button>
                ))}
              </div>

              {/* Botão Compartilhar */}
              <button
                type="button"
                className="btn sm"
                onClick={handleShare}
                style={{
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: '#fff',
                  border: 'none',
                  fontSize: 12.5,
                  padding: '6px 14px',
                }}
              >
                📲 Compartilhar no WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Histórico: Devocionais Anteriores */}
      {pastList.length > 0 && (
        <section className="section" style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 20, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📜</span> Devocionais Anteriores
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pastList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectDevotional(item)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <div>
                  <span style={{ fontSize: 11.5, color: '#fbbf24', display: 'block', marginBottom: 2 }}>
                    📅 {item.dateFormatted}
                  </span>
                  <h4 style={{ margin: 0, fontSize: 16, color: '#f1f5f9' }}>{item.title}</h4>
                  {item.verseRef && (
                    <span style={{ fontSize: 12.5, color: 'var(--text-sub)' }}>📖 {item.verseRef}</span>
                  )}
                </div>
                <button type="button" className="btn ghost sm" style={{ padding: '6px 12px', fontSize: 12 }}>
                  ▶ Ouvir
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
