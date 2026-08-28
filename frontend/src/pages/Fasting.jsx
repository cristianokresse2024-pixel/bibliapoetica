import { useEffect, useState } from 'react';
import { useProgress, startFast, cancelFast, completeFast } from '../lib/progress.js';
import { useToast } from '../lib/toast.jsx';
import { ensureNotifyPermission, notify, beep, fmtLong } from '../lib/notify.js';

const FAST_TYPES = [
  { id: 'total', label: 'Jejum total', desc: 'Sem alimento e sem água', icon: '💧' },
  { id: 'normal', label: 'Jejum normal', desc: 'Sem alimento, apenas água', icon: '🍽️' },
  { id: 'daniel', label: 'Jejum de Daniel', desc: 'Só vegetais e água', icon: '🥬' },
  { id: 'parcial', label: 'Jejum parcial', desc: 'Uma refeição por dia', icon: '🌤️' },
  { id: 'midia', label: 'Jejum de mídia', desc: 'Sem redes sociais/TV', icon: '📵' },
  { id: 'proprio', label: 'Outro', desc: 'Defina o seu', icon: '✨' },
];

export default function Fasting() {
  const state = useProgress();
  const toast = useToast();
  const active = state.fast.active;

  const [typeId, setTypeId] = useState('normal');
  const [unit, setUnit] = useState('horas'); // horas | dias
  const [amount, setAmount] = useState(24);
  const [customLabel, setCustomLabel] = useState('');
  const [note, setNote] = useState('');
  const [now, setNow] = useState(Date.now());

  // relógio ao vivo
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  async function begin() {
    const perm = await ensureNotifyPermission();
    if (perm === 'denied') {
      toast({ icon: '🔔', title: 'Notificações bloqueadas', desc: 'Ative nas configurações para ser avisado.' });
    }
    const type = FAST_TYPES.find((t) => t.id === typeId);
    const plannedMs = (unit === 'dias' ? amount * 24 : amount) * 3600000;
    const label = typeId === 'proprio' && customLabel.trim() ? customLabel.trim() : type.label;
    startFast({ type: typeId, label, plannedMs, note });
    toast({ icon: type.icon, title: 'Jejum iniciado!', desc: `${label} · ${unit === 'dias' ? amount + ' dia(s)' : amount + 'h'}` });
  }

  function finish() {
    const res = completeFast();
    toast({ icon: '🌙', title: `+${20 + Math.round(res.hours * 3)} XP`, desc: `Jejum concluído: ${res.hours}h. Deus honra sua entrega!` });
    res.newAchievements?.forEach((a, i) =>
      setTimeout(() => toast({ icon: a.icon, title: 'Conquista desbloqueada!', desc: a.name }), 600 * (i + 1))
    );
  }

  function cancel() {
    if (confirm('Deseja realmente cancelar este jejum? Ele não será registrado.')) {
      cancelFast();
      toast({ icon: '⏹️', title: 'Jejum cancelado' });
    }
  }

  // ---- Estado ATIVO ----
  if (active) {
    const totalMs = active.endTs - active.startTs;
    const elapsedMs = now - active.startTs;
    const remainingMs = active.endTs - now;
    const pct = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));
    const done = remainingMs <= 0;
    const type = FAST_TYPES.find((t) => t.id === active.type) || FAST_TYPES[5];

    return (
      <div className="fade-in">
        <section className="section">
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '18px 0 4px' }}>🌙 Jejum em andamento</h2>
          <p className="sub">“Quando jejuardes... teu Pai, que vê em secreto, te recompensará.” — Mateus 6:17-18</p>
        </section>

        <section className="section">
          <div className="secret-card fast-active-card">
            <div className="fast-type-badge">{type.icon} {active.label}</div>

            <div className="fast-count-wrap">
              <div className={`fast-count ${done ? 'done' : ''}`}>{done ? '✓ Concluído!' : fmtLong(remainingMs / 1000)}</div>
              <div className="muted">{done ? 'Você cumpriu seu propósito!' : 'restante'}</div>
            </div>

            <div className="bar" style={{ margin: '6px 0 4px' }}><span style={{ width: pct + '%' }} /></div>
            <div className="row-between" style={{ fontSize: 13 }}>
              <span className="muted">Decorrido: {fmtLong(Math.max(0, elapsedMs) / 1000)}</span>
              <span className="muted">{Math.round(pct)}%</span>
            </div>

            {active.note && <p className="fast-note">🎯 {active.note}</p>}

            <div className="fast-meta muted">
              Início: {new Date(active.startTs).toLocaleString('pt-BR')}<br />
              Meta: {new Date(active.endTs).toLocaleString('pt-BR')}
            </div>

            <div className="intro-actions">
              <button className="btn" onClick={finish}>{done ? '🎉 Registrar conclusão' : '✓ Encerrar agora'}</button>
              <button className="btn ghost" onClick={cancel}>Cancelar</button>
            </div>
            <p className="muted" style={{ fontSize: 12.5, textAlign: 'center', marginBottom: 0 }}>
              🔔 Você será avisado quando faltarem 5 minutos e quando o tempo se cumprir. Deixe o app aberto para receber o alerta.
            </p>
          </div>
        </section>
      </div>
    );
  }

  // ---- Estado de CONFIGURAÇÃO ----
  return (
    <div className="fade-in">
      <section className="section">
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '18px 0 4px' }}>🌙 Jejum</h2>
        <p className="sub">Consagre um tempo a Deus. Escolha o tipo e a duração — o app cuida do resto.</p>
      </section>

      <section className="section">
        <div className="secret-card">
          <h3 style={{ marginTop: 0 }}>Tipo de jejum</h3>
          <div className="fast-types">
            {FAST_TYPES.map((t) => (
              <button key={t.id} className={`fast-type ${typeId === t.id ? 'active' : ''}`} onClick={() => setTypeId(t.id)}>
                <span className="ft-ic">{t.icon}</span>
                <span className="ft-name">{t.label}</span>
                <span className="ft-desc">{t.desc}</span>
              </button>
            ))}
          </div>

          {typeId === 'proprio' && (
            <input className="note-box" placeholder="Nome do seu jejum (ex.: Jejum de açúcar)" value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)} style={{ marginTop: 14 }} />
          )}

          <h3 style={{ marginBottom: 8 }}>Duração</h3>
          <div className="custom-row">
            <input type="number" min="1" max={unit === 'dias' ? 40 : 720} value={amount}
              onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value || '1', 10)))}
              className="select" style={{ width: 100 }} />
            <div className="unit-toggle">
              <button className={unit === 'horas' ? 'active' : ''} onClick={() => setUnit('horas')}>Horas</button>
              <button className={unit === 'dias' ? 'active' : ''} onClick={() => setUnit('dias')}>Dias</button>
            </div>
          </div>
          <div className="quick-durations">
            {(unit === 'horas' ? [3, 6, 12, 24, 40] : [1, 3, 7, 21, 40]).map((v) => (
              <button key={v} className={`chip ${amount === v ? 'active' : ''}`} onClick={() => setAmount(v)}>
                {v} {unit === 'dias' ? (v === 1 ? 'dia' : 'dias') : 'h'}
              </button>
            ))}
          </div>

          <h3 style={{ marginBottom: 8 }}>Propósito / motivo (opcional)</h3>
          <input className="note-box" placeholder="Ex.: Buscar direção, interceder pela família..." value={note}
            onChange={(e) => setNote(e.target.value)} />

          <button className="btn big-btn" onClick={begin} style={{ marginTop: 18 }}>🌙 Iniciar jejum</button>
        </div>
      </section>

      {state.fast.completed > 0 && (
        <section className="section">
          <h3 style={{ fontSize: 18, marginBottom: 12 }}>Seu histórico de jejuns</h3>
          <div className="stat-grid">
            <div className="stat"><div className="big gold">{state.fast.completed}</div><div className="lbl">Concluídos</div></div>
            <div className="stat"><div className="big">{state.fast.totalHours}h</div><div className="lbl">Total jejuado</div></div>
            <div className="stat"><div className="big">{state.fast.longestHours}h</div><div className="lbl">Maior jejum</div></div>
            <div className="stat"><div className="big">🔥</div><div className="lbl">Consagração</div></div>
          </div>
        </section>
      )}
    </div>
  );
}
