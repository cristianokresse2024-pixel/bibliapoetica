import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', icon: '🏠', label: 'Início', end: true },
  { to: '/livros', icon: '📚', label: 'Bíblia' },
  { to: '/oracao', icon: '🕊️', label: 'Oração' },
  { to: '/jejum', icon: '🌙', label: 'Jejum' },
  { to: '/jornada', icon: '🏆', label: 'Jornada' },
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
