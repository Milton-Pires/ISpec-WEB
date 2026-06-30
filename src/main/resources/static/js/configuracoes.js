/* ═══════════════════════════════════════
   iSpec – Configurações page logic
   ═══════════════════════════════════════ */

verificarAutenticacao();

let usuarioAtual = null;

const TIPO_LABEL = {
  ADMIN:   'Administrador',
  FISCAL:  'Fiscal',
  TECNICO: 'Técnico',
};

// ── Tabs ──────────────────────────────────
function setTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `tab-${tab}`);
  });
}

// ── Carregar dados do usuário ─────────────
async function carregarPerfil() {
  const res = await apiFetch('/usuarios/me');
  if (!res) return;
  usuarioAtual = await res.json();

  document.getElementById('perfil-initial').textContent = usuarioAtual.nome.charAt(0).toUpperCase();
  document.getElementById('perfil-nome').textContent     = usuarioAtual.nome;
  document.getElementById('perfil-email-label').textContent = usuarioAtual.email;
  document.getElementById('perfil-tipo').textContent     = TIPO_LABEL[usuarioAtual.tipo] || usuarioAtual.tipo;

  document.getElementById('p-nome').value  = usuarioAtual.nome  || '';
  document.getElementById('p-email').value = usuarioAtual.email || '';
  document.getElementById('p-cpf').value   = usuarioAtual.cpf   || '';
}

// ── Salvar perfil ─────────────────────────
async function salvarPerfil(ev) {
  ev.preventDefault();
  const msgEl = document.getElementById('perfil-msg');
  msgEl.classList.add('hidden');

  const data = {
    nome:  document.getElementById('p-nome').value.trim(),
    email: document.getElementById('p-email').value.trim(),
    cpf:   document.getElementById('p-cpf').value.trim(),
    tipo:  usuarioAtual.tipo,
  };

  const response = await apiFetch('/usuarios/me', {
    method: 'PUT',
    body: JSON.stringify(data)
  });

  if (!response) return;

  if (!response.ok) {
    const erro = await response.text();
    mostrarMsg('perfil-msg', erro, 'erro');
    return;
  }

  mostrarMsg('perfil-msg', 'Perfil atualizado com sucesso!', 'sucesso');
  await carregarPerfil();
  carregarUsuarioLogado();
}

// ── Força da senha ────────────────────────
function verificarForcaSenha() {
  const senha = document.getElementById('s-nova').value;

  const reqs = {
    len: senha.length >= 8,
    mai: /[A-Z]/.test(senha),
    min: /[a-z]/.test(senha),
    num: /[0-9]/.test(senha),
    sim: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha),
  };

  Object.keys(reqs).forEach(key => {
    const el = document.getElementById(`req-${key}`);
    const ok = reqs[key];
    el.classList.toggle('text-green-600', ok);
    el.classList.toggle('text-gray-400', !ok);
    el.querySelector('span').textContent = ok ? '✓' : '○';
  });

  const total = Object.values(reqs).filter(Boolean).length;
  const cores = ['bg-gray-200', 'bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-green-500'];
  const labels = ['', 'Muito fraca', 'Fraca', 'Boa', 'Forte'];

  for (let i = 1; i <= 4; i++) {
    const bar = document.getElementById(`bar-${i}`);
    bar.className = `strength-bar flex-1 ${i <= total ? cores[total] : 'bg-gray-200'}`;
  }

  const label = document.getElementById('senha-forca-label');
  label.textContent = senha ? `Força: ${labels[total]}` : '';
}

// ── Trocar senha ──────────────────────────
async function trocarSenha(ev) {
  ev.preventDefault();
  const msgEl = document.getElementById('senha-msg');
  msgEl.classList.add('hidden');

  const senhaAtual = document.getElementById('s-atual').value;
  const novaSenha  = document.getElementById('s-nova').value;
  const confirma   = document.getElementById('s-confirma').value;

  if (novaSenha !== confirma) {
    mostrarMsg('senha-msg', 'As senhas não coincidem.', 'erro');
    return;
  }

  const response = await apiFetch('/usuarios/me/senha', {
    method: 'PATCH',
    body: JSON.stringify({ senhaAtual, novaSenha })
  });

  if (!response) return;

  const texto = await response.text();

  if (!response.ok) {
    mostrarMsg('senha-msg', texto, 'erro');
    return;
  }

  mostrarMsg('senha-msg', texto, 'sucesso');
  document.getElementById('senha-form').reset();
  verificarForcaSenha();
}

// ── Mensagens de feedback ─────────────────
function mostrarMsg(id, texto, tipo) {
  const el = document.getElementById(id);
  el.textContent = texto;
  el.classList.remove('hidden', 'bg-red-50', 'text-red-700', 'bg-green-50', 'text-green-700');
  if (tipo === 'sucesso') {
    el.classList.add('bg-green-50', 'text-green-700');
  } else {
    el.classList.add('bg-red-50', 'text-red-700');
  }
  setTimeout(() => el.classList.add('hidden'), 5000);
}

// ── Sidebar ──────────────────────────────
let sidebar, overlay, isMobile;

document.addEventListener('DOMContentLoaded', async () => {
  sidebar  = document.getElementById('sidebar');
  overlay  = document.getElementById('sidebar-overlay');
  isMobile = window.innerWidth < 1024;

  window.addEventListener('resize', () => {
    isMobile = window.innerWidth < 1024;
    if (!isMobile) {
      overlay?.classList.remove('show');
      sidebar?.classList.remove('mobile-open');
    }
  });

  await carregarPerfil();
  carregarBadgeAvisos();
});

function toggleSidebar() {
  if (isMobile) {
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('show');
  } else {
    sidebar.classList.toggle('collapsed');
  }
}

function closeSidebar() {
  sidebar.classList.remove('mobile-open');
  overlay.classList.remove('show');
}