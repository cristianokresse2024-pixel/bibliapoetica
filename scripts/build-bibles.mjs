// Processa as versões da Bíblia (JSON bruto) em arquivos por livro + índice de metadados.
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'assets_src';
const OUT = 'public/bibles';

const VERSIONS = [
  { id: 'nvi', file: 'nvi.json', name: 'Nova Versão Internacional', short: 'NVI' },
  { id: 'acf', file: 'acf.json', name: 'Almeida Corrigida Fiel', short: 'ACF' },
  { id: 'aa',  file: 'aa.json',  name: 'Almeida Revisada',        short: 'AA'  },
];

// Metadados por livro (abrev -> testamento, categoria). Ordem canônica protestante.
const META = {
  gn:['VT','Pentateuco'], ex:['VT','Pentateuco'], lv:['VT','Pentateuco'], nm:['VT','Pentateuco'], dt:['VT','Pentateuco'],
  js:['VT','Históricos'], jz:['VT','Históricos'], rt:['VT','Históricos'], '1sm':['VT','Históricos'], '2sm':['VT','Históricos'],
  '1rs':['VT','Históricos'], '2rs':['VT','Históricos'], '1cr':['VT','Históricos'], '2cr':['VT','Históricos'],
  ed:['VT','Históricos'], ne:['VT','Históricos'], et:['VT','Históricos'],
  job:['VT','Poéticos'], 'jó':['VT','Poéticos'], sl:['VT','Poéticos'], pv:['VT','Poéticos'], ec:['VT','Poéticos'], ct:['VT','Poéticos'],
  is:['VT','Profetas Maiores'], jr:['VT','Profetas Maiores'], lm:['VT','Profetas Maiores'], ez:['VT','Profetas Maiores'], dn:['VT','Profetas Maiores'],
  os:['VT','Profetas Menores'], jl:['VT','Profetas Menores'], am:['VT','Profetas Menores'], ob:['VT','Profetas Menores'], jn:['VT','Profetas Menores'],
  mq:['VT','Profetas Menores'], na:['VT','Profetas Menores'], hc:['VT','Profetas Menores'], sf:['VT','Profetas Menores'], ag:['VT','Profetas Menores'],
  zc:['VT','Profetas Menores'], ml:['VT','Profetas Menores'],
  mt:['NT','Evangelhos'], mc:['NT','Evangelhos'], lc:['NT','Evangelhos'], jo:['NT','Evangelhos'],
  atos:['NT','Históricos'],
  rm:['NT','Cartas de Paulo'], '1co':['NT','Cartas de Paulo'], '2co':['NT','Cartas de Paulo'], gl:['NT','Cartas de Paulo'],
  ef:['NT','Cartas de Paulo'], fp:['NT','Cartas de Paulo'], cl:['NT','Cartas de Paulo'], '1ts':['NT','Cartas de Paulo'], '2ts':['NT','Cartas de Paulo'],
  '1tm':['NT','Cartas de Paulo'], '2tm':['NT','Cartas de Paulo'], tt:['NT','Cartas de Paulo'], fm:['NT','Cartas de Paulo'],
  hb:['NT','Cartas Gerais'], tg:['NT','Cartas Gerais'], '1pe':['NT','Cartas Gerais'], '2pe':['NT','Cartas Gerais'],
  '1jo':['NT','Cartas Gerais'], '2jo':['NT','Cartas Gerais'], '3jo':['NT','Cartas Gerais'], jd:['NT','Cartas Gerais'],
  ap:['NT','Apocalíptico'],
};

// Normaliza abreviações divergentes entre fontes para um padrão único.
const ABBR_FIX = {
  jud:'jz', '1sam':'1sm','2sam':'2sm','1kgs':'1rs','2kgs':'2rs','1ch':'1cr','2ch':'2cr',
  ezr:'ed', est:'et', psa:'sl', prv:'pv', sof:'sf', act:'atos', act_:'atos',
};

function normAbbr(a){ a=a.toLowerCase(); return ABBR_FIX[a]||a; }

fs.mkdirSync(OUT, { recursive: true });

let indexBooks = null;

for (const v of VERSIONS) {
  const raw = fs.readFileSync(path.join(SRC, v.file));
  // remove BOM
  const text = raw.toString('utf8').replace(/^\uFEFF/, '');
  const data = JSON.parse(text);
  const vDir = path.join(OUT, v.id);
  fs.mkdirSync(vDir, { recursive: true });

  const books = [];
  data.forEach((b, i) => {
    const abbrev = normAbbr(b.abbrev);
    const chapters = b.chapters; // array of arrays of verse strings
    fs.writeFileSync(path.join(vDir, `${abbrev}.json`), JSON.stringify(chapters));
    const meta = META[abbrev] || ['?','?'];
    books.push({
      order: i + 1,
      abbrev,
      name: b.name,
      testament: meta[0],
      category: meta[1],
      chapters: chapters.length,
      verses: chapters.reduce((s, c) => s + c.length, 0),
    });
  });

  if (!indexBooks) indexBooks = books;
  console.log(`${v.short}: ${books.length} livros, ${books.reduce((s,b)=>s+b.chapters,0)} caps, ${books.reduce((s,b)=>s+b.verses,0)} versículos`);
}

const index = {
  versions: VERSIONS.map(v => ({ id: v.id, name: v.name, short: v.short })),
  books: indexBooks,
  totals: {
    books: indexBooks.length,
    chapters: indexBooks.reduce((s,b)=>s+b.chapters,0),
    verses: indexBooks.reduce((s,b)=>s+b.verses,0),
  },
};
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index));
console.log('index.json escrito. Totais:', index.totals);

// Verificação: abreviações sem metadados
const missing = indexBooks.filter(b => b.testament === '?');
if (missing.length) console.warn('AVISO abrev sem meta:', missing.map(b=>b.abbrev+':'+b.name));
