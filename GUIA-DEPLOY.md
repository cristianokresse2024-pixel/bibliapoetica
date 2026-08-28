# 🚀 Guia de ativação da IA Viva (backend seguro)

Este guia liga a **IA Viva** usando **Firebase Cloud Functions** (que guarda a chave
do **Groq** com segurança) e o **Firebase Auth** (login). Você faz isso uma vez.

> 🔐 **Regra de ouro:** a chave do Groq **nunca** vai para o código nem para o
> navegador. Ela fica como *Secret* no Firebase. O frontend só chama a função.

---

## Pré-requisitos

1. **Node 20** instalado.
2. **Conta Firebase** (você já tem) e um **projeto** criado no
   [console.firebase.google.com](https://console.firebase.google.com).
3. **Chave do Groq NOVA** (a anterior foi exposta no chat — revogue-a em
   [console.groq.com](https://console.groq.com) → *API Keys* → apagar → criar outra).
4. Firebase CLI:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

> ⚠️ **Plano Blaze:** Cloud Functions que chamam uma API externa (Groq) exigem o
> plano **Blaze** (pay-as-you-go) do Firebase. Ele tem franquia gratuita mensal
> generosa, mas pede cartão. Ative em: Console → ⚙️ → *Uso e faturamento*.

---

## Passo 1 — Apontar o projeto

Edite **`.firebaserc`** e troque `SEU_PROJECT_ID_AQUI` pelo ID do seu projeto Firebase.

## Passo 2 — Ativar serviços no Console

- **Authentication** → *Get started* → habilite **Google** (e/ou E-mail/senha).
- **Firestore Database** → *Create database* → modo produção → região
  `southamerica-east1` (São Paulo).

## Passo 3 — Configurar o frontend (config pública)

No Console: ⚙️ *Configurações do projeto* → *Seus apps* → **App da Web** (crie um se
não houver) → copie os valores do `firebaseConfig`.

Crie **`frontend/.env.local`** (baseado em `frontend/.env.example`) e preencha:
```
VITE_FB_API_KEY=...
VITE_FB_AUTH_DOMAIN=SEU_PROJECT_ID.firebaseapp.com
VITE_FB_PROJECT_ID=SEU_PROJECT_ID
VITE_FB_APP_ID=...
VITE_FB_FUNCTIONS_REGION=southamerica-east1
```

## Passo 4 — Guardar a chave do Groq como SECRET (nunca no código)

```bash
cd functions
npm install
firebase functions:secrets:set GROQ_API_KEY
# Cole a chave NOVA do Groq quando solicitado. Pronto — fica criptografada.
```

Parâmetros ajustáveis (modelo e limites) já têm padrão; para mudar, edite
`functions/.env` (baseado em `functions/.env.example`).

## Passo 5 — Publicar

```bash
# Da raiz do projeto:
firebase deploy --only functions,firestore:rules

# (Opcional) publicar o site pelo Firebase Hosting em vez do GitHub Pages:
npm run build
firebase deploy --only hosting
```

## Passo 6 — Testar

1. `npm run dev` (ou acesse o site publicado).
2. Vá em **IA Viva** → **Entrar** (login Google) → faça uma pergunta.
3. Confira em Firestore: coleção `users/{uid}/aiUsage/{data}` (contador) e
   `aiLogs` (custos/tokens).

---

## 🔧 Ajustes rápidos (sem mexer no código)

| O quê | Onde |
|---|---|
| Trocar o modelo | `functions/.env` → `GROQ_MODEL` |
| Trocar de provedor (ex.: Gemini) | `functions/.env` → `AI_PROVIDER` (+ novo adaptador em `AIService.js`) |
| Limite diário grátis | `functions/.env` → `FREE_DAILY_AI_LIMIT` |
| Limite diário Premium | `functions/.env` → `PREMIUM_DAILY_AI_LIMIT` |
| Girar a chave do Groq | `firebase functions:secrets:set GROQ_API_KEY` + `firebase deploy --only functions` |

## 🧯 Solução de problemas

- **"A IA Viva ainda está sendo configurada"** → falta o `frontend/.env.local`
  (config do Firebase) ou o build foi feito sem ele.
- **`unauthenticated`** → você não está logado.
- **`resource-exhausted`** → limite diário atingido (ajuste em `functions/.env`).
- **Erro 403/permissão ao publicar** → confirme `firebase login` e o Project ID.
