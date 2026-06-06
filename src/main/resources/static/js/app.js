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

// ── Badge de avisos na sidebar ───────────
async function carregarBadgeAvisos() {
  try {
    const res = await apiFetch('/avisos');
    if (!res) return;
    const data = await res.json();

    const total = (data.vencidos?.length || 0)
                + (data.vencendo30?.length || 0)
                + (data.vencendo90?.length || 0)
                + (data.reprovadas?.length || 0);

    const badgeEl = document.getElementById('badge-avisos');
    if (!badgeEl) return;

    if (total > 0) {
      badgeEl.textContent = total > 99 ? '99+' : total;
      badgeEl.classList.remove('hidden');
    } else {
      badgeEl.classList.add('hidden');
    }
  } catch (e) {}
}