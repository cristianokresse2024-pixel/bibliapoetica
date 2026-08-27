/* ============================================================
   store.js — estado do usuário e persistência local
   ============================================================ */

const KEY = "bibliapoetica:v1";

const defaultState = {
  xp: 0,
  streak: 0,            // ofensiva atual (dias consecutivos)
  bestStreak: 0,        // recorde de ofensiva
  lastReadDay: null,    // "YYYY-MM-DD" da última leitura
  history: {},          // { "YYYY-MM-DD": xpGanhoNoDia }
  read: {},             // { "gn:1": true, ... } capítulos lidos
  badges: {},           // { "livro:gn": "YYYY-MM-DD", ... }
  lastRead: null,       // { book, chapter } para "continuar lendo"
  settings: { theme: "dark", font: "md" },
};

const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(defaultState);
    const saved = JSON.parse(raw);
    return { ...structuredClone(defaultState), ...saved, settings: { ...defaultState.settings, ...(saved.settings || {}) } };
  } catch {
    return structuredClone(defaultState);
  }
}

let state = load();

export function getState() { return state; }

export function setState(patch) {
  state = { ...state, ...patch };
  persist();
  emit();
}

export function patch(fn) {
  const next = fn(structuredClone(state));
  state = next;
  persist();
  emit();
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* armazenamento cheio */ }
}

export function resetAll() {
  state = structuredClone(defaultState);
  persist();
  emit();
}

export function onChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() { listeners.forEach((fn) => fn(state)); }

/* ---------- utilitários de data ---------- */
export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function addDaysKey(key, n) {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d + n);
  return todayKey(dt);
}

export function keyToDate(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}
