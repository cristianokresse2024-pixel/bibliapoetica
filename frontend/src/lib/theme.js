// Temas visuais por categoria de livro (gradiente + emoji) para as capas geradas.
export const CATEGORY_THEME = {
  'Pentateuco':        { grad: ['#7c4a1e', '#c9862f', '#f2c14e'], emoji: '📜', tag: 'Lei' },
  'Históricos':        { grad: ['#3b2f6b', '#6d4aa0', '#a678d6'], emoji: '🏰', tag: 'História' },
  'Poéticos':          { grad: ['#134e4a', '#0e7490', '#2dd4bf'], emoji: '🎵', tag: 'Poesia' },
  'Profetas Maiores':  { grad: ['#7f1d1d', '#b91c1c', '#f97316'], emoji: '🔥', tag: 'Profecia' },
  'Profetas Menores':  { grad: ['#78350f', '#b45309', '#fbbf24'], emoji: '⚡', tag: 'Profecia' },
  'Evangelhos':        { grad: ['#1e3a8a', '#2563eb', '#60a5fa'], emoji: '✝️', tag: 'Evangelho' },
  'Cartas de Paulo':   { grad: ['#164e63', '#0891b2', '#67e8f9'], emoji: '✉️', tag: 'Carta' },
  'Cartas Gerais':     { grad: ['#3f3f46', '#71717a', '#d4d4d8'], emoji: '📨', tag: 'Carta' },
  'Apocalíptico':      { grad: ['#4c0519', '#9f1239', '#fb7185'], emoji: '👁️', tag: 'Revelação' },
};

export function themeFor(category) {
  return CATEGORY_THEME[category] || { grad: ['#334155', '#475569', '#94a3b8'], emoji: '📖', tag: '' };
}

export function bookGradientCss(category) {
  const t = themeFor(category);
  return `linear-gradient(140deg, ${t.grad[0]} 0%, ${t.grad[1]} 55%, ${t.grad[2]} 100%)`;
}
