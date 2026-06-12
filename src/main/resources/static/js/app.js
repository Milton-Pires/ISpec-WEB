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
  // Se estiver na página de avisos, não mostra o badge
  if (window.location.pathname.includes('avisos.html')) return;

  try {
    const res = await apiFetch('/avisos');
    if (!res) return;
    const data = await res.json();

    const total = (data.vencidos?.length || 0)
                + (data.vencendo30?.length || 0)
                + (data.vencendo90?.length || 0)
                + (data.reprovadas?.length || 0)
                + (data.agendaSemana?.length || 0);

    const badgeEl = document.getElementById('badge-avisos');
    if (!badgeEl) return;

    if (total > 0) {
      badgeEl.textContent = total > 99 ? '99+' : total;
      badgeEl.classList.remove('hidden');
    } else {
      badgeEl.classList.add('hidden');
    }
  } catch (e) {
    console.error('Erro badge avisos:', e);
  }
}

// ── Carregar usuário logado na sidebar ───
async function carregarUsuarioLogado() {
  const token = getToken();
  if (!token) return;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const email   = payload.sub;
    const role    = payload.role;

    // Preenche email e inicial imediatamente
    const emailEl   = document.getElementById('user-email');
    const initialEl = document.getElementById('user-initial');
    if (emailEl)   emailEl.textContent   = email;
    if (initialEl) initialEl.textContent = email.charAt(0).toUpperCase();

    // Busca nome completo (só ADMIN tem acesso a /usuarios)
    if (role === 'ADMIN') {
      const res = await apiFetch('/usuarios');
      if (!res) return;
      const lista = await res.json();
      const u = lista.find(x => x.email === email);
      if (u) {
        const nomeEl = document.getElementById('user-nome');
        if (nomeEl)    nomeEl.textContent    = u.nome;
        if (initialEl) initialEl.textContent = u.nome.charAt(0).toUpperCase();
      }
    } else {
      // Para não-admin busca só pelo email no token
      const nomeEl = document.getElementById('user-nome');
      if (nomeEl) nomeEl.textContent = email.split('@')[0];
    }
  } catch (e) {}
}

async function ajustarMenuPorRole() {
  const token = getToken();
  if (!token) return;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role    = payload.role;

    // Esconde o link de Usuários para não-admins
    const linkUsuarios = document.querySelector('a[href="usuarios.html"]');
    if (linkUsuarios && role !== 'ADMIN') {
      linkUsuarios.style.display = 'none';
    }
  } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  carregarUsuarioLogado();
  ajustarMenuPorRole();
});