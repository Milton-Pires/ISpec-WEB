/* ═══════════════════════════════════════
   iSpec – Main Dashboard logic
   ═══════════════════════════════════════ */

verificarAutenticacao();

// ── Data ─────────────────────────────────
document.getElementById('topbar-date').textContent =
  new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });

// ── Saudação por horário ─────────────────
function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

// ── Carregar dados do dashboard ──────────
async function carregarDashboard() {
  const [
    resClientes,
    resEquipamentos,
    resInspecoes,
    resAvisos,
    resAgenda,
  ] = await Promise.all([
    apiFetch('/clientes'),
    apiFetch('/equipamentos'),
    apiFetch('/inspecoes'),
    apiFetch('/avisos'),
    apiFetch('/agendamentos'),
  ]);

  const clientes     = resClientes     ? await resClientes.json()     : [];
  const equipamentos = resEquipamentos ? await resEquipamentos.json() : [];
  const inspecoes    = resInspecoes    ? await resInspecoes.json()    : [];
  const avisos       = resAvisos       ? await resAvisos.json()       : {};
  const agendamentos = resAgenda       ? await resAgenda.json()       : [];

  // ── Saudação com nome do usuário ────────
  const token = getToken();
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email   = payload.sub;
      const resUsuarios = await apiFetch('/usuarios');
      if (resUsuarios) {
        const lista = await resUsuarios.json();
        const u = lista.find(x => x.email === email);
        if (u) {
          const welcomeEl = document.getElementById('welcome-msg');
          if (welcomeEl) welcomeEl.textContent = `${saudacao()}, ${u.nome.split(' ')[0]} 👋`;
          const nomeEl    = document.getElementById('user-nome');
          const emailEl   = document.getElementById('user-email');
          const initialEl = document.getElementById('user-initial');
          if (nomeEl)    nomeEl.textContent    = u.nome;
          if (emailEl)   emailEl.textContent   = u.email;
          if (initialEl) initialEl.textContent = u.nome.charAt(0).toUpperCase();
        }
      }
    } catch (e) {}
  }

  // ── KPI: Inspeções este mês ─────────────
  const hoje     = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();
  const inspecoesMes = inspecoes.filter(i => {
    if (!i.dataInspecao) return false;
    const d = new Date(i.dataInspecao + 'T00:00:00');
    return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
  });
  const aprovadas = inspecoesMes.filter(i => i.aprovado === true).length;
  const taxaAprov = inspecoesMes.length > 0
    ? Math.round((aprovadas / inspecoesMes.length) * 100) : 0;
  atualizarKpi(0, inspecoesMes.length, `${taxaAprov}% aprovadas`);

  // ── KPI: Clientes ativos ────────────────
  const clientesAtivos = clientes.filter(c => c.status === 'ativo').length;
  const pctAtivos = clientes.length > 0
    ? Math.round((clientesAtivos / clientes.length) * 100) : 0;
  atualizarKpi(1, clientesAtivos, `${pctAtivos}% do total`);

  // ── KPI: Avisos pendentes ───────────────
  const totalAvisos = (avisos.vencidos?.length    || 0)
                    + (avisos.vencendo30?.length   || 0)
                    + (avisos.vencendo90?.length   || 0)
                    + (avisos.reprovadas?.length   || 0)
                    + (avisos.agendaSemana?.length || 0);
  atualizarKpi(2, totalAvisos, totalAvisos > 0 ? 'Requer atenção' : 'Tudo em ordem');

  // ── KPI: Equipamentos conformes ─────────
  const conformes = equipamentos.filter(e => e.status === 'ATIVO' && !e.precisaManutencao).length;
  const pctConf   = equipamentos.length > 0
    ? Math.round((conformes / equipamentos.length) * 100) : 0;
  atualizarKpi(3, conformes, `${pctConf}% conformes`);

  // ── Próximas inspeções ───────────────────
  renderProximasInspecoes(agendamentos);

  // ── Avisos recentes ──────────────────────
  renderAvisosRecentes(avisos);

  // ── Conformidade por tipo ────────────────
  renderConformidade(equipamentos);
}

function atualizarKpi(index, valor, badge) {
  const cards = document.querySelectorAll('.card-anim');
  if (!cards[index]) return;
  const numEl   = cards[index].querySelector('p.text-2xl');
  const badgeEl = cards[index].querySelector('span.text-xs');
  if (numEl)   numEl.textContent   = valor;
  if (badgeEl) badgeEl.textContent = badge;
}

