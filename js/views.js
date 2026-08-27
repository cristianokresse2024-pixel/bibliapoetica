/* ============================================================
   views.js — renderização das telas
   ============================================================ */

import { getState } from "./store.js";
import { levelInfo } from "./gamification.js";
import { orderedBooks, contentParts, totalChapters, getDailyVerse } from "./data.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = (n) => Number(n || 0).toLocaleString("pt-BR");

/* ============================================================
   INÍCIO
   ============================================================ */
export async function renderHome(view, bible) {
  const st = getState();
  const lvl = levelInfo(st.xp);
  const books = orderedBooks(bible);
  const total = totalChapters(bible);
  const readCount = Object.keys(st.read).length;
  const pctBible = Math.round((readCount / total) * 100);
  const daily = await getDailyVerse();
  const todayDone = (st.history || {})[new Date().toISOString().slice(0, 10)] > 0;

  const continueCard = st.lastRead
    ? `
    <a class="card continue-card" href="#/ler/${st.lastRead.book}/${st.lastRead.chapter}">
      <img class="continue-cover" src="assets/capa-genesis.jpg" alt="">
      <div class="continue-info">
        <div class="kicker">Continuar lendo</div>
        <h3>${esc(bookInfoName(bible, st.lastRead.book))} ${st.lastRead.chapter}</h3>
        <p>Você parou aqui — retome sua leitura e ganhe XP</p>
      </div>
      <span class="continue-go">›</span>
    </a>`
    : `
    <a class="card continue-card" href="#/ler/gn/1">
      <img class="continue-cover" src="assets/capa-genesis.jpg" alt="">
      <div class="continue-info">
        <div class="kicker">Comece sua jornada</div>
        <h3>Gênesis 1</h3>
        <p>“No princípio, Deus criou os céus e a terra.”</p>
      </div>
      <span class="continue-go">›</span>
    </a>`;

  view.innerHTML = `
    <section class="hero">
      <h1>${st.lastReadDay && todayDone ? `Olá de novo! 🔥` : `Leia a Palavra. Viva a Palavra.`}</h1>
      <p>Uma Bíblia digital em linguagem viva e de fácil leitura, fiel ao sentido dos escritos originais. Leia, ganhe pontos e mantenha sua chama acesa — um capítulo por dia muda uma vida.</p>
      <div class="hero-stats">
        <span class="hero-chip">⚡ Nível ${lvl.number} · ${esc(lvl.title)}</span>
        <span class="hero-chip">🔥 ${st.streak} dia${st.streak === 1 ? "" : "s"} seguido${st.streak === 1 ? "" : "s"}</span>
        <span class="hero-chip">📖 ${fmt(readCount)} capítulos lidos</span>
      </div>
    </section>

    <h2 class="section-title">Seu progresso</h2>
    <div class="card ring-wrap" style="margin-bottom:16px">
      <div class="ring">
        <svg width="92" height="92" viewBox="0 0 92 92">
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#f0c86e"/><stop offset="100%" stop-color="#ff9f43"/>
            </linearGradient>
          </defs>
          <circle class="ring-track" cx="46" cy="46" r="40" fill="none" stroke-width="9"/>
          <circle class="ring-fill" cx="46" cy="46" r="40" fill="none" stroke-width="9"
            stroke-dasharray="251.3" stroke-dashoffset="${(251.3 * (1 - lvl.pct / 100)).toFixed(1)}"/>
        </svg>
        <div class="ring-center">${lvl.pct}%</div>
      </div>
      <div style="flex:1">
        <div style="font-size:12px;color:var(--text-soft);letter-spacing:1px;text-transform:uppercase;font-weight:800">Nível ${lvl.number} · ${esc(lvl.title)}</div>
        <div style="font-size:22px;font-weight:900;margin:6px 0 4px">${fmt(st.xp)} XP</div>
        <div style="font-size:12.5px;color:var(--text-faint)">
          ${lvl.nextXp ? `Faltam ${fmt(lvl.nextXp - st.xp)} XP para o Nível ${lvl.number + 1}` : "Nível máximo alcançado. Que jornada! 👑"}
        </div>
      </div>
    </div>

    <div class="progress-row" style="margin-bottom:8px">
      <div class="card stat-card"><div class="ico">🔥</div><div class="value">${st.streak}</div><div class="label">dias de ofensiva</div><div class="sub">recorde: ${st.bestStreak} dias</div></div>
      <div class="card stat-card"><div class="ico">📖</div><div class="value">${fmt(readCount)}</div><div class="label">capítulos lidos</div><div class="sub">de ${fmt(total)} na Bíblia</div></div>
      <div class="card stat-card"><div class="ico">📊</div><div class="value">${pctBible}%</div><div class="label">da Bíblia</div><div class="sub">continue assim!</div></div>
      <div class="card stat-card"><div class="ico">🏅</div><div class="value">${Object.keys(st.badges).length}</div><div class="label">conquistas</div><div class="sub"><a href="#/estatisticas" style="color:var(--gold-soft);font-weight:700">ver todas ›</a></div></div>
    </div>

    <h2 class="section-title">Versículo do dia</h2>
    <div class="card daily">
      <div class="ref">${esc(daily.ref)}</div>
      <blockquote>“${esc(daily.text)}”</blockquote>
      <div class="daily-note">${esc(daily.note)}</div>
    </div>

    <h2 class="section-title">Continuar lendo</h2>
    ${continueCard}

    <h2 class="section-title">Como funciona</h2>
    <div class="method">
      <h3>📖 Texto: moderno e fiel</h3>
      <p>Cada capítulo é uma adaptação em português atual, elaborada com base em traduções consagradas de domínio público (Almeida 1911 e Tradução Brasileira 1917), preservando o sentido dos escritos originais — sem invenções, sem cortes de conteúdo.</p>
      <h3>🎮 Gamificação: leitura que vicia (no bom sentido)</h3>
      <p>Ganhe XP ao ler capítulos (+10 na primeira leitura), receba bônus diários conforme sua ofensiva cresce, desbloqueie conquistas ao concluir livros e suba de nível ganhando títulos — de Novato a Apóstolo.</p>
    </div>`;
}

