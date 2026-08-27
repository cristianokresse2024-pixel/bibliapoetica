# 📖 Bíblia Poética

> **Leitura viva, fiel às Escrituras.** Uma Bíblia digital em linguagem moderna e de fácil leitura, com gamificação de progresso.

Aplicativo web (PWA) em português: leia a Bíblia, ganhe XP, suba de nível, mantenha sua ofensiva diária e desbloqueie conquistas — com um texto adaptado ao português atual, **fiel ao sentido dos escritos originais**.

---

## ✨ Funcionalidades

- **📚 Estrutura completa da Bíblia** — os 66 livros (39 AT + 27 NT), 1.189 capítulos, organizados por testamento e grupo literário.
- **📖 Gênesis completo** — os 50 capítulos, 1.533 versículos, na adaptação moderna, com resumo e seções por capítulo.
- **🎮 Gamificação de progresso**
  - **XP**: +10 por capítulo lido (1ª vez), +2 por releitura, +25 por livro concluído.
  - **Níveis e títulos**: 20 níveis, de *Novato* a *Apóstolo*.
  - **Ofensiva (streak)**: leia todos os dias e ganhe bônus crescentes (até +50 XP/dia).
  - **Conquistas**: medalhas por livro concluído + mapa de calor da sua leitura dos últimos 4 meses.
- **🌙 Modo escuro e claro**, 4 tamanhos de fonte no leitor, design responsivo (celular e desktop).
- **📡 PWA offline** — instale no celular/desktop; o que você já leu continua disponível sem internet.
- **🕊️ Versículo do dia** com reflexão curta.

## 🚀 Como rodar

```bash
# qualquer servidor estático serve; incluído um pronto:
node server.js
# ou
python3 -m http.server 8080
```

Depois abra `http://localhost:8080`. (Sem servidor, abrir o `index.html` direto também funciona, exceto o modo offline/PWA.)

## 🧭 Navegação

| Rota | Tela |
|---|---|
| `#/` | Início (progresso, versículo do dia, continuar lendo) |
| `#/biblia` | Biblioteca dos 66 livros, com filtros por grupo |
| `#/livro/:id` | Página do livro, grade de capítulos e progresso |
| `#/ler/:id/:cap` | Leitor com tamanho de fonte e registro de leitura |
| `#/estatisticas` | Conquistas, mapa de calor, trilha de níveis |

## 📁 Estrutura

```
index.html              — shell do app
css/styles.css          — tema escuro/claro e componentes
js/
  main.js               — bootstrap, rotas, ações do leitor
  router.js             — hash router
  views.js              — renderização das telas
  gamification.js       — XP, níveis, ofensivas, toasts, level-up
  store.js              — estado + persistência (localStorage)
  data.js               — carregamento da estrutura e do conteúdo
sw.js                   — service worker (PWA offline)
manifest.webmanifest    — manifest PWA
server.js               — servidor estático de desenvolvimento
data/
  books.json            — estrutura dos 66 livros e grupos
  daily-verses.json     — 36 versículos do dia
  books/gn/*.json       — conteúdo de Gênesis em 3 partes (01-17, 18-36, 37-50)
scripts/gen_part*.py    — geradores do conteúdo (fonte do texto)
assets/capa-genesis.jpg — capa otimizada (original: GENESIS.png)
icons/                  — ícones do app
```

## 🖋️ Sobre o texto

O texto é uma **adaptação autoral em português moderno**, elaborada a partir de traduções consagradas de **domínio público** (Almeida 1911 e Tradução Brasileira 1917), com linguagem atual e clara, preservando o conteúdo e o sentido dos escritos originais — todos os versículos presentes, sem acréscimos ou cortes.

> ⚠️ Cada capítulo inclui um resumo editorial de leitura. O texto bíblico adaptado é o conteúdo dos versículos; os resumos e títulos de seção são auxílios de navegação.

## 🗺️ Próximos passos

1. **Mais livros** — a estrutura já comporta qualquer livro: basta criar `data/books/{id}/{parte}.json` e listar as partes em `books.json` (modelo pronto em `scripts/`).
2. **Quizzes por capítulo** (bônus de XP por acertos).
3. **Compartilhamento de versículos** como imagem.
4. **Modo "leitura guiada"** (planos: 30 dias, 90 dias, Bíblia em 1 ano).

---

Feito com ❤️ e reverência — *a Palavra de Deus é viva e eficaz.*
