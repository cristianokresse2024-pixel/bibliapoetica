import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { isVipEmail } from '../config/vipList.js';
import { BRAND } from '../config/brand.js';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    authModalMessage,
    login,
    register,
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const isModeLogin = authModalMode === 'login';
  const isVip = isVipEmail(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isModeLogin) {
        await login({ email, password });
      } else {
        await register({ name, email, password });
      }
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao processar sua solicitação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={closeAuthModal}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={closeAuthModal} aria-label="Fechar">
          ✕
        </button>

        <div className="auth-modal-header">
          <img src={BRAND.logo} alt="Logo" className="auth-modal-logo" />
          <h2>{isModeLogin ? 'Acessar sua Conta' : 'Criar sua Conta'}</h2>
          <p className="auth-modal-sub">
            {authModalMessage || (isModeLogin
              ? 'Entre para acessar todos os recursos do Movimento Fé Inteligente.'
              : 'Cadastre-se para começar sua jornada de crescimento espiritual.')}
          </p>
        </div>

        <div className="auth-modal-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${isModeLogin ? 'active' : ''}`}
            onClick={() => { setAuthModalMode('login'); setError(''); }}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${!isModeLogin ? 'active' : ''}`}
            onClick={() => { setAuthModalMode('register'); setError(''); }}
          >
            Cadastre-se
          </button>
        </div>

        {error && <div className="auth-error-banner">⚠️ {error}</div>}

        {isVip && !isModeLogin && (
          <div className="auth-vip-banner">
            👑 <strong>E-mail VIP Reconhecido:</strong> Você terá acesso total vitalício e gratuito!
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isModeLogin && (
            <div className="auth-field">
              <label>Nome Completo</label>
              <input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
          )}

          <div className="auth-field">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus={isModeLogin}
            />
          </div>

          <div className="auth-field">
            <div className="auth-label-row">
              <label>Senha</label>
              <button
                type="button"
                className="auth-show-pass-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={isModeLogin ? 'Sua senha' : 'Mínimo 6 caracteres'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn auth-submit-btn" disabled={loading}>
            {loading ? (
              <span>Carregando...</span>
            ) : isModeLogin ? (
              'Entrar no Aplicativo'
            ) : isVip ? (
              'Criar Conta VIP Gratuita'
            ) : (
              'Criar Minha Conta'
            )}
          </button>
        </form>

        <div className="auth-modal-footer">
          {isModeLogin ? (
            <p>
              Ainda não tem conta?{' '}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => { setAuthModalMode('register'); setError(''); }}
              >
                Cadastre-se gratuitamente
              </button>
            </p>
          ) : (
            <p>
              Já possui cadastro?{' '}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => { setAuthModalMode('login'); setError(''); }}
              >
                Faça login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
