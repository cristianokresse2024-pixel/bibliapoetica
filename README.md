# 📖 Bíblia Poética

Uma **Bíblia interativa** e moderna — uma jornada de leitura da Palavra com ilustrações épicas, gamificação e experiência imersiva. Aplicativo web (PWA) instalável no celular.

## ✨ Recursos

- **Bíblia completa e íntegra** — 66 livros, 1.189 capítulos, 31.105 versículos.
- **3 traduções**: Nova Versão Internacional (NVI, padrão), Almeida Corrigida Fiel (ACF) e Almeida Revisada (AA).
- **Capas ilustradas** em estilo pictórico épico para os principais livros.
- **Gamificação**: XP, níveis, sequência de dias (streak), meta diária e 12 medalhas/conquistas.
- **Jornada de leitura**: progresso por testamento e por livro, "continuar de onde parou".
- **Versículo do dia**, favoritos, anotações pessoais e compartilhamento.
- **Ajuste de fonte**, tema escuro elegante e navegação por capítulos.
- Todo o progresso é salvo localmente no dispositivo (localStorage).

## 🚀 Publicação

Deploy automático no **GitHub Pages** via GitHub Actions a cada push.

## 🛠️ Desenvolvimento

```bash
npm install
npm run data     # (re)processa os JSONs da Bíblia em public/bibles
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção em dist/
```

## 📚 Fonte dos textos

Traduções em domínio público / uso livre a partir do projeto
[thiagobodruk/bible](https://github.com/thiagobodruk/bible) (JSON), verificadas quanto à
integridade (contagem de livros, capítulos e versículos, sem versículos vazios).

## 🎨 Arte

Ilustrações geradas em estilo pictórico. A capa de Gênesis foi fornecida pelo autor do projeto.

---

Feito com reverência. _"Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho."_ — Salmos 119:105
