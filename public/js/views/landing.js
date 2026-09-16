import { navigate } from '../router.js';

export function renderLanding(app) {
  app.innerHTML = `
    <nav class="navbar">
      <div class="navbar-brand" style="cursor:pointer" onclick="window.location.hash='#/'">
        <div class="logo-icon">📦</div>
        Troque Rápido
      </div>
      <div class="navbar-links">
        <a href="#/">Início</a>
        <a href="#/cliente">Área do Cliente</a>
        <a href="#/login">Login</a>
        <a href="#/contratar" class="btn btn-primary btn-sm" style="color:#fff;text-decoration:none">Contratar</a>
      </div>
    </nav>

    <section class="hero">
      <h1>Logística Reversa Inteligente para seu E-commerce</h1>
      <p>Automatize trocas, devoluções e retornos com integração direta aos Correios e transportadoras. Reduza custos e melhore a experiência do cliente.</p>
      <div class="hero-cta">
        <a href="#/contratar" class="btn btn-primary btn-lg">Contratar Agora</a>
        <a href="#/cliente" class="btn btn-outline btn-lg">Área do Cliente</a>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Tudo o que sua loja precisa</h2>
      <p class="section-subtitle">Gestão completa de logística reversa em uma única plataforma</p>
      <div class="features-grid">
        <div class="feature-card">
          <div class="icon" style="background:var(--primary-100)">🔄</div>
          <h3>Trocas e Devoluções</h3>
          <p>Solicitações automatizadas com aprovação manual ou automática, conforme sua política.</p>
        </div>
        <div class="feature-card">
          <div class="icon" style="background:var(--success-light)">📮</div>
          <h3>Integração Correios</h3>
          <p>Coleta reversa, etiquetas e rastreamento diretamente integrado ao SIGEP dos Correios.</p>
        </div>
        <div class="feature-card">
          <div class="icon" style="background:var(--warning-light)">📊</div>
          <h3>Dashboard Completo</h3>
          <p>Acompanhe métricas, rankings e relatórios detalhados de todas as solicitações.</p>
        </div>
        <div class="feature-card">
          <div class="icon" style="background:var(--danger-light)">🛒</div>
          <h3>Nuvemshop & Bling</h3>
          <p>Integração nativa com Nuvemshop e Bling para sincronizar pedidos e produtos.</p>
        </div>
        <div class="feature-card">
          <div class="icon" style="background:var(--primary-100)">💳</div>
          <h3>Pagamentos Vindi</h3>
          <p>Cobrança automática via Vindi com planos flexíveis para diferentes volumes.</p>
        </div>
        <div class="feature-card">
          <div class="icon" style="background:var(--success-light)">🚚</div>
          <h3>Multi-Transportadora</h3>
          <p>Suporte para Correios, Kangu e Melhor Envio com simulação de fretes.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Planos para todos os tamanhos</h2>
      <p class="section-subtitle">Escolha o plano ideal para o volume da sua loja</p>
      <div class="pricing-grid">
        <div class="pricing-card">
          <h3>Starter</h3>
          <div class="price">R$49<span>/mês</span></div>
          <ul>
            <li>Até 50 solicitações/mês</li>
            <li>1 loja integrada</li>
            <li>Integração Correios</li>
            <li>Suporte por e-mail</li>
          </ul>
          <a href="#/contratar" class="btn btn-outline" style="width:100%">Começar</a>
        </div>
        <div class="pricing-card featured">
          <div class="badge">Mais Popular</div>
          <h3>Pro</h3>
          <div class="price">R$99<span>/mês</span></div>
          <ul>
            <li>Até 200 solicitações/mês</li>
            <li>3 lojas integradas</li>
            <li>Correios + Kangu + Melhor Envio</li>
            <li>Dashboard avançado</li>
            <li>Suporte prioritário</li>
          </ul>
          <a href="#/contratar" class="btn btn-primary" style="width:100%">Contratar Pro</a>
        </div>
        <div class="pricing-card">
          <h3>Enterprise</h3>
          <div class="price">R$199<span>/mês</span></div>
          <ul>
            <li>Solicitações ilimitadas</li>
            <li>Lojas ilimitadas</li>
            <li>Todas as transportadoras</li>
            <li>API + Webhooks</li>
            <li>Suporte dedicado</li>
          </ul>
          <a href="#/contratar" class="btn btn-outline" style="width:100%">Falar com Vendas</a>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="navbar-brand">
        <div class="logo-icon">📦</div>
        Troque Rápido
      </div>
      <p>Plataforma de Logística Reversa para E-commerce &copy; 2024</p>
    </footer>
  `;
}
