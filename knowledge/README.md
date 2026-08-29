# 📚 Base de Conhecimento Teológico — IA Viva (RAG)

Este diretório é o repositório central para alimentar a sabedoria e os dados teológicos da **IA Viva**.

---

## 📁 Estrutura de Pastas

```
knowledge/
├── pdfs/               <-- Coloque seus livros, artigos e comentários em formato .pdf aqui
├── teologia/           <-- Resumos, dogmática, teologia sistemática em .md ou .txt
├── comentarios/        <-- Comentários versículo a versículo (ex: Matthew Henry, Calvino, etc.)
└── index/              <-- Base vetorial / índices processados para busca semântica
```

---

## 🚀 Como Funciona a Alimentação da IA

1. **Adicionar Materiais:**
   - Coloque seus PDFs na pasta `knowledge/pdfs/` ou textos em `knowledge/teologia/`.

2. **Processamento e Indexação (RAG):**
   - O sistema extrai o texto, divide em tópicos e referências bíblicas correspondentes.
   - Quando o usuário faz uma pergunta ou pede a explicação de um versículo, o backend (`api/lib/AIService.js`) consulta esses materiais prioritariamente para formular respostas com base fiel na sua biblioteca!
