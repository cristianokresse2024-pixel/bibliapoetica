import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', icon: '🏠', label: 'Início', end: true },
  { to: '/livros', icon: '📚', label: 'Livros' },
  { to: '/jornada', icon: '🏆', label: 'Jornada' },
  { to: '/favoritos', icon: '⭐', label: 'Favoritos' },
];

export default function BottomNav() {
  return (
    <nav className="bottomnav">
      {items.map((i) => (
        <NavLink key={i.to} to={i.to} end={i.end} className={({ isActive }) => (isActive ? 'active' : '')}>
          <span className="ic">{i.icon}</span>
          <span>{i.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
