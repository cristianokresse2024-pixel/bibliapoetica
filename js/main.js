/* ============================================================
   main.js — bootstrap do app
   ============================================================ */

import { getState, setState, onChange } from "./store.js";
import { startRouter } from "./router.js";
import { getBible, getChapter } from "./data.js";
import { markChapterRead, checkBookComplete, applyRewards, updateMiniXp, toast } from "./gamification.js";
import { renderHome, renderBiblia, renderLivro, renderLer, renderStats } from "./views.js";

const view = document.getElementById("view");

/* ---------- tema e fonte ---------- */
function applySettings() {
  const st = getState();
  document.documentElement.dataset.theme = st.settings.theme;
  document.documentElement.dataset.font = st.settings.font;
  document.getElementById("themeToggle").textContent = st.settings.theme === "dark" ? "☾" : "☀";
}
document.getElementById("themeToggle").addEventListener("click", () => {
  const next = getState().settings.theme === "dark" ? "light" : "dark";
  setState({ settings: { ...getState().settings, theme: next } });
});
window.addEventListener("biblepoetica:font", (e) => {
  setState({ settings: { ...getState().settings, font: e.detail } });
});

/* ---------- tabbar ativa ---------- */
function setActiveTab(routeName) {
  const map = { home: "home", biblia: "biblia", livro: "biblia", ler: "biblia", stats: "stats" };
  const active = map[routeName] || "home";
  document.querySelectorAll(".tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.tab === active);
  });
}

/* ---------- rotas ---------- */
let bible = null;
let pendingRoute = null;

async function handleRoute(route) {
  if (!bible) {
    pendingRoute = route;
    return;
  }
  setActiveTab(route.name);
  window.scrollTo({ top: 0 });

  try {
    switch (route.name) {
      case "home":
        await renderHome(view, bible);
        break;
      case "biblia":
        renderBiblia(view, bible);
        break;
      case "livro":
        renderLivro(view, bible, route.book);
        break;
      case "ler": {
        const chapter = await getChapter(bible, route.book, route.chapter);
        renderLer(view, bible, route.book, route.chapter, chapter);
        bindReaderActions(route.book, route.chapter);
        break;
      }
      case "stats":
        renderStats(view, bible);
        break;
      default:
        view.innerHTML = `<div class="card soon-card"><h2>Página não encontrada</h2><p><a class="btn" href="#/">Voltar ao início</a></p></div>`;
    }
  } catch (err) {
    console.error(err);
    view.innerHTML = `<div class="card soon-card"><div class="big">😢</div><h2>Algo deu errado</h2><p>${err.message}</p><p><a class="btn" href="#/">Voltar ao início</a></p></div>`;
  }
}

/* ---------- ações do leitor ---------- */
function bindReaderActions(bookId, chapterNum) {
  const btn = document.getElementById("markReadBtn");
  if (!btn) return;

  const book = bible.books[bookId];
  const bookName = book.short || book.name;

  btn.addEventListener("click", () => {
    const rewards = markChapterRead(bookId, chapterNum);
    applyRewards(rewards, `${bookName} ${chapterNum}`);

    // verifica conclusão do livro
    const complete = checkBookComplete(bookId, book.chapters);
    if (complete) {
      toast(`🏅 Você concluiu ${book.name}! +${complete.gained} XP`, "badge");
    }

    // atualiza a tela
    handleRoute({ name: "ler", book: bookId, chapter: chapterNum });
  });
}

/* ---------- mini XP ---------- */
document.getElementById("miniXp").addEventListener("click", () => { location.hash = "#/estatisticas"; });

/* ---------- offline ---------- */
window.addEventListener("offline", () => { document.getElementById("offlineBar").hidden = false; });
window.addEventListener("online", () => { document.getElementById("offlineBar").hidden = true; });

/* ---------- boot ---------- */
async function boot() {
  applySettings();
  updateMiniXp();
  onChange(() => {
    updateMiniXp();
  });

  startRouter(async (route) => {
    if (!bible) {
      pendingRoute = route;
      try {
        bible = await getBible();
      } catch (err) {
        console.error("Falha ao carregar a Bíblia", err);
        view.innerHTML = `<div class="card soon-card"><div class="big">😢</div><h2>Não foi possível carregar a Bíblia</h2><p>Verifique sua conexão e recarregue a página.</p></div>`;
        return;
      }
      const r = pendingRoute || route;
      pendingRoute = null;
      await handleRoute(r);
    } else {
      await handleRoute(route);
    }
  });

  // service worker (PWA offline)
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("sw.js");
    } catch (err) {
      console.warn("Service worker não registrado:", err);
    }
  }
}

boot();
