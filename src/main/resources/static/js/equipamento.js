/* ═══════════════════════════════════════
   iSpec – Equipamentos page logic
   ═══════════════════════════════════════ */

verificarAutenticacao();

let equipamentos = [];
let clientes     = [];
let activeFilterTipo   = 'todos';
let activeFilterStatus = 'todos';
let viewingId = null;

// ── Formatação de data ───────────────────
function formatarData(data) {
    if (!data) return '—';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

function estaVencido(dataValidade) {
    if (!dataValidade) return false;
    return new Date(dataValidade) < new Date();
}

// ── KPIs ────────────────────────────────
// Os KPIs sempre refletem o total geral de equipamentos,
// independente dos filtros ativos na tabela.
function updateKpis() {
    document.getElementById('kpi-total').textContent      = equipamentos.length;
    document.getElementById('kpi-manutencao').textContent = equipamentos.filter(e => e.status === 'EM_MANUTENCAO').length;
    document.getElementById('kpi-vencidos').textContent   = equipamentos.filter(e => e.status === 'VENCIDO').length;
}

// ── Filtros ──────────────────────────────
function setFilterTipo(tipo) {
    activeFilterTipo = tipo;
    document.querySelectorAll('.filter-tipo').forEach(btn => {
        const isActive = btn.dataset.tipo === tipo;
        btn.classList.toggle('bg-brand-red', isActive);
        btn.classList.toggle('text-white', isActive);
        btn.classList.toggle('bg-white', !isActive);
        btn.classList.toggle('border', !isActive);
        btn.classList.toggle('border-gray-200', !isActive);
        btn.classList.toggle('text-gray-600', !isActive);
    });
    renderTable();
}

function setFilterStatus(status) {
    activeFilterStatus = status;
    document.querySelectorAll('.filter-status').forEach(btn => {
        const isActive = btn.dataset.status === status;
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
    const tbody  = document.getElementById('equip-table');
    const empty  = document.getElementById('empty-state');

    const filtered = equipamentos.filter(e => {
        const tipo = e.tipo || e.tipoEquipamentoNome || '';
        const matchTipo   = activeFilterTipo === 'todos' || tipo === activeFilterTipo;
        const matchStatus = activeFilterStatus === 'todos' || e.status === activeFilterStatus;
        const matchSearch = !q
            || e.nome?.toLowerCase().includes(q)
            || e.numSerie?.toLowerCase().includes(q)
            || e.cliente?.razaoSocial?.toLowerCase().includes(q);
        return matchTipo && matchStatus && matchSearch;
    });

    const resultCount = document.getElementById('result-count');
    resultCount.textContent = filtered.length === equipamentos.length
        ? `${equipamentos.length} equipamentos`
        : `${filtered.length} de ${equipamentos.length}`;

    if (!filtered.length) {
        tbody.innerHTML = '';
        empty.classList.remove('hidden');
        empty.classList.add('flex');
        updateKpis(); // atualiza mesmo quando a tabela está vazia por filtro
        return;
    }

    empty.classList.add('hidden');
    empty.classList.remove('flex');

    tbody.innerHTML = filtered.map((e, i) => {
        const tipo        = e.tipo || 'Equipamento';
        const vencido     = estaVencido(e.dataValidade);
        const statusLabel = vencido ? 'vencido' : e.status?.toLowerCase() || 'ativo';
        const statusText  = statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1).replace('_', ' ');
        const locDesc     = e.localizacao
            ? [e.localizacao.bloco, e.localizacao.andar, e.localizacao.sala].filter(Boolean).join(' / ')
            : '—';

        return `
      <tr class="equip-row row-anim border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
          data-equip-id="${e.id}" style="animation-delay:${i * 0.04}s">
        <td class="px-5 py-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-brand-rose flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="#8B0012" stroke-width="2" stroke-linecap="round">
                <path d="M12 2l9 4v6c0 5-3.5 9.5-9 11C6.5 21.5 3 17 3 12V6l9-4z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="font-sora font-semibold text-gray-800 text-sm truncate max-w-[160px]">${e.nome}</p>
              <p class="text-gray-400 text-xs font-dm">${e.numSerie || '—'}</p>
            </div>
          </div>
        </td>
        <td class="px-5 py-4 hidden md:table-cell">
          <span class="px-2.5 py-1 rounded-full text-[11px] font-sora font-semibold type-${tipo.toLowerCase()}">${tipo}</span>
        </td>
        <td class="px-5 py-4 hidden lg:table-cell">
          <span class="text-gray-600 text-sm font-dm">${e.cliente?.razaoSocial || '—'}</span>
        </td>
        <td class="px-5 py-4 hidden lg:table-cell">
          <span class="text-gray-600 text-sm font-dm">${locDesc}</span>
        </td>
        <td class="px-5 py-4">
          <span class="px-2.5 py-1 rounded-full text-[11px] font-sora font-semibold badge-${statusLabel}">${statusText}</span>
        </td>
        <td class="px-5 py-4 hidden sm:table-cell">
          <span class="text-gray-600 text-sm font-dm ${vencido ? 'text-red-500 font-semibold' : ''}">${formatarData(e.dataValidade)}</span>
        </td>
        <td class="px-5 py-4">
          <div class="flex items-center gap-1">
            <button type="button" class="w-8 h-8 rounded-lg hover:bg-brand-rose flex items-center justify-center transition-colors" title="Visualizar" data-action="view" data-id="${e.id}">
              <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            <button type="button" class="w-8 h-8 rounded-lg hover:bg-brand-rose flex items-center justify-center transition-colors" title="Editar" data-action="edit" data-id="${e.id}">
              <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button type="button" class="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors" title="Excluir" data-action="delete" data-id="${e.id}">
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
            if (action === 'edit')   openModalEdit(id);
            if (action === 'delete') deleteEquipamento(id);
        };
    });

    document.querySelectorAll('.equip-row').forEach(row => {
        row.onclick = () => openDrawer(parseInt(row.dataset.equipId, 10));
    });
}

// ── Modal ────────────────────────────────
function openModal() {
    document.getElementById('modal-title').textContent = 'Novo Equipamento';
    document.getElementById('equip-form').reset();
    document.getElementById('edit-id').value = '';
    ocultarCamposEspecificos();

    // Esconde o campo de status — não faz sentido na criação
    document.getElementById('campo-status').classList.add('hidden');

    carregarClientesSelect();
    document.getElementById('modal').classList.add('open');
}

function openModalEdit(id) {
    const e = equipamentos.find(x => x.id === id);
    if (!e) return;

    document.getElementById('modal-title').textContent = 'Editar Equipamento';
    document.getElementById('edit-id').value           = e.id;
    document.getElementById('f-nome').value            = e.nome        || '';
    document.getElementById('f-num-serie').value       = e.numSerie    || '';
    document.getElementById('f-dt-instalacao').value   = e.dataInstalacao || '';
    document.getElementById('f-dt-validade').value     = e.dataValidade   || '';

    // Exibe e preenche o campo de status na edição
    document.getElementById('campo-status').classList.remove('hidden');
    document.getElementById('f-status').value = e.status || 'ATIVO';

    const tipo = e.tipo || '';
    document.getElementById('f-tipo').value = tipo;
    onTipoChange();

    carregarClientesSelect().then(() => {
        if (e.cliente) {
            document.getElementById('f-cliente').value = e.cliente.id;
            carregarLocalizacoesSelect(e.cliente.id).then(() => {
                if (e.localizacao) document.getElementById('f-localizacao').value = e.localizacao.id;
            });
        }
    });

    document.getElementById('modal').classList.add('open');
}

function closeModal() {
    document.getElementById('modal').classList.remove('open');
}

function handleBackdropClick(ev) {
    if (ev.target === document.getElementById('modal')) closeModal();
}

// ── Campos específicos por tipo ──────────
function onTipoChange() {
    const tipo = document.getElementById('f-tipo').value;
    ocultarCamposEspecificos();
    if (tipo === 'Extintor') {
        document.getElementById('campos-extintor').classList.remove('hidden');
        carregarAgentesSelect();
        carregarTiposEquipSelect('Extintor');
    } else if (tipo === 'Alarme') {
        document.getElementById('campos-alarme').classList.remove('hidden');
        carregarSensoresSelect();
        carregarTiposEquipSelect('Alarme');
    } else if (tipo === 'Hidrante') {
        document.getElementById('campos-hidrante').classList.remove('hidden');
        carregarTiposEquipSelect('Hidrante');
    }
}

function ocultarCamposEspecificos() {
    document.getElementById('campos-extintor').classList.add('hidden');
    document.getElementById('campos-alarme').classList.add('hidden');
    document.getElementById('campos-hidrante').classList.add('hidden');
}

// ── Selects dinâmicos ────────────────────
async function carregarClientesSelect() {
    const res = await apiFetch('/clientes');
    if (!res) return;
    clientes = await res.json();
    const select = document.getElementById('f-cliente');
    select.innerHTML = '<option value="">Selecione o cliente</option>';
    clientes.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.razaoSocial} — ${c.cnpj || ''}</option>`;
    });
    select.onchange = () => carregarLocalizacoesSelect(select.value);
}

async function carregarLocalizacoesSelect(clienteId) {
    const select = document.getElementById('f-localizacao');
    select.innerHTML = '<option value="">Selecione a localização</option>';
    if (!clienteId) return;
    const res = await apiFetch(`/localizacoes`);
    if (!res) return;
    const todas = await res.json();
    const filtradas = todas.filter(l => l.cliente?.id == clienteId);
    if (!filtradas.length) {
        select.innerHTML = '<option value="">Nenhuma localização cadastrada</option>';
        return;
    }
    filtradas.forEach(l => {
        const desc = [l.bloco, l.andar, l.sala].filter(Boolean).join(' / ') || `Localização ${l.id}`;
        select.innerHTML += `<option value="${l.id}">${desc}</option>`;
    });
}

async function carregarTiposEquipSelect(filtro) {
    const res = await apiFetch('/tipos-equipamento');
    if (!res) return;
    const tipos = await res.json();
    const select = document.getElementById('f-tipo-equip');
    select.innerHTML = '<option value="">Selecione o tipo</option>';
    tipos.forEach(t => {
        select.innerHTML += `<option value="${t.id}">${t.descTipo}</option>`;
    });
}

async function carregarAgentesSelect() {
    const res = await apiFetch('/agentes-extintor');
    if (!res) return;
    const agentes = await res.json();
    const select = document.getElementById('f-agente');
    select.innerHTML = '<option value="">Selecione o agente</option>';
    agentes.forEach(a => {
        select.innerHTML += `<option value="${a.id}">${a.descAgente}</option>`;
    });
}

async function carregarSensoresSelect() {
    const res = await apiFetch('/tipos-sensor');
    if (!res) return;
    const sensores = await res.json();
    const select = document.getElementById('f-sensor');
    select.innerHTML = '<option value="">Selecione o sensor</option>';
    sensores.forEach(s => {
        select.innerHTML += `<option value="${s.id}">${s.descSensor}</option>`;
    });
}

// ── Salvar equipamento ───────────────────
async function saveEquipamento(ev) {
    ev.preventDefault();
    const editId = document.getElementById('edit-id').value;
    const tipo   = document.getElementById('f-tipo').value;

    const base = {
        tipo,
        nome:            document.getElementById('f-nome').value.trim(),
        numSerie:        document.getElementById('f-num-serie').value.trim(),
        dataInstalacao:  document.getElementById('f-dt-instalacao').value || null,
        dataValidade:    document.getElementById('f-dt-validade').value   || null,
        tipoEquipamento: { id: parseInt(document.getElementById('f-tipo-equip').value) },
        cliente:         { id: parseInt(document.getElementById('f-cliente').value) },
        localizacao:     { id: parseInt(document.getElementById('f-localizacao').value) },
    };

    let data = { ...base };

    if (tipo === 'Extintor') {
        data.capacidade = parseFloat(document.getElementById('f-capacidade').value) || null;
        data.pressao    = parseFloat(document.getElementById('f-pressao').value)    || null;
        const agenteId  = document.getElementById('f-agente').value;
        if (agenteId) data.agente = { id: parseInt(agenteId) };
    } else if (tipo === 'Alarme') {
        data.funcionando        = document.getElementById('f-funcionando').checked;
        data.ultimaVerificacao  = document.getElementById('f-ultima-verificacao').value || null;
        const sensorId          = document.getElementById('f-sensor').value;
        if (sensorId) data.tipoSensor = { id: parseInt(sensorId) };
    } else if (tipo === 'Hidrante') {
        data.pressaoAgua          = parseFloat(document.getElementById('f-pressao-agua').value)          || null;
        data.comprimentoMangueira = parseFloat(document.getElementById('f-comprimento-mangueira').value) || null;
    }

    // Salva os dados do equipamento (POST ou PUT)
    const response = editId
        ? await apiFetch(`/equipamentos/${editId}`, { method: 'PUT', body: JSON.stringify(data) })
        : await apiFetch('/equipamentos', { method: 'POST', body: JSON.stringify(data) });

    if (!response) return;

    if (!response.ok) {
        const erro = await response.text();
        alert(erro);
        return;
    }

    // Se for edição, envia a mudança de status separadamente via PATCH
    // O backend recalcula o status automaticamente no GET, mas aqui
    // respeitamos a escolha manual do usuário
    if (editId) {
        const status = document.getElementById('f-status').value;
        await apiFetch(`/equipamentos/${editId}/status?status=${status}`, { method: 'PATCH' });
    }

    closeModal();
    await carregarEquipamentos();
}

// ── Drawer ───────────────────────────────
function openDrawer(id) {
    const e = equipamentos.find(x => x.id === id);
    if (!e) return;
    viewingId = id;

    const tipo    = e.tipo || 'Equipamento';
    const vencido = estaVencido(e.dataValidade);
    const statusLabel = vencido ? 'vencido' : e.status?.toLowerCase() || 'ativo';
    const locDesc = e.localizacao
        ? [e.localizacao.bloco, e.localizacao.andar, e.localizacao.sala].filter(Boolean).join(' / ')
        : '—';

    document.getElementById('d-nome').textContent          = e.nome      || '—';
    document.getElementById('d-num-serie').textContent     = e.numSerie  || 'Sem nº de série';
    document.getElementById('d-tipo').textContent          = tipo;
    document.getElementById('d-cliente').textContent       = e.cliente?.razaoSocial || '—';
    document.getElementById('d-localizacao').textContent   = locDesc;
    document.getElementById('d-dt-instalacao').textContent = formatarData(e.dataInstalacao);
    document.getElementById('d-dt-validade').textContent   = formatarData(e.dataValidade);

    const statusMap = {
        ativo:         { dot: 'bg-green-500', text: 'Ativo',           bg: 'bg-green-50 text-green-700' },
        inativo:       { dot: 'bg-gray-400',  text: 'Inativo',         bg: 'bg-gray-50 text-gray-700' },
        vencido:       { dot: 'bg-red-500',   text: 'Vencido',         bg: 'bg-red-50 text-red-700' },
        em_manutencao: { dot: 'bg-yellow-500',text: 'Em Manutenção',   bg: 'bg-yellow-50 text-yellow-700' },
    };
    const s = statusMap[statusLabel] || statusMap.ativo;
    const banner = document.getElementById('d-status-banner');
    banner.className = `px-6 py-3 flex items-center gap-2 border-b border-gray-100 ${s.bg}`;
    document.getElementById('d-status-dot').className   = `w-2 h-2 rounded-full ${s.dot}`;
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

// ── Deletar ──────────────────────────────
async function deleteEquipamento(id) {
    if (!confirm('Deseja realmente excluir este equipamento?')) return;
    await apiFetch(`/equipamentos/${id}`, { method: 'DELETE' });
    await carregarEquipamentos();
    if (viewingId === id) closeDrawer();
}

function deleteFromDrawer() {
    if (viewingId) deleteEquipamento(viewingId);
}

// ── Carregar equipamentos da API ─────────
async function carregarEquipamentos() {
    const res = await apiFetch('/equipamentos');
    if (!res) return;
    equipamentos = await res.json();
    renderTable();
}

// ── Sidebar ──────────────────────────────
let sidebar, overlay, isMobile;

document.addEventListener('DOMContentLoaded', () => {
    sidebar  = document.getElementById('sidebar');
    overlay  = document.getElementById('sidebar-overlay');
    isMobile = window.innerWidth < 1024;

    const dateEl = document.getElementById('topbar-date');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('pt-BR', {
            weekday: 'short', day: 'numeric', month: 'short'
        });
    }

    window.addEventListener('resize', () => {
        isMobile = window.innerWidth < 1024;
        if (!isMobile) {
            overlay?.classList.remove('show');
            sidebar?.classList.remove('mobile-open');
        }
    });

    carregarEquipamentos();
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