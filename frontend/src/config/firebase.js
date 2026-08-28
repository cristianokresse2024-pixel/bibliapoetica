// =============================================================================
// Configuração do Firebase (lado do cliente).
// -----------------------------------------------------------------------------
// IMPORTANTE: as chaves abaixo são de configuração PÚBLICA do Firebase (é normal
// e seguro expô-las no frontend — elas apenas identificam o projeto). NÃO são
// segredos. Os segredos de verdade (GROQ_API_KEY, Mercado Pago) ficam APENAS no
// backend (Cloud Functions), nunca aqui.
//
// Preencha via variáveis de ambiente do Vite (arquivo .env.local, NÃO commitado):
//   VITE_FB_API_KEY, VITE_FB_AUTH_DOMAIN, VITE_FB_PROJECT_ID,
//   VITE_FB_APP_ID, VITE_FB_FUNCTIONS_REGION
//
// Enquanto não configurado, isFirebaseConfigured() é false e o app funciona
// normalmente com os recursos que não dependem de backend.
// =============================================================================

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY || '',
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FB_PROJECT_ID || '',
  appId: import.meta.env.VITE_FB_APP_ID || '',
};

export const FUNCTIONS_REGION =
  import.meta.env.VITE_FB_FUNCTIONS_REGION || 'southamerica-east1';

export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}
