import { API } from '../api.js';
import { Auth, toast } from '../auth.js';
import { navigate } from '../router.js';

const STATUS_MAP = {
  1: { label: 'Aguardando', class: 'badge-gray' },
  2: { label: 'Pendente', class: 'badge-warning' },
  3: { label: 'Aprovado', class: 'badge-info' },
  4: { label: 'Coletado', class: 'badge-info' },
  5: { label: 'Em Trânsito', class: 'badge-info' },
  6: { label: 'Entregue', class: 'badge-success' },
  7: { label: 'Recusado', class: 'badge-danger' },
  8: { label: 'Cancelado', class: 'badge-danger' },
  9: { label: 'Finalizado', class: 'badge-success' },
};

function statusBadge(statusId) {
  const s = STATUS_MAP[statusId] || { label: `Status ${statusId}`, class: 'badge-gray' };
  return `<span class="badge ${s.class}">${s.label}</span>`;
}

export function renderPainel(app) {
  const admin = Auth.getAdmin();
  const adminName = admin?.name || admin?.email || 'Admin';

  app.innerHTML = `
    <div class="painel-layout">
      <div class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <div class="logo-icon">📦</div>
          <span>Troque Rápido</span>
        </div>
        <nav class="sidebar-nav">
          <div class="nav-item active" data-tab="dashboard"><span class="icon">📊</span> Dashboard</div>
          <div class="nav-item" data-tab="requests"><span class="icon">🔄</span> Solicitações</div>
          <div class="nav-item" data-tab="reasons"><span class="icon">📝</span> Motivos</div>
          <div class="nav-item" data-tab="plans"><span class="icon">💳</span> Planos</div>
          <div class="nav-item" data-tab="settings"><span class="icon">⚙️</span> Configurações</div>
        </nav>
        <div class="sidebar-footer">
          <div class="user-info">
            <strong>${adminName}</strong>
            <a href="#" onclick="return false" id="logout-btn" style="color:var(--gray-400);font-size:0.82rem">Sair</a>
          </div>
        </div>
      </div>
      <div class="painel-main">
        <button class="menu-toggle" id="menu-toggle">☰</button>
        <div id="painel-content"></div>
      </div>
    </div>
  `;

  // Sidebar interactions
  document.getElementById('logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    Auth.logout();
    toast('Sessão encerrada', 'info');
  });

  document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  const navItems = document.querySelectorAll('.nav-item[data-tab]');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      loadTab(item.dataset.tab);
      document.getElementById('sidebar').classList.remove('open');
    });
  });

  loadTab('dashboard');
}

