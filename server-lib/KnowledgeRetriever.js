import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const INDEX_DIR = path.resolve(ROOT_DIR, 'knowledge', 'index');
const THEOLOGY_INDEX_FILE = path.resolve(ROOT_DIR, 'knowledge', 'theology-index.json');
const SINGLE_INDEX_FILE = path.resolve(ROOT_DIR, 'knowledge', 'knowledge-index.json');

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

let cachedIndex = null;
let lastLoaded = 0;

function getKnowledgeIndex() {
  const now = Date.now();
  if (cachedIndex && now - lastLoaded < 60000) {
    return cachedIndex;
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

    if (fs.existsSync(INDEX_DIR)) {
      const files = fs.readdirSync(INDEX_DIR).filter((f) => f.endsWith('.json')).sort();
      for (const f of files) {
        try {
          const content = fs.readFileSync(path.join(INDEX_DIR, f), 'utf8');
          addItems(JSON.parse(content));
        } catch {}
      }
    }

    if (fs.existsSync(SINGLE_INDEX_FILE)) {
      try {
        const content = fs.readFileSync(SINGLE_INDEX_FILE, 'utf8');
        addItems(JSON.parse(content));
      } catch {}
    }

    if (combined.length > 0) {
      cachedIndex = combined;
      lastLoaded = now;
      return cachedIndex;
    }
  } catch (err) {
    console.warn('Não foi possível carregar o índice de conhecimento:', err.message);
  }
  return [];
}

function normalize(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ');
}

export function retrieveContext(query, maxResults = 3) {
  if (!query || typeof query !== 'string') return '';
  const index = getKnowledgeIndex();
  if (!index || index.length === 0) return '';

  const cleanQuery = normalize(query);
  const terms = cleanQuery
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  if (terms.length === 0) return '';

  const scored = [];

  for (const item of index) {
    let score = 0;
    const cleanTitle = normalize(item.title || '');
    const cleanContent = normalize(item.content || '');
    const keywords = (item.keywords || []).map(normalize);
    const bibleRefs = (item.bibleRefs || []).map(normalize);

    // 1. Prioridade máxima para correspondência de livro, capítulo e versículo bíblico
    for (const ref of bibleRefs) {
      if (ref && ref.length >= 3 && cleanQuery.includes(ref)) {
        score += 50; // Referência direta encontrada!
      }
    }

    // 2. Pontuação léxica e temática
    let matchedTermsCount = 0;
    for (const term of terms) {
      let termMatched = false;
      if (bibleRefs.some((r) => r.includes(term))) {
        score += 15;
        termMatched = true;
      }
      if (keywords.includes(term)) {
        score += 8;
        termMatched = true;
      }
      if (cleanTitle.includes(term)) {
        score += 6;
        termMatched = true;
      }
      if (cleanContent.includes(term)) {
        score += 2;
        termMatched = true;
      }
      if (termMatched) matchedTermsCount += 1;
    }

    // Bônus se a pergunta contiver o título ou múltiplos termos
    if (cleanTitle.length > 4 && cleanQuery.includes(cleanTitle)) {
      score += 25;
    }
    if (matchedTermsCount >= 2) {
      score += matchedTermsCount * 6;
    }

    const minScore = terms.length >= 2 ? 16 : 10;
    if (score >= minScore) {
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, maxResults);

  if (top.length === 0) return '';

  // Formata o contexto teológico como consulta interna da IA (sem exigir citações externas)
  const formattedPieces = top.map(({ item }) => {
    return `[Consulta Teológica Interna: ${item.source} — ${item.title}]\n${item.content}`;
  });

  return formattedPieces.join('\n\n---\n\n');
}
