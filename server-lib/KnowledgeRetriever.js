import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const INDEX_DIR = path.resolve(ROOT_DIR, 'knowledge', 'index');
const BY_BOOK_DIR = path.resolve(ROOT_DIR, 'knowledge', 'theology', 'by-book');
const THEOLOGY_INDEX_FILE = path.resolve(ROOT_DIR, 'knowledge', 'theology-index.json');
const SINGLE_INDEX_FILE = path.resolve(ROOT_DIR, 'knowledge', 'knowledge-index.json');

const BIBLE_BOOKS = [
  { name: 'Gênesis', abbrev: 'gn', matches: ['genesis', 'gênesis', 'gn', 'gen'] },
  { name: 'Êxodo', abbrev: 'ex', matches: ['exodo', 'êxodo', 'ex'] },
  { name: 'Levítico', abbrev: 'lv', matches: ['levitico', 'levítico', 'lv', 'lev'] },
  { name: 'Números', abbrev: 'nm', matches: ['numeros', 'números', 'nm', 'num'] },
  { name: 'Deuteronômio', abbrev: 'dt', matches: ['deuteronomio', 'deuteronômio', 'dt', 'deut'] },
  { name: 'Josué', abbrev: 'js', matches: ['josue', 'josué', 'js', 'jos'] },
  { name: 'Juízes', abbrev: 'jz', matches: ['juizes', 'juízes', 'jz', 'jui'] },
  { name: 'Rute', abbrev: 'rt', matches: ['rute', 'rt'] },
  { name: '1 Samuel', abbrev: '1sm', matches: ['1 samuel', '1samuel', '1 sm', '1sm'] },
  { name: '2 Samuel', abbrev: '2sm', matches: ['2 samuel', '2samuel', '2 sm', '2sm'] },
  { name: '1 Reis', abbrev: '1rs', matches: ['1 reis', '1reis', '1 rs', '1rs'] },
  { name: '2 Reis', abbrev: '2rs', matches: ['2 reis', '2reis', '2 rs', '2rs'] },
  { name: '1 Crônicas', abbrev: '1cr', matches: ['1 cronicas', '1 crônicas', '1cr', '1 cr'] },
  { name: '2 Crônicas', abbrev: '2cr', matches: ['2 cronicas', '2 crônicas', '2cr', '2 cr'] },
  { name: 'Esdras', abbrev: 'ed', matches: ['esdras', 'ed', 'esd'] },
  { name: 'Neemias', abbrev: 'ne', matches: ['neemias', 'ne', 'neem'] },
  { name: 'Ester', abbrev: 'et', matches: ['ester', 'et', 'est'] },
  { name: 'Jó', abbrev: 'jo', matches: ['jó', 'jo'] },
  { name: 'Salmos', abbrev: 'sl', matches: ['salmos', 'salmo', 'sl', 'psalms', 'ps'] },
  { name: 'Provérbios', abbrev: 'pv', matches: ['proverbios', 'provérbios', 'pv', 'prov'] },
  { name: 'Eclesiastes', abbrev: 'ec', matches: ['eclesiastes', 'ec', 'ecl'] },
  { name: 'Cânticos', abbrev: 'ct', matches: ['canticos', 'cânticos', 'ct', 'cantares'] },
  { name: 'Isaías', abbrev: 'is', matches: ['isaias', 'isaías', 'is', 'isa'] },
  { name: 'Jeremias', abbrev: 'jr', matches: ['jeremias', 'jr', 'jer'] },
  { name: 'Lamentações', abbrev: 'lm', matches: ['lamentacoes', 'lamentações', 'lm', 'lam'] },
  { name: 'Ezequiel', abbrev: 'ez', matches: ['ezequiel', 'ez', 'eze'] },
  { name: 'Daniel', abbrev: 'dn', matches: ['daniel', 'dn', 'dan'] },
  { name: 'Oséias', abbrev: 'os', matches: ['oseias', 'oséias', 'os'] },
  { name: 'Joel', abbrev: 'jl', matches: ['joel', 'jl'] },
  { name: 'Amós', abbrev: 'am', matches: ['amos', 'amós', 'am'] },
  { name: 'Obadias', abbrev: 'ob', matches: ['obadias', 'ob'] },
  { name: 'Jonas', abbrev: 'jn', matches: ['jonas', 'jn', 'jon'] },
  { name: 'Miquéias', abbrev: 'mq', matches: ['miqueias', 'miquéias', 'mq', 'miq'] },
  { name: 'Naum', abbrev: 'na', matches: ['naum', 'na'] },
  { name: 'Habacuque', abbrev: 'hc', matches: ['habacuque', 'hc', 'hab'] },
  { name: 'Sofonias', abbrev: 'sf', matches: ['sofonias', 'sf', 'sof'] },
  { name: 'Ageu', abbrev: 'ag', matches: ['ageu', 'ag'] },
  { name: 'Zacarias', abbrev: 'zc', matches: ['zacarias', 'zc', 'zac'] },
  { name: 'Malaquias', abbrev: 'ml', matches: ['malaquias', 'ml', 'mal'] },
  { name: 'Mateus', abbrev: 'mt', matches: ['mateus', 'mt', 'mat'] },
  { name: 'Marcos', abbrev: 'mc', matches: ['marcos', 'mc', 'marc'] },
  { name: 'Lucas', abbrev: 'lc', matches: ['lucas', 'lc', 'luc'] },
  { name: 'João', abbrev: 'jo', matches: ['joao', 'joão', 'jo', 'john'] },
  { name: 'Atos', abbrev: 'at', matches: ['atos', 'at', 'act'] },
  { name: 'Romanos', abbrev: 'rm', matches: ['romanos', 'rm', 'rom'] },
  { name: '1 Coríntios', abbrev: '1co', matches: ['1 corintios', '1 coríntios', '1co', '1 co'] },
  { name: '2 Coríntios', abbrev: '2co', matches: ['2 corintios', '2 coríntios', '2co', '2 co'] },
  { name: 'Gálatas', abbrev: 'gl', matches: ['galatas', 'gálatas', 'gl', 'gal'] },
  { name: 'Efésios', abbrev: 'ef', matches: ['efesios', 'efésios', 'ef', 'efe'] },
  { name: 'Filipenses', abbrev: 'fp', matches: ['filipenses', 'fp', 'fil'] },
  { name: 'Colossenses', abbrev: 'cl', matches: ['colossenses', 'cl', 'col'] },
  { name: '1 Tessalonicenses', abbrev: '1ts', matches: ['1 tessalonicenses', '1ts', '1 ts'] },
  { name: '2 Tessalonicenses', abbrev: '2ts', matches: ['2 tessalonicenses', '2ts', '2 ts'] },
  { name: '1 Timóteo', abbrev: '1tm', matches: ['1 timoteo', '1 timóteo', '1tm', '1 tm'] },
  { name: '2 Timóteo', abbrev: '2tm', matches: ['2 timoteo', '2 timóteo', '2tm', '2 tm'] },
  { name: 'Tito', abbrev: 'tt', matches: ['tito', 'tt'] },
  { name: 'Filemom', abbrev: 'fm', matches: ['filemom', 'fm'] },
  { name: 'Hebreus', abbrev: 'hb', matches: ['hebreus', 'hb', 'heb'] },
  { name: 'Tiago', abbrev: 'tg', matches: ['tiago', 'tg', 'tia'] },
  { name: '1 Pedro', abbrev: '1pe', matches: ['1 pedro', '1pe', '1 pe'] },
  { name: '2 Pedro', abbrev: '2pe', matches: ['2 pedro', '2pe', '2 pe'] },
  { name: '1 João', abbrev: '1jo', matches: ['1 joao', '1 joão', '1jo', '1 jo'] },
  { name: '2 João', abbrev: '2jo', matches: ['2 joao', '2 joão', '2jo', '2 jo'] },
  { name: '3 João', abbrev: '3jo', matches: ['3 joao', '3 joão', '3jo', '3 jo'] },
  { name: 'Judas', abbrev: 'jd', matches: ['judas', 'jd'] },
  { name: 'Apocalipse', abbrev: 'ap', matches: ['apocalipse', 'ap', 'apoc', 'rev'] }
];

