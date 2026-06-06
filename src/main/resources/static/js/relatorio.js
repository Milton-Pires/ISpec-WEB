/* ═══════════════════════════════════════
   iSpec – Relatórios page logic
   ═══════════════════════════════════════ */

verificarAutenticacao();

let clientes = [];

// ── Carregar clientes ────────────────────
async function carregarClientes() {
  const res = await apiFetch('/clientes');
  if (!res) return;
  clientes = await res.json();
  const select = document.getElementById('sel-cliente');
  select.innerHTML = '<option value="">Selecione um cliente</option>';
  clientes.forEach(c => {
    select.innerHTML += `<option value="${c.id}">${c.razaoSocial} — ${c.cnpj || ''}</option>`;
  });
}

// ── Ao selecionar cliente ────────────────
function onClienteChange() {
  const id = document.getElementById('sel-cliente').value;
  const info = document.getElementById('cliente-info');

  if (!id) {
    info.classList.add('hidden');
    return;
  }

  const cliente = clientes.find(c => c.id == id);
  if (!cliente) return;

  document.getElementById('cliente-inicial').textContent = cliente.razaoSocial?.charAt(0).toUpperCase();
  document.getElementById('cliente-nome').textContent    = cliente.razaoSocial;
  document.getElementById('cliente-cnpj').textContent   = cliente.cnpj || '—';
  info.classList.remove('hidden');
}

// ── Atalhos de período ───────────────────
function setPeriodo(tipo) {
  const hoje = new Date();
  let inicio, fim;

  if (tipo === 'mes') {
    inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    fim    = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
  } else if (tipo === 'trimestre') {
    const mes = Math.floor(hoje.getMonth() / 3) * 3;
    inicio = new Date(hoje.getFullYear(), mes, 1);
    fim    = new Date(hoje.getFullYear(), mes + 3, 0);
  } else if (tipo === 'semestre') {
    const mes = hoje.getMonth() < 6 ? 0 : 6;
    inicio = new Date(hoje.getFullYear(), mes, 1);
    fim    = new Date(hoje.getFullYear(), mes + 6, 0);
  } else if (tipo === 'ano') {
    inicio = new Date(hoje.getFullYear(), 0, 1);
    fim    = new Date(hoje.getFullYear(), 11, 31);
  }

  document.getElementById('f-inicio').value = inicio.toISOString().split('T')[0];
  document.getElementById('f-fim').value    = fim.toISOString().split('T')[0];
}

// ── Exportar ─────────────────────────────
async function exportar(tipo, formato) {
  const clienteId = document.getElementById('sel-cliente').value;
  const inicio    = document.getElementById('f-inicio').value;
  const fim       = document.getElementById('f-fim').value;
  const msgErro   = document.getElementById('msg-erro');
  const msgInst   = document.getElementById('msg-instrucao');

  // Validações
  if (!clienteId) {
    mostrarErro('Selecione um cliente antes de exportar.');
    return;
  }
  if (!inicio || !fim) {
    mostrarErro('Defina o período (data início e data fim).');
    return;
  }
  if (inicio > fim) {
    mostrarErro('A data início não pode ser maior que a data fim.');
    return;
  }

  msgErro.classList.add('hidden');
  msgInst.classList.add('hidden');

  const url = `/relatorios/${tipo}/${formato}?clienteId=${clienteId}&inicio=${inicio}&fim=${fim}`;
  const token = getToken();

  try {
    const btn = event.currentTarget;
    const textoOriginal = btn.innerHTML;
    btn.classList.add('btn-loading');
    btn.innerHTML = `<svg class="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,.2)" stroke-width="3"/><path d="M12 2a10 10 0 0110 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg> Gerando...`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    btn.classList.remove('btn-loading');
    btn.innerHTML = textoOriginal;

    if (!response.ok) {
      mostrarErro('Erro ao gerar o relatório. Tente novamente.');
      return;
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    if (formato === 'pdf') {
      // Abre o PDF no navegador para imprimir/salvar
      window.open(blobUrl, '_blank');
    } else {
      // Faz download do Excel
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `relatorio-${tipo}-${inicio}-${fim}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    }

  } catch (err) {
    mostrarErro('Erro de conexão. Verifique se o servidor está rodando.');
  }
}

function mostrarErro(msg) {
  const msgErro = document.getElementById('msg-erro');
  document.getElementById('msg-erro-text').textContent = msg;
  msgErro.classList.remove('hidden');
  document.getElementById('msg-instrucao').classList.add('hidden');
  setTimeout(() => msgErro.classList.add('hidden'), 5000);
}

// ── Sidebar ──────────────────────────────
let sidebar, overlay, isMobile;

document.addEventListener('DOMContentLoaded', async () => {
  sidebar  = document.getElementById('sidebar');
  overlay  = document.getElementById('sidebar-overlay');
  isMobile = window.innerWidth < 1024;

  // Define período padrão: mês atual
  setPeriodo('mes');

  window.addEventListener('resize', () => {
    isMobile = window.innerWidth < 1024;
    if (!isMobile) {
      overlay?.classList.remove('show');
      sidebar?.classList.remove('mobile-open');
    }
  });

  await carregarClientes();
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