function bookInfoName(bible, id) { return bible.books[id]?.name || id; }

/* ============================================================
   BIBLIOTECA
   ============================================================ */
const GROUPS = { todos: "Todos", pentateuco: "Pentateuco", historicos: "Históricos", poeticos: "Poéticos", profetas: "Profetas", evangelhos: "Evangelhos", historia: "História", cartas: "Cartas", profecia: "Profecia" };

export function renderBiblia(view, bible) {
  const st = getState();
  const books = orderedBooks(bible);

  view.innerHTML = `
    <h1 class="page-title">Bíblia</h1>
    <div class="filters" id="bookFilters">
      ${Object.entries(GROUPS).map(([gid, gname]) =>
        `<button class="filter-pill ${gid === "todos" ? "active" : ""}" data-group="${gid}">${gname}</button>`).join("")}
    </div>
    <div id="booksContainer"></div>
    <div class="method" style="margin-top:18px">
      <h3>Conteúdo em expansão</h3>
      <p>Gênesis já está disponível com a adaptação completa. Os demais livros aparecem com seus capítulos assim que o texto é publicado — os que já possuem conteúdo estão marcados em dourado.</p>
    </div>`;

  const container = view.querySelector("#booksContainer");
  const pills = view.querySelectorAll(".filter-pill");

  function paint(group) {
    container.innerHTML = "";
    for (const b of books) {
      if (group !== "todos" && b.groupId !== group) continue;
      const parts = contentParts(bible, b.id);
      const hasContent = parts.length > 0;
      const readCount = Array.from({ length: b.chapters }, (_, i) => i + 1)
        .filter((c) => st.read[`${b.id}:${c}`]).length;
      const pct = Math.round((readCount / b.chapters) * 100);
      const done = readCount === b.chapters;

      const tile = document.createElement("a");
      tile.href = hasContent ? `#/livro/${b.id}` : "#/biblia";
      tile.className = `book-tile ${done ? "done" : ""} ${hasContent ? "" : "empty"}`;
      tile.innerHTML = `
        <div class="abbrev">${esc(b.short)}</div>
        <div class="name">${esc(b.name)}</div>
        <div class="ch-count">${b.chapters} cap.</div>
        ${readCount > 0 ? `<span class="pct ${done ? "done" : ""}">${done ? "✓ 100%" : pct + "%"}</span>` : ""}
        ${!hasContent ? `<span class="badge-soon">em breve</span>` : ""}`;
      if (!hasContent) {
        tile.addEventListener("click", (e) => { e.preventDefault(); });
      }
      container.appendChild(tile);
    }
    // mostrar grupo do testamento como legenda
    const curBooks = books.filter((b) => group === "todos" || b.groupId === group);
    const atCount = curBooks.filter((b) => b.testament === "at").length;
    const ntCount = curBooks.length - atCount;
    const legend = document.createElement("div");
    legend.style.cssText = "font-size:11.5px;color:var(--text-faint);margin:12px 2px 0";
    legend.textContent = `${curBooks.length} livros · ${atCount} no Antigo Testamento · ${ntCount} no Novo Testamento`;
    container.appendChild(legend);
  }

  pills.forEach((pill) => pill.addEventListener("click", () => {
    pills.forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    paint(pill.dataset.group);
  }));

  paint("todos");
}

