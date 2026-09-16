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

function statusBadge(id) {
  const s = STATUS_MAP[id] || { label: `Status ${id}`, class: 'badge-gray' };
  return `<span class="badge ${s.class}">${s.label}</span>`;
}

function openModal(title, bodyHtml, footerHtml = '') {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header"><h3>${title}</h3><button class="modal-close" id="modal-x">&times;</button></div>
      <div class="modal-body">${bodyHtml}</div>
      ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
    </div>`;
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.getElementById('modal-x').addEventListener('click', close);
  return { overlay, close };
}

export function renderLojista(app) {
  if (!Auth.isAuthenticated()) {
    navigate('/login');
    return;
  }

  const admin = Auth.getAdmin();
  const storeName = admin?.name || admin?.store_name || 'Minha Loja';

  app.innerHTML = `
    <div class="painel-layout">
      <div class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <div class="logo-icon">🏬</div>
          <span>Área do Lojista</span>
        </div>
        <nav class="sidebar-nav">
          <div class="nav-item active" data-ltab="dashboard"><span class="icon">📊</span> Dashboard</div>
          <div class="nav-item" data-ltab="requests"><span class="icon">🔄</span> Solicitações</div>
          <div class="nav-item" data-ltab="ranking"><span class="icon">🏆</span> Ranking de Produtos</div>
          <div class="nav-item" data-ltab="reasons"><span class="icon">📝</span> Motivos de Devolução</div>
          <div class="nav-item" data-ltab="messages"><span class="icon">💬</span> Mensagens</div>
          <div class="nav-item" data-ltab="settings"><span class="icon">⚙️</span> Configurações</div>
        </nav>
        <div class="sidebar-footer">
          <div class="user-info">
            <strong>${storeName}</strong>
            <a href="#" onclick="return false" id="lojista-logout" style="color:var(--gray-400);font-size:0.82rem">Sair</a>
          </div>
        </div>
      </div>
      <div class="painel-main">
        <button class="menu-toggle" id="lojista-menu-toggle">☰</button>
        <div id="lojista-content"></div>
      </div>
    </div>
  `;

  document.getElementById('lojista-logout').addEventListener('click', (e) => {
    e.preventDefault();
    Auth.logout();
    toast('Sessão encerrada', 'info');
  });

  document.getElementById('lojista-menu-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  const navItems = app.querySelectorAll('.nav-item[data-ltab]');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      loadLojistaTab(item.dataset.ltab);
      document.getElementById('sidebar').classList.remove('open');
    });
  });

  loadLojistaTab('dashboard');
}

async function loadLojistaTab(tab) {
  const content = document.getElementById('lojista-content');
  content.innerHTML = '<div class="loading"><div class="spinner"></div>Carregando...</div>';
  try {
    switch (tab) {
      case 'dashboard': await loadDashboard(content); break;
      case 'requests': await loadRequests(content); break;
      case 'ranking': await loadRanking(content); break;
      case 'reasons': await loadReasons(content); break;
      case 'messages': await loadMessages(content); break;
      case 'settings': await loadSettings(content); break;
    }
  } catch (err) {
    content.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>${err.message || 'Erro ao carregar dados'}</p></div>`;
  }
}

