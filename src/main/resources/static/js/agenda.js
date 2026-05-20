/* ═══════════════════════════════════════
   iSpec – Agenda page logic
   ═══════════════════════════════════════ */

verificarAutenticacao();

let agendamentos  = [];
let usuarios      = [];
let mesAtual      = new Date().getMonth();
let anoAtual      = new Date().getFullYear();
let diaSelecionado = null;
let editingId      = null;

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
               'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

const TIPO_LABEL = {
  INSPECAO:      'Inspeção',
  MANUTENCAO:    'Manutenção',
  VISITA_TECNICA:'Visita Técnica',
};

const TIPO_CLASS = {
  INSPECAO:      'pill-inspecao',
  MANUTENCAO:    'pill-manutencao',
  VISITA_TECNICA:'pill-visita_tecnica',
};

const STATUS_COLOR = {
  PENDENTE:  { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400',  label: 'Pendente'  },
  REALIZADO: { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500',  label: 'Realizado' },
  CANCELADO: { bg: 'bg-gray-50',   text: 'text-gray-500',   dot: 'bg-gray-400',   label: 'Cancelado' },
};

// ── Calendário ───────────────────────────
function renderCalendario() {
  const titulo    = document.getElementById('cal-titulo');
  const subtitulo = document.getElementById('cal-subtitulo');
  const grid      = document.getElementById('cal-grid');

  titulo.textContent    = MESES[mesAtual];
  subtitulo.textContent = `${anoAtual} · ${agendamentos.filter(a => {
    const d = new Date(a.data + 'T00:00:00');
    return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
  }).length} agendamentos`;

  const hoje       = new Date();
  const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
  const ultimoDia   = new Date(anoAtual, mesAtual + 1, 0).getDate();
  const diasAntMes  = new Date(anoAtual, mesAtual, 0).getDate();

  grid.innerHTML = '';

  // Dias do mês anterior
  for (let i = primeiroDia - 1; i >= 0; i--) {
    grid.appendChild(criarCelula(diasAntMes - i, mesAtual - 1, anoAtual, true));
  }

  // Dias do mês atual
  for (let d = 1; d <= ultimoDia; d++) {
    const isHoje = d === hoje.getDate() && mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear();
    const isSel  = diaSelecionado &&
      diaSelecionado.dia === d &&
      diaSelecionado.mes === mesAtual &&
      diaSelecionado.ano === anoAtual;
    grid.appendChild(criarCelula(d, mesAtual, anoAtual, false, isHoje, isSel));
  }

  // Completar a última linha
  const total = primeiroDia + ultimoDia;
  const resto = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= resto; d++) {
    grid.appendChild(criarCelula(d, mesAtual + 1, anoAtual, true));
  }
}

function criarCelula(dia, mes, ano, outroMes, isHoje = false, isSel = false) {
  const cell = document.createElement('div');
  cell.className = `cal-day p-2 border-b border-r border-gray-100 ${outroMes ? 'other-month' : ''} ${isHoje ? 'today' : ''} ${isSel ? 'selected' : ''}`;

  // Número do dia
  const numSpan = document.createElement('span');
  numSpan.className = `day-num inline-flex items-center justify-center w-7 h-7 text-sm font-sora font-semibold text-gray-700 mb-1`;
  numSpan.textContent = dia;
  cell.appendChild(numSpan);

  // Eventos do dia
  if (!outroMes) {
    const dataStr = `${ano}-${String(mes + 1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
    const eventos = agendamentos.filter(a => a.data === dataStr);
    const max = 2;
    eventos.slice(0, max).forEach(ev => {
      const pill = document.createElement('div');
      pill.className = `event-pill ${TIPO_CLASS[ev.tipo] || 'pill-inspecao'} mb-0.5 font-dm`;
      pill.textContent = ev.titulo;
      pill.onclick = (e) => { e.stopPropagation(); abrirAgendamento(ev); };
      cell.appendChild(pill);
    });
    if (eventos.length > max) {
      const more = document.createElement('div');
      more.className = 'text-xs text-gray-400 font-dm pl-1';
      more.textContent = `+${eventos.length - max} mais`;
      cell.appendChild(more);
    }

    cell.onclick = () => abrirDia(dia, mes, ano);
  }

  return cell;
}

function mesAnterior() {
  if (mesAtual === 0) { mesAtual = 11; anoAtual--; }
  else mesAtual--;
  renderCalendario();
}

function proximoMes() {
  if (mesAtual === 11) { mesAtual = 0; anoAtual++; }
  else mesAtual++;
  renderCalendario();
}

// ── Drawer do dia ────────────────────────
function abrirDia(dia, mes, ano) {
  diaSelecionado = { dia, mes, ano };
  renderCalendario();

  const dataStr = `${ano}-${String(mes + 1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
  const eventos = agendamentos.filter(a => a.data === dataStr);

  const [, mesStr, diaStr] = dataStr.split('-');
  document.getElementById('d-dia-titulo').textContent = `${diaStr}/${mesStr}/${ano}`;
  document.getElementById('d-dia-count').textContent  = `${eventos.length} agendamento(s)`;

  const container = document.getElementById('d-agendamentos');
  if (!eventos.length) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-8 text-center">
        <svg viewBox="0 0 24 24" class="w-10 h-10 text-gray-200 mb-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <p class="text-gray-400 text-sm font-dm">Nenhum agendamento neste dia</p>
      </div>`;
  } else {
    container.innerHTML = eventos.map(ev => {
      const s = STATUS_COLOR[ev.status] || STATUS_COLOR.PENDENTE;
      return `
        <div class="rounded-xl border border-gray-100 overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 ${s.bg}">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full ${s.dot}"></span>
              <span class="font-sora font-semibold text-sm ${s.text}">${TIPO_LABEL[ev.tipo] || ev.tipo}</span>
            </div>
            <span class="text-xs font-dm ${s.text}">${s.label}</span>
          </div>
          <div class="px-4 py-3 flex flex-col gap-1">
            <p class="font-sora font-semibold text-gray-800 text-sm">${ev.titulo}</p>
            <p class="text-gray-400 text-xs font-dm">Responsável: ${ev.responsavel?.nome || '—'}</p>
            ${ev.descricao ? `<p class="text-gray-500 text-xs font-dm mt-1">${ev.descricao}</p>` : ''}
          </div>
          ${ev.status === 'PENDENTE' ? `
          <div class="flex gap-2 px-4 pb-3">
            <button onclick="marcarStatus(${ev.id}, 'REALIZADO')"
                    class="flex-1 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 font-sora font-semibold text-xs hover:bg-green-100 transition-all">
              ✓ Realizado
            </button>
            <button onclick="marcarStatus(${ev.id}, 'CANCELADO')"
                    class="flex-1 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 font-sora font-semibold text-xs hover:bg-red-100 transition-all">
              ✕ Cancelado
            </button>
            <button onclick="editarAgendamento(${ev.id})"
                    class="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-all shrink-0">
              <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button onclick="excluirAgendamento(${ev.id})"
                    class="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-red-50 transition-all shrink-0">
              <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              </svg>
            </button>
          </div>` : `
          <div class="flex gap-2 px-4 pb-3">
            <button onclick="excluirAgendamento(${ev.id})"
                    class="flex-1 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 font-sora font-semibold text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
              Excluir
            </button>
          </div>`}
        </div>`;
    }).join('');
  }

  document.getElementById('drawer-backdrop').classList.add('open');
  document.getElementById('drawer').classList.add('open');
}

function closeDrawer() {
  document.getElementById('drawer-backdrop').classList.remove('open');
  document.getElementById('drawer').classList.remove('open');
}

function abrirAgendamento(ev) {
  if (ev.data) {
    const [ano, mes, dia] = ev.data.split('-').map(Number);
    abrirDia(dia, mes - 1, ano);
  }
}

// ── Modal ────────────────────────────────
function openModal() {
  editingId = null;
  document.getElementById('modal-title').textContent = 'Novo Agendamento';
  document.getElementById('agenda-form').reset();
  document.getElementById('edit-id').value = '';
  document.getElementById('f-data').value = new Date().toISOString().split('T')[0];
  document.getElementById('modal').classList.add('open');
}

function openModalNoDia() {
  openModal();
  if (diaSelecionado) {
    const { dia, mes, ano } = diaSelecionado;
    document.getElementById('f-data').value =
      `${ano}-${String(mes + 1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
  }
}

function editarAgendamento(id) {
  const ag = agendamentos.find(a => a.id === id);
  if (!ag) return;
  editingId = id;
  document.getElementById('modal-title').textContent = 'Editar Agendamento';
  document.getElementById('edit-id').value    = id;
  document.getElementById('f-titulo').value   = ag.titulo || '';
  document.getElementById('f-tipo').value     = ag.tipo   || '';
  document.getElementById('f-data').value     = ag.data   || '';
  document.getElementById('f-descricao').value = ag.descricao || '';
  if (ag.responsavel) document.getElementById('f-responsavel').value = ag.responsavel.id;
  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

function handleBackdropClick(ev) {
  if (ev.target === document.getElementById('modal')) closeModal();
}

// ── Salvar ───────────────────────────────
async function salvarAgendamento(ev) {
  ev.preventDefault();
  const editId    = document.getElementById('edit-id').value;
  const respId    = document.getElementById('f-responsavel').value;

  const body = {
    titulo:    document.getElementById('f-titulo').value.trim(),
    tipo:      document.getElementById('f-tipo').value,
    data:      document.getElementById('f-data').value,
    descricao: document.getElementById('f-descricao').value.trim(),
    ...(respId ? { responsavel: { id: parseInt(respId) } } : {})
  };

  const response = editId
    ? await apiFetch(`/agendamentos/${editId}`, { method: 'PUT', body: JSON.stringify(body) })
    : await apiFetch('/agendamentos', { method: 'POST', body: JSON.stringify(body) });

  if (!response) return;

  if (!response.ok) {
    const erro = await response.text();
    alert(erro);
    return;
  }

  closeModal();
  await carregarAgendamentos();

  if (diaSelecionado) {
    const { dia, mes, ano } = diaSelecionado;
    abrirDia(dia, mes, ano);
  }
}

// ── Marcar status ────────────────────────
async function marcarStatus(id, status) {
  const response = await apiFetch(`/agendamentos/${id}/status?status=${status}`, { method: 'PATCH' });
  if (!response) return;
  await carregarAgendamentos();
  if (diaSelecionado) {
    const { dia, mes, ano } = diaSelecionado;
    abrirDia(dia, mes, ano);
  }
}

// ── Excluir ──────────────────────────────
async function excluirAgendamento(id) {
  if (!confirm('Deseja excluir este agendamento?')) return;
  await apiFetch(`/agendamentos/${id}`, { method: 'DELETE' });
  await carregarAgendamentos();
  if (diaSelecionado) {
    const { dia, mes, ano } = diaSelecionado;
    abrirDia(dia, mes, ano);
  }
}

// ── Popup vencidos ───────────────────────
async function verificarVencidos() {
  const res = await apiFetch('/agendamentos/vencidos');
  if (!res) return;
  const vencidos = await res.json();
  if (!vencidos.length) return;

  const lista = document.getElementById('vencidos-lista');
  lista.innerHTML = vencidos.map(ag => {
    const [ano, mes, dia] = ag.data.split('-');
    const s = STATUS_COLOR[ag.status] || STATUS_COLOR.PENDENTE;
    return `
      <div class="rounded-xl border border-gray-100 p-4 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="font-sora font-semibold text-gray-800 text-sm">${ag.titulo}</span>
          <span class="text-xs font-dm text-gray-400">${dia}/${mes}/${ano}</span>
        </div>
        <p class="text-gray-400 text-xs font-dm">${TIPO_LABEL[ag.tipo] || ag.tipo} · ${ag.responsavel?.nome || '—'}</p>
        <div class="flex gap-2 mt-1">
          <button onclick="marcarStatusPopup(${ag.id}, 'REALIZADO')"
                  class="flex-1 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 font-sora font-semibold text-xs hover:bg-green-100 transition-all">
            ✓ Realizado
          </button>
          <button onclick="marcarStatusPopup(${ag.id}, 'CANCELADO')"
                  class="flex-1 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 font-sora font-semibold text-xs hover:bg-red-100 transition-all">
            ✕ Cancelado
          </button>
        </div>
      </div>`;
  }).join('');

  document.getElementById('vencidos-popup').classList.add('open');
}

async function marcarStatusPopup(id, status) {
  await marcarStatus(id, status);
  const res = await apiFetch('/agendamentos/vencidos');
  if (!res) return;
  const vencidos = await res.json();
  if (!vencidos.length) fecharVencidos();
  else await verificarVencidos();
}

function fecharVencidos() {
  document.getElementById('vencidos-popup').classList.remove('open');
}

// ── Carregar dados ───────────────────────
async function carregarAgendamentos() {
  const res = await apiFetch('/agendamentos');
  if (!res) return;
  agendamentos = await res.json();
  renderCalendario();
}

async function carregarUsuarios() {
  const res = await apiFetch('/usuarios');
  if (!res) return;
  usuarios = await res.json();
  const select = document.getElementById('f-responsavel');
  select.innerHTML = '<option value="">Usuário logado (padrão)</option>';
  usuarios.forEach(u => {
    select.innerHTML += `<option value="${u.id}">${u.nome} (${u.tipo})</option>`;
  });
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

  await Promise.all([carregarAgendamentos(), carregarUsuarios()]);
  await verificarVencidos();
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