/* ============================================================
   PÁGINA DO LIVRO
   ============================================================ */
export function renderLivro(view, bible, bookId) {
  const b = bible.books[bookId];
  if (!b) { view.innerHTML = `<div class="card soon-card"><div class="big">📭</div><h2>Livro não encontrado</h2><p><a class="btn" href="#/biblia">Voltar à Bíblia</a></p></div>`; return; }

  const st = getState();
  const parts = contentParts(bible, bookId);
  const hasContent = parts.length > 0;
  const readCount = Array.from({ length: b.chapters }, (_, i) => i + 1)
    .filter((c) => st.read[`${bookId}:${c}`]).length;
  const pct = Math.round((readCount / b.chapters) * 100);
  const current = st.lastRead && st.lastRead.book === bookId ? st.lastRead.chapter : null;
  const badge = st.badges[`livro:${bookId}`];

  const chapterTiles = Array.from({ length: b.chapters }, (_, i) => i + 1).map((c) => `
    <a href="#/ler/${bookId}/${c}" class="ch-tile ${st.read[`${bookId}:${c}`] ? "read" : ""} ${c === current ? "current" : ""}"
       title="${esc(b.name)} ${c}">${c}</a>`).join("");

  view.innerHTML = `
    <div class="book-head">
      <div class="book-cover placeholder">${esc(b.short)}</div>
      <div class="book-meta">
        <h1>${esc(b.name)}</h1>
        <div class="sub">${b.testament === "at" ? "Antigo Testamento" : "Novo Testamento"} · ${b.chapters} capítulos · grupo: ${esc(b.group)}</div>
        <p class="desc">${esc(b.desc || "")}</p>
        <div class="progress-line"><span style="width:${pct}%"></span></div>
        <div style="font-size:12.5px;color:var(--text-soft)">
          ${readCount} de ${b.chapters} capítulos lidos (${pct}%)
          ${badge ? ` · <span style="color:var(--gold-soft);font-weight:800">🏅 Livro concluído em ${badge}</span>` : ""}
        </div>
      </div>
    </div>

    ${hasContent
      ? `<h2 class="section-title">Capítulos</h2><div class="ch-grid">${chapterTiles}</div>`
      : `
      <div class="card soon-card">
        <div class="big">⏳</div>
        <h2>Em breve</h2>
        <p>A adaptação de <strong>${esc(b.name)}</strong> ainda está sendo preparada. Gênesis já está disponível — leia enquanto isso e acumule XP!</p>
        ${bookId !== "gn" ? `<a class="btn btn-gold" href="#/ler/gn/1">Ler Gênesis agora</a>` : ""}
      </div>`}

    ${hasContent ? `<div style="margin-top:18px"><a class="btn btn-gold" href="#/ler/${bookId}/${current || 1}">${current ? `Continuar no capítulo ${current}` : "Começar leitura"} 📖</a></div>` : ""}`;
}

/* ============================================================
   LEITOR DE CAPÍTULO
   ============================================================ */
