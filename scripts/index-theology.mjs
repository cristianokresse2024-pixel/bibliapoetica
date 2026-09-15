import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let PDFParseClass = null;
try {
  const pdfModule = require('pdf-parse');
  PDFParseClass = pdfModule.PDFParse || pdfModule.default || pdfModule;
} catch (err) {
  console.warn('pdf-parse não disponível:', err.message);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SCAN_DIRS = [
  path.resolve(ROOT_DIR, 'biblioteca'),
  path.resolve(ROOT_DIR, 'docs')
];

const OUTPUT_INDEX_FILE = path.resolve(ROOT_DIR, 'knowledge', 'theology-index.json');
const OUTPUT_INDEX_DIR = path.resolve(ROOT_DIR, 'knowledge', 'index');

// Tabela de Livros da Bíblia e abreviações aceitas
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
  { name: '1 Crônicas', abbrev: '1cr', matches: ['1 cronicas', '1 crônicas', '1cronicas', '1 cr', '1cr'] },
  { name: '2 Crônicas', abbrev: '2cr', matches: ['2 cronicas', '2 crônicas', '2cronicas', '2 cr', '2cr'] },
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
  { name: '1 Coríntios', abbrev: '1co', matches: ['1 corintios', '1 coríntios', '1corintios', '1 co', '1co'] },
  { name: '2 Coríntios', abbrev: '2co', matches: ['2 corintios', '2 coríntios', '2corintios', '2 co', '2co'] },
  { name: 'Gálatas', abbrev: 'gl', matches: ['galatas', 'gálatas', 'gl', 'gal'] },
  { name: 'Efésios', abbrev: 'ef', matches: ['efesios', 'efésios', 'ef', 'efe'] },
  { name: 'Filipenses', abbrev: 'fp', matches: ['filipenses', 'fp', 'fil'] },
  { name: 'Colossenses', abbrev: 'cl', matches: ['colossenses', 'cl', 'col'] },
  { name: '1 Tessalonicenses', abbrev: '1ts', matches: ['1 tessalonicenses', '1ts', '1 ts', '1tes'] },
  { name: '2 Tessalonicenses', abbrev: '2ts', matches: ['2 tessalonicenses', '2ts', '2 ts', '2tes'] },
  { name: '1 Timóteo', abbrev: '1tm', matches: ['1 timoteo', '1 timóteo', '1tm', '1 tm'] },
  { name: '2 Timóteo', abbrev: '2tm', matches: ['2 timoteo', '2 timóteo', '2tm', '2 tm'] },
  { name: 'Tito', abbrev: 'tt', matches: ['tito', 'tt'] },
  { name: 'Filemom', abbrev: 'fm', matches: ['filemom', 'fm', 'flm'] },
  { name: 'Hebreus', abbrev: 'hb', matches: ['hebreus', 'hb', 'heb'] },
  { name: 'Tiago', abbrev: 'tg', matches: ['tiago', 'tg', 'tia'] },
  { name: '1 Pedro', abbrev: '1pe', matches: ['1 pedro', '1pedro', '1 pe', '1pe'] },
  { name: '2 Pedro', abbrev: '2pe', matches: ['2 pedro', '2pedro', '2 pe', '2pe'] },
  { name: '1 João', abbrev: '1jo', matches: ['1 joao', '1 joão', '1jo', '1 jo'] },
  { name: '2 João', abbrev: '2jo', matches: ['2 joao', '2 joão', '2jo', '2 jo'] },
  { name: '3 João', abbrev: '3jo', matches: ['3 joao', '3 joão', '3jo', '3 jo'] },
  { name: 'Judas', abbrev: 'jd', matches: ['judas', 'jd'] },
  { name: 'Apocalipse', abbrev: 'ap', matches: ['apocalipse', 'ap', 'apoc', 'revelation', 'rev'] }
];