// ===== Dashboard =====
async function loadDashboard(content) {
  content.innerHTML = `
    <div class="painel-header"><h1>Dashboard da Loja</h1></div>
    <div class="stats-grid" id="lojista-stats"><div class="loading"><div class="spinner"></div></div></div>
    <div class="card" style="margin-top:24px">
      <div class="card-header"><h3>Solicitações Recentes</h3><button class="btn btn-outline btn-sm" id="ver-todas">Ver todas</button></div>
      <div id="lojista-recent"><div class="loading"><div class="spinner"></div></div></div>
    </div>
  `;

  document.getElementById('ver-todas').addEventListener('click', () => {
    document.querySelector('[data-ltab="requests"]').click();
  });

  try {
    const res = await API.getRequests(10, 0);
    const list = res?.data || res?.requests || res || [];
    const arr = Array.isArray(list) ? list : [];

    const pending = arr.filter(r => r.status_id >= 1 && r.status_id <= 5).length;
    const finished = arr.filter(r => r.status_id === 6 || r.status_id === 9).length;
    const rejected = arr.filter(r => r.status_id === 7 || r.status_id === 8).length;

    document.getElementById('lojista-stats').innerHTML = `
      <div class="stat-card">
        <div class="stat-icon" style="background:var(--primary-100)">🔄</div>
        <div class="stat-value">${arr.length}</div>
        <div class="stat-label">Total de Solicitações</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:var(--warning-light)">⏳</div>
        <div class="stat-value">${pending}</div>
        <div class="stat-label">Em Andamento</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:var(--success-light)">✅</div>
        <div class="stat-value">${finished}</div>
        <div class="stat-label">Finalizadas</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:var(--danger-light)">❌</div>
        <div class="stat-value">${rejected}</div>
        <div class="stat-label">Recusadas/Canceladas</div>
      </div>
    `;

    const recentEl = document.getElementById('lojista-recent');
    if (arr.length === 0) {
      recentEl.innerHTML = '<div class="empty-state"><div class="icon">📭</div><p>Nenhuma solicitação encontrada</p></div>';
    } else {
      recentEl.innerHTML = `
        <div class="table-container">
          <table>
            <thead><tr><th>ID</th><th>Motivo</th><th>Cliente</th><th>Status</th><th>Data</th></tr></thead>
            <tbody>
              ${arr.map(r => `
                <tr style="cursor:pointer" data-rid="${r.id}">
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
      recentEl.querySelectorAll('tr[data-rid]').forEach(tr => {
        tr.addEventListener('click', () => viewRequestDetail(parseInt(tr.dataset.rid)));
      });
    }
  } catch (err) {
    document.getElementById('lojista-stats').innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

// ===== Requests =====
let reqState = { limit: 10, offset: 0, status: '', search: '' };

async function loadRequests(content) {
  content.innerHTML = `
    <div class="painel-header"><h1>Solicitações de Devolução</h1></div>
    <div class="toolbar">
      <input type="text" class="form-control search-box" id="l-req-search" placeholder="Buscar por motivo, cliente..." value="${reqState.search}" />
      <select class="form-control" id="l-req-status">
        <option value="">Todos os status</option>
        ${Object.entries(STATUS_MAP).map(([k, v]) => `<option value="${k}" ${reqState.status == k ? 'selected' : ''}>${v.label}</option>`).join('')}
      </select>
      <button class="btn btn-primary btn-sm" id="l-req-search-btn">Buscar</button>
    </div>
    <div class="card">
      <div id="l-req-table"><div class="loading"><div class="spinner"></div></div></div>
    </div>
  `;

  document.getElementById('l-req-search-btn').addEventListener('click', () => {
    reqState.search = document.getElementById('l-req-search').value;
    reqState.status = document.getElementById('l-req-status').value;
    reqState.offset = 0;
    fetchRequests();
  });
  document.getElementById('l-req-search').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('l-req-search-btn').click();
  });

  fetchRequests();
}