async function loadTab(tab) {
  const content = document.getElementById('painel-content');
  content.innerHTML = '<div class="loading"><div class="spinner"></div>Carregando...</div>';
  try {
    switch (tab) {
      case 'dashboard': await loadDashboard(content); break;
      case 'requests': await loadRequests(content); break;
      case 'reasons': await loadReasons(content); break;
      case 'plans': await loadPlans(content); break;
      case 'settings': await loadSettings(content); break;
    }
  } catch (err) {
    content.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>${err.message || 'Erro ao carregar dados'}</p></div>`;
  }
}

// ===== Dashboard =====
async function loadDashboard(content) {
  content.innerHTML = `
    <div class="painel-header"><h1>Dashboard</h1></div>
    <div class="stats-grid" id="stats-grid">
      <div class="loading"><div class="spinner"></div></div>
    </div>
    <div class="card" style="margin-top:24px">
      <div class="card-header"><h3>Solicitações Recentes</h3></div>
      <div id="recent-requests"><div class="loading"><div class="spinner"></div></div></div>
    </div>
  `;

  try {
    const requests = await API.getRequests(5, 0);
    const list = requests?.data || requests?.requests || requests || [];
    const arr = Array.isArray(list) ? list : [];

    document.getElementById('stats-grid').innerHTML = `
      <div class="stat-card">
        <div class="stat-icon" style="background:var(--primary-100)">🔄</div>
        <div class="stat-value">${arr.length}</div>
        <div class="stat-label">Solicitações Recentes</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:var(--success-light)">✅</div>
        <div class="stat-value">${arr.filter(r => r.status_id >= 6 && r.status_id <= 9).length}</div>
        <div class="stat-label">Finalizadas</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:var(--warning-light)">⏳</div>
        <div class="stat-value">${arr.filter(r => r.status_id >= 1 && r.status_id <= 5).length}</div>
        <div class="stat-label">Em Andamento</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:var(--danger-light)">❌</div>
        <div class="stat-value">${arr.filter(r => r.status_id >= 7 && r.status_id <= 8).length}</div>
        <div class="stat-label">Recusadas/Canceladas</div>
      </div>
    `;

    const recentEl = document.getElementById('recent-requests');
    if (arr.length === 0) {
      recentEl.innerHTML = '<div class="empty-state"><div class="icon">📭</div><p>Nenhuma solicitação encontrada</p></div>';
    } else {
      recentEl.innerHTML = `
        <div class="table-container">
          <table>
            <thead><tr><th>ID</th><th>Motivo</th><th>Cliente</th><th>Status</th><th>Data</th></tr></thead>
            <tbody>
              ${arr.map(r => `
                <tr style="cursor:pointer" onclick="window._viewRequest(${r.id})">
                  <td>#${r.id}</td>
                  <td>${r.reason || '-'}</td>
                  <td>${r.customer?.name || r.customer_name || '-'}</td>
                  <td>${statusBadge(r.status_id)}</td>
                  <td>${r.created_at ? new Date(r.created_at).toLocaleDateString('pt-BR') : '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  } catch (err) {
    document.getElementById('stats-grid').innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

// ===== Requests =====
let reqState = { limit: 10, offset: 0, status: '', search: '' };

async function loadRequests(content) {
  content.innerHTML = `
    <div class="painel-header"><h1>Solicitações de Logística</h1></div>
    <div class="toolbar">
      <input type="text" class="form-control search-box" id="req-search" placeholder="Buscar por motivo, cliente..." value="${reqState.search}" />
      <select class="form-control" id="req-status">
        <option value="">Todos os status</option>
        ${Object.entries(STATUS_MAP).map(([k, v]) => `<option value="${k}" ${reqState.status == k ? 'selected' : ''}>${v.label}</option>`).join('')}
      </select>
      <button class="btn btn-primary btn-sm" id="req-search-btn">Buscar</button>
    </div>
    <div class="card">
      <div id="req-table"><div class="loading"><div class="spinner"></div></div></div>
    </div>
  `;

  document.getElementById('req-search-btn').addEventListener('click', () => {
    reqState.search = document.getElementById('req-search').value;
    reqState.status = document.getElementById('req-status').value;
    reqState.offset = 0;
    fetchRequests();
  });

  document.getElementById('req-search').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('req-search-btn').click();
  });

  fetchRequests();
}

async function fetchRequests() {
  const el = document.getElementById('req-table');
  el.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  try {
    const res = await API.getRequests(reqState.limit, reqState.offset, reqState.status, reqState.search);
    const list = res?.data || res?.requests || res || [];
    const arr = Array.isArray(list) ? list : [];
    const total = res?.total || res?.count || arr.length;

    if (arr.length === 0) {
      el.innerHTML = '<div class="empty-state"><div class="icon">📭</div><p>Nenhuma solicitação encontrada</p></div>';
      return;
    }

    el.innerHTML = `
      <div class="table-container">
        <table>
          <thead><tr><th>ID</th><th>Motivo</th><th>Cliente</th><th>Status</th><th>Coleta</th><th>Data</th><th>Ações</th></tr></thead>
          <tbody>
            ${arr.map(r => `
              <tr>
                <td>#${r.id}</td>
                <td>${r.reason || '-'}</td>
                <td>${r.customer?.name || r.customer_name || '-'}</td>
                <td>${statusBadge(r.status_id)}</td>
                <td>${r.collect_number || '-'}</td>
                <td>${r.created_at ? new Date(r.created_at).toLocaleDateString('pt-BR') : '-'}</td>
                <td><button class="btn btn-outline btn-sm" onclick="window._viewRequest(${r.id})">Ver</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <div class="pagination-info">Mostrando ${reqState.offset + 1}–${reqState.offset + arr.length} de ${total}</div>
        <div class="pagination-controls">
          <button ${reqState.offset === 0 ? 'disabled' : ''} id="prev-page">← Anterior</button>
          <button ${reqState.offset + reqState.limit >= total ? 'disabled' : ''} id="next-page">Próxima →</button>
        </div>
      </div>
    `;

    document.getElementById('prev-page')?.addEventListener('click', () => { reqState.offset = Math.max(0, reqState.offset - reqState.limit); fetchRequests(); });
    document.getElementById('next-page')?.addEventListener('click', () => { reqState.offset += reqState.limit; fetchRequests(); });
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

// Request detail modal
window._viewRequest = async (id) => {
  try {
    const r = await API.getRequest(id);
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>Solicitação #${r.id}</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="detail-row"><span class="label">Motivo</span><span class="value">${r.reason || '-'}</span></div>
          <div class="detail-row"><span class="label">Observação</span><span class="value">${r.observation || '-'}</span></div>
          <div class="detail-row"><span class="label">Status</span><span class="value">${statusBadge(r.status_id)}</span></div>
          <div class="detail-row"><span class="label">Número de Coleta</span><span class="value">${r.collect_number || '-'}</span></div>
          <div class="detail-row"><span class="label">Código de Serviço</span><span class="value">${r.service_code || '-'}</span></div>
          <div class="detail-row"><span class="label">Caixas</span><span class="value">${r.boxes || '-'}</span></div>
          <div class="detail-row"><span class="label">Cliente</span><span class="value">${r.customer?.name || '-'}</span></div>
          <div class="detail-row"><span class="label">E-mail do Cliente</span><span class="value">${r.customer?.email || '-'}</span></div>
          <div class="detail-row"><span class="label">Telefone</span><span class="value">${r.customer?.phone || '-'}</span></div>
          <div class="detail-row"><span class="label">Endereço</span><span class="value">${r.address ? `${r.address.street}, ${r.address.number} - ${r.address.city}/${r.address.state}` : '-'}</span></div>
          <div class="detail-row"><span class="label">Data</span><span class="value">${r.created_at ? new Date(r.created_at).toLocaleString('pt-BR') : '-'}</span></div>
        </div>
        <div class="modal-footer">
          ${r.status_id <= 2 ? `<button class="btn btn-danger btn-sm" id="reject-btn">Recusar</button>` : ''}
          ${r.status_id <= 3 ? `<button class="btn btn-success btn-sm" id="approve-btn">Aprovar</button>` : ''}
          <button class="btn btn-secondary btn-sm" onclick="this.closest('.modal-overlay').remove()">Fechar</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    const approveBtn = overlay.querySelector('#approve-btn');
    if (approveBtn) {
      approveBtn.addEventListener('click', async () => {
        try {
          await API.updateStatus({ id: r.id, adminId: Auth.getAdmin()?.id, statusId: 3, voucher: '' });
          toast('Solicitação aprovada!', 'success');
          overlay.remove();
          fetchRequests();
        } catch (err) { toast(err.message, 'error'); }
      });
    }

    const rejectBtn = overlay.querySelector('#reject-btn');
    if (rejectBtn) {
      rejectBtn.addEventListener('click', async () => {
        try {
          await API.rejectRequest(r.id);
          toast('Solicitação recusada', 'info');
          overlay.remove();
          fetchRequests();
        } catch (err) { toast(err.message, 'error'); }
      });
    }
  } catch (err) {
    toast(err.message, 'error');
  }
};

// ===== Reasons =====
async function loadReasons(content) {
  content.innerHTML = `
    <div class="painel-header">
      <h1>Motivos de Devolução</h1>
      <button class="btn btn-primary btn-sm" id="add-reason-btn">+ Novo Motivo</button>
    </div>
    <div class="card"><div id="reasons-list"><div class="loading"><div class="spinner"></div></div></div></div>
  `;

  document.getElementById('add-reason-btn').addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header"><h3>Novo Motivo</h3><button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button></div>
        <div class="modal-body">
          <div class="form-group"><label>Nome do Motivo</label><input type="text" class="form-control" id="reason-name" placeholder="Ex: Produto com defeito" /></div>
          <div class="form-group"><label>Ativo para clientes</label><select class="form-control" id="reason-check"><option value="true">Sim</option><option value="false">Não</option></select></div>
        </div>
        <div class="modal-footer"><button class="btn btn-primary btn-sm" id="save-reason">Salvar</button><button class="btn btn-secondary btn-sm" onclick="this.closest('.modal-overlay').remove()">Cancelar</button></div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    document.getElementById('save-reason').addEventListener('click', async () => {
      const name = document.getElementById('reason-name').value;
      if (!name) return toast('Informe o nome do motivo', 'error');
      try {
        await API.createReason({ name, check: document.getElementById('reason-check').value === 'true' });
        toast('Motivo criado!', 'success');
        overlay.remove();
        loadReasons(content);
      } catch (err) { toast(err.message, 'error'); }
    });
  });

  fetchReasons();
}

async function fetchReasons() {
  const el = document.getElementById('reasons-list');
  el.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  try {
    const res = await API.getReasons();
    const arr = Array.isArray(res) ? res : (res?.data || []);
    if (arr.length === 0) {
      el.innerHTML = '<div class="empty-state"><div class="icon">📝</div><p>Nenhum motivo cadastrado</p></div>';
      return;
    }
    el.innerHTML = `
      <div class="table-container">
        <table>
          <thead><tr><th>ID</th><th>Motivo</th><th>Ativo</th><th>Ações</th></tr></thead>
          <tbody>
            ${arr.map(r => `
              <tr>
                <td>#${r.id}</td>
                <td>${r.name}</td>
                <td>${r.check ? '<span class="badge badge-success">Sim</span>' : '<span class="badge badge-gray">Não</span>'}</td>
                <td><button class="btn btn-danger btn-sm" onclick="window._delReason(${r.id})">Excluir</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

window._delReason = async (id) => {
  if (!confirm('Excluir este motivo?')) return;
  try {
    await API.deleteReason(id);
    toast('Motivo excluído', 'info');
    fetchReasons();
  } catch (err) { toast(err.message, 'error'); }
};

// ===== Plans =====
async function loadPlans(content) {
  content.innerHTML = `
    <div class="painel-header">
      <h1>Planos</h1>
      <button class="btn btn-primary btn-sm" id="add-plan-btn">+ Novo Plano</button>
    </div>
    <div class="card"><div id="plans-list"><div class="loading"><div class="spinner"></div></div></div></div>
  `;

  document.getElementById('add-plan-btn').addEventListener('click', () => showPlanModal());
  fetchPlans();
}

async function fetchPlans() {
  const el = document.getElementById('plans-list');
  el.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  try {
    const res = await API.getPlans(0, 50);
    const arr = Array.isArray(res) ? res : (res?.data || []);
    if (arr.length === 0) {
      el.innerHTML = '<div class="empty-state"><div class="icon">💳</div><p>Nenhum plano cadastrado</p></div>';
      return;
    }
    el.innerHTML = `
      <div class="table-container">
        <table>
          <thead><tr><th>ID</th><th>Nome</th><th>Limite</th><th>Preço</th><th>Plataforma</th><th>Visível</th><th>Ações</th></tr></thead>
          <tbody>
            ${arr.map(p => `
              <tr>
                <td>#${p.id}</td>
                <td>${p.name}</td>
                <td>${p.limit_logistics}</td>
                <td>R$ ${Number(p.price).toFixed(2)}</td>
                <td>${p.platform || '-'}</td>
                <td>${p.is_visible ? '<span class="badge badge-success">Sim</span>' : '<span class="badge badge-gray">Não</span>'}</td>
                <td>
                  <button class="btn btn-outline btn-sm" onclick="window._editPlan(${p.id})">Editar</button>
                  <button class="btn btn-danger btn-sm" onclick="window._delPlan(${p.id})">Excluir</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

function showPlanModal(plan = null) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header"><h3>${plan ? 'Editar Plano' : 'Novo Plano'}</h3><button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button></div>
      <div class="modal-body">
        <div class="form-group"><label>Nome</label><input type="text" class="form-control" id="plan-name" value="${plan?.name || ''}" /></div>
        <div class="form-row">
          <div class="form-group"><label>Limite de Solicitações</label><input type="number" class="form-control" id="plan-limit" value="${plan?.limit_logistics || ''}" /></div>
          <div class="form-group"><label>Preço (R$)</label><input type="number" step="0.01" class="form-control" id="plan-price" value="${plan?.price || ''}" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Plataforma</label><input type="text" class="form-control" id="plan-platform" value="${plan?.platform || ''}" placeholder="nuvemshop, bling..." /></div>
          <div class="form-group"><label>Visível</label><select class="form-control" id="plan-visible"><option value="true" ${plan?.is_visible ? 'selected' : ''}>Sim</option><option value="false" ${plan && !plan.is_visible ? 'selected' : ''}>Não</option></select></div>
        </div>
        <div class="form-group"><label>Link Vindi</label><input type="text" class="form-control" id="plan-vindi" value="${plan?.link_vindi || ''}" /></div>
      </div>
      <div class="modal-footer"><button class="btn btn-primary btn-sm" id="save-plan">Salvar</button><button class="btn btn-secondary btn-sm" onclick="this.closest('.modal-overlay').remove()">Cancelar</button></div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  document.getElementById('save-plan').addEventListener('click', async () => {
    const data = {
      name: document.getElementById('plan-name').value,
      limit_logistics: parseInt(document.getElementById('plan-limit').value) || 0,
      price: parseFloat(document.getElementById('plan-price').value) || 0,
      platform: document.getElementById('plan-platform').value,
      is_visible: document.getElementById('plan-visible').value === 'true',
      link_vindi: document.getElementById('plan-vindi').value,
    };
    if (plan) data.id = plan.id;
    try {
      if (plan) await API.updatePlan(data); else await API.createPlan(data);
      toast('Plano salvo!', 'success');
      overlay.remove();
      fetchPlans();
    } catch (err) { toast(err.message, 'error'); }
  });
}

window._editPlan = async (id) => {
  try {
    const plan = await API.getPlan(id);
    showPlanModal(plan);
  } catch (err) { toast(err.message, 'error'); }
};

window._delPlan = async (id) => {
  if (!confirm('Excluir este plano?')) return;
  try { await API.deletePlan(id); toast('Plano excluído', 'info'); fetchPlans(); }
  catch (err) { toast(err.message, 'error'); }
};

// ===== Settings =====
async function loadSettings(content) {
  content.innerHTML = `
    <div class="painel-header"><h1>Configurações</h1></div>
    <div class="tab-nav">
      <button class="active" data-settings-tab="address">Endereço</button>
      <button data-settings-tab="message">Mensagens</button>
      <button data-settings-tab="shipping">Transportadoras</button>
    </div>
    <div id="settings-content"></div>
  `;

  const tabs = content.querySelectorAll('[data-settings-tab]');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    loadSettingsTab(t.dataset.settingsTab);
  }));

  loadSettingsTab('address');
}

async function loadSettingsTab(tab) {
  const el = document.getElementById('settings-content');
  el.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

  if (tab === 'address') {
    try {
      let addr = null;
      try { addr = await API.getAddress(); } catch {}
      el.innerHTML = `
        <div class="card"><div class="card-body">
          <form id="addr-form">
            <div class="form-row">
              <div class="form-group" style="flex:2"><label>Rua</label><input type="text" class="form-control" name="street" value="${addr?.street || ''}" required /></div>
              <div class="form-group" style="flex:1"><label>Número</label><input type="text" class="form-control" name="number" value="${addr?.number || ''}" required /></div>
            </div>
            <div class="form-group"><label>Bairro</label><input type="text" class="form-control" name="neighborhood" value="${addr?.neighborhood || ''}" required /></div>
            <div class="form-row">
              <div class="form-group" style="flex:2"><label>Cidade</label><input type="text" class="form-control" name="city" value="${addr?.city || ''}" required /></div>
              <div class="form-group" style="flex:1"><label>Estado</label><input type="text" class="form-control" name="state" value="${addr?.state || ''}" maxlength="2" required /></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Complemento</label><input type="text" class="form-control" name="complement" value="${addr?.complement || ''}" /></div>
              <div class="form-group"><label>CEP</label><input type="text" class="form-control" name="zipcode" value="${addr?.zipcode || ''}" required /></div>
            </div>
            <button type="submit" class="btn btn-primary btn-sm">Salvar Endereço</button>
          </form>
        </div></div>
      `;
      document.getElementById('addr-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        try {
          if (addr) await API.updateAddress(data); else await API.createAddress(data);
          toast('Endereço salvo!', 'success');
        } catch (err) { toast(err.message, 'error'); }
      });
    } catch (err) {
      el.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
    }
  } else if (tab === 'message') {
    try {
      let msg = null;
      try { msg = await API.getMessageAdmin(); } catch {}
      el.innerHTML = `
        <div class="card"><div class="card-body">
          <form id="msg-form">
            <div class="form-group"><label>Mensagem de Sucesso de Solicitação</label>
              <textarea class="form-control" name="solicitation_success_message" rows="4" placeholder="Mensagem exibida ao cliente após solicitar devolução">${msg?.solicitation_success_message || ''}</textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-sm">Salvar Mensagem</button>
          </form>
        </div></div>
      `;
      document.getElementById('msg-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        try { await API.updateMessage(data); toast('Mensagem salva!', 'success'); }
        catch (err) { toast(err.message, 'error'); }
      });
    } catch (err) {
      el.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
    }
  } else if (tab === 'shipping') {
    try {
      const res = await API.getShippingServices();
      const arr = Array.isArray(res) ? res : (res?.data || []);
      el.innerHTML = `
        <div class="card"><div class="card-body">
          <p style="color:var(--gray-500);margin-bottom:16px;font-size:0.88rem">Transportadoras configuradas para coleta.</p>
          ${arr.length === 0
            ? '<div class="empty-state"><div class="icon">🚚</div><p>Nenhuma transportadora configurada</p></div>'
            : `<div class="table-container"><table><thead><tr><th>Transportadora</th><th>Estados</th></tr></thead><tbody>
              ${arr.map(s => `<tr><td>${s.name}</td><td>${Array.isArray(s.state) ? s.state.join(', ') : s.state || '-'}</td></tr>`).join('')}
            </tbody></table></div>`
          }
        </div></div>
      `;
    } catch (err) {
      el.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
    }
  }
}
