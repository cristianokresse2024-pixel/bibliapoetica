/* ============================================================
   data.js — estrutura da Bíblia e carregamento de conteúdo
   ============================================================ */

let BIBLE = null;                    // estrutura completa (books.json)
const bookCache = new Map();        // conteúdo de livros carregados

export async function getBible() {
  if (!BIBLE) BIBLE = await (await fetch("data/books.json")).json();
  return BIBLE;
}

export function bookInfo(bible, id) { return bible.books[id]; }

/* Lista ordenada de livros, com testamento/grupo resolvidos */
export function orderedBooks(bible) {
  const out = [];
  for (const testament of ["at", "nt"]) {
    for (const group of bible.groups[testament]) {
      for (const id of group.books) {
        const b = bible.books[id];
        out.push({ ...b, testament, group: group.name, groupId: group.id });
      }
    }
  }
  return out;
}

/* Contagem total de capítulos da Bíblia */
export function totalChapters(bible) {
  return Object.values(bible.books).reduce((acc, b) => acc + b.chapters, 0);
}

/* Partes de conteúdo disponíveis para um livro */
export function contentParts(bible, bookId) {
  const b = bible.books[bookId];
  return b.parts || [];
}

/* Carrega o conteúdo de um livro (mescla as partes em cache) */
export async function getBookContent(bible, bookId) {
  if (bookCache.has(bookId)) return bookCache.get(bookId);
  const b = bible.books[bookId];
  const parts = contentParts(bible, bookId);
  const chapters = {};
  for (const part of parts) {
    const data = await (await fetch(`data/books/${bookId}/${part}.json`)).json();
    Object.assign(chapters, data.chapters);
  }
  const content = { ...b, chapters };
  bookCache.set(bookId, content);
  return content;
}

/* Pega um capítulo específico (com cache do livro inteiro) */
export async function getChapter(bible, bookId, chapter) {
  const content = await getBookContent(bible, bookId);
  return content.chapters[String(chapter)] || null;
}

/* Versículo do dia: estável por data, rotativo entre a lista */
export async function getDailyVerse() {
  const verses = await (await fetch("data/daily-verses.json")).json();
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return verses[dayOfYear % verses.length];
}
