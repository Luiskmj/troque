import { API } from '../api.js';
import { toast } from '../auth.js';
import { navigate } from '../router.js';

export function renderContratar(app) {
  app.innerHTML = `
    <nav class="navbar">
      <div class="navbar-brand" style="cursor:pointer" onclick="window.location.hash='#/'">
        <div class="logo-icon">📦</div>
        Troque Rápido
      </div>
      <div class="navbar-links">
        <a href="#/">Início</a>
        <a href="#/login">Login</a>
      </div>
    </nav>

    <div class="auth-page">
      <div class="auth-card" style="max-width:520px">
        <div class="navbar-brand" style="cursor:pointer" onclick="window.location.hash='#/'">
          <div class="logo-icon">📦</div>
          Troque Rápido
        </div>
        <h2>Contratar Plataforma</h2>
        <p class="auth-subtitle">Preencha os dados da sua loja para começar</p>
        <form id="contratar-form">
          <div class="form-group">
            <label>Nome da Loja *</label>
            <input type="text" class="form-control" name="name_store" placeholder="Minha Loja Ltda" required />
          </div>
          <div class="form-group">
            <label>CNPJ *</label>
            <input type="text" class="form-control" name="identification" placeholder="00.000.000/0000-00" required />
          </div>
          <div class="form-group">
            <label>E-mail *</label>
            <input type="email" class="form-control" name="email" placeholder="contato@minhaloja.com.br" required />
          </div>
          <div class="form-group">
            <label>Telefone *</label>
            <input type="tel" class="form-control" name="telephone" placeholder="(11) 99999-9999" required />
          </div>
          <div class="form-group">
            <label>Senha *</label>
            <input type="password" class="form-control" name="password" placeholder="Mínimo 6 caracteres" minlength="6" required />
          </div>
          <button type="submit" class="btn btn-primary btn-lg" id="submit-btn">Criar Conta</button>
        </form>
        <div class="auth-footer">
          Já tem conta? <a href="#/login">Fazer login</a>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('contratar-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const data = Object.fromEntries(new FormData(form));
    btn.disabled = true;
    btn.textContent = 'Criando conta...';
    try {
      await API.createStore(data);
      toast('Conta criada com sucesso! Faça login para continuar.', 'success');
      navigate('/login');
    } catch (err) {
      toast(err.message || 'Erro ao criar conta', 'error');
      btn.disabled = false;
      btn.textContent = 'Criar Conta';
    }
  });
}
