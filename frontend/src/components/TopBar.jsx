import { Link } from 'react-router-dom';
import { useProgress, computeStats } from '../lib/progress.js';

const BASE = import.meta.env.BASE_URL;

export default function TopBar({ index }) {
  const state = useProgress();
  const stats = computeStats(index);
  return (
    <header className="topbar">
      <div className="container row">
        <Link to="/" className="brand">
          <img className="logo" src={`${BASE}favicon.svg`} alt="" />
          <span>
            Bíblia Poética
            <small>Sua jornada na Palavra</small>
          </span>
        </Link>
        <div className="spacer" />
        <span className="pill" title="Sequência de dias de leitura">🔥 {stats.streak}</span>
        <span className="pill gold" title="Nível e experiência">⭐ Nv {stats.level.level}</span>
      </div>
    </header>
  );
}
