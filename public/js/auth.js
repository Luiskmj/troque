// Auth state management
export const Auth = {
  getToken: () => localStorage.getItem('troque_token'),
  setToken: (token) => localStorage.setItem('troque_token', token),
  clear: () => { localStorage.removeItem('troque_token'); localStorage.removeItem('troque_admin'); },
  isAuthenticated: () => !!localStorage.getItem('troque_token'),
  getAdmin: () => {
    try { return JSON.parse(localStorage.getItem('troque_admin') || 'null'); }
    catch { return null; }
  },
  setAdmin: (admin) => localStorage.setItem('troque_admin', JSON.stringify(admin)),
  login: (token, admin) => {
    Auth.setToken(token);
    Auth.setAdmin(admin);
  },
  logout: () => {
    Auth.clear();
    window.location.hash = '#/';
  },
};

// Toast helper
export function toast(message, type = 'info', duration = 3500) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.className = `toast ${type} show`;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), duration);
}