export function renderLer(view, bible, bookId, chapterNum, chapter) {
  const b = bible.books[bookId];
  if (!b || !chapter) {
    view.innerHTML = `<div class="card soon-card"><div class="big">📭</div><h2>Capítulo indisponível</h2><p>Este conteúdo ainda não foi publicado.</p><p><a class="btn" href="#/livro/${esc(bookId)}">Voltar</a></p></div>`;
    return;
  }

  const st = getState();
  const isRead = !!st.read[`${bookId}:${chapterNum}`];
  const prev = chapterNum > 1 ? chapterNum - 1 : null;
  const next = chapterNum < b.chapters ? chapterNum + 1 : null;

  const navOptions = Array.from({ length: b.chapters }, (_, i) => i + 1)
    .map((c) => `<option value="${c}" ${c === chapterNum ? "selected" : ""}>Capítulo ${c}</option>`).join("");

  // Intercala títulos de seção com os parágrafos correspondentes
  const sections = chapter.sections || [];
  const sectionsByStart = {};
  sections.forEach((s) => { sectionsByStart[s.start] = s.title; });

  let bodyHtml = "";
  (chapter.paragraphs || []).forEach((p) => {
    const firstV = (p.verses && p.verses[0]) ? p.verses[0].v : null;
    if (firstV !== null && sectionsByStart[firstV]) {
      bodyHtml += `<div class="p-title">${esc(sectionsByStart[firstV])}</div>\n`;
    }
    const verses = (p.verses || [])
      .map((v) => `<sup class="verse-num">${v.v}</sup>${esc(v.text)}`)
      .join(" ");
    bodyHtml += `<p>${verses}</p>\n`;
  });

  view.innerHTML = `
    <div class="reader-head">
      <div class="reader-crumb">${esc(b.name)}</div>
      <h1>Capítulo ${chapterNum}</h1>
      <div class="reader-chapter-info">${chapter.verses} versículos ${isRead ? "· ✓ já lido (releituras valem +2 XP)" : ""}</div>
      <div class="reader-nav">
        <select id="chSelect" aria-label="Escolher capítulo">${navOptions}</select>
        <select id="fontSelect" aria-label="Tamanho da fonte">
          <option value="sm" ${st.settings.font === "sm" ? "selected" : ""}>A</option>
          <option value="md" ${st.settings.font === "md" ? "selected" : ""}>A+</option>
          <option value="lg" ${st.settings.font === "lg" ? "selected" : ""}>A++</option>
          <option value="xl" ${st.settings.font === "xl" ? "selected" : ""}>A+++</option>
        </select>
        <span class="spacer"></span>
        ${prev ? `<a class="btn btn-sm" href="#/ler/${bookId}/${prev}">‹ Anterior</a>` : `<span class="btn btn-sm" style="opacity:.4;pointer-events:none">‹ Anterior</span>`}
        ${next ? `<a class="btn btn-sm btn-gold" href="#/ler/${bookId}/${next}">Próximo ›</a>` : `<span class="btn btn-sm btn-gold" style="opacity:.4;pointer-events:none">Próximo ›</span>`}
      </div>
    </div>

    ${chapter.summary ? `<div class="chapter-summary"><strong>Um olhar sobre o capítulo:</strong> ${esc(chapter.summary)}</div>` : ""}

    <article class="chapter" id="chapterText">
      ${bodyHtml}
    </article>

    <div class="reader-end">
      <div class="finish-card ${isRead ? "done" : ""}">
        ${isRead
          ? `<h3>✓ Capítulo concluído</h3><p>Você já leu este capítulo. Ler de novo mantém sua chama acesa: +2 XP.</p><button class="btn btn-gold" id="markReadBtn">Registrar releitura 🔄</button>`
          : `<h3>Terminou de ler?</h3><p>Marque como lido e ganhe <strong>+10 XP</strong>${next ? "" : " + bônus de conclusão de livro"}. Sua ofensiva diária agradece! 🔥</p><button class="btn btn-gold" id="markReadBtn">Marcar como lido ✨</button>`}
      </div>
      <div class="reader-end-nav">
        <a class="btn" href="#/livro/${esc(bookId)}">📚 ${esc(b.short)}</a>
        ${next ? `<a class="btn btn-gold" href="#/ler/${bookId}/${next}">Próximo capítulo ›</a>` : `<a class="btn btn-gold" href="#/livro/${esc(bookId)}">Livro concluído 🏁</a>`}
      </div>
    </div>`;

  view.querySelector("#chSelect").addEventListener("change", (e) => {
    location.hash = `#/ler/${bookId}/${e.target.value}`;
  });
  view.querySelector("#fontSelect").addEventListener("change", (e) => {
    document.documentElement.dataset.font = e.target.value;
    window.dispatchEvent(new CustomEvent("biblepoetica:font", { detail: e.target.value }));
  });
}

/* ============================================================
   ESTATÍSTICAS / CONQUISTAS
   ============================================================ */
