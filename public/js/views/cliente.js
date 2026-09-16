import { API } from '../api.js';
import { toast } from '../auth.js';

export function renderCliente(app) {
  app.innerHTML = `
    <nav class="navbar">
      <div class="navbar-brand" style="cursor:pointer" onclick="window.location.hash='#/'">
        <div class="logo-icon">📦</div>
        Troque Rápido
      </div>
      <div class="navbar-links">
        <a href="#/">Início</a>
        <a href="#/login">Painel Admin</a>
      </div>
    </nav>

    <div class="client-page">
      <div class="client-header">
        <h1>Área do Cliente</h1>
        <p>Solicite uma devolução ou troca e acompanhe o status</p>
      </div>

      <div class="tab-nav">
        <button class="active" data-ctab="track">Acompanhar Solicitação</button>
        <button data-ctab="new">Nova Solicitação</button>
      </div>

      <div id="client-content"></div>
    </div>
  `;

  const tabs = app.querySelectorAll('[data-ctab]');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    loadClientTab(t.dataset.ctab);
  }));

  loadClientTab('track');
}

function loadClientTab(tab) {
  const el = document.getElementById('client-content');
  if (tab === 'track') {
    el.innerHTML = `
      <div class="card">
        <div class="card-body">
          <div class="form-group">
            <label>Número de Coleta</label>
            <div style="display:flex;gap:12px">
              <input type="text" class="form-control" id="track-code" placeholder="Digite o número de coleta" />
              <button class="btn btn-primary" id="track-btn">Rastrear</button>
            </div>
          </div>
          <div id="track-result"></div>
        </div>
      </div>
    `;
    document.getElementById('track-btn').addEventListener('click', trackRequest);
    document.getElementById('track-code').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') trackRequest();
    });
  } else if (tab === 'new') {
    el.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h3 style="margin-bottom:20px">Dados do Cliente</h3>
          <form id="customer-form">
            <div class="form-group"><label>Nome Completo *</label><input type="text" class="form-control" name="name" required /></div>
            <div class="form-row">
              <div class="form-group"><label>E-mail *</label><input type="email" class="form-control" name="email" required /></div>
              <div class="form-group"><label>Telefone *</label><input type="tel" class="form-control" name="phone" required /></div>
            </div>
            <div class="form-group"><label>CPF/CNPJ *</label><input type="text" class="form-control" name="identification" required /></div>

            <h3 style="margin:24px 0 20px">Endereço de Coleta</h3>
            <div class="form-row">
              <div class="form-group" style="flex:1"><label>CEP *</label><div style="display:flex;gap:8px"><input type="text" class="form-control" name="zipcode" id="cep-input" required /><button type="button" class="btn btn-outline btn-sm" id="cep-btn">Buscar</button></div></div>
            </div>
            <div class="form-row">
              <div class="form-group" style="flex:2"><label>Rua *</label><input type="text" class="form-control" name="street" id="street-input" required /></div>
              <div class="form-group" style="flex:1"><label>Número *</label><input type="text" class="form-control" name="number" required /></div>
            </div>
            <div class="form-group"><label>Bairro *</label><input type="text" class="form-control" name="neighborhood" id="neighborhood-input" required /></div>
            <div class="form-row">
              <div class="form-group" style="flex:2"><label>Cidade *</label><input type="text" class="form-control" name="city" id="city-input" required /></div>
              <div class="form-group" style="flex:1"><label>Estado *</label><input type="text" class="form-control" name="state" id="state-input" maxlength="2" required /></div>
            </div>
            <div class="form-group"><label>Complemento</label><input type="text" class="form-control" name="complement" /></div>

            <h3 style="margin:24px 0 20px">Detalhes da Solicitação</h3>
            <div class="form-group"><label>Motivo *</label>
              <select class="form-control" name="reason" id="reason-select" required>
                <option value="">Selecione um motivo</option>
              </select>
            </div>
            <div class="form-group"><label>Observação</label><textarea class="form-control" name="observation" rows="3" placeholder="Descreva o motivo da devolução/troca"></textarea></div>

            <button type="submit" class="btn btn-primary btn-lg" id="submit-solicitation">Enviar Solicitação</button>
          </form>
        </div>
      </div>
    `;

    // CEP lookup
    document.getElementById('cep-btn').addEventListener('click', async () => {
      const cep = document.getElementById('cep-input').value.replace(/\D/g, '');
      if (!cep) return toast('Digite um CEP', 'error');
      try {
        const res = await API.searchCEP(cep);
        const data = res?.data || res;
        if (data) {
          document.getElementById('street-input').value = data.logradouro || data.street || '';
          document.getElementById('neighborhood-input').value = data.bairro || data.neighborhood || '';
          document.getElementById('city-input').value = data.localidade || data.city || '';
          document.getElementById('state-input').value = data.uf || data.state || '';
        }
      } catch (err) { toast('CEP não encontrado', 'error'); }
    });

    // Load reasons (public endpoint)
    loadCustomerReasons();

    // Submit
    document.getElementById('customer-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submit-solicitation');
      const formData = Object.fromEntries(new FormData(e.target));
      btn.disabled = true;
      btn.textContent = 'Enviando...';

      try {
        // Step 1: Create customer
        const customer = await API.createCustomer({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          identification: formData.identification,
        });

        // Step 2: Create address
        const address = await API.createAddress({
          street: formData.street,
          number: formData.number,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          complement: formData.complement || '',
          zipcode: formData.zipcode,
        });

        // Step 3: Create logistics request
        await API.createLogisticsRequest({
          reason: formData.reason,
          observation: formData.observation || '',
          nuvemshop_store_id: customer?.nuvemshop_store_id || customer?.admin?.nuvemshop_store_id || 0,
          customer_id: customer?.id || customer?.customer_id || 0,
          address_id: address?.id || address?.address_id || 0,
          status_id: 2,
        });

        toast('Solicitação enviada com sucesso!', 'success');
        // Switch to track tab
        document.querySelector('[data-ctab="track"]').click();
      } catch (err) {
        toast(err.message || 'Erro ao enviar solicitação', 'error');
        btn.disabled = false;
        btn.textContent = 'Enviar Solicitação';
      }
    });
  }
}

async function loadCustomerReasons() {
  try {
    const res = await API.getReasonsCustomer('');
    const arr = Array.isArray(res) ? res : (res?.data || []);
    const select = document.getElementById('reason-select');
    arr.forEach(r => {
      if (r.check) {
        const opt = document.createElement('option');
        opt.value = r.name;
        opt.textContent = r.name;
        select.appendChild(opt);
      }
    });
  } catch {
    // Endpoint may require store_id; provide common defaults
    const defaults = ['Produto com defeito', 'Produto errado', 'Desistência', 'Tamanho incorreto', 'Outro'];
    const select = document.getElementById('reason-select');
    defaults.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      select.appendChild(opt);
    });
  }
}

async function trackRequest() {
  const code = document.getElementById('track-code').value.trim();
  const el = document.getElementById('track-result');
  if (!code) return toast('Digite o número de coleta', 'error');

  el.innerHTML = '<div class="loading"><div class="spinner"></div>Buscando...</div>';
  try {
    // Try the accompany endpoint (may require auth)
    const res = await fetch(`/logistic_request_accompany/${code}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('troque_token') || ''}` }
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Solicitação não encontrada');

    el.innerHTML = `
      <div class="tracking-result">
        <div class="card"><div class="card-body">
          <div class="detail-row"><span class="label">Número de Coleta</span><span class="value">${code}</span></div>
          <div class="detail-row"><span class="label">Status</span><span class="value">${data.status || data[0]?.status || 'Em processamento'}</span></div>
          ${data.codigo || data[0]?.codigo ? `<div class="detail-row"><span class="label">Código de Rastreio</span><span class="value">${data.codigo || data[0]?.codigo || '-'}</span></div>` : ''}
        </div></div>
        ${Array.isArray(data) && data.length > 0 ? `
          <div class="card" style="margin-top:16px"><div class="card-body">
            <h4 style="margin-bottom:16px">Histórico de Rastreamento</h4>
            <div class="timeline">
              ${data.map((event, i) => `
                <div class="timeline-item ${i === 0 ? 'done' : ''}">
                  <div class="timeline-title">${event.descricao || event.status || event.description || 'Evento'}</div>
                  <div class="timeline-date">${event.data || event.criadoEm || event.date || ''} ${event.hora || event.time || ''}</div>
                  ${event.local || event.cidade ? `<div style="font-size:0.8rem;color:var(--gray-400)">${event.local || event.cidade}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div></div>
        ` : ''}
      </div>
    `;
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><div class="icon">🔍</div><p>${err.message}<br><br>Digite o número de coleta fornecido quando sua solicitação foi aprovada.</p></div>`;
  }
}
