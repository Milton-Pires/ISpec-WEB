
const API_BASE_URL = (() => {
  const host = window.location.hostname;

  // Ambiente local (rodando o frontend direto no navegador / live server)
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:8080';
  }

  // Produção — troque pela URL real gerada pelo Railway
  return 'https://ispec-web-production.up.railway.app';
})();