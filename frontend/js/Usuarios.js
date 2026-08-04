/* ═══════════════════════════════════════
   iSpec – Usuários page logic
   ═══════════════════════════════════════ */

verificarAutenticacao();

let usuarios = [];
let activeFilter = 'todos';

const TIPO_LABEL = {
  ADMIN:   'Admin',
  FISCAL:  'Fiscal',
  TECNICO: 'Técnico',
};

// ── Avatar color ─────────────────────────
function avatarColor(nome) {
  const colors = ['#8B0012','#C0001A','#1D4ED8','#0369A1','#047857','#7C3AED','#B45309'];
  let sum = 0;
  for (let c of nome) sum += c.charCodeAt(0);
  return colors[sum % colors.length];
}

// ── KPIs ────────────────────────────────
function updateKpis() {
  document.getElementById('kpi-admin').textContent  = usuarios.filter(u => u.tipo === 'ADMIN').length;
  document.getElementById('kpi-fiscal').textContent = usuarios.filter(u => u.tipo === 'FISCAL').length;
  document.getElementById('kpi-tecnico').textContent = usuarios.filter(u => u.tipo === 'TECNICO').length;
}

// ── Filtros ──────────────────────────────
function setFilter(f) {
  activeFilter = f;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const isActive = btn.dataset.filter === f;
    btn.classList.toggle('bg-brand-red', isActive);
    btn.classList.toggle('text-white', isActive);
    btn.classList.toggle('bg-white', !isActive);
    btn.classList.toggle('border', !isActive);
    btn.classList.toggle('border-gray-200', !isActive);
    btn.classList.toggle('text-gray-600', !isActive);
  });
  renderTable();
}

// ── Tabela ──────────────────────────────
function renderTable() {
  const q      = document.getElementById('search').value.toLowerCase();
  const tbody  = document.getElementById('usuarios-table');
  const empty  = document.getElementById('empty-state');

  const filtered = usuarios.filter(u => {
    const matchFilter = activeFilter === 'todos' || u.tipo === activeFilter;
    const matchSearch = !q
      || u.nome?.toLowerCase().includes(q)
      || u.email?.toLowerCase().includes(q)
      || u.cpf?.includes(q);
    return matchFilter && matchSearch;
  });

  const resultCount = document.getElementById('result-count');
  resultCount.textContent = filtered.length === usuarios.length
    ? `${usuarios.length} usuários`
    : `${filtered.length} de ${usuarios.length}`;

  if (!filtered.length) {
    tbody.innerHTML = '';
    empty.classList.remove('hidden');
    empty.classList.add('flex');
    return;
  }

  empty.classList.add('hidden');
  empty.classList.remove('flex');

  tbody.innerHTML = filtered.map((u, i) => `
    <tr class="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors row-anim"
        style="animation-delay:${i * 0.04}s">
      <td class="px-5 py-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-sora font-bold text-sm text-white"
               style="background:${avatarColor(u.nome)}">
            ${u.nome?.charAt(0).toUpperCase()}
          </div>
          <div class="min-w-0">
            <p class="font-sora font-semibold text-gray-800 text-sm truncate max-w-[160px]">${u.nome}</p>
          </div>
        </div>
      </td>
      <td class="px-5 py-4 hidden md:table-cell">
        <span class="text-gray-600 text-sm font-dm">${u.cpf || '—'}</span>
      </td>
      <td class="px-5 py-4 hidden md:table-cell">
        <span class="text-gray-600 text-sm font-dm">${u.email || '—'}</span>
      </td>
      <td class="px-5 py-4">
        <span class="px-2.5 py-1 rounded-full text-[11px] font-sora font-semibold badge-${u.tipo}">
          ${TIPO_LABEL[u.tipo] || u.tipo}
        </span>
      </td>
      <td class="px-5 py-4">
        <div class="flex items-center gap-1">
          <button type="button" class="w-8 h-8 rounded-lg hover:bg-brand-rose flex items-center justify-center transition-colors"
                  title="Editar" data-action="edit" data-id="${u.id}">
            <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button type="button" class="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"
                  title="Excluir" data-action="delete" data-id="${u.id}">
            <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  updateKpis();
  attachTableActions();
}

function attachTableActions() {
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const id = parseInt(btn.dataset.id, 10);
      if (action === 'edit')   openModalEdit(id);
      if (action === 'delete') deletarUsuario(id);
    };
  });
}

// ── Modal ────────────────────────────────
function openModal() {
  document.getElementById('modal-title').textContent = 'Novo Usuário';
  document.getElementById('usuario-form').reset();
  document.getElementById('edit-id').value = '';
  document.getElementById('div-senha').classList.remove('hidden');
  document.getElementById('f-senha').required = true;
  document.getElementById('modal').classList.add('open');
}

function openModalEdit(id) {
  const u = usuarios.find(x => x.id === id);
  if (!u) return;
  document.getElementById('modal-title').textContent = 'Editar Usuário';
  document.getElementById('edit-id').value  = u.id;
  document.getElementById('f-nome').value   = u.nome  || '';
  document.getElementById('f-email').value  = u.email || '';
  document.getElementById('f-cpf').value    = u.cpf   || '';
  document.getElementById('f-tipo').value   = u.tipo  || '';
  // Esconde senha na edição
  document.getElementById('div-senha').classList.add('hidden');
  document.getElementById('f-senha').required = false;
  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

function handleBackdropClick(ev) {
  if (ev.target === document.getElementById('modal')) closeModal();
}

// ── Salvar ───────────────────────────────
async function salvarUsuario(ev) {
  ev.preventDefault();
  const editId = document.getElementById('edit-id').value;

  const data = {
    nome:  document.getElementById('f-nome').value.trim(),
    email: document.getElementById('f-email').value.trim(),
    cpf:   document.getElementById('f-cpf').value.trim(),
    tipo:  document.getElementById('f-tipo').value,
  };

  let response;

  if (editId) {
    response = await apiFetch(`/usuarios/${editId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  } else {
    const senha = document.getElementById('f-senha').value;
    response = await apiFetch('/auth/cadastro', {
      method: 'POST',
      body: JSON.stringify({ ...data, senha })
    });
  }

  if (!response) return;

  if (!response.ok) {
    const erro = await response.text();
    alert(erro);
    return;
  }

  closeModal();
  await carregarUsuarios();
}

// ── Deletar ──────────────────────────────
async function deletarUsuario(id) {
  if (!confirm('Deseja realmente excluir este usuário?')) return;
  await apiFetch(`/usuarios/${id}`, { method: 'DELETE' });
  await carregarUsuarios();
}

// ── Carregar ─────────────────────────────
async function carregarUsuarios() {
  const res = await apiFetch('/usuarios');
  if (!res) return;
  usuarios = await res.json();
  renderTable();
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

  await carregarUsuarios();
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