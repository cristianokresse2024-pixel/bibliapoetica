# ✨ Viva Inteligente

**Ecossistema cristão digital de crescimento espiritual** — Bíblia, IA Viva, estudos,
oração, comunidade e inteligência artificial. Parte do **Movimento Fé Inteligente**.

> _"Uma jornada para crescer na fé, conhecer a Palavra e viver uma vida transformada."_

O Viva Inteligente **não** é faculdade, seminário nem curso teológico formal. Ele oferece
uma jornada de crescimento espiritual. A IA é uma **ferramenta de apoio ao estudo** — não
substitui a Bíblia, a oração, a comunhão com Deus, a igreja ou a liderança espiritual.

> Este projeto nasceu como "Bíblia Poética" e está sendo transformado, de forma
> **incremental e sem perder funcionalidades**, no ecossistema Viva Inteligente.

## 🧭 Pilares

1. **Bíblia** — 66 livros, 3 traduções (NVI/ACF/AA), leitor, favoritos, notas, introduções.
2. **IA Viva** — assistente de estudo da Palavra (em preparação — requer backend).
3. **Estudos** — jornada de crescimento; estudo principal **Fé Inteligente**; certificado simbólico.
4. **Lugar Secreto** — oração com cronômetro, som ambiente/YouTube e lembrete diário.
5. **Comunidade Fé Inteligente** — publicações, pedidos de oração, testemunhos (em preparação).
6. **Perfil** — conta, Premium e programa de indicação (em preparação).
7. **Progresso** — XP, níveis, streak, medalhas e gamificação de tudo.

## ✨ Recursos atuais

- Bíblia completa e íntegra — 66 livros, 1.189 capítulos, 31.105 versículos, 3 traduções.
- Capas ilustradas, jornada de leitura, versículo do dia, favoritos e anotações.
- Gamificação: XP, níveis, sequência (streak), meta diária e conquistas.
- Lugar Secreto (oração), Jejum e Diário de Gratidão — todos gamificados.
- PWA instalável. Progresso salvo localmente (localStorage).

## 🎨 Identidade centralizada

Todo o branding (nome, logo, favicon, cores, textos institucionais, pilares) fica em
**`frontend/src/config/brand.js`**. Para trocar a marca (ex.: aplicar a logo oficial do
Movimento Fé Inteligente), altere apenas esse arquivo.

## 🛠️ Desenvolvimento

```bash
npm install
npm run data     # (re)processa os JSONs da Bíblia em frontend/public/bibles
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção (gerado na raiz, servido pelo GitHub Pages)
```

## 🗂️ Estrutura

```
frontend/                 # código-fonte (React + Vite)
  src/config/brand.js     # ← identidade centralizada
  src/pages/              # telas (Bíblia, IA Viva, Estudos, Comunidade, Perfil, ...)
  src/lib/                # progresso, dados, notificações, tema, etc.
knowledge/                # base de conhecimento para RAG (ver knowledge/README.md)
audio/prayer-background/  # fundo musical opcional do Lugar Secreto (ver README próprio)
scripts/                  # utilitários de dados/imagens
```

## 🚀 Roadmap (fases seguintes — exigem backend)

As fases abaixo exigem um backend seguro (recomendado **Firebase**: Auth + Firestore +
Cloud Functions), pois envolvem segredos, banco de dados e webhooks. **Nada disso pode
rodar no GitHub Pages** (estático).

- **IA Viva** — camada `AIService` chamando a **API Gemini** por Cloud Function.
- **RAG** — ingestão de PDFs em `/knowledge` → embeddings → busca semântica.
- **Contas** — Firebase Auth; sincronização do progresso local para a nuvem.
- **Premium** — `Viva Inteligente Premium` a **R$ 29,90/mês** com controle de acesso.
- **Mercado Pago** — assinaturas recorrentes + webhooks.
- **Indicação** — código único (`VIVA-XXXXXX`) e link `/?ref=CODE`.
- **Painel administrativo** — estudos, PDFs, usuários, assinaturas, indicações, custos de IA.

## 🔐 Variáveis de ambiente / segredos (fases futuras)

**Nunca** coloque segredos no código-fonte nem no frontend. Configure no backend:

| Variável | Uso |
|---|---|
| `GEMINI_API_KEY` | Chave da API Gemini (somente backend) |
| `GEMINI_MODEL` | Modelo (padrão sugerido: `gemini-2.5-flash-lite`) |
| `MERCADOPAGO_ACCESS_TOKEN` | Token do Mercado Pago (somente backend) |
| `MERCADOPAGO_WEBHOOK_SECRET` | Validação de webhooks do Mercado Pago |
| `FREE_DAILY_AI_LIMIT` | Limite diário de uso da IA (grátis) |
| `PREMIUM_DAILY_AI_LIMIT` | Limite diário de uso da IA (Premium) |

## 📚 Fonte dos textos bíblicos

Textos de domínio público / traduções livres, processados a partir de repositórios abertos.
```
