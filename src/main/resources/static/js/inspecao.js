/* ═══════════════════════════════════════
   iSpec – Inspeções page logic
   ═══════════════════════════════════════ */

verificarAutenticacao();

let inspecoes    = [];
let equipamentos = [];
let usuarios     = [];
let perguntas    = [];
let equipSelecionado = null;
let respostas    = {}; // { perguntaId: true/false }
let etapaAtual   = 1;
let viewingId    = null;

let filterResultado = 'todos';
let filterTipo      = 'todos';

// ── Formatação ───────────────────────────
function formatarData(data) {
    if (!data) return '—';
    const [ano, mes, dia] = data.toString().split('-');
    return `${dia}/${mes}/${ano}`;
}

// ── KPIs ────────────────────────────────
function updateKpis() {
    const totalEquipamentos = equipamentos.length;

    const inspecoesPorEquip = new Set(
        inspecoes.map(i => i.equipamento?.id)
    );

    const pendentes = equipamentos.filter(e =>
        !inspecoesPorEquip.has(e.id)
    ).length;

    const aprovadas = inspecoes.filter(i => i.aprovado === true).length;
    const reprovadas = inspecoes.filter(i => i.aprovado === false).length;

    document.getElementById('kpi-total').textContent = inspecoes.length;
    document.getElementById('kpi-aprovadas').textContent = aprovadas;
    document.getElementById('kpi-reprovadas').textContent = reprovadas;
    document.getElementById('kpi-pendentes').textContent = pendentes;
}

// ── Filtros ──────────────────────────────
function setFilter(tipo, valor) {
    if (tipo === 'resultado') {
        filterResultado = valor;
        document.querySelectorAll('.filter-resultado').forEach(btn => {
            const isActive = btn.dataset.resultado === valor;
            btn.classList.toggle('bg-brand-red', isActive);
            btn.classList.toggle('text-white', isActive);
            btn.classList.toggle('bg-white', !isActive);
            btn.classList.toggle('border', !isActive);
            btn.classList.toggle('border-gray-200', !isActive);
            btn.classList.toggle('text-gray-600', !isActive);
        });
    } else if (tipo === 'tipo') {
        filterTipo = valor;
        document.querySelectorAll('.filter-tipo').forEach(btn => {
            const isActive = btn.dataset.tipo === valor;
            btn.classList.toggle('bg-brand-red', isActive);
            btn.classList.toggle('text-white', isActive);
            btn.classList.toggle('bg-white', !isActive);
            btn.classList.toggle('border', !isActive);
            btn.classList.toggle('border-gray-200', !isActive);
            btn.classList.toggle('text-gray-600', !isActive);
        });
    }
    renderTable();
}

