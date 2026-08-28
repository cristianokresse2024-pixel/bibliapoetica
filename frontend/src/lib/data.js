// Carregamento e cache dos dados bíblicos (arquivos por livro).
const BASE = import.meta.env.BASE_URL;

let _index = null;
const _bookCache = new Map(); // key: `${version}/${abbrev}` -> chapters[][]

export async function loadIndex() {
  if (_index) return _index;
  const res = await fetch(`${BASE}bibles/index.json`);
  if (!res.ok) throw new Error('Falha ao carregar índice da Bíblia');
  _index = await res.json();
  return _index;
}

export async function loadBook(version, abbrev) {
  const key = `${version}/${abbrev}`;
  if (_bookCache.has(key)) return _bookCache.get(key);
  const res = await fetch(`${BASE}bibles/${version}/${abbrev}.json`);
  if (!res.ok) throw new Error(`Falha ao carregar ${abbrev}`);
  const chapters = await res.json();
  _bookCache.set(key, chapters);
  return chapters;
}

export function coverUrl(abbrev) {
  return `${BASE}covers/${abbrev}.jpg`;
}
export function heroUrl(name) {
  return `${BASE}covers/${name}.jpg`;
}
