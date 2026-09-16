// Simple hash-based router
import { renderLanding } from './views/landing.js';
import { renderContratar } from './views/contratar.js';
import { renderLogin } from './views/login.js';
import { renderPainel } from './views/painel.js';
import { renderCliente } from './views/cliente.js';
import { Auth } from './auth.js';

const routes = {
  '/': renderLanding,
  '/contratar': renderContratar,
  '/login': renderLogin,
  '/painel': renderPainel,
  '/cliente': renderCliente,
};

export function getRoute() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  return hash;
}

export function navigate(path) {
  window.location.hash = path;
}

export function router() {
  const route = getRoute();
  const app = document.getElementById('app');

  // Guard protected routes
  if (route === '/painel' && !Auth.isAuthenticated()) {
    navigate('/login');
    return;
  }

  const handler = routes[route] || renderLanding;
  app.innerHTML = '';
  handler(app);
  window.scrollTo(0, 0);
}

export function initRouter() {
  window.addEventListener('hashchange', router);
  router();
}