export function renderStats(view, bible) {
  const st = getState();
  const lvl = levelInfo(st.xp);
  const books = orderedBooks(bible);
  const readCount = Object.keys(st.read).length;

  // mapa de calor das últimas 18 semanas
  const today = new Date();
  const days = [];
  for (let i = 126; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    days.push({ key, dow: d.getDay(), xp: st.history[key] || 0 });
  }
  const weeks = [];
  for (let w = 0; w < 18; w++) weeks.push(days.slice(w * 7, w * 7 + 7));
  const heatHtml = weeks.map((wk) => `<div class="week">${wk.map((d) => {
    const cls = d.xp >= 50 ? "l4" : d.xp >= 25 ? "l3" : d.xp > 0 ? "l2" : "l1";
    return `<span class="heat-cell ${cls}" title="${d.key}${d.xp ? ` · ${d.xp} XP` : ""}"></span>`;
  }).join("")}</div>`).join("");

  // conquistas por livro
  const completed = books.filter((b) => st.badges[`livro:${b.id}`]);
  const achHtml = books.map((b) => {
    const unlocked = !!st.badges[`livro:${b.id}`];
    const chDone = Array.from({ length: b.chapters }, (_, i) => i + 1).filter((c) => st.read[`${b.id}:${c}`]).length;
    return `
      <div class="ach-item ${unlocked ? "" : "locked"}">
        <div class="ach-ico">${unlocked ? "🏅" : "🔒"}</div>
        <div>
          <h4>${unlocked ? "Livro concluído: " : ""}${esc(b.name)}</h4>
          <p>${unlocked ? `Concluído em ${st.badges[`livro:${b.id}`]}` : `${chDone} de ${b.chapters} capítulos lidos`}</p>
        </div>
        <span class="ach-xp">${unlocked ? "✓ +25 XP" : "+25 XP"}</span>
      </div>`;
  }).join("");

  // níveis
  const levelHtml = LEVEL_LIST.map((lv, i) => {
    const isNow = lvl.number === lv.num;
    const isDone = lvl.number > lv.num;
    return `<div class="level-item ${isNow ? "now" : ""} ${isDone ? "done" : ""}">
      <span class="lv-num">${isDone ? "✓" : lv.num}</span>
      <span>${esc(lv.title)}</span>
      <span class="lv-xp">${isNow ? `${fmt(st.xp)} / ${fmt(lv.xp)} XP` : `a partir de ${fmt(lv.xp)} XP`}</span>
    </div>`;
  }).join("");

  view.innerHTML = `
    <h1 class="page-title">Conquistas</h1>

    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;gap:22px;align-items:center;flex-wrap:wrap">
        <div style="font-size:56px">${lvl.number < 5 ? "🌱" : lvl.number < 10 ? "🔥" : lvl.number < 15 ? "⚔️" : lvl.number < 20 ? "👑" : "🕊️"}</div>
        <div style="flex:1;min-width:200px">
          <div style="font-size:12px;letter-spacing:1.4px;text-transform:uppercase;color:var(--gold-soft);font-weight:800">Nível ${lvl.number} · ${esc(lvl.title)}</div>
          <div style="font-size:26px;font-weight:900">${fmt(st.xp)} XP</div>
          <div class="progress-line"><span style="width:${lvl.pct}%"></span></div>
          <div style="font-size:12px;color:var(--text-faint)">${lvl.nextXp ? `Faltam ${fmt(lvl.nextXp - st.xp)} XP para “${esc(LEVEL_LIST[lvl.number].title)}”` : "Nível máximo!"}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:30px;font-weight:900">🔥 ${st.streak}</div>
          <div style="font-size:12px;color:var(--text-faint)">dias de ofensiva · recorde ${st.bestStreak}</div>
        </div>
      </div>
    </div>

    <h2 class="section-title">Leitura dos últimos meses</h2>
    <div class="card">
      <div class="heatmap-wrap"><div class="heatmap">${heatHtml}</div></div>
      <div class="heat-legend">Menos <span class="heat-cell l1"></span><span class="heat-cell l2"></span><span class="heat-cell l3"></span><span class="heat-cell l4"></span> Mais · ${fmt(readCount)} capítulos lidos</div>
    </div>

    <h2 class="section-title">Livros concluídos (${completed.length} de ${books.length})</h2>
    <div class="ach-list">${achHtml}</div>

    <div class="level-track">
      <h2 class="section-title">Trilha de níveis</h2>
      <div class="level-list">${levelHtml}</div>
    </div>`;
}

const LEVEL_LIST = [
  { num: 1, title: "Novato", xp: 0 },
  { num: 2, title: "Curioso", xp: 60 },
  { num: 3, title: "Peregrino", xp: 150 },
  { num: 4, title: "Explorador", xp: 280 },
  { num: 5, title: "Leitor", xp: 450 },
  { num: 6, title: "Discípulo", xp: 660 },
  { num: 7, title: "Aprendiz", xp: 910 },
  { num: 8, title: "Servo", xp: 1200 },
  { num: 9, title: "Mensageiro", xp: 1530 },
  { num: 10, title: "Atalaia", xp: 1900 },
  { num: 11, title: "Guerreiro", xp: 2310 },
  { num: 12, title: "Pastor", xp: 2760 },
  { num: 13, title: "Mestre", xp: 3250 },
  { num: 14, title: "Sábio", xp: 3780 },
  { num: 15, title: "Escriba", xp: 4350 },
  { num: 16, title: "Profeta", xp: 4960 },
  { num: 17, title: "Sacerdote", xp: 5610 },
  { num: 18, title: "Príncipe", xp: 6300 },
  { num: 19, title: "Rei", xp: 7030 },
  { num: 20, title: "Apóstolo", xp: 7800 },
];
