/* ═══════════════════════════════════════
   iSpec – Utilitários globais
   ═══════════════════════════════════════ */

// ── Token JWT ───────────────────────────
function getToken() {
  return localStorage.getItem('token');
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/index.html';
}

function verificarAutenticacao() {
  if (!getToken()) {
    window.location.href = '/pages/login.html';
  }
}

// ── Fetch autenticado ───────────────────
async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(endpoint, { ...options, headers });

  if (response.status === 401) {
    logout();
    return;
  }

  if (response.status === 403) {
    alert('Você não tem permissão para realizar esta ação.');
    return;
  }

  return response;
}