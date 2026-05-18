/* ═══════════════════════════════════════
   iSpec – Clientes page logic
   ═══════════════════════════════════════ */

verificarAutenticacao();

let clients = [];
let activeFilter = 'todos';
let viewingId = null;

// ── Utilitários ─────────────────────────
function avatarColor(name) {
  const colors = ['#8B0012','#C0001A','#1D4ED8','#0369A1','#047857','#7C3AED','#B45309','#0F766E'];
  let sum = 0;
  for (let c of name) sum += c.charCodeAt(0);
  return colors[sum % colors.length];
}

// ── KPIs ────────────────────────────────
function updateKpis() {
  document.getElementById('kpi-total').textContent     = clients.length;
  document.getElementById('kpi-ativos').textContent    = clients.filter(c => c.status === 'ativo').length;
  document.getElementById('kpi-pendentes').textContent = clients.filter(c => c.status === 'pendente').length;
  document.getElementById('kpi-inativos').textContent  = clients.filter(c => c.status === 'inativo').length;
}

// ── Tabela ──────────────────────────────
function renderTable() {
  const q      = document.getElementById('search').value.toLowerCase();
  const tbody  = document.getElementById('clients-table');
  const empty  = document.getElementById('empty-state');

  const filtered = clients.filter(c => {
    const matchFilter = activeFilter === 'todos' || c.status === activeFilter;
    const matchSearch = !q
        || c.razaoSocial?.toLowerCase().includes(q)
        || c.cnpj?.includes(q)
        || c.cidade?.toLowerCase().includes(q)
        || c.responsavel?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const resultCount = document.getElementById('result-count');
  resultCount.textContent = filtered.length === clients.length
      ? `${clients.length} clientes`
      : `${filtered.length} de ${clients.length}`;

  if (!filtered.length) {
    tbody.innerHTML = '';
    empty.classList.remove('hidden');
    empty.classList.add('flex');
    return;
  }

  empty.classList.add('hidden');
  empty.classList.remove('flex');

  tbody.innerHTML = filtered.map((c, i) => `
    <tr class="client-row row-anim border-b border-gray-50 last:border-0"
        data-client-id="${c.id}" style="animation-delay:${i * 0.04}s">
      <td class="px-5 py-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-sora font-bold text-sm text-white"
               style="background:${avatarColor(c.razaoSocial)}">
            ${c.razaoSocial?.charAt(0).toUpperCase()}
          </div>
          <div class="min-w-0">
            <p class="font-sora font-semibold text-gray-800 text-sm truncate max-w-[160px]">${c.razaoSocial}</p>
            <p class="text-gray-400 text-xs font-dm">${c.cnpj || '—'}</p>
          </div>
        </div>
      </td>
      <td class="px-5 py-4 hidden md:table-cell">
        <span class="text-gray-600 text-sm font-dm">${c.cnpj || '—'}</span>
      </td>
      <td class="px-5 py-4 hidden lg:table-cell">
        <p class="text-gray-700 text-sm font-dm">${c.responsavel || '—'}</p>
        <p class="text-gray-400 text-xs font-dm">${c.telefone || '—'}</p>
      </td>
      <td class="px-5 py-4 hidden lg:table-cell">
        <span class="text-gray-600 text-sm font-dm">${c.cidade || '—'}/${c.uf || '—'}</span>
      </td>
      <td class="px-5 py-4">
        <span class="px-2.5 py-1 rounded-full text-[11px] font-sora font-semibold badge-${c.status}">
          ${c.status?.charAt(0).toUpperCase() + c.status?.slice(1)}
        </span>
      </td>
      <td class="px-5 py-4 hidden sm:table-cell">
        <span class="text-gray-600 text-sm font-dm">${c.totalEquipamentos ?? '—'}</span>
      </td>
      <td class="px-5 py-4">
        <div class="flex items-center gap-1">
          <button type="button" class="w-8 h-8 rounded-lg hover:bg-brand-rose flex items-center justify-center transition-colors" title="Visualizar" data-action="view" data-id="${c.id}">
            <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          <button type="button" class="w-8 h-8 rounded-lg hover:bg-brand-rose flex items-center justify-center transition-colors" title="Editar" data-action="edit" data-id="${c.id}">
            <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button type="button" class="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors" title="Excluir" data-action="delete" data-id="${c.id}">
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
  document.querySelectorAll('[data-action]').forEach(button => {
    button.onclick = (event) => {
      event.stopPropagation();
      const action = button.dataset.action;
      const id = parseInt(button.dataset.id, 10);
      if (action === 'view')   openDrawer(id);
      if (action === 'edit')   openModalEdit(id);
      if (action === 'delete') deleteClient(id);
    };
  });

  document.querySelectorAll('.client-row').forEach(row => {
    row.onclick = () => openDrawer(parseInt(row.dataset.clientId, 10));
  });
}

// ── Filtros ─────────────────────────────
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

// ── Modal ────────────────────────────────
function openModal() {
  document.getElementById('modal-title').textContent = 'Novo Cliente';
  document.getElementById('client-form').reset();
  document.getElementById('edit-id').value = '';
  document.getElementById('modal').classList.add('open');
}

function openModalEdit(id) {
  const c = clients.find(x => x.id === id);
  if (!c) return;
  document.getElementById('modal-title').textContent = 'Editar Cliente';
  document.getElementById('edit-id').value           = c.id;
  document.getElementById('f-razao_social').value    = c.razaoSocial || '';
  document.getElementById('f-cnpj').value            = c.cnpj        || '';
  document.getElementById('f-email').value           = c.email       || '';
  document.getElementById('f-tel').value             = c.telefone    || '';
  document.getElementById('f-resp').value            = c.responsavel || '';
  document.getElementById('f-cidade').value          = c.cidade      || '';
  document.getElementById('f-uf').value              = c.uf          || '';
  document.getElementById('f-end').value             = c.endereco    || '';
  document.getElementById('f-status_cliente').value  = c.status      || 'pendente';
  document.getElementById('f-obs').value             = c.observacoes || '';
  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

// ── Salvar cliente ───────────────────────
async function saveClient(e) {
  e.preventDefault();
  const editId = document.getElementById('edit-id').value;

  const data = {
    razaoSocial:  document.getElementById('f-razao_social').value.trim(),
    cnpj:         document.getElementById('f-cnpj').value.trim(),
    email:        document.getElementById('f-email').value.trim(),
    telefone:     document.getElementById('f-tel').value.trim(),
    responsavel:  document.getElementById('f-resp').value.trim(),
    cidade:       document.getElementById('f-cidade').value.trim(),
    uf:           document.getElementById('f-uf').value.trim().toUpperCase(),
    endereco:     document.getElementById('f-end').value.trim(),
    status:       document.getElementById('f-status_cliente').value,
    observacoes:  document.getElementById('f-obs').value.trim(),
  };

  const response = editId
      ? await apiFetch(`/clientes/${editId}`, { method: 'PUT', body: JSON.stringify(data) })
      : await apiFetch('/clientes', { method: 'POST', body: JSON.stringify(data) });

  if (!response) return;

  if (!response.ok) {
    const erro = await response.text();
    alert(erro);
    return;
  }

  closeModal();
  await carregarClientes();
}

// ── Drawer ───────────────────────────────
function openDrawer(id) {
  const c = clients.find(x => x.id === id);
  if (!c) return;
  viewingId = id;

  document.getElementById('d-initial').textContent = c.razaoSocial?.charAt(0).toUpperCase();
  document.getElementById('d-nome').textContent     = c.razaoSocial  || '—';
  document.getElementById('d-tipo').textContent     = c.cnpj         || '—';
  document.getElementById('d-doc').textContent      = c.cnpj         || '—';
  document.getElementById('d-resp').textContent     = c.responsavel  || '—';
  document.getElementById('d-email').textContent    = c.email        || '—';
  document.getElementById('d-tel').textContent      = c.telefone     || '—';
  document.getElementById('d-end').textContent      = c.endereco     || '—';
  document.getElementById('d-cidade').textContent   = `${c.cidade || '—'}${c.uf ? ' – ' + c.uf : ''}`;
  document.getElementById('d-obs').textContent      = c.observacoes  || 'Nenhuma observação registrada.';

  const statusMap = {
    ativo:    { dot: 'bg-green-500', text: 'Ativo',    bg: 'bg-green-50 text-green-700' },
    pendente: { dot: 'bg-amber-400', text: 'Pendente', bg: 'bg-amber-50 text-amber-700' },
    inativo:  { dot: 'bg-red-400',   text: 'Inativo',  bg: 'bg-red-50 text-red-700' },
  };
  const s = statusMap[c.status] || statusMap.pendente;
  const banner = document.getElementById('d-status-banner');
  banner.className = `px-6 py-3 flex items-center gap-2 border-b border-gray-100 ${s.bg}`;
  document.getElementById('d-status-dot').className  = `w-2 h-2 rounded-full ${s.dot}`;
  document.getElementById('d-status-text').textContent = s.text;

  document.getElementById('drawer-backdrop').classList.add('open');
  document.getElementById('drawer').classList.add('open');
}

function closeDrawer() {
  document.getElementById('drawer-backdrop').classList.remove('open');
  document.getElementById('drawer').classList.remove('open');
  viewingId = null;
}

function editFromDrawer() {
  const id = viewingId;
  closeDrawer();
  setTimeout(() => openModalEdit(id), 150);
}

// ── Deletar cliente ──────────────────────
async function deleteClient(id) {
  if (!confirm('Deseja realmente excluir este cliente?')) return;
  await apiFetch(`/clientes/${id}`, { method: 'DELETE' });
  await carregarClientes();
  if (viewingId === id) closeDrawer();
}

function deleteFromDrawer() {
  if (viewingId) deleteClient(viewingId);
}

// ── Carregar clientes da API ─────────────
async function carregarClientes() {
  const response = await apiFetch('/clientes');
  if (!response) return;
  clients = await response.json();
  renderTable();
}

// ── Sidebar ──────────────────────────────

let sidebar, overlay, isMobile;

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

// ── Inicialização ────────────────────────
document.addEventListener('DOMContentLoaded', () => {
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

  const dateEl = document.getElementById('topbar-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('pt-BR', {
      weekday: 'short', day: 'numeric', month: 'short'
    });
  }
  carregarClientes();
});

