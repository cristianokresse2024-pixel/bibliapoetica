import { Link } from 'react-router-dom';
import { useProgress, computeStats } from '../lib/progress.js';
import { BRAND } from '../config/brand.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function TopBar({ index }) {
  const state = useProgress();
  const stats = computeStats(index);
  const { user, isVip, isSubscriber, openAuthModal, isLoggedIn } = useAuth();

  return (
    <header className="topbar">
      <div className="container row">
        <Link to="/" className="brand">
          <img className="logo" src={BRAND.logo} alt="" />
          <span>
            {BRAND.name}
            <small>{BRAND.movement}</small>
          </span>
        </Link>
        <div className="spacer" />
        {isVip ? (
          <Link to="/perfil" className="pill gold" title="Membro VIP Vitalício">👑 VIP</Link>
        ) : isSubscriber ? (
          <Link to="/perfil" className="pill gold" title="Assinante Premium">⭐ PRO</Link>
        ) : !isLoggedIn ? (
          <button
            type="button"
            className="pill"
            style={{ cursor: 'pointer', border: '1px solid rgba(251,191,36,.3)' }}
            onClick={() => openAuthModal('login')}
            title="Fazer Login"
          >
            🔑 Entrar
          </button>
        ) : null}
        <span className="pill" title="Sequência de dias de leitura">🔥 {stats.streak}</span>
        <span className="pill gold" title="Nível e experiência">⭐ Nv {stats.level.level}</span>
      </div>
    </header>
  );
}
