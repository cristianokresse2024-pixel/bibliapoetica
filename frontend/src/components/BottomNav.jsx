import { NavLink } from 'react-router-dom';
import { PILLARS } from '../config/brand.js';
import IAIcon from './IAIcon.jsx';

// A barra inferior mostra apenas os pilares marcados com nav:true.
const items = PILLARS.filter((p) => p.nav);

export default function BottomNav() {
  return (
    <nav className="bottomnav">
      {items.map((i) => (
        <NavLink key={i.to} to={i.to} end={i.end} className={({ isActive }) => (isActive ? 'active' : '')}>
          <span className="ic">
            {i.id === 'ia-viva' ? <IAIcon size={22} /> : i.icon}
          </span>
          <span>{i.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
