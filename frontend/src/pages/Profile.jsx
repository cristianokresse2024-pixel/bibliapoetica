import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand.js';
import { useProgress, computeStats } from '../lib/progress.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getReferralCode } from '../lib/ambassadorEngine.js';
import { startSubscriptionCheckout } from '../lib/checkoutService.js';

export default function Profile({ index }) {
  const state = useProgress();
  const stats = computeStats(index);
  const { user, isLoggedIn, isVip, isSubscriber, logout, openAuthModal } = useAuth();
  const [subscribing, setSubscribing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const isOwner = user?.email === 'cristianokresse2024@gmail.com';

  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      openAuthModal('register', 'Cadastre-se para assinar o plano premium.');
      return;
    }

    try {
      setSubscribing(true);
      setCheckoutError(null);
      await startSubscriptionCheckout(user);
    } catch (err) {
      console.error('[Profile Checkout Error]:', err);
      setCheckoutError(err.message || 'Erro ao abrir checkout de pagamento.');
      setSubscribing(false);
    }
  };

  return (
    <div className="fade-in">
      <section className="section">
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '18px 0 4px' }}>👤 Perfil</h2>
        <p className="sub">{BRAND.positioning}</p>
      </section>

      {/* Cartão de Conta / Autenticação */}
      <section className="section">
        <div className="secret-card" style={{ gap: 12 }}>
          {isLoggedIn ? (
            <>
              <div className="row-between" style={{ alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20 }}>{user.name}</h3>
                  <span className="muted" style={{ fontSize: 13 }}>{user.email}</span>
                </div>
                {isOwner ? (
                  <span className="sc-badge gold-badge" style={{ fontSize: 12, padding: '4px 10px' }}>
                    👑 Dono do Aplicativo
                  </span>
                ) : isVip ? (
                  <span className="sc-badge gold-badge" style={{ fontSize: 12, padding: '4px 10px' }}>
                    👑 Membro VIP Vitalício
                  </span>
                ) : isSubscriber ? (
                  <span className="sc-badge gold-badge" style={{ fontSize: 12, padding: '4px 10px' }}>
                    ⭐ Assinante Premium
                  </span>
                ) : (
                  <span className="sc-badge" style={{ fontSize: 12, padding: '4px 10px' }}>
                    Plano Gratuito
                  </span>
                )}
              </div>

              <div className="row" style={{ gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                <Link to="/embaixadores" className="btn sm">
                  👑 {isOwner ? 'Painel de Gestão do Dono' : 'Meu Painel de Embaixador'}
                </Link>
                <button
                  type="button"
                  className="btn ghost sm"
                  onClick={logout}
                  style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, .3)' }}
                >
                  Sair da Conta
                </button>
              </div>
            </>
          ) : (
            <div className="auth-prompt-box">
              <div style={{ fontSize: 32 }}>🔐</div>
              <h3 style={{ margin: '8px 0 4px' }}>Crie sua conta no {BRAND.name}</h3>
              <p className="muted" style={{ margin: '0 0 14px', fontSize: 14 }}>
                Sincronize seu progresso espiritual, acerte suas metas e convide amigos para ganhar meses grátis.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => openAuthModal('register')}
                >
                  Criar Conta Gratuita
                </button>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => openAuthModal('login')}
                >
                  Já tenho conta (Entrar)
                </button>
              </div>
            </div>
          )}
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

      {/* Plano de Assinatura */}
      <section className="section">
        <div className="premium-card">
          <div className="premium-glow" />
          <div className="premium-body">
            <span className="sc-badge gold-badge">
              {isOwner ? '👑 Proprietário Oficial' : isVip ? '👑 VIP Vitalício' : isSubscriber ? '⭐ Assinante Ativo' : 'Movimento Fé Inteligente'}
            </span>
            <h3 style={{ margin: '8px 0 4px' }}>{BRAND.name} Premium</h3>
            {isOwner || isVip ? (
              <p style={{ color: '#fde68a', fontWeight: 600, margin: '8px 0 12px' }}>
                Sua conta possui acesso total liberado a todas as ferramentas, IA Viva, Estudos e Comunidade!
              </p>
            ) : isSubscriber ? (
              <p style={{ color: '#86efac', fontWeight: 600, margin: '8px 0 12px' }}>
                Sua assinatura está ativa! Aproveite a IA Viva, os Estudos Avançados e a Comunidade.
              </p>
            ) : (
              <>
                <div className="premium-price"><strong>R$ 29,90</strong> <span className="muted">/ mês</span></div>
                <p className="muted" style={{ margin: '8px 0 12px' }}>
                  Acesso ao ecossistema completo: IA Viva com acesso a uma grande gama de conhecimento dos materiais do Movimento Viva Inteligente, Estudos, Aulas e Comunidade.
                </p>
                <button
                  type="button"
                  className="btn"
                  onClick={handleSubscribe}
                  disabled={subscribing}
                >
                  {subscribing ? 'Redirecionando ao Mercado Pago…' : isLoggedIn ? 'Assinar Agora — R$ 29,90/mês' : 'Cadastre-se para Assinar'}
                </button>
                {checkoutError && (
                  <p style={{ color: '#ef4444', marginTop: 8, fontSize: 13 }}>⚠️ {checkoutError}</p>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Programa Oficial de Embaixadores */}
      <section className="section">
        <div className="secret-card" style={{ gap: 12 }}>
          <div className="row-between" style={{ alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 19 }}>👑 Programa de Embaixadores</h3>
            <span className="sc-badge gold-badge">10 Ativos = Conta 100% Grátis</span>
          </div>

          <p className="muted" style={{ margin: 0 }}>
            Indique amigos para o Viva Inteligente. Conquiste <strong>meses grátis</strong> e mantenha sua <strong>assinatura 100% gratuita</strong> ao manter 10 indicados ativos!
          </p>

          <div className="affiliate-box">
            <div className="affiliate-code-row">
              <div>
                <span style={{ fontSize: 11.5, color: '#c4b5fd', display: 'block' }}>SEU CÓDIGO DE INDICAÇÃO:</span>
                <strong style={{ fontSize: 16, color: '#fde68a' }}>
                  {isLoggedIn ? getReferralCode(user) : 'CRIE SUA CONTA'}
                </strong>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Link to="/embaixadores" className="btn sm">
                  👑 {isOwner ? 'Abrir Painel do Dono →' : 'Abrir Painel de Embaixador →'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