const STOP_WORDS = new Set([
  'a', 'ao', 'aos', 'aquela', 'aquelas', 'aquele', 'aqueles', 'aquilo', 'as', 'até',
  'com', 'como', 'da', 'das', 'de', 'dela', 'delas', 'dele', 'deles', 'depois', 'do', 'dos',
  'e', 'ela', 'elas', 'ele', 'eles', 'em', 'era', 'eram', 'essa', 'essas', 'esse', 'esses',
  'esta', 'estas', 'este', 'estes', 'eu', 'foi', 'fomos', 'foram', 'isso', 'isto', 'já',
  'lhe', 'lhes', 'mais', 'mas', 'me', 'mesmo', 'meu', 'meus', 'minha', 'minhas', 'muito',
  'na', 'não', 'nas', 'nem', 'no', 'nos', 'nós', 'nossa', 'nossas', 'nosso', 'nossos',
  'num', 'numa', 'o', 'os', 'ou', 'para', 'pela', 'pelas', 'pelo', 'pelos', 'por', 'qual',
  'quando', 'que', 'quem', 'se', 'sem', 'ser', 'seu', 'seus', 'só', 'sua', 'suas', 'também',
  'te', 'tem', 'tinha', 'toda', 'todas', 'todo', 'todos', 'tu', 'tua', 'tuas', 'um', 'uma',
  'você', 'vocês', 'vos', 'sobre', 'quero', 'saber', 'qual', 'falar', 'me', 'diga', 'explique'
]);

