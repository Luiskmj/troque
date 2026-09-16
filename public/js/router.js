// Simple hash-based router
import { renderLanding } from './views/landing.js';
import { renderContratar } from './views/contratar.js';
import { renderLogin } from './views/login.js';
import { renderPainel } from './views/painel.js';
import { renderCliente } from './views/cliente.js';
import { renderLojista } from './views/lojista.js';
import { Auth } from './auth.js';

const routes = {
  '/': renderLanding,
  '/contratar': renderContratar,
  '/login': renderLogin,
  '/painel': renderPainel,
  '/cliente': renderCliente,
  '/lojista': renderLojista,
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
  if ((route === '/painel' || route === '/lojista') && !Auth.isAuthenticated()) {
    navigate('/login');
    return;
  }

  const handler = routes[route] || renderLanding;
  app.innerHTML = '';
  handler(app);
  window.scrollTo(0, 0);
}

export function initRouter() {
  // If navigated to a path like /lojista, convert to hash route
  const path = window.location.pathname;
  if (path && path !== '/' && !path.startsWith('/js/') && !path.startsWith('/css/') && !path.startsWith('/files')) {
    window.history.replaceState(null, '', '/');
    window.location.hash = path;
  }
  window.addEventListener('hashchange', router);
  router();
}