async function fetchRequests() {
  const el = document.getElementById('l-req-table');
  el.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  try {
    const res = await API.getRequests(reqState.limit, reqState.offset, reqState.status, reqState.search);
    const list = res?.data || res?.requests || res || [];
    const arr = Array.isArray(list) ? list : [];
    const total = res?.total || arr.length;

    if (arr.length === 0) {
      el.innerHTML = '<div class="empty-state"><div class="icon">📭</div><p>Nenhuma solicitação encontrada</p></div>';
      return;
    }

    el.innerHTML = `
      <div class="table-container">
        <table>
          <thead><tr><th>ID</th><th>Motivo</th><th>Cliente</th><th>Status</th><th>Data</th><th>Ações</th></tr></thead>
          <tbody>
            ${arr.map(r => `
              <tr>
                <td>#${r.id}</td>
                <td>${r.reason || '-'}</td>
                <td>${r.customer?.name || r.customer_name || '-'}</td>
                <td>${statusBadge(r.status_id)}</td>
                <td>${r.created_at ? new Date(r.created_at).toLocaleDateString('pt-BR') : '-'}</td>
                <td><button class="btn btn-outline btn-sm" data-view="${r.id}">Ver</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <span class="pagination-info">${reqState.offset + 1}–${Math.min(reqState.offset + arr.length, total)} de ${total}</span>
        <div class="pagination-controls">
          <button id="l-prev" ${reqState.offset === 0 ? 'disabled' : ''}>Anterior</button>
          <button id="l-next" ${reqState.offset + reqState.limit >= total ? 'disabled' : ''}>Próximo</button>
        </div>
      </div>
    `;

    el.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => viewRequestDetail(parseInt(btn.dataset.view)));
    });
    document.getElementById('l-prev')?.addEventListener('click', () => { reqState.offset -= reqState.limit; fetchRequests(); });
    document.getElementById('l-next')?.addEventListener('click', () => { reqState.offset += reqState.limit; fetchRequests(); });
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

async function viewRequestDetail(id) {
  const { close } = openModal('Carregando...', '<div class="loading"><div class="spinner"></div></div>');
  try {
    const r = await API.getRequest(id);
    const data = r?.data || r;

    let actionsHtml = '';
    if (data.status_id === 2) {
      actionsHtml = `
        <button class="btn btn-success btn-sm" id="approve-btn">✓ Aprovar</button>
        <button class="btn btn-danger btn-sm" id="reject-btn">✕ Recusar</button>
      `;
    }

    const { close: close2 } = openModal(
      `Solicitação #${data.id}`,
      `
        <div class="detail-row"><span class="label">Status</span><span class="value">${statusBadge(data.status_id)}</span></div>
        <div class="detail-row"><span class="label">Motivo</span><span class="value">${data.reason || '-'}</span></div>
        <div class="detail-row"><span class="label">Cliente</span><span class="value">${data.customer?.name || data.customer_name || '-'}</span></div>
        <div class="detail-row"><span class="label">E-mail</span><span class="value">${data.customer?.email || '-'}</span></div>
        <div class="detail-row"><span class="label">Telefone</span><span class="value">${data.customer?.phone || '-'}</span></div>
        <div class="detail-row"><span class="label">Observação</span><span class="value">${data.observation || '-'}</span></div>
        <div class="detail-row"><span class="label">Data</span><span class="value">${data.created_at ? new Date(data.created_at).toLocaleString('pt-BR') : '-'}</span></div>
        ${data.address ? `
          <div class="detail-row"><span class="label">Endereço</span><span class="value">${data.address.street || ''}, ${data.address.number || ''} - ${data.address.neighborhood || ''}, ${data.address.city || ''}/${data.address.state || ''}</span></div>
          <div class="detail-row"><span class="label">CEP</span><span class="value">${data.address.zipcode || '-'}</span></div>
        ` : ''}
      `,
      actionsHtml
    );
    close();

    document.getElementById('approve-btn')?.addEventListener('click', async () => {
      try {
        await API.updateStatus({ id: data.id, status_id: 3 });
        toast('Solicitação aprovada!', 'success');
        close2();
        fetchRequests();
      } catch (err) { toast(err.message, 'error'); }
    });
    document.getElementById('reject-btn')?.addEventListener('click', async () => {
      try {
        await API.rejectRequest(data.id);
        toast('Solicitação recusada', 'info');
        close2();
        fetchRequests();
      } catch (err) { toast(err.message, 'error'); }
    });
  } catch (err) {
    close();
    toast(err.message || 'Erro ao carregar solicitação', 'error');
  }
}