let cachedGeneralIndex = null;
let lastGeneralLoaded = 0;
const bookCacheMap = new Map(); // abbrev -> { items, loadedAt }

function normalize(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ');
}

function detectBookAbbrev(cleanQuery) {
  for (const b of BIBLE_BOOKS) {
    for (const m of b.matches) {
      const escapedM = m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Para abreviações de 2 letras, exige estar com número ou limite de palavra
      if (escapedM.length > 2 || escapedM === 'jó') {
        const regex = new RegExp(`\\b${escapedM}\\b`, 'i');
        if (regex.test(cleanQuery)) return b.abbrev;
      } else {
        const withNumRegex = new RegExp(`\\b${escapedM}\\s*\\d+`, 'i');
        if (withNumRegex.test(cleanQuery)) return b.abbrev;
      }
    }
  }
  return null;
}

function getBookIndex(abbrev) {
  const now = Date.now();
  if (bookCacheMap.has(abbrev)) {
    const cached = bookCacheMap.get(abbrev);
    if (now - cached.loadedAt < 300000) return cached.items;
  }

  const bookFile = path.join(BY_BOOK_DIR, `${abbrev}.json`);
  if (fs.existsSync(bookFile)) {
    try {
      const items = JSON.parse(fs.readFileSync(bookFile, 'utf8'));
      bookCacheMap.set(abbrev, { items, loadedAt: now });
      return items;
    } catch (e) {
      console.warn(`Aviso ao ler livro ${abbrev}.json:`, e.message);
    }
  }
  return null;
}

