// Configurazione runtime del frontend.
// API sullo stesso dominio: in sviluppo il proxy di ng serve (proxy.conf.json),
// in produzione vercel.json, inoltrano /api e /api-docs al backend.
export const environment = {
  production: false,
  apiBase: '/api/v1',
};
