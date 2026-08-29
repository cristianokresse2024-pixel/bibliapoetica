import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { startSubscriptionCheckout } from '../lib/checkoutService.js';

export default function PaywallCard({
  title = 'Recurso Exclusivo para Assinantes',
  description = 'Para acessar a IA Viva, os Estudos Avançados e a Comunidade, faça parte do Movimento Fé Inteligente.',
  icon = '👑',
}) {
  const { isLoggedIn, openAuthModal, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      openAuthModal('register', 'Crie sua conta para assinar o plano premium.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      await startSubscriptionCheckout(user);
    } catch (err) {
      console.error('[Checkout Error]:', err);
      setErrorMessage(err.message || 'Ocorreu um erro ao abrir o pagamento.');
      setLoading(false);
    }
  };

  return (
    <div className="paywall-card-container">
      <div className="paywall-card">
        <div className="paywall-badge">{icon} Área para Assinantes</div>

        <h2 className="paywall-title">{title}</h2>
        <p className="paywall-desc">{description}</p>

        <div className="paywall-benefits-list">
          <div className="paywall-benefit-item">
            <span className="paywall-check">✓</span>
            <div>
              <strong>IA Viva:</strong> Acesso a uma grande gama de conhecimento dos materiais do Movimento Viva Inteligente.
            </div>
          </div>

          <div className="paywall-benefit-item">
            <span className="paywall-check">✓</span>
            <div>
              <strong>Cursos e Aulas Completas:</strong> Trilhas de estudo bíblico, vídeos e materiais exclusivos.
            </div>
          </div>

          <div className="paywall-benefit-item">
            <span className="paywall-check">✓</span>
            <div>
              <strong>Comunidade do Reino:</strong> Compartilhe testemunhos, orações e experiências com outros membros.
            </div>
          </div>

          <div className="paywall-benefit-item">
            <span className="paywall-check">✓</span>
            <div>
              <strong>Explicação Versículo por Versículo:</strong> Análise doutrinária e histórica aprofundada.
            </div>
          </div>
        </div>

        <div className="paywall-actions">
          {!isLoggedIn ? (
            <div className="paywall-btn-group">
              <button
                type="button"
                className="btn paywall-primary-btn"
                onClick={() => openAuthModal('register')}
              >
                Cadastre-se para Acessar
              </button>
              <button
                type="button"
                className="btn ghost paywall-secondary-btn"
                onClick={() => openAuthModal('login')}
              >
                Já tem conta? Entrar
              </button>
            </div>
          ) : (
            <div className="paywall-btn-group">
              <button
                type="button"
                className="btn paywall-primary-btn"
                onClick={handleSubscribe}
                disabled={loading}
              >
                {loading ? 'Redirecionando ao Mercado Pago…' : 'Tornar-se Assinante Agora — R$ 29,90/mês'}
              </button>
              <p className="paywall-user-info">
                Logado como: <strong>{user?.email}</strong> (Plano Gratuito)
              </p>
            </div>
          )}

          {errorMessage && (
            <p className="error-msg" style={{ color: '#ef4444', marginTop: 10, fontSize: 14 }}>
              ⚠️ {errorMessage}
            </p>
          )}
        </div>

        <div className="paywall-free-reminder">
          🕊️ <em>Lembrando: A Bíblia, Lugar Secreto, Jejum e Gratidão são 100% gratuitos para todo mundo!</em>
        </div>
      </div>
    </div>
  );
}
