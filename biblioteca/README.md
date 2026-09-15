# 📖 Biblioteca Teológica Local — IA Viva (RAG)

Este diretório armazena os comentários bíblicos, léxicos (hebraico/grego), dicionários e livros teológicos em **PDF**, **Markdown (.md)** e **Texto (.txt)**.

---

## 📁 Estrutura de Pastas

```text
biblioteca/
├── comentarios/     <-- Comentários bíblicos versículo a versículo (ex: Mateus, Romanos, Salmos)
├── lexicos/         <-- Léxicos de hebraico e grego, estudos de palavras e dicionários bíblicos
└── livros/          <-- Teologia sistemática, história bíblica e livros devocionais profundos
```

---

## 🚀 Como Funciona o Pipeline de Indexação

1. **Adicionar Livros:**
   Basta colar seus arquivos em .pdf, .md ou .txt dentro de qualquer uma das pastas acima.

2. **Executar a Indexação:**
   No terminal do projeto, execute:
   ```bash
   npm run index:theology
   ```
   O script extrairá os textos dos PDFs, dividirá em trechos temáticos e associará cada trecho aos livros e versículos bíblicos correspondentes.

3. **Consulta Automática no App:**
   Sempre que um usuário selecionar um versículo na Bíblia e tocar em **"Explicar"**, o sistema consulta prioritariamente esta base teológica para fundamentar a explicação em 3 partes:
   - **O que estava acontecendo** (cenário histórico e cultural)
   - **O que o texto realmente significa** (verdade central descomplicada)
   - **Para a sua vida hoje** (aplicação prática para o leitor)

---

## 🔒 Diretriz de Voz Própria e Zero Plágio
A IA utiliza esta biblioteca exclusivamente como base de dados interna:
- **É proibido** copiar trechos literais dos livros.
- **É proibido** fazer citações acadêmicas ("de acordo com o autor X...").
- A explicação é sempre gerada com a **voz própria**, simples, viva e transformadora da IA Viva.
