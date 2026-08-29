export default function IAIcon({ size = 24, className = '', glow = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ia-viva-icon ${className}`}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        filter: glow ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6)) drop-shadow(0 0 2px rgba(192, 132, 252, 0.4))' : 'none',
      }}
    >
      <defs>
        {/* Gradiente Dourado Celestial */}
        <linearGradient id="goldDivine" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF275" />
          <stop offset="40%" stopColor="#FBBF24" />
          <stop offset="85%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Gradiente Roxo Real */}
        <linearGradient id="purpleRoyal" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E9D5FF" />
          <stop offset="50%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>

        {/* Brilho Central */}
        <radialGradient id="centerLight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Halo de Luz Radiante */}
      <circle cx="16" cy="16" r="14" fill="url(#centerLight)" opacity="0.35" />

      {/* Raios Celestiais de Luz (Estrela de 8 pontas refinada) */}
      <path
        d="M16 2L18.2 12.2L28.4 14.4L20.4 18.8L22.6 29L16 23.4L9.4 29L11.6 18.8L3.6 14.4L13.8 12.2L16 2Z"
        fill="url(#goldDivine)"
        opacity="0.25"
      />

      {/* Livro Sagrado Aberto (Bíblia da Sabedoria) */}
      <path
        d="M5 20.5C8 19 12 19 16 21.5C20 19 24 19 27 20.5V10.5C24 9 20 9 16 11.5C12 9 8 9 5 10.5V20.5Z"
        fill="url(#purpleRoyal)"
        stroke="url(#goldDivine)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Lombada e Divisão Central */}
      <line x1="16" y1="11.5" x2="16" y2="21.5" stroke="#FFF" strokeWidth="1.2" strokeLinecap="round" />

      {/* Centelha Divina de Inteligência (Estrela Central Viva) */}
      <path
        d="M16 4.5C16 4.5 17.2 9.5 20.5 10.8C17.2 12 16 17 16 17C16 17 14.8 12 11.5 10.8C14.8 9.5 16 4.5 16 4.5Z"
        fill="url(#goldDivine)"
      />

      {/* Ponto de Luz Intensa */}
      <circle cx="16" cy="10.8" r="1.4" fill="#FFFFFF" />

      {/* Centelhas Satélites da IA */}
      <circle cx="25" cy="7" r="1" fill="#FDE68A" opacity="0.85" />
      <circle cx="7" cy="8" r="0.8" fill="#FDE68A" opacity="0.75" />
    </svg>
  );
}
