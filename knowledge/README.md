# Base de Conhecimento — Viva Inteligente (RAG)

Esta pasta guarda os **materiais de conhecimento** que futuramente alimentarão a
**IA Viva** por meio de RAG (Retrieval-Augmented Generation). A ideia é que a IA
consulte primeiro estes materiais próprios/licenciados antes de responder.

> ⚠️ **Importante:** esta pasta é a **fonte** dos materiais. Ela NÃO é publicada
> junto com o site (não faz parte do build do frontend). O processamento gera um
> índice de busca (embeddings) que fica no backend.

## Estrutura

```
knowledge/
├── teologia/           # fundamentos teológicos
├── estudos-biblicos/   # estudos e roteiros
├── comentarios/        # comentários bíblicos
├── apostilas/          # apostilas e materiais didáticos
├── fe-inteligente/     # material oficial do estudo Fé Inteligente
└── materiais/          # materiais diversos
```

## Como adicionar novos materiais

1. Coloque o arquivo (`.pdf`, `.txt`, `.md`) na subpasta mais apropriada.
2. Rode a rotina de ingestão (será criada em fase futura):
   ```
   npm run ingest-knowledge
   ```
   Ela irá: detectar novos arquivos → extrair o texto → dividir em trechos (chunks)
   → gerar embeddings → armazenar o índice para busca semântica.
3. A IA Viva passará a usar esse conteúdo, citando a origem quando apropriado
   (ex.: *"Fonte: material do Viva Inteligente"*).

## ⚖️ Direitos autorais

**Não** adicione materiais protegidos por direitos autorais sem autorização ou
licença. Use apenas conteúdo próprio, de domínio público ou devidamente licenciado.
