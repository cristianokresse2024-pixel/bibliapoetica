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

  // ---- Lugar Secreto (oração) ----
  prayer: {
    totalSeconds: 0,     // tempo total orado (acumulado)
    sessions: 0,         // nº de sessões concluídas
    longest: 0,          // maior sessão em segundos
    lastGoalMin: 15,     // última meta escolhida (minutos)
    log: {},             // 'YYYY-MM-DD' -> segundos orados no dia
    history: [],         // [{ date, seconds, goalMin }]
  },

  // ---- Jejum ----
  fast: {
    active: null,        // { type, label, startTs, endTs, note } ou null
    completed: 0,        // nº de jejuns concluídos
    totalHours: 0,       // horas totais jejuadas
    longestHours: 0,     // maior jejum em horas
    history: [],         // [{ type, label, startTs, endTs, plannedMs, note }]
  },

  // ---- Diário de gratidão ----
  gratitude: [],         // [{ id, ts, date, text }]

  // ---- Lembrete de oração ----
  prayerReminder: {
    enabled: false,
    time: '07:00',       // 'HH:MM'
    lastNotified: null,  // 'YYYY-MM-DD'
  },
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
let syncTimer = null;

export function triggerDebouncedCloudSync() {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(async () => {
    try {
      const sessionRaw = localStorage.getItem('viva_session_v1');
      if (!sessionRaw) return;
      const session = JSON.parse(sessionRaw);
      if (!session || !session.id) return;

      await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.id,
          progress: state,
        }),
      });
    } catch {
      // Falha silenciosa se estiver offline
    }
  }, 1200);
}

function emit() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  listeners.forEach((l) => l());
  triggerDebouncedCloudSync();
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

/**
 * Restaura e mescla o progresso vindo da nuvem (Supabase) ao fazer login em qualquer dispositivo
 */
