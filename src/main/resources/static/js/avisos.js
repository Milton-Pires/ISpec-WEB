/* ═══════════════════════════════════════
   iSpec – Avisos page logic
   ═══════════════════════════════════════ */

verificarAutenticacao();

const FMT = (data) => {
  if (!data) return '—';
  const [ano, mes, dia] = data.toString().split('-');
  return `${dia}/${mes}/${ano}`;
};

const TIPO_AGENDA = {
  INSPECAO:       'Inspeção',
  MANUTENCAO:     'Manutenção',
  VISITA_TECNICA: 'Visita Técnica',
};

// ── Renderizar lista de equipamentos ────
function renderEquipamentos(containerId, badgeId, lista, cor) {
  const container = document.getElementById(containerId);
  const badge     = document.getElementById(badgeId);
  badge.textContent = lista.length;

  if (!lista.length) {
    container.innerHTML = `
      <div class="flex items-center justify-center py-8 text-gray-300 gap-2">
        <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="text-sm font-dm">Nenhum item</span>
      </div>`;
    return;
  }

  container.innerHTML = lista.map(eq => `
    <div class="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
      <div class="w-8 h-8 bg-brand-rose rounded-lg flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="#8B0012" stroke-width="2" stroke-linecap="round">
          <path d="M12 2l9 4v6c0 5-3.5 9.5-9 11C6.5 21.5 3 17 3 12V6l9-4z"/>
          <polyline points="9 12 11 14 15 10"/>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-sora font-semibold text-gray-800 text-sm truncate">${eq.nome || '—'}</p>
        <p class="text-gray-400 text-xs font-dm">${eq.cliente?.razaoSocial || '—'} · ${eq.numSerie || 'Sem nº série'}</p>
      </div>
      <div class="text-right shrink-0">
        <p class="text-xs font-dm font-semibold ${cor}">${FMT(eq.dataValidade)}</p>
        <p class="text-gray-400 text-xs font-dm">${eq.getClass?.name || eq.tipo || '—'}</p>
      </div>
    </div>
  `).join('');
}

// ── Renderizar agenda ────────────────────
function renderAgenda(lista) {
  const container = document.getElementById('lista-agenda');
  const badge     = document.getElementById('badge-agenda');
  document.getElementById('kpi-agenda').textContent = lista.length;
  badge.textContent = lista.length;

  if (!lista.length) {
    container.innerHTML = `
      <div class="flex items-center justify-center py-8 text-gray-300 gap-2">
        <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="text-sm font-dm">Nenhum agendamento esta semana</span>
      </div>`;
    return;
  }

  const PILL = {
    INSPECAO:       'bg-red-100 text-red-700',
    MANUTENCAO:     'bg-yellow-100 text-yellow-700',
    VISITA_TECNICA: 'bg-blue-100 text-blue-700',
  };

  container.innerHTML = lista.map(ag => `
    <div class="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
      <div class="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-sora font-semibold text-gray-800 text-sm truncate">${ag.titulo || '—'}</p>
        <p class="text-gray-400 text-xs font-dm">${ag.responsavel?.nome || '—'}</p>
      </div>
      <div class="flex flex-col items-end gap-1 shrink-0">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-sora font-bold ${PILL[ag.tipo] || 'bg-gray-100 text-gray-600'}">${TIPO_AGENDA[ag.tipo] || ag.tipo}</span>
        <p class="text-gray-500 text-xs font-dm">${FMT(ag.data)}</p>
      </div>
    </div>
  `).join('');
}

// ── Renderizar reprovadas ────────────────
function renderReprovadas(lista) {
  const container = document.getElementById('lista-reprovadas');
  const badge     = document.getElementById('badge-reprovadas');
  badge.textContent = lista.length;

  if (!lista.length) {
    container.innerHTML = `
      <div class="flex items-center justify-center py-8 text-gray-300 gap-2">
        <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="text-sm font-dm">Nenhuma inspeção reprovada recentemente</span>
      </div>`;
    return;
  }

  container.innerHTML = lista.map(ins => `
    <div class="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
      <div class="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="#991b1b" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-sora font-semibold text-gray-800 text-sm truncate">${ins.equipamento?.nome || '—'}</p>
        <p class="text-gray-400 text-xs font-dm">${ins.equipamento?.cliente?.razaoSocial || '—'} · Responsável: ${ins.responsavel?.nome || '—'}</p>
      </div>
      <div class="text-right shrink-0">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-sora font-bold bg-red-100 text-red-700">Reprovado</span>
        <p class="text-gray-400 text-xs font-dm mt-0.5">${FMT(ins.dataInspecao)}</p>
      </div>
    </div>
  `).join('');
}

// ── Carregar avisos ──────────────────────
async function carregarAvisos() {
  const res = await apiFetch('/avisos');
  if (!res) return;
  const data = await res.json();

  const { vencidos, vencendo30, vencendo90, reprovadas, agendaSemana } = data;

  // KPIs
  document.getElementById('kpi-vencidos').textContent = vencidos.length;
  document.getElementById('kpi-30dias').textContent   = vencendo30.length;
  document.getElementById('kpi-90dias').textContent   = vencendo90.length;

  // Badge total
  const total = vencidos.length + vencendo30.length + vencendo90.length + reprovadas.length;
  const badgeTotal = document.getElementById('badge-total');
  if (total > 0) {
    badgeTotal.textContent = `${total} aviso${total > 1 ? 's' : ''}`;
    badgeTotal.classList.remove('hidden');
  } else {
    badgeTotal.classList.add('hidden');
  }

  // Listas
  renderEquipamentos('lista-vencidos',  'badge-vencidos', vencidos,   'text-red-600');
  renderEquipamentos('lista-30dias',    'badge-30dias',   vencendo30, 'text-orange-600');
  renderEquipamentos('lista-90dias',    'badge-90dias',   vencendo90, 'text-amber-600');
  renderAgenda(agendaSemana);
  renderReprovadas(reprovadas);

  // Última atualização
  const agora = new Date();
  document.getElementById('ultima-atualizacao').textContent =
    `Atualizado às ${agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
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
  await carregarAvisos();
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