import { Link } from 'react-router-dom';
import { useProgress, computeStats } from '../lib/progress.js';
import { BRAND } from '../config/brand.js';

export default function TopBar({ index }) {
  const state = useProgress();
  const stats = computeStats(index);
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
        <span className="pill" title="Sequência de dias de leitura">🔥 {stats.streak}</span>
        <span className="pill gold" title="Nível e experiência">⭐ Nv {stats.level.level}</span>
      </div>
    </header>
  );
}