// ── Próximas inspeções ───────────────────
function renderProximasInspecoes(agendamentos) {
  const container = document.querySelector('.lg\\:col-span-2 .divide-y');
  if (!container) return;

  const hojeStr  = new Date().toISOString().split('T')[0];
  const proximos = agendamentos
    .filter(a => a.data >= hojeStr && a.status === 'PENDENTE' && a.tipo === 'INSPECAO')
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 5);

  if (!proximos.length) {
    container.innerHTML = `
      <div class="flex items-center justify-center py-8 text-gray-400">
        <div class="text-center">
          <svg viewBox="0 0 24 24" class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <p class="font-dm text-sm">Nenhuma inspeção agendada</p>
          <p class="text-xs mt-1">As próximas inspeções aparecerão aqui</p>
        </div>
      </div>`;
    return;
  }

  container.innerHTML = proximos.map(ag => {
    const [ano, mes, dia] = ag.data.split('-');
    return `
      <div class="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
        <div class="w-10 h-10 bg-brand-rose rounded-xl flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="#8B0012" stroke-width="2" stroke-linecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-sora font-semibold text-gray-800 text-sm truncate">${ag.titulo}</p>
          <p class="text-gray-400 text-xs font-dm">${ag.responsavel?.nome || '—'}</p>
        </div>
        <div class="text-right shrink-0">
          <p class="font-sora font-semibold text-gray-700 text-sm">${dia}/${mes}</p>
          <p class="text-gray-400 text-xs font-dm">${ano}</p>
        </div>
      </div>`;
  }).join('');
}

// ── Avisos recentes ──────────────────────
function renderAvisosRecentes(avisos) {
  const divs = document.querySelectorAll('.bg-white.rounded-2xl.shadow-sm.border.border-gray-100.overflow-hidden');
  const container = divs[divs.length - 1]?.querySelector('.divide-y');
  if (!container) return;

  const itens = [
    ...(avisos.vencidos   || []).slice(0, 2).map(e => ({ tipo: 'critico', msg: `${e.nome} vencido`,           sub: e.cliente?.razaoSocial || '—' })),
    ...(avisos.vencendo30 || []).slice(0, 2).map(e => ({ tipo: 'urgente', msg: `${e.nome} vence em 30 dias`,  sub: e.cliente?.razaoSocial || '—' })),
    ...(avisos.reprovadas || []).slice(0, 2).map(i => ({ tipo: 'info',    msg: `Reprovado: ${i.equipamento?.nome || '—'}`, sub: i.responsavel?.nome || '—' })),
  ].slice(0, 5);

  if (!itens.length) {
    container.innerHTML = `
      <div class="flex items-center justify-center py-8 text-gray-400">
        <div class="text-center">
          <svg viewBox="0 0 24 24" class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          </svg>
          <p class="font-dm text-sm">Nenhum aviso pendente</p>
        </div>
      </div>`;
    return;
  }

  const COR = {
    critico: 'bg-red-500',
    urgente: 'bg-orange-400',
    info:    'bg-blue-400',
  };

  container.innerHTML = itens.map(item => `
    <div class="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
      <span class="w-2 h-2 rounded-full shrink-0 ${COR[item.tipo]}"></span>
      <div class="flex-1 min-w-0">
        <p class="font-sora font-semibold text-gray-800 text-xs truncate">${item.msg}</p>
        <p class="text-gray-400 text-xs font-dm">${item.sub}</p>
      </div>
    </div>`).join('');
}

// ── Conformidade por tipo ────────────────
function renderConformidade(equipamentos) {
  const tipos  = ['Extintor', 'Hidrante', 'Alarme'];
  const barras = document.querySelectorAll('#progress-bars .flex.items-center');

  tipos.forEach((tipo, i) => {
    const total     = equipamentos.filter(e => e.classe === tipo || (e.tipo || '') === tipo).length;
    const conformes = equipamentos.filter(e => {
      const isTipo = e.classe === tipo || (e.tipo || '') === tipo;
      return isTipo && e.status === 'ATIVO' && !e.precisaManutencao;
    }).length;
    const pct = total > 0 ? Math.round((conformes / total) * 100) : 0;

    if (barras[i]) {
      const fill  = barras[i].querySelector('.progress-fill');
      const pctEl = barras[i].querySelector('.w-8');
      const label = barras[i].querySelector('.w-28');
      if (fill)  { fill.dataset.target = pct; fill.style.width = pct + '%'; }
      if (pctEl) pctEl.textContent = pct + '%';
      if (label) label.textContent  = `${tipo}${total > 0 ? ` (${total})` : ''}`;
    }
  });
}

// ── Sidebar ──────────────────────────────
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');
let isMobile  = window.innerWidth < 1024;

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

window.addEventListener('resize', () => {
  isMobile = window.innerWidth < 1024;
  if (!isMobile) {
    overlay.classList.remove('show');
    sidebar.classList.remove('mobile-open');
  }
});

// ── Module card click ────────────────────
document.querySelectorAll('.module-card').forEach(card => {
  card.addEventListener('click', function () {
    this.style.transform = 'scale(.96)';
    setTimeout(() => { this.style.transform = ''; }, 150);
  });
});

// ── Inicialização ────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await carregarDashboard();
  carregarBadgeAvisos();
});