// ── Tabela ──────────────────────────────
function renderTable() {
    const q          = document.getElementById('search').value.toLowerCase();
    const clienteId  = document.getElementById('filter-cliente').value;
    const dataInicio = document.getElementById('filter-data-inicio').value;
    const dataFim    = document.getElementById('filter-data-fim').value;
    const tbody      = document.getElementById('inspecao-table');
    const empty      = document.getElementById('empty-state');

    const filtered = inspecoes.filter(i => {
        const resultado = i.aprovado === true ? 'aprovado' : i.aprovado === false ? 'reprovado' : 'pendente';
        const tipo = i.equipamento?.tipo || '';

        const matchResultado = filterResultado === 'todos' || resultado === filterResultado;
        const matchTipo      = filterTipo === 'todos' || tipo === filterTipo;
        const matchCliente   = clienteId === 'todos' || i.equipamento?.cliente?.id == clienteId;
        const matchSearch    = !q
            || i.equipamento?.nome?.toLowerCase().includes(q)
            || i.equipamento?.numSerie?.toLowerCase().includes(q)
            || i.responsavel?.nome?.toLowerCase().includes(q);

        let matchData = true;
        if (dataInicio) matchData = matchData && i.dataInspecao >= dataInicio;
        if (dataFim)    matchData = matchData && i.dataInspecao <= dataFim;

        return matchResultado && matchTipo && matchCliente && matchSearch && matchData;
    });

    const resultCount = document.getElementById('result-count');
    resultCount.textContent = filtered.length === inspecoes.length
        ? `${inspecoes.length} inspeções`
        : `${filtered.length} de ${inspecoes.length}`;

    if (!filtered.length) {
        tbody.innerHTML = '';
        empty.classList.remove('hidden');
        empty.classList.add('flex');
        return;
    }

    empty.classList.add('hidden');
    empty.classList.remove('flex');

    tbody.innerHTML = filtered.map((i, idx) => {
        const resultado = i.aprovado === true ? 'aprovado' : i.aprovado === false ? 'reprovado' : 'pendente';
        const resultadoText = resultado.charAt(0).toUpperCase() + resultado.slice(1);

        return `
      <tr class="insp-row row-anim border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
          data-insp-id="${i.id}" style="animation-delay:${idx * 0.04}s">
        <td class="px-5 py-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-brand-rose flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="#8B0012" stroke-width="2" stroke-linecap="round">
                <path d="M12 2l9 4v6c0 5-3.5 9.5-9 11C6.5 21.5 3 17 3 12V6l9-4z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="font-sora font-semibold text-gray-800 text-sm truncate max-w-[150px]">${i.equipamento?.nome || '—'}</p>
              <p class="text-gray-400 text-xs font-dm">${i.equipamento?.numSerie || '—'}</p>
            </div>
          </div>
        </td>
        <td class="px-5 py-4 hidden md:table-cell">
          <span class="text-gray-600 text-sm font-dm">${i.equipamento?.cliente?.razaoSocial || '—'}</span>
        </td>
        <td class="px-5 py-4 hidden lg:table-cell">
          <span class="text-gray-600 text-sm font-dm">${i.responsavel?.nome || '—'}</span>
        </td>
        <td class="px-5 py-4 hidden lg:table-cell">
          <span class="text-gray-600 text-sm font-dm">${formatarData(i.dataInspecao)}</span>
        </td>
        <td class="px-5 py-4">
          <span class="px-2.5 py-1 rounded-full text-[11px] font-sora font-semibold badge-${resultado}">${resultadoText}</span>
        </td>
        <td class="px-5 py-4">
          <div class="flex items-center gap-1">
            <button type="button" class="w-8 h-8 rounded-lg hover:bg-brand-rose flex items-center justify-center transition-colors" data-action="view" data-id="${i.id}">
              <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            <button type="button" class="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors" data-action="delete" data-id="${i.id}">
              <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
    }).join('');

    updateKpis();
    attachTableActions();
}

function attachTableActions() {
    document.querySelectorAll('[data-action]').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;
            const id = parseInt(btn.dataset.id, 10);
            if (action === 'view')   openDrawer(id);
            if (action === 'delete') deleteInspecao(id);
        };
    });

    document.querySelectorAll('.insp-row').forEach(row => {
        row.onclick = (e) => {
            e.stopPropagation();
            openDrawer(parseInt(row.dataset.inspId, 10));
        };
    });
}

// ── Modal ────────────────────────────────
function openModal() {
    equipSelecionado = null;
    respostas = {};
    etapaAtual = 1;
    document.getElementById('search-equip').value = '';
    document.getElementById('equip-results').innerHTML = '';
    document.getElementById('equip-selecionado').classList.add('hidden');
    document.getElementById('f-data').value = new Date().toISOString().split('T')[0];
    document.getElementById('f-obs').value = '';
    document.getElementById('chk-outro-responsavel').checked = false;
    document.getElementById('div-outro-responsavel').classList.add('hidden');
    document.getElementById('checklist-items').innerHTML = '';
    irParaEtapa(1);
    document.getElementById('modal').classList.add('open');
}

function closeModal() {
    document.getElementById('modal').classList.remove('open');
}

function handleBackdropClick(ev) {
    if (ev.target === document.getElementById('modal')) closeModal();
}

// ── Etapas ───────────────────────────────
function irParaEtapa(n) {
    etapaAtual = n;
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${n}`).classList.add('active');

    // Indicadores
    for (let i = 1; i <= 3; i++) {
        const ind = document.getElementById(`step-ind-${i}`);
        ind.classList.remove('active', 'done');
        if (i < n)      ind.classList.add('done');
        else if (i === n) ind.classList.add('active');
    }

    const btnVoltar  = document.getElementById('btn-voltar');
    const btnAvancar = document.getElementById('btn-avancar');
    const btnCancelar = document.getElementById('btn-cancelar');

    btnVoltar.classList.toggle('hidden', n === 1);
    btnCancelar.classList.toggle('hidden', n > 1);

    if (n === 3) {
        btnAvancar.textContent = 'Salvar Inspeção';
    } else {
        btnAvancar.textContent = 'Próximo';
    }
}

async function avancarEtapa() {
    if (etapaAtual === 1) {
        if (!equipSelecionado) {
            alert('Selecione um equipamento para continuar.');
            return;
        }
        if (!document.getElementById('f-data').value) {
            alert('Informe a data da inspeção.');
            return;
        }
        await carregarChecklist();
        irParaEtapa(2);

    } else if (etapaAtual === 2) {
        const total = Object.keys(respostas).length;
        const totalPerguntas = perguntas.length;
        if (total < totalPerguntas) {
            alert(`Responda todas as perguntas antes de continuar. (${total}/${totalPerguntas})`);
            return;
        }
        preencherConfirmacao();
        irParaEtapa(3);

    } else if (etapaAtual === 3) {
        await salvarInspecao();
    }
}

function voltarEtapa() {
    if (etapaAtual > 1) irParaEtapa(etapaAtual - 1);
}

// ── Busca de equipamentos ────────────────
function filtrarEquipamentos() {
    const q = document.getElementById('search-equip').value.toLowerCase();
    const results = document.getElementById('equip-results');

    if (!q) { results.innerHTML = ''; return; }

    const filtrados = equipamentos.filter(e =>
        e.nome?.toLowerCase().includes(q) || e.numSerie?.toLowerCase().includes(q)
    ).slice(0, 5);

    if (!filtrados.length) {
        results.innerHTML = `<p class="text-gray-400 text-sm font-dm text-center py-2">Nenhum equipamento encontrado</p>`;
        return;
    }

    results.innerHTML = filtrados.map(e => `
    <button type="button" onclick="selecionarEquip(${e.id})"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-brand-red hover:bg-brand-rose transition-all text-left">
      <div class="w-8 h-8 bg-brand-rose rounded-lg flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="#8B0012" stroke-width="2" stroke-linecap="round">
          <path d="M12 2l9 4v6c0 5-3.5 9.5-9 11C6.5 21.5 3 17 3 12V6l9-4z"/>
          <polyline points="9 12 11 14 15 10"/>
        </svg>
      </div>
      <div class="min-w-0">
        <p class="font-sora font-semibold text-gray-800 text-sm truncate">${e.nome}</p>
        <p class="text-gray-400 text-xs font-dm">${e.numSerie || '—'} · ${e.tipo || ''} · ${e.cliente?.razaoSocial || '—'}</p>
      </div>
    </button>
  `).join('');
}

function selecionarEquip(id) {
    equipSelecionado = equipamentos.find(e => e.id === id);
    document.getElementById('equip-results').innerHTML = '';
    document.getElementById('search-equip').value = '';

    document.getElementById('sel-nome').textContent  = equipSelecionado.nome;
    document.getElementById('sel-serie').textContent = equipSelecionado.numSerie || 'Sem nº de série';
    document.getElementById('equip-selecionado').classList.remove('hidden');
}

function deselecionarEquip() {
    equipSelecionado = null;
    document.getElementById('equip-selecionado').classList.add('hidden');
}

function toggleOutroResponsavel() {
    const checked = document.getElementById('chk-outro-responsavel').checked;
    document.getElementById('div-outro-responsavel').classList.toggle('hidden', !checked);
}

// ── Checklist ────────────────────────────
async function carregarChecklist() {
    const tipo = equipSelecionado?.tipo || '';
    const res  = await apiFetch(`/perguntas-inspecao/tipo/${tipo}`);
    if (!res) return;
    perguntas = await res.json();
    respostas = {};

    document.getElementById('checklist-titulo').textContent = `Checklist — ${tipo}`;
    atualizarProgresso();

    const container = document.getElementById('checklist-items');
    container.innerHTML = perguntas.map(p => `
    <div class="checklist-item flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50">
      <p class="text-gray-700 text-sm font-dm flex-1">${p.pergunta}</p>
      <div class="flex gap-2 shrink-0">
        <button type="button" onclick="responder(${p.id}, true)"
                id="btn-sim-${p.id}"
                class="answer-btn px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-sora font-semibold transition-all">
          Sim
        </button>
        <button type="button" onclick="responder(${p.id}, false)"
                id="btn-nao-${p.id}"
                class="answer-btn px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-sora font-semibold transition-all">
          Não
        </button>
      </div>
    </div>
  `).join('');
}

function responder(perguntaId, valor) {
    respostas[perguntaId] = valor;

    const btnSim = document.getElementById(`btn-sim-${perguntaId}`);
    const btnNao = document.getElementById(`btn-nao-${perguntaId}`);

    btnSim.classList.remove('sim', 'nao');
    btnNao.classList.remove('sim', 'nao');

    if (valor) {
        btnSim.classList.add('sim');
    } else {
        btnNao.classList.add('nao');
    }

    atualizarProgresso();
}

function atualizarProgresso() {
    const total     = perguntas.length;
    const respondidas = Object.keys(respostas).length;
    document.getElementById('checklist-progresso').textContent = `${respondidas}/${total} respondidas`;
}

// ── Confirmação ──────────────────────────
function preencherConfirmacao() {
    const aprovado = Object.values(respostas).every(r => r === true);
    const sim = Object.values(respostas).filter(r => r === true).length;
    const total = perguntas.length;

    const preview = document.getElementById('resultado-preview');
    if (aprovado) {
        preview.className = 'rounded-xl p-4 flex items-center gap-3 bg-green-50 border border-green-200';
        preview.innerHTML = `
      <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div>
        <p class="font-sora font-bold text-green-700">Aprovado</p>
        <p class="text-green-600 text-xs font-dm">Todos os itens foram aprovados</p>
      </div>`;
    } else {
        preview.className = 'rounded-xl p-4 flex items-center gap-3 bg-red-50 border border-red-200';
        preview.innerHTML = `
      <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      </div>
      <div>
        <p class="font-sora font-bold text-red-700">Reprovado</p>
        <p class="text-red-600 text-xs font-dm">${total - sim} item(ns) não aprovado(s)</p>
      </div>`;
    }

    const data = document.getElementById('f-data').value;
    const [ano, mes, dia] = data.split('-');
    document.getElementById('conf-equip').textContent  = equipSelecionado.nome;
    document.getElementById('conf-serie').textContent  = equipSelecionado.numSerie || '—';
    document.getElementById('conf-data').textContent   = `${dia}/${mes}/${ano}`;
    document.getElementById('conf-itens').textContent  = `${sim}/${total}`;

    const outroResp = document.getElementById('chk-outro-responsavel').checked;
    const selectResp = document.getElementById('f-responsavel');
    if (outroResp && selectResp.value) {
        const u = usuarios.find(u => u.id == selectResp.value);
        document.getElementById('conf-responsavel').textContent = u?.nome || 'Outro usuário';
    } else {
        document.getElementById('conf-responsavel').textContent = 'Usuário logado';
    }
}

// ── Salvar inspeção ──────────────────────
async function salvarInspecao() {
    const outroResp = document.getElementById('chk-outro-responsavel').checked;
    const respId    = document.getElementById('f-responsavel').value;

    const body = {
        equipamentoId: Number(equipSelecionado.id),
        dataInspecao:  document.getElementById('f-data').value,
        observacoes:   document.getElementById('f-obs').value.trim(),
        itens: perguntas.map(p => ({
            perguntaId: Number(p.id),
            resposta:   respostas[p.id] === true
        }))
    };

    if (outroResp && respId) {
        body.responsavelId = Number(respId);
    }

    const response = await apiFetch('/inspecoes', {
        method: 'POST',
        body: JSON.stringify(body)
    });

    if (!response) return;

    if (!response.ok) {
        const erro = await response.text();
        alert(erro);
        return;
    }

    closeModal();
    await carregarInspecoes();
}

// ── Drawer ───────────────────────────────
async function openDrawer(id) {
    const i = inspecoes.find(x => x.id === id);
    if (!i) return;
    viewingId = id;

    document.getElementById('d-equip').textContent      = i.equipamento?.nome || '—';
    document.getElementById('d-serie').textContent      = i.equipamento?.numSerie || 'Sem nº de série';
    document.getElementById('d-cliente').textContent    = i.equipamento?.cliente?.razaoSocial || '—';
    document.getElementById('d-responsavel').textContent = i.responsavel?.nome || '—';
    document.getElementById('d-data').textContent       = formatarData(i.dataInspecao);
    document.getElementById('d-tipo').textContent       = i.equipamento?.tipo || '—';
    document.getElementById('d-obs').textContent        = i.observacoes || 'Nenhuma observação registrada.';

    const resultado = i.aprovado === true ? 'aprovado' : i.aprovado === false ? 'reprovado' : 'pendente';
    const statusMap = {
        aprovado:  { dot: 'bg-green-500', text: 'Aprovado',  bg: 'bg-green-50 text-green-700' },
        reprovado: { dot: 'bg-red-500',   text: 'Reprovado', bg: 'bg-red-50 text-red-700' },
        pendente:  { dot: 'bg-amber-400', text: 'Pendente',  bg: 'bg-amber-50 text-amber-700' },
    };
    const s = statusMap[resultado];
    const banner = document.getElementById('d-resultado-banner');
    banner.className = `px-6 py-3 flex items-center gap-2 border-b border-gray-100 ${s.bg}`;
    document.getElementById('d-resultado-dot').className  = `w-2 h-2 rounded-full ${s.dot}`;
    document.getElementById('d-resultado-text').textContent = s.text;

    // Carrega itens do checklist
    const resItens = await apiFetch(`/inspecoes/${id}/itens`);
    if (resItens) {
        const itens = await resItens.json();
        const container = document.getElementById('d-checklist');
        if (!itens.length) {
            container.innerHTML = '<p class="text-gray-400 text-sm font-dm">Sem itens registrados.</p>';
        } else {
            container.innerHTML = itens.map(item => `
        <div class="flex items-center justify-between gap-3 px-3 py-2 rounded-lg ${item.resposta ? 'bg-green-50' : 'bg-red-50'}">
          <p class="text-gray-700 text-xs font-dm flex-1">${item.pergunta?.pergunta || '—'}</p>
          <span class="text-xs font-sora font-bold ${item.resposta ? 'text-green-600' : 'text-red-600'}">${item.resposta ? 'Sim' : 'Não'}</span>
        </div>
      `).join('');
        }
    }

    document.getElementById('drawer-backdrop').classList.add('open');
    document.getElementById('drawer').classList.add('open');
}

function closeDrawer() {
    document.getElementById('drawer-backdrop').classList.remove('open');
    document.getElementById('drawer').classList.remove('open');
    viewingId = null;
}

// ── Deletar ──────────────────────────────
async function deleteInspecao(id) {
    if (!confirm('Deseja realmente excluir esta inspeção?')) return;
    await apiFetch(`/inspecoes/${id}`, { method: 'DELETE' });
    await carregarInspecoes();
    if (viewingId === id) closeDrawer();
}

function deleteFromDrawer() {
    if (viewingId) deleteInspecao(viewingId);
}

// ── Carregar dados ───────────────────────
async function carregarInspecoes() {
    const res = await apiFetch('/inspecoes');
    if (!res) return;
    inspecoes = await res.json();
    renderTable();
}

async function carregarEquipamentos() {
    const res = await apiFetch('/equipamentos');
    if (!res) return;
    equipamentos = await res.json();
}

async function carregarUsuarios() {
    const res = await apiFetch('/usuarios/todos');
    if (!res) return;
    const lista = await res.json();
    const select = document.getElementById('f-responsavel');
    select.innerHTML = '<option value="">Usuário logado (padrão)</option>';
    lista.forEach(u => {
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

    await Promise.all([
        carregarInspecoes(),
        carregarEquipamentos(),
        carregarUsuarios(),
        carregarClientesFiltro(),
    ]);

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