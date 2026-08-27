// Sistema de progresso e gamificação — persistido em localStorage.
import { useSyncExternalStore } from 'react';

const KEY = 'biblia-poetica:v1';

const DEFAULT = {
  version: 'nvi',
  read: {},            // `${abbrev}.${chapter}` -> timestamp (capítulos lidos)
  favorites: [],       // ["jo.3.16", ...]
  notes: {},           // `${abbrev}.${ch}.${v}` -> texto
  xp: 0,
  streak: { count: 0, last: null }, // last = 'YYYY-MM-DD'
  lastRead: null,      // { version, abbrev, chapter, name }
  achievements: {},    // id -> timestamp
  fontScale: 1,
  dailyGoal: 3,        // capítulos/dia
  dailyLog: {},        // 'YYYY-MM-DD' -> nº de capítulos lidos naquele dia
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT };
  }
}

let state = load();
const listeners = new Set();

function emit() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  listeners.forEach((l) => l());
}
function set(updater) {
  state = typeof updater === 'function' ? updater(state) : { ...state, ...updater };
  emit();
}

function subscribe(cb) { listeners.add(cb); return () => listeners.delete(cb); }
function getSnapshot() { return state; }

export function useProgress() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// ---------- helpers de data ----------
export function todayStr(d = new Date()) {
  return d.toISOString().slice(0, 10);
}
function daysBetween(a, b) {
  const ms = new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00');
  return Math.round(ms / 86400000);
}

// ---------- ações ----------
export function setVersion(version) { set({ version }); }
export function setFontScale(fontScale) { set({ fontScale }); }
export function setDailyGoal(dailyGoal) { set({ dailyGoal }); }

export function setLastRead(info) { set({ lastRead: info }); }

export function isChapterRead(abbrev, chapter) {
  return !!state.read[`${abbrev}.${chapter}`];
}

export function markChapterRead(abbrev, chapter, versesCount = 0) {
  const id = `${abbrev}.${chapter}`;
  if (state.read[id]) return { xpGained: 0, newAchievements: [] };
  const today = todayStr();

  set((s) => {
    const read = { ...s.read, [id]: Date.now() };
    // streak
    let streak = { ...s.streak };
    if (streak.last === today) {
      // já leu hoje, mantém
    } else if (streak.last && daysBetween(streak.last, today) === 1) {
      streak = { count: streak.count + 1, last: today };
    } else {
      streak = { count: 1, last: today };
    }
    const dailyLog = { ...s.dailyLog, [today]: (s.dailyLog[today] || 0) + 1 };
    const xpGain = 10 + Math.min(20, Math.round(versesCount / 5));
    return { ...s, read, streak, dailyLog, xp: s.xp + xpGain };
  });

  const newAchievements = recomputeAchievements();
  return { xpGained: 10, newAchievements };
}

export function toggleFavorite(ref) {
  set((s) => {
    const exists = s.favorites.includes(ref);
    const favorites = exists ? s.favorites.filter((r) => r !== ref) : [ref, ...s.favorites];
    return { ...s, favorites };
  });
  recomputeAchievements();
}
export function isFavorite(ref) { return state.favorites.includes(ref); }

export function setNote(ref, text) {
  set((s) => {
    const notes = { ...s.notes };
    if (text && text.trim()) notes[ref] = text; else delete notes[ref];
    return { ...s, notes };
  });
}

// ---------- level ----------
export function levelFromXp(xp) {
  // curva suave: nível n requer 100 * n * (n+1) / 2 acumulado
  let level = 1;
  while (xp >= 50 * level * (level + 1)) level++;
  const floor = 50 * (level - 1) * level;
  const ceil = 50 * level * (level + 1);
  return { level, floor, ceil, into: xp - floor, span: ceil - floor };
}

// ---------- conquistas ----------
export const ACHIEVEMENTS = [
  { id: 'first_step', name: 'Primeiro Passo', desc: 'Leia seu primeiro capítulo', icon: '🌱', test: (s) => Object.keys(s.read).length >= 1 },
  { id: 'genesis_done', name: 'No Princípio', desc: 'Complete o livro de Gênesis', icon: '🌍', test: (s) => bookComplete(s, 'gn', 50) },
  { id: 'gospel_john', name: 'A Palavra', desc: 'Complete o Evangelho de João', icon: '✝️', test: (s) => bookComplete(s, 'jo', 21) },
  { id: 'psalms_50', name: 'Salmista', desc: 'Leia 50 salmos', icon: '🎵', test: (s) => countBook(s, 'sl') >= 50 },
  { id: 'streak_7', name: 'Semana Fiel', desc: 'Mantenha 7 dias seguidos', icon: '🔥', test: (s) => s.streak.count >= 7 },
  { id: 'streak_30', name: 'Mês Devoto', desc: 'Mantenha 30 dias seguidos', icon: '⚡', test: (s) => s.streak.count >= 30 },
  { id: 'chapters_100', name: 'Centurião', desc: 'Leia 100 capítulos', icon: '💯', test: (s) => Object.keys(s.read).length >= 100 },
  { id: 'chapters_500', name: 'Peregrino', desc: 'Leia 500 capítulos', icon: '🧭', test: (s) => Object.keys(s.read).length >= 500 },
  { id: 'nt_done', name: 'Boas Novas', desc: 'Complete o Novo Testamento', icon: '📜', test: (s, idx) => testamentComplete(s, idx, 'NT') },
  { id: 'ot_done', name: 'Lei e Profetas', desc: 'Complete o Antigo Testamento', icon: '🏛️', test: (s, idx) => testamentComplete(s, idx, 'VT') },
  { id: 'whole_bible', name: 'Toda a Palavra', desc: 'Leia a Bíblia inteira', icon: '👑', test: (s) => Object.keys(s.read).length >= 1189 },
  { id: 'collector', name: 'Colecionador', desc: 'Favorite 10 versículos', icon: '⭐', test: (s) => s.favorites.length >= 10 },
];

let _indexRef = null;
export function setIndexRef(idx) { _indexRef = idx; }

function countBook(s, abbrev) {
  return Object.keys(s.read).filter((k) => k.startsWith(abbrev + '.')).length;
}
function bookComplete(s, abbrev, chapters) {
  return countBook(s, abbrev) >= chapters;
}
function testamentComplete(s, idx, t) {
  if (!idx) return false;
  const books = idx.books.filter((b) => b.testament === t);
  return books.every((b) => countBook(s, b.abbrev) >= b.chapters);
}

export function recomputeAchievements() {
  const gained = [];
  set((s) => {
    const achievements = { ...s.achievements };
    let xpBonus = 0;
    for (const a of ACHIEVEMENTS) {
      if (!achievements[a.id] && a.test(s, _indexRef)) {
        achievements[a.id] = Date.now();
        gained.push(a);
        xpBonus += 50;
      }
    }
    if (!gained.length) return s;
    return { ...s, achievements, xp: s.xp + xpBonus };
  });
  return gained;
}

// stats derivados
export function computeStats(idx) {
  const s = state;
  const totalChapters = idx ? idx.totals.chapters : 1189;
  const readCount = Object.keys(s.read).length;
  return {
    readCount,
    totalChapters,
    percent: Math.round((readCount / totalChapters) * 1000) / 10,
    favorites: s.favorites.length,
    streak: s.streak.count,
    xp: s.xp,
    level: levelFromXp(s.xp),
    todayRead: s.dailyLog[todayStr()] || 0,
  };
}
