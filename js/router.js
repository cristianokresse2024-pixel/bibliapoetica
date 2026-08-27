/* ============================================================
   router.js — hash router simples
   Rotas: #/ | #/biblia | #/livro/:id | #/ler/:id/:cap | #/estatisticas
   ============================================================ */

export function parseRoute(hash) {
  const path = (hash || "#/").replace(/^#\/?/, "");
  const segments = path.split("/").filter(Boolean).map(decodeURIComponent);
  if (segments.length === 0) return { name: "home" };
  if (segments[0] === "biblia") return { name: "biblia" };
  if (segments[0] === "livro" && segments[1]) return { name: "livro", book: segments[1] };
  if (segments[0] === "ler" && segments[1] && segments[2]) {
    return { name: "ler", book: segments[1], chapter: parseInt(segments[2], 10) || 1 };
  }
  if (segments[0] === "estatisticas") return { name: "stats" };
  return { name: "home" };
}

export function startRouter(onRoute) {
  function handle() { onRoute(parseRoute(location.hash)); }
  window.addEventListener("hashchange", handle);
  handle();
}

export function navigate(path) { location.hash = path; }
