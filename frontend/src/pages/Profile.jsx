import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand.js';
import { useProgress, computeStats } from '../lib/progress.js';

// PERFIL — dados do usuário, assinatura Premium e indicação.
// FASE 1: mostra progresso local (localStorage) e prévias de Conta/Premium/Indicação
// que serão ativadas com o backend (Firebase Auth + Firestore + Mercado Pago).

export default function Profile({ index }) {
  const state = useProgress();
  const stats = computeStats(index);

  return (
    <div className="fade-in">
      <section className="section">
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '18px 0 4px' }}>👤 Perfil</h2>
        <p className="sub">{BRAND.positioning}</p>
      </section>

      {/* Conta (em breve) */}
      <section className="section">
        <div className="secret-card" style={{ gap: 10 }}>
          <div className="row-between">
            <h3 style={{ margin: 0 }}>Sua conta</h3>
            <span className="sc-badge">Visitante</span>
          </div>
          <p className="muted" style={{ margin: 0 }}>
            Hoje seu progresso é salvo neste dispositivo. Com uma conta, ele ficará seguro na nuvem
            e acessível em qualquer aparelho.
          </p>
          <button className="btn ghost sm" disabled style={{ alignSelf: 'flex-start' }}>Criar conta · em breve</button>
        </div>
      </section>

      {/* Progresso local */}
      <section className="section">
        <h3 style={{ fontSize: 18, marginBottom: 12 }}>Seu progresso</h3>
        <div className="stat-grid">
          <div className="stat"><div className="big gold">{stats.readCount}</div><div className="lbl">Capítulos lidos</div></div>
          <div className="stat"><div className="big">{stats.percent}%</div><div className="lbl">Da Bíblia</div></div>
          <div className="stat"><div className="big">🔥 {stats.streak}</div><div className="lbl">Dias seguidos</div></div>
          <div className="stat"><div className="big">⭐ {stats.level.level}</div><div className="lbl">Nível</div></div>
        </div>
        <Link className="btn ghost sm" to="/jornada" style={{ marginTop: 12 }}>Ver jornada completa →</Link>
      </section>

      {/* Premium */}
      <section className="section">
        <div className="premium-card">
          <div className="premium-glow" />
          <div className="premium-body">
            <span className="sc-badge gold-badge">Premium</span>
            <h3 style={{ margin: '8px 0 4px' }}>{BRAND.name} Premium</h3>
            <div className="premium-price"><strong>R$ 29,90</strong> <span className="muted">/ mês</span></div>
            <p className="muted" style={{ margin: '8px 0 12px' }}>
              Acesso ao ecossistema completo: IA Viva, Estudos, Comunidade e muito mais.
            </p>
            <button className="btn" disabled>Assinar · em breve</button>
          </div>
        </div>
      </section>

      {/* Indicação */}
      <section className="section">
        <div className="secret-card" style={{ gap: 10 }}>
          <h3 style={{ margin: 0 }}>🎁 Indique e cresça junto</h3>
          <p className="muted" style={{ margin: 0 }}>
            Em breve você terá um código exclusivo (ex.: <code>VIVA-ABC123</code>) e um link para
            convidar amigos para a jornada.
          </p>
          <div className="ref-box">
            <span className="ref-code">VIVA-••••••</span>
            <button className="btn ghost sm" disabled>Copiar · em breve</button>
          </div>
        </div>
      </section>
    </div>
  );
}
