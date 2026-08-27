// Referências para "Versículo do Dia" e "Plano/jornada". abbrev usa o padrão normalizado.
export const VOTD_REFS = [
  { abbrev: 'jo', name: 'João', ch: 3, v: 16 },
  { abbrev: 'sl', name: 'Salmos', ch: 23, v: 1 },
  { abbrev: 'fp', name: 'Filipenses', ch: 4, v: 13 },
  { abbrev: 'pv', name: 'Provérbios', ch: 3, v: 5 },
  { abbrev: 'is', name: 'Isaías', ch: 41, v: 10 },
  { abbrev: 'rm', name: 'Romanos', ch: 8, v: 28 },
  { abbrev: 'js', name: 'Josué', ch: 1, v: 9 },
  { abbrev: 'mt', name: 'Mateus', ch: 6, v: 33 },
  { abbrev: 'sl', name: 'Salmos', ch: 46, v: 1 },
  { abbrev: 'jr', name: 'Jeremias', ch: 29, v: 11 },
  { abbrev: '1co', name: '1 Coríntios', ch: 13, v: 4 },
  { abbrev: 'gl', name: 'Gálatas', ch: 5, v: 22 },
  { abbrev: 'sl', name: 'Salmos', ch: 91, v: 1 },
  { abbrev: 'mt', name: 'Mateus', ch: 11, v: 28 },
  { abbrev: 'pv', name: 'Provérbios', ch: 16, v: 3 },
  { abbrev: 'ef', name: 'Efésios', ch: 2, v: 8 },
  { abbrev: 'sl', name: 'Salmos', ch: 119, v: 105 },
  { abbrev: 'hb', name: 'Hebreus', ch: 11, v: 1 },
  { abbrev: 'lm', name: 'Lamentações', ch: 3, v: 22 },
  { abbrev: '1pe', name: '1 Pedro', ch: 5, v: 7 },
  { abbrev: 'mt', name: 'Mateus', ch: 5, v: 16 },
  { abbrev: 'sl', name: 'Salmos', ch: 121, v: 1 },
  { abbrev: 'jo', name: 'João', ch: 14, v: 6 },
  { abbrev: 'rm', name: 'Romanos', ch: 12, v: 2 },
  { abbrev: 'pv', name: 'Provérbios', ch: 4, v: 23 },
  { abbrev: '2tm', name: '2 Timóteo', ch: 1, v: 7 },
  { abbrev: 'sl', name: 'Salmos', ch: 37, v: 5 },
  { abbrev: 'is', name: 'Isaías', ch: 40, v: 31 },
  { abbrev: 'mc', name: 'Marcos', ch: 11, v: 24 },
  { abbrev: 'cl', name: 'Colossenses', ch: 3, v: 23 },
  { abbrev: 'sl', name: 'Salmos', ch: 34, v: 8 },
];

export function votdForToday() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date() - start;
  const dayOfYear = Math.floor(diff / 86400000);
  return VOTD_REFS[dayOfYear % VOTD_REFS.length];
}