function getGeneralIndex() {
  const now = Date.now();
  if (cachedGeneralIndex && now - lastGeneralLoaded < 60000) {
    return cachedGeneralIndex;
  }
  try {
    const combined = [];
    const seenIds = new Set();

    const addItems = (items) => {
      if (!Array.isArray(items)) return;
      for (const item of items) {
        const id = item.id || `${item.source}-${item.title}`;
        if (!seenIds.has(id)) {
          seenIds.add(id);
          combined.push(item);
        }
      }
    };

    if (fs.existsSync(THEOLOGY_INDEX_FILE)) {
      try {
        const content = fs.readFileSync(THEOLOGY_INDEX_FILE, 'utf8');
        addItems(JSON.parse(content));
      } catch (e) {
        console.warn('Aviso ao carregar theology-index.json:', e.message);
      }
    }

    if (fs.existsSync(SINGLE_INDEX_FILE)) {
      try {
        const content = fs.readFileSync(SINGLE_INDEX_FILE, 'utf8');
        addItems(JSON.parse(content));
      } catch {}
    }

    if (combined.length > 0) {
      cachedGeneralIndex = combined;
      lastGeneralLoaded = now;
      return cachedGeneralIndex;
    }
  } catch (err) {
    console.warn('Não foi possível carregar o índice de conhecimento:', err.message);
  }
  return [];
}

export function retrieveContext(query, maxResults = 3) {
  if (!query || typeof query !== 'string') return '';

  const cleanQuery = normalize(query);
  const terms = cleanQuery
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  if (terms.length === 0) return '';

  // 1. Tenta identificar se a busca é sobre um livro bíblico específico
  const abbrev = detectBookAbbrev(cleanQuery);
  let searchPool = null;

  if (abbrev) {
    searchPool = getBookIndex(abbrev);
  }

  // Se não encontrou pool por livro, usa o índice geral
  if (!searchPool || searchPool.length === 0) {
    searchPool = getGeneralIndex();
  }

  if (!searchPool || searchPool.length === 0) return '';

  const scored = [];

  for (const item of searchPool) {
    let score = 0;
    const cleanTitle = normalize(item.title || '');
    const cleanContent = normalize(item.content || '');
    const keywords = (item.keywords || []).map(normalize);
    const bibleRefs = (item.bibleRefs || []).map(normalize);

    // 1. Prioridade máxima para correspondência de livro, capítulo e versículo bíblico
    for (const ref of bibleRefs) {
      if (ref && ref.length >= 3 && cleanQuery.includes(ref)) {
        score += 60; // Referência direta encontrada!
      }
    }

    // 2. Pontuação léxica e temática
    let matchedTermsCount = 0;
    for (const term of terms) {
      let termMatched = false;
      if (bibleRefs.some((r) => r.includes(term))) {
        score += 20;
        termMatched = true;
      }
      if (keywords.includes(term)) {
        score += 10;
        termMatched = true;
      }
      if (cleanTitle.includes(term)) {
        score += 8;
        termMatched = true;
      }
      if (cleanContent.includes(term)) {
        score += 3;
        termMatched = true;
      }
      if (termMatched) matchedTermsCount += 1;
    }

    if (cleanTitle.length > 4 && cleanQuery.includes(cleanTitle)) {
      score += 25;
    }
    if (matchedTermsCount >= 2) {
      score += matchedTermsCount * 8;
    }

    const minScore = terms.length >= 2 ? 16 : 10;
    if (score >= minScore) {
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, maxResults);

  if (top.length === 0) {
    // Se o pool de livro não deu score suficiente, tenta fallback no geral
    if (abbrev && searchPool !== cachedGeneralIndex) {
      const general = getGeneralIndex();
      for (const item of general) {
        let score = 0;
        const cleanContent = normalize(item.content || '');
        for (const term of terms) {
          if (cleanContent.includes(term)) score += 3;
        }
        if (score >= 15) scored.push({ item, score });
      }
      scored.sort((a, b) => b.score - a.score);
      const generalTop = scored.slice(0, maxResults);
      if (generalTop.length > 0) {
        return generalTop.map(({ item }) => `[Consulta Teológica Interna: ${item.source} — ${item.title}]\n${item.content}`).join('\n\n---\n\n');
      }
    }
    return '';
  }

  // Formata o contexto teológico como consulta interna da IA
  const formattedPieces = top.map(({ item }) => {
    return `[Consulta Teológica Interna: ${item.source} — ${item.title}]\n${item.content}`;
  });

  return formattedPieces.join('\n\n---\n\n');
}
