// =============================================================================
// IDENTIDADE CENTRALIZADA — VIVA INTELIGENTE
// -----------------------------------------------------------------------------
// Ponto único de verdade para nome, logo, favicon, cores e textos institucionais.
// Para futuras mudanças de marca (ex.: logo oficial do Movimento Fé Inteligente),
// altere APENAS este arquivo. Nada de nome/cor deve ficar "hardcoded" nas telas.
// =============================================================================

const BASE = import.meta.env.BASE_URL;

export const BRAND = {
  // ---- Nome do aplicativo ----
  name: 'Viva Inteligente',
  shortName: 'Viva Inteligente',
  tagline: 'Cresça na fé. Conheça a Palavra. Viva transformado.',
  movement: 'Movimento Fé Inteligente',

  // ---- Posicionamento (textos institucionais) ----
  positioning:
    'Uma jornada para crescer na fé, conhecer a Palavra e viver uma vida transformada.',
  aiDisclaimer:
    'A IA Viva é uma ferramenta de apoio ao estudo. Ela não substitui a Bíblia, ' +
    'a oração, a comunhão com Deus, a igreja ou a liderança espiritual.',
  studiesDisclaimer:
    'Os Estudos oferecem uma jornada de crescimento espiritual. Não se trata de ' +
    'faculdade, seminário, curso teológico formal nem certificação acadêmica ou profissional.',

  // ---- Logo e favicon (preparado para a logo oficial futura) ----
  // Troque estes caminhos quando a arte oficial estiver disponível.
  logo: `${BASE}favicon.svg`,
  favicon: `${BASE}favicon.svg`,
  appIcon: `${BASE}covers/hero.jpg`,

  // ---- Cores (preservadas do tema atual; ajustar quando vier a identidade oficial) ----
  colors: {
    bg: '#0f0a1e',
    gold: '#fbbf24',
    gold2: '#f59e0b',
    themeColor: '#0f0a1e',
  },

  // ---- Contato / institucional (preencher quando definido) ----
  links: {
    site: '',
    instagram: '',
    youtube: '',
  },
};

// Pilares do ecossistema (ordem oficial do projeto).
// `nav: true` = aparece na barra inferior. Os demais ficam na Home/Perfil.
export const PILLARS = [
  { id: 'inicio',       label: 'Início',        icon: '🏠', to: '/',              nav: true,  end: true },
  { id: 'biblia',       label: 'Bíblia',        icon: '📖', to: '/livros',        nav: true  },
  { id: 'ia-viva',      label: 'IA Viva',       icon: '✨', to: '/ia',            nav: true  },
  { id: 'estudos',      label: 'Estudos',       icon: '🎓', to: '/estudos',       nav: true  },
  { id: 'lugar-secreto',label: 'Lugar Secreto', icon: '🕊️', to: '/oracao',        nav: false },
  { id: 'comunidade',   label: 'Comunidade',    icon: '🤝', to: '/comunidade',    nav: false },
  { id: 'progresso',    label: 'Progresso',     icon: '🏆', to: '/jornada',       nav: false },
  { id: 'perfil',       label: 'Perfil',        icon: '👤', to: '/perfil',        nav: true  },
];

export default BRAND;