function normalize(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Identifica menções e referências bíblicas no texto do fragmento
 */
function extractBibleReferences(text, fileName = '') {
  const refs = new Set();
  const lower = normalize(text + ' ' + fileName);

  for (const book of BIBLE_BOOKS) {
    let bookFound = false;
    for (const m of book.matches) {
      // Regex para capturar padrões como "Mateus 6:33", "Mt 6.33", "Mateus 6"
      const escapedM = m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedM}\\s*([0-9]{1,3})(?:[:\\.]([0-9]{1,3}))?\\b`, 'gi');
      let match;
      while ((match = regex.exec(lower)) !== null) {
        bookFound = true;
        const chapter = match[1];
        const verse = match[2];
        if (verse) {
          refs.add(`${book.name} ${chapter}:${verse}`);
          refs.add(`${book.abbrev} ${chapter}:${verse}`);
        } else {
          refs.add(`${book.name} ${chapter}`);
          refs.add(`${book.abbrev} ${chapter}`);
        }
        refs.add(book.name);
        refs.add(book.abbrev);
      }

      if (!bookFound) {
        const wordRegex = new RegExp(`\\b${escapedM}\\b`, 'i');
        if (wordRegex.test(lower)) {
          refs.add(book.name);
          refs.add(book.abbrev);
        }
      }
    }
  }

  return Array.from(refs);
}

/**
 * Encontra todos os arquivos de livros teológicos
 */
function findTheologyFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        results.push(...findTheologyFiles(fullPath));
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.pdf', '.md', '.txt'].includes(ext) && !entry.name.startsWith('.')) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

function isNoiseChunk(text) {
  if (!text || text.length < 120) return true;
  // Detecta páginas de sumário, índices pontilhados (... ...)
  const dotCount = (text.match(/\.{3,}/g) || []).length;
  if (dotCount >= 3) return true;
  const dotsAndDashes = (text.match(/[\.\_\-]{2,}/g) || []).join('').length;
  if (dotsAndDashes / text.length > 0.12) return true;
  return false;
}

/**
 * Divide o texto do livro em fragmentos inteligentes com sobreposição
 */
function chunkText(rawText, chunkSize = 950, overlap = 150) {
  const clean = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (!clean) return [];

  const paragraphs = clean.split(/\n\s*\n/);
  const chunks = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    if (currentChunk.length + trimmed.length <= chunkSize) {
      currentChunk += (currentChunk ? '\n\n' : '') + trimmed;
    } else {
      if (currentChunk.length >= 150 && !isNoiseChunk(currentChunk)) {
        chunks.push(currentChunk);
      }
      const overlapText = currentChunk.slice(-overlap).trim();
      currentChunk = (overlapText ? overlapText + '\n\n' : '') + trimmed;
    }
  }

  if (currentChunk.length >= 150 && !isNoiseChunk(currentChunk)) {
    chunks.push(currentChunk);
  }

  return chunks;
}

const BOOKS_CACHE_DIR = path.resolve(OUTPUT_INDEX_DIR, 'books');

async function runIndexer() {
  console.log('📚 Iniciando Pipeline de Indexação da Biblioteca Teológica...');
  const allFiles = [];

  for (const dir of SCAN_DIRS) {
    const found = findTheologyFiles(dir);
    allFiles.push(...found);
  }

  // Remove duplicados
  const uniqueFiles = Array.from(new Set(allFiles));
  console.log(`📁 Encontrados ${uniqueFiles.length} arquivos teológicos para análise.`);

  if (!fs.existsSync(OUTPUT_INDEX_DIR)) {
    fs.mkdirSync(OUTPUT_INDEX_DIR, { recursive: true });
  }
  if (!fs.existsSync(BOOKS_CACHE_DIR)) {
    fs.mkdirSync(BOOKS_CACHE_DIR, { recursive: true });
  }

  const fullIndex = [];
  let totalChunks = 0;
  let fileIndex = 0;

  for (const filePath of uniqueFiles) {
    fileIndex++;
    const relPath = path.relative(ROOT_DIR, filePath);
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const stat = fs.statSync(filePath);
    const sizeMb = (stat.size / (1024 * 1024)).toFixed(1);

    // Identificador único para cache incremental
    const cleanId = fileName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().slice(0, 60);
    const cacheFilePath = path.join(BOOKS_CACHE_DIR, `${cleanId}.json`);

    // 1. Verifica se já existe cache válido e atualizado
    if (fs.existsSync(cacheFilePath)) {
      try {
        const cacheStat = fs.statSync(cacheFilePath);
        if (cacheStat.mtimeMs >= stat.mtimeMs) {
          const cachedChunks = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
          if (Array.isArray(cachedChunks) && cachedChunks.length > 0) {
            console.log(`⚡ [${fileIndex}/${uniqueFiles.length}] Usando cache: ${fileName} (${cachedChunks.length} fragmentos)`);
            fullIndex.push(...cachedChunks);
            totalChunks += cachedChunks.length;
            continue;
          }
        }
      } catch {}
    }

    console.log(`⏳ [${fileIndex}/${uniqueFiles.length}] Processando: ${fileName} (${sizeMb} MB)`);
    let fileText = '';

    try {
      if (ext === '.pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        if (typeof PDFParseClass === 'function') {
          try {
            const parser = new PDFParseClass({ data: dataBuffer });
            const pdfData = await parser.getText();
            fileText = pdfData.text || '';
            if (typeof parser.destroy === 'function') await parser.destroy();
          } catch {
            const pdfData = await PDFParseClass(dataBuffer);
            fileText = pdfData.text || '';
          }
        }
      } else {
        fileText = fs.readFileSync(filePath, 'utf8');
      }

      if (!fileText || fileText.trim().length < 50) {
        console.log(`⚠️ Arquivo com pouco conteúdo de texto extraível: ${fileName}`);
        continue;
      }

      const rawChunks = chunkText(fileText);
      const bookChunks = [];

      rawChunks.forEach((content, idx) => {
        const bibleRefs = extractBibleReferences(content, fileName);
        const baseName = path.parse(fileName).name;
        
        // Mantém fragmentos que tenham referências bíblicas ou termos teológicos
        const keywords = Array.from(new Set([
          ...bibleRefs,
          ...fileName.replace(/[^a-zA-Z0-9À-ÿ]/g, ' ').split(/\s+/).filter(w => w.length > 2)
        ]));

        bookChunks.push({
          id: `${baseName}-chunk-${idx + 1}`,
          source: fileName,
          path: relPath,
          title: `${baseName} (Parte ${idx + 1})`,
          content: content.trim(),
          bibleRefs,
          keywords
        });
      });

      // Salva o cache imediato deste livro no disco
      fs.writeFileSync(cacheFilePath, JSON.stringify(bookChunks, null, 2), 'utf8');
      console.log(`   └─ Salvos ${bookChunks.length} fragmentos em cache.`);

      fullIndex.push(...bookChunks);
      totalChunks += bookChunks.length;
    } catch (err) {
      console.error(`❌ Erro ao ler ${fileName}:`, err.message);
    }
  }

  // Particionamento inteligente por livro bíblico para buscas instantâneas
  const byBookDir = path.resolve(ROOT_DIR, 'knowledge', 'theology', 'by-book');
  if (!fs.existsSync(byBookDir)) {
    fs.mkdirSync(byBookDir, { recursive: true });
  }

  const byBookMap = {};
  for (const b of BIBLE_BOOKS) byBookMap[b.abbrev] = [];
  const generalList = [];

  for (const chunk of fullIndex) {
    let assigned = false;
    for (const b of BIBLE_BOOKS) {
      if (chunk.bibleRefs && (chunk.bibleRefs.includes(b.name) || chunk.bibleRefs.includes(b.abbrev))) {
        byBookMap[b.abbrev].push(chunk);
        assigned = true;
      }
    }
    if (!assigned) {
      generalList.push(chunk);
    }
  }

  let booksCount = 0;
  for (const [abbrev, items] of Object.entries(byBookMap)) {
    if (items.length > 0) {
      booksCount++;
      fs.writeFileSync(path.join(byBookDir, `${abbrev}.json`), JSON.stringify(items, null, 2), 'utf8');
    }
  }
  fs.writeFileSync(path.join(byBookDir, 'geral.json'), JSON.stringify(generalList, null, 2), 'utf8');

  // Gera índice curado de topo para buscas gerais (mantém abaixo de 30MB para git e serverless)
  const sampleCurated = [];
  for (const [abbrev, items] of Object.entries(byBookMap)) {
    sampleCurated.push(...items.slice(0, 100));
  }
  sampleCurated.push(...generalList.slice(0, 500));

  fs.writeFileSync(OUTPUT_INDEX_FILE, JSON.stringify(sampleCurated, null, 2), 'utf8');
  fs.writeFileSync(path.resolve(OUTPUT_INDEX_DIR, 'theology.json'), JSON.stringify(sampleCurated, null, 2), 'utf8');

  console.log('====================================================');
  console.log(`✅ Indexação Teológica Concluída!`);
  console.log(`   - Arquivos processados: ${uniqueFiles.length}`);
  console.log(`   - Total de fragmentos indexados: ${totalChunks}`);
  console.log(`   - Livros bíblicos particionados: ${booksCount}`);
  console.log(`   - Arquivo de índice mestre gerado: ${OUTPUT_INDEX_FILE}`);
  console.log('====================================================');
}

runIndexer().catch(err => {
  console.error('Falha fatal na indexação:', err);
  process.exit(1);
});