export function hydrateProgressFromCloud(cloudProgress) {
  if (!cloudProgress) return;
  set((current) => {
    return {
      ...current,
      read: { ...current.read, ...(cloudProgress.read || {}) },
      favorites: Array.from(new Set([...(current.favorites || []), ...(cloudProgress.favorites || [])])),
      notes: { ...current.notes, ...(cloudProgress.notes || {}) },
      achievements: { ...current.achievements, ...(cloudProgress.achievements || {}) },
      xp: Math.max(current.xp || 0, cloudProgress.xp || 0),
      streak:
        (cloudProgress.streak?.count || 0) >= (current.streak?.count || 0)
          ? cloudProgress.streak
          : current.streak,
      prayer: {
        totalSeconds: Math.max(current.prayer?.totalSeconds || 0, cloudProgress.prayer?.totalSeconds || 0),
        sessions: Math.max(current.prayer?.sessions || 0, cloudProgress.prayer?.sessions || 0),
        longest: Math.max(current.prayer?.longest || 0, cloudProgress.prayer?.longest || 0),
        lastGoalMin: cloudProgress.prayer?.lastGoalMin || current.prayer?.lastGoalMin || 15,
        log: { ...(current.prayer?.log || {}), ...(cloudProgress.prayer?.log || {}) },
        history: [...(cloudProgress.prayer?.history || []), ...(current.prayer?.history || [])].slice(0, 100),
      },
      fast: {
        completed: Math.max(current.fast?.completed || 0, cloudProgress.fast?.completed || 0),
        totalHours: Math.max(current.fast?.totalHours || 0, cloudProgress.fast?.totalHours || 0),
        longestHours: Math.max(current.fast?.longestHours || 0, cloudProgress.fast?.longestHours || 0),
        active: current.fast?.active || cloudProgress.fast?.active || null,
        history: [...(cloudProgress.fast?.history || []), ...(current.fast?.history || [])].slice(0, 100),
      },
      gratitude: [...(cloudProgress.gratitude || []), ...(current.gratitude || [])]
        .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
        .slice(0, 500),
      lastRead: cloudProgress.lastRead || current.lastRead,
      dailyGoal: cloudProgress.dailyGoal || current.dailyGoal || 3,
      fontScale: cloudProgress.fontScale || current.fontScale || 1.0,
      version: cloudProgress.version || current.version || 'nvi',
    };
  });
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

// ---------- Lugar Secreto (oração) ----------
export function setPrayerGoal(min) {
  set((s) => ({ ...s, prayer: { ...s.prayer, lastGoalMin: min } }));
}

// Registra uma sessão de oração concluída. seconds = tempo efetivamente orado.
export function recordPrayer(seconds, goalMin) {
  const today = todayStr();
  const mins = Math.max(1, Math.round(seconds / 60));
  set((s) => {
    const p = s.prayer;
    // streak também conta oração como atividade espiritual do dia
    let streak = { ...s.streak };
    if (streak.last === today) {
      // já ativo hoje
    } else if (streak.last && daysBetween(streak.last, today) === 1) {
      streak = { count: streak.count + 1, last: today };
    } else {
      streak = { count: 1, last: today };
    }
    return {
      ...s,
      streak,
      xp: s.xp + 5 + mins, // 5 base + 1 XP por minuto orado
      prayer: {
        ...p,
        totalSeconds: p.totalSeconds + seconds,
        sessions: p.sessions + 1,
        longest: Math.max(p.longest, seconds),
        lastGoalMin: goalMin || p.lastGoalMin,
        log: { ...p.log, [today]: (p.log[today] || 0) + seconds },
        history: [{ date: today, seconds, goalMin: goalMin || p.lastGoalMin, ts: Date.now() }, ...p.history].slice(0, 100),
      },
    };
  });
  const gained = recomputeAchievements();
  return { newAchievements: gained, mins };
}

// ---------- Jejum ----------
export function startFast({ type, label, plannedMs, note }) {
  const startTs = Date.now();
  set((s) => ({
    ...s,
    fast: { ...s.fast, active: { type, label, startTs, endTs: startTs + plannedMs, plannedMs, note: note || '' } },
  }));
}

export function cancelFast() {
  set((s) => ({ ...s, fast: { ...s.fast, active: null } }));
}

// Conclui o jejum ativo (manual ou automático ao atingir o tempo).
export function completeFast() {
  const active = state.fast.active;
  if (!active) return { newAchievements: [], hours: 0 };
  const elapsedMs = Date.now() - active.startTs;
  const hours = Math.max(0, Math.round((elapsedMs / 3600000) * 10) / 10);
  const today = todayStr();
  set((s) => {
    const f = s.fast;
    let streak = { ...s.streak };
    if (streak.last === today) {} 
    else if (streak.last && daysBetween(streak.last, today) === 1) streak = { count: streak.count + 1, last: today };
    else streak = { count: 1, last: today };
    return {
      ...s,
      streak,
      xp: s.xp + 20 + Math.round(hours * 3), // 20 base + 3 XP por hora
      fast: {
        ...f,
        active: null,
        completed: f.completed + 1,
        totalHours: Math.round((f.totalHours + hours) * 10) / 10,
        longestHours: Math.max(f.longestHours, hours),
        history: [{ ...active, endedTs: Date.now(), hours }, ...f.history].slice(0, 100),
      },
    };
  });
  const gained = recomputeAchievements();
  return { newAchievements: gained, hours };
}

// ---------- Diário de gratidão ----------
export function addGratitude(text) {
  if (!text || !text.trim()) return { newAchievements: [] };
  const today = todayStr();
  set((s) => {
    // conta como atividade espiritual do dia (mantém streak)
    let streak = { ...s.streak };
    if (streak.last === today) {}
    else if (streak.last && daysBetween(streak.last, today) === 1) streak = { count: streak.count + 1, last: today };
    else streak = { count: 1, last: today };
    const entry = { id: Math.random().toString(36).slice(2), ts: Date.now(), date: today, text: text.trim() };
    return { ...s, streak, xp: s.xp + 5, gratitude: [entry, ...s.gratitude].slice(0, 500) };
  });
  return { newAchievements: recomputeAchievements() };
}

export function removeGratitude(id) {
  set((s) => ({ ...s, gratitude: s.gratitude.filter((g) => g.id !== id) }));
}

// ---------- Lembrete de oração ----------
export function setPrayerReminder(patch) {
  set((s) => ({ ...s, prayerReminder: { ...s.prayerReminder, ...patch } }));
}
export function markReminderNotified(date) {
  set((s) => ({ ...s, prayerReminder: { ...s.prayerReminder, lastNotified: date } }));
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
  // Oração
  { id: 'first_prayer', name: 'No Lugar Secreto', desc: 'Conclua sua 1ª oração', icon: '🙏', test: (s) => s.prayer.sessions >= 1 },
  { id: 'prayer_warrior', name: 'Guerreiro de Oração', desc: 'Conclua 10 orações', icon: '🕊️', test: (s) => s.prayer.sessions >= 10 },
  { id: 'prayer_hour', name: 'Uma Hora Vigiando', desc: 'Ore 60 min numa só vez', icon: '⏳', test: (s) => s.prayer.longest >= 3600 },
  { id: 'prayer_10h', name: 'Intercessor', desc: 'Acumule 10h de oração', icon: '💛', test: (s) => s.prayer.totalSeconds >= 36000 },
  // Jejum
  { id: 'first_fast', name: 'Primeiro Jejum', desc: 'Conclua seu 1º jejum', icon: '🍽️', test: (s) => s.fast.completed >= 1 },
  { id: 'fast_24', name: 'Um Dia Consagrado', desc: 'Conclua um jejum de 24h', icon: '🌙', test: (s) => s.fast.longestHours >= 24 },
  { id: 'fast_5', name: 'Disciplina Espiritual', desc: 'Conclua 5 jejuns', icon: '🔥', test: (s) => s.fast.completed >= 5 },
  // Gratidão
  { id: 'first_gratitude', name: 'Coração Grato', desc: 'Escreva sua 1ª gratidão', icon: '🌻', test: (s) => (s.gratitude?.length || 0) >= 1 },
  { id: 'gratitude_30', name: 'Gratidão Constante', desc: 'Registre 30 gratidões', icon: '🙌', test: (s) => (s.gratitude?.length || 0) >= 30 },
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
    prayerSessions: s.prayer.sessions,
    prayerMinutes: Math.round(s.prayer.totalSeconds / 60),
    fastCompleted: s.fast.completed,
    fastActive: s.fast.active,
    gratitudeCount: s.gratitude?.length || 0,
  };
}