// ===== Ranking =====
async function loadRanking(content) {
  content.innerHTML = `
    <div class="painel-header"><h1>Ranking de Produtos Devolvidos</h1></div>
    <div class="card">
      <div class="card-header"><h3>Motivos mais frequentes</h3></div>
      <div id="ranking-content"><div class="loading"><div class="spinner"></div></div></div>
    </div>
  `;
  try {
    const res = await API.getRanking();
    const arr = Array.isArray(res) ? res : (res?.data || []);
    const el = document.getElementById('ranking-content');
    if (arr.length === 0) {
      el.innerHTML = '<div class="empty-state"><div class="icon">📊</div><p>Nenhum dado de ranking disponível</p></div>';
    } else {
      el.innerHTML = `
        <div class="table-container">
          <table>
            <thead><tr><th>#</th><th>Motivo</th><th>Quantidade</th><th>Percentual</th></tr></thead>
            <tbody>
              ${arr.map((item, i) => {
                const qty = item.quantity || item.count || item.total || 0;
                const max = arr[0]?.quantity || arr[0]?.count || arr[0]?.total || 1;
                const pct = Math.round((qty / max) * 100);
                return `
                  <tr>
                    <td>${i + 1}º</td>
                    <td>${item.reason || item.name || '-'}</td>
                    <td>${qty}</td>
                    <td><div style="display:flex;align-items:center;gap:8px"><div style="width:100px;height:8px;background:var(--gray-100);border-radius:4px;overflow:hidden"><div style="width:${pct}%;height:100%;background:var(--primary)"></div></div><span style="font-size:0.82rem;color:var(--gray-500)">${pct}%</span></div></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  } catch (err) {
    document.getElementById('ranking-content').innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

// ===== Reasons =====
async function loadReasons(content) {
  content.innerHTML = `
    <div class="painel-header">
      <h1>Motivos de Devolução</h1>
      <button class="btn btn-primary btn-sm" id="add-reason-btn">+ Novo Motivo</button>
    </div>
    <div class="card"><div id="reasons-list"><div class="loading"><div class="spinner"></div></div></div></div>
  `;

  document.getElementById('add-reason-btn').addEventListener('click', () => openReasonForm());

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
          <thead><tr><th>Motivo</th><th>Ativo</th><th>Ações</th></tr></thead>
          <tbody>
            ${arr.map(r => `
              <tr>
                <td>${r.name || r.reason || '-'}</td>
                <td>${r.check ? '<span class="badge badge-success">Sim</span>' : '<span class="badge badge-gray">Não</span>'}</td>
                <td>
                  <button class="btn btn-outline btn-sm" data-edit="${r.id}">Editar</button>
                  <button class="btn btn-danger btn-sm" data-del="${r.id}">Excluir</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    el.querySelectorAll('[data-edit]').forEach(btn => btn.addEventListener('click', () => {
      const reason = arr.find(r => r.id == btn.dataset.edit);
      openReasonForm(reason);
    }));
    el.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', async () => {
      if (!confirm('Excluir este motivo?')) return;
      try {
        await API.deleteReason(btn.dataset.del);
        toast('Motivo excluído', 'success');
        fetchReasons();
      } catch (err) { toast(err.message, 'error'); }
    }));
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

function openReasonForm(reason = null) {
  const isEdit = !!reason;
  const { close } = openModal(
    isEdit ? 'Editar Motivo' : 'Novo Motivo',
    `
      <form id="reason-form">
        <div class="form-group">
          <label>Nome do Motivo *</label>
          <input type="text" class="form-control" name="name" value="${reason?.name || reason?.reason || ''}" required />
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" name="check" ${(!isEdit || reason?.check) ? 'checked' : ''} style="width:auto;margin-right:6px" />
            Motivo ativo (visível para clientes)
          </label>
        </div>
      </form>
    `,
    `<button class="btn btn-secondary" id="cancel-reason">Cancelar</button><button class="btn btn-primary" id="save-reason">Salvar</button>`
  );

  document.getElementById('cancel-reason').addEventListener('click', close);
  document.getElementById('save-reason').addEventListener('click', async () => {
    const form = document.getElementById('reason-form');
    const name = form.name.value.trim();
    if (!name) { toast('Digite o nome do motivo', 'error'); return; }
    const check = form.check.checked;
    try {
      if (isEdit) {
        await API.updateReasons({ id: reason.id, name, check });
      } else {
        await API.createReason({ name, check });
      }
      toast('Motivo salvo com sucesso!', 'success');
      close();
      fetchReasons();
    } catch (err) { toast(err.message, 'error'); }
  });
}

// ===== Messages =====
async function loadMessages(content) {
  const admin = Auth.getAdmin();
  const storeId = admin?.id || '';
  content.innerHTML = `
    <div class="painel-header"><h1>Mensagens Personalizadas</h1></div>
    <div class="card">
      <div class="card-body">
        <p style="color:var(--gray-500);margin-bottom:20px;font-size:0.9rem">Configure mensagens exibidas para seus clientes durante o processo de solicitação.</p>
        <div id="messages-content"><div class="loading"><div class="spinner"></div></div></div>
      </div>
    </div>
  `;
  try {
    const res = await API.getMessageCustomer(storeId);
    const data = res?.data || res || {};
    document.getElementById('messages-content').innerHTML = `
      <form id="msg-form">
        <div class="form-group">
          <label>Mensagem para o cliente (exibida na área do cliente)</label>
          <textarea class="form-control" name="message" rows="4" placeholder="Digite a mensagem que seus clientes verão...">${data.message || data.customer_message || ''}</textarea>
        </div>
        <button type="submit" class="btn btn-primary" id="save-msg">Salvar Mensagem</button>
      </form>
    `;
    document.getElementById('msg-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = e.target.message.value.trim();
      const btn = document.getElementById('save-msg');
      btn.disabled = true; btn.textContent = 'Salvando...';
      try {
        await API.updateMessage({ message: msg, store_id: storeId });
        toast('Mensagem salva!', 'success');
      } catch (err) { toast(err.message, 'error'); }
      btn.disabled = false; btn.textContent = 'Salvar Mensagem';
    });
  } catch (err) {
    document.getElementById('messages-content').innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

// ===== Settings =====
async function loadSettings(content) {
  const admin = Auth.getAdmin();
  content.innerHTML = `
    <div class="painel-header"><h1>Configurações da Loja</h1></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:24px">
      <div class="card">
        <div class="card-header"><h3>Dados da Loja</h3></div>
        <div class="card-body">
          <form id="store-form">
            <div class="form-group"><label>Nome da Loja</label><input type="text" class="form-control" name="name" value="${admin?.name || ''}" /></div>
            <div class="form-group"><label>E-mail</label><input type="email" class="form-control" name="email" value="${admin?.email || ''}" /></div>
            <div class="form-group"><label>Telefone</label><input type="tel" class="form-control" name="phone" value="${admin?.phone || ''}" /></div>
            <button type="submit" class="btn btn-primary" id="save-store">Salvar Dados</button>
          </form>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Integração Nuvemshop</h3></div>
        <div class="card-body">
          <div class="detail-row"><span class="label">Status</span><span class="value">${admin?.nuvemshop_store_id ? '<span class="badge badge-success">Conectado</span>' : '<span class="badge badge-gray">Não conectado</span>'}</span></div>
          <div class="detail-row"><span class="label">Store ID</span><span class="value">${admin?.nuvemshop_store_id || '-'}</span></div>
          <div style="margin-top:16px">
            <button class="btn btn-outline btn-sm" id="nuvemshop-btn">${admin?.nuvemshop_store_id ? 'Reconectar' : 'Conectar Nuvemshop'}</button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Endereço de Coleta</h3></div>
        <div class="card-body">
          <div id="address-content"><div class="loading"><div class="spinner"></div></div></div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('store-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('save-store');
    const formData = Object.fromEntries(new FormData(e.target));
    btn.disabled = true; btn.textContent = 'Salvando...';
    try {
      await API.updateAdmin(formData);
      const admin = Auth.getAdmin();
      Auth.setAdmin({ ...admin, ...formData });
      toast('Dados da loja atualizados!', 'success');
    } catch (err) { toast(err.message, 'error'); }
    btn.disabled = false; btn.textContent = 'Salvar Dados';
  });

  document.getElementById('nuvemshop-btn').addEventListener('click', () => {
    toast('Integração Nuvemshop requer configuração via API. Em breve!', 'info');
  });

  try {
    const res = await API.getAddress();
    const data = res?.data || res || {};
    document.getElementById('address-content').innerHTML = `
      <div class="detail-row"><span class="label">CEP</span><span class="value">${data.zipcode || '-'}</span></div>
      <div class="detail-row"><span class="label">Rua</span><span class="value">${data.street || '-'}</span></div>
      <div class="detail-row"><span class="label">Número</span><span class="value">${data.number || '-'}</span></div>
      <div class="detail-row"><span class="label">Bairro</span><span class="value">${data.neighborhood || '-'}</span></div>
      <div class="detail-row"><span class="label">Cidade/UF</span><span class="value">${data.city || '-'} / ${data.state || '-'}</span></div>
      <div style="margin-top:16px"><button class="btn btn-outline btn-sm" id="edit-address">Editar Endereço</button></div>
    `;
    document.getElementById('edit-address').addEventListener('click', () => openAddressForm(data));
  } catch {
    document.getElementById('address-content').innerHTML = `
      <div class="empty-state"><div class="icon">📍</div><p>Nenhum endereço cadastrado</p></div>
      <button class="btn btn-primary btn-sm" id="add-address" style="margin-top:12px">+ Cadastrar Endereço</button>
    `;
    document.getElementById('add-address').addEventListener('click', () => openAddressForm({}));
  }
}

function openAddressForm(data) {
  const { close } = openModal(
    'Endereço de Coleta',
    `
      <form id="addr-form">
        <div class="form-group"><label>CEP *</label><input type="text" class="form-control" name="zipcode" value="${data.zipcode || ''}" required /></div>
        <div class="form-row">
          <div class="form-group" style="flex:2"><label>Rua *</label><input type="text" class="form-control" name="street" value="${data.street || ''}" required /></div>
          <div class="form-group" style="flex:1"><label>Número *</label><input type="text" class="form-control" name="number" value="${data.number || ''}" required /></div>
        </div>
        <div class="form-group"><label>Bairro *</label><input type="text" class="form-control" name="neighborhood" value="${data.neighborhood || ''}" required /></div>
        <div class="form-row">
          <div class="form-group" style="flex:2"><label>Cidade *</label><input type="text" class="form-control" name="city" value="${data.city || ''}" required /></div>
          <div class="form-group" style="flex:1"><label>Estado *</label><input type="text" class="form-control" name="state" value="${data.state || ''}" maxlength="2" required /></div>
        </div>
        <div class="form-group"><label>Complemento</label><input type="text" class="form-control" name="complement" value="${data.complement || ''}" /></div>
      </form>
    `,
    `<button class="btn btn-secondary" id="cancel-addr">Cancelar</button><button class="btn btn-primary" id="save-addr">Salvar</button>`
  );

  document.getElementById('cancel-addr').addEventListener('click', close);
  document.getElementById('save-addr').addEventListener('click', async () => {
    const form = document.getElementById('addr-form');
    const formData = Object.fromEntries(new FormData(form));
    try {
      if (data.id) {
        await API.updateAddress({ ...formData, id: data.id });
      } else {
        await API.createAddress(formData);
      }
      toast('Endereço salvo!', 'success');
      close();
      loadSettings(document.getElementById('lojista-content'));
    } catch (err) { toast(err.message, 'error'); }
  });
}
