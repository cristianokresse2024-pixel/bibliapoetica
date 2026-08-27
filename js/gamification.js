/* ============================================================
   gamification.js — XP, níveis, ofensivas, conquistas
   ============================================================ */

import { getState, patch, todayKey, addDaysKey } from "./store.js";

/* Regras de XP */
export const XP_RULES = {
  chapterFirst: 10,   // ler um capítulo pela 1ª vez
  chapterReread: 2,   // reler um capítulo já lido
  bookComplete: 25,   // concluir um livro
  streakBonus: 5,     // bônus por dia de ofensiva (limitado a 10)
};

/* Níveis e títulos */
export const LEVELS = [
  { xp: 0,     title: "Novato" },
  { xp: 60,    title: "Curioso" },
  { xp: 150,   title: "Peregrino" },
  { xp: 280,   title: "Explorador" },
  { xp: 450,   title: "Leitor" },
  { xp: 660,   title: "Discípulo" },
  { xp: 910,   title: "Aprendiz" },
  { xp: 1200,  title: "Servo" },
  { xp: 1530,  title: "Mensageiro" },
  { xp: 1900,  title: "Atalaia" },
  { xp: 2310,  title: "Guerreiro" },
  { xp: 2760,  title: "Pastor" },
  { xp: 3250,  title: "Mestre" },
  { xp: 3780,  title: "Sábio" },
  { xp: 4350,  title: "Escriba" },
  { xp: 4960,  title: "Profeta" },
  { xp: 5610,  title: "Sacerdote" },
  { xp: 6300,  title: "Príncipe" },
  { xp: 7030,  title: "Rei" },
  { xp: 7800,  title: "Apóstolo" },
];

export function levelInfo(xp) {
  let lvl = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].xp) lvl = i;
  const cur = LEVELS[lvl];
  const next = LEVELS[lvl + 1] || null;
  const into = next ? xp - cur.xp : 0;
  const span = next ? next.xp - cur.xp : 1;
  return {
    number: lvl + 1,
    title: cur.title,
    xp,
    nextXp: next ? next.xp : null,
    into,
    span,
    pct: next ? Math.min(100, Math.round((into / span) * 100)) : 100,
    max: !next,
  };
}

/* ---------- marca um capítulo como lido e aplica recompensas ---------- */
export function markChapterRead(bookId, chapter) {
  const key = `${bookId}:${chapter}`;
  const today = todayKey();
  const st = getState();
  const already = !!st.read[key];

  const rewards = { xp: 0, parts: [], streak: 0, newBadge: null };

  // 1) XP do capítulo
  if (!already) {
    rewards.xp += XP_RULES.chapterFirst;
    rewards.parts.push(`+${XP_RULES.chapterFirst} XP — capítulo lido`);
  } else {
    rewards.xp += XP_RULES.chapterReread;
    rewards.parts.push(`+${XP_RULES.chapterReread} XP — releitura`);
  }

  // 2) Atualização de ofensiva (streak) e bônus
  let newStreak = st.streak;
  if (st.lastReadDay === today) {
    // já leu hoje: ofensiva continua igual
  } else if (st.lastReadDay === addDaysKey(today, -1)) {
    newStreak += 1;
  } else {
    newStreak = 1;
  }
  if (!st.history[today]) {
    const bonus = Math.min(newStreak, 10) * XP_RULES.streakBonus;
    rewards.xp += bonus;
    rewards.streak = newStreak;
    if (newStreak > 1) rewards.parts.push(`+${bonus} XP — bônus de ofensiva (🔥 ${newStreak} dias)`);
    else rewards.parts.push(`+${bonus} XP — bônus do dia`);
  }

  patch((s) => {
    s.read[key] = true;
    s.lastRead = { book: bookId, chapter };
    s.lastReadDay = today;
    s.streak = newStreak;
    s.bestStreak = Math.max(s.bestStreak || 0, newStreak);
    s.history[today] = (s.history[today] || 0) + rewards.xp;
    s.xp += rewards.xp;
    return s;
  });

  return rewards;
}

/* ---------- verifica se um livro inteiro foi concluído ---------- */
export function checkBookComplete(bookId, totalChapters) {
  const st = getState();
  const done = totalChapters;
  const readCount = Array.from({ length: totalChapters }, (_, i) => i + 1)
    .filter((c) => st.read[`${bookId}:${c}`]).length;
  if (readCount >= done && !st.badges[`livro:${bookId}`]) {
    const today = todayKey();
    let gained = XP_RULES.bookComplete;
    patch((s) => {
      s.badges[`livro:${bookId}`] = today;
      s.history[today] = (s.history[today] || 0) + gained;
      s.xp += gained;
      return s;
    });
    return { badge: `livro:${bookId}`, gained };
  }
  return null;
}

/* ---------- toast ---------- */
export function toast(message, kind = "xp") {
  const box = document.getElementById("toasts");
  if (!box) return;
  const el = document.createElement("div");
  el.className = `toast ${kind}`;
  const icons = { xp: "✨", streak: "🔥", badge: "🏅", info: "📖" };
  el.innerHTML = `<span>${icons[kind] || icons.info}</span><span>${message}</span>`;
  box.appendChild(el);
  setTimeout(() => {
    el.classList.add("out");
    setTimeout(() => el.remove(), 350);
  }, 3400);
}

/* ---------- overlay de level-up ---------- */
export function showLevelUp(level) {
  const overlay = document.getElementById("levelUp");
  if (!overlay) return;
  document.getElementById("luLevel").textContent = `Nível ${level.number}`;
  document.getElementById("luTitle").textContent = `“${level.title}”`;
  overlay.hidden = false;
  document.getElementById("luOk").onclick = () => { overlay.hidden = true; };
}

/* Aplica o XP e dispara toasts + level-up se subiu de nível */
export function applyRewards(rewards, bookName = "") {
  const before = getState().xp - rewards.xp;
  const beforeLvl = levelInfo(before).number;
  const afterLvl = levelInfo(getState().xp).number;

  if (rewards.streak > 1) toast(`Ofensiva de ${rewards.streak} dias! ${rewards.streak > 2 ? "Continue firme!" : ""}`, "streak");
  if (rewards.xp > 0) toast(`+${rewards.xp} XP${bookName ? ` · ${bookName}` : ""}`, "xp");
  if (rewards.newBadge) toast("🏅 Conquista desbloqueada!", "badge");

  if (afterLvl > beforeLvl) {
    setTimeout(() => showLevelUp(levelInfo(getState().xp)), 900);
  }
  updateMiniXp();
}

/* ---------- mini barra de XP no topo ---------- */
export function updateMiniXp() {
  const st = getState();
  const lvl = levelInfo(st.xp);
  const lvlEl = document.getElementById("miniLevel");
  const barEl = document.getElementById("miniXpBar");
  const ptsEl = document.getElementById("miniXpPoints");
  if (lvlEl) lvlEl.textContent = `Nv ${lvl.number}`;
  if (barEl) barEl.style.width = `${lvl.pct}%`;
  if (ptsEl) ptsEl.textContent = `${st.xp} XP`;
}
