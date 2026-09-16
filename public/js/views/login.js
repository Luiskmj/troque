import { API } from '../api.js';
import { Auth, toast } from '../auth.js';
import { navigate } from '../router.js';

export function renderLogin(app) {
  if (Auth.isAuthenticated()) {
    navigate('/painel');
    return;
  }

  app.innerHTML = `
    <div class="auth-page" style="background:linear-gradient(135deg,var(--primary-dark),var(--accent))">
      <div class="auth-card">
        <div class="navbar-brand" style="cursor:pointer" onclick="window.location.hash='#/'">
          <div class="logo-icon">📦</div>
          Troque Rápido
        </div>
        <h2>Bem-vindo de volta</h2>
        <p class="auth-subtitle">Acesse o painel de gerenciamento</p>
        <form id="login-form">
          <div class="form-group">
            <label>E-mail</label>
            <input type="email" class="form-control" name="email" placeholder="seu@email.com" required />
          </div>
          <div class="form-group">
            <label>Senha</label>
            <input type="password" class="form-control" name="password" placeholder="Sua senha" required />
          </div>
          <button type="submit" class="btn btn-primary btn-lg" id="submit-btn">Entrar</button>
        </form>
        <div class="auth-footer">
          Não tem conta? <a href="#/contratar">Contratar agora</a>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const { email, password } = Object.fromEntries(new FormData(form));
    btn.disabled = true;
    btn.textContent = 'Entrando...';
    try {
      const res = await API.login(email, password);
      Auth.login(res.token, res.administrator || res.admin || res);
      toast('Login realizado com sucesso!', 'success');
      navigate('/painel');
    } catch (err) {
      toast(err.message || 'Erro ao fazer login', 'error');
      btn.disabled = false;
      btn.textContent = 'Entrar';
    }
  });
}
