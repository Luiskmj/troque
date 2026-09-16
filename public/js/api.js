// API client wrapper
const BASE_URL = '';

export async function api(endpoint, options = {}) {
  const token = localStorage.getItem('troque_token');
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const res = await fetch(BASE_URL + endpoint, config);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || data.error || `Erro ${res.status}`);
  }
  return data;
}

export const API = {
  // Auth
  login: (email, password) => api('/session', { method: 'POST', body: JSON.stringify({ email, password }) }),
  createStore: (data) => api('/create-store', { method: 'POST', body: JSON.stringify(data) }),
  firstAccess: () => api('/first_access'),
  requestReset: (email) => api('/request-reset-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (data) => api('/reset-password', { method: 'POST', body: JSON.stringify(data) }),

  // Admin
  getAdmin: () => api('/admin'),
  getConfig: () => api('/config'),
  updateAdmin: (data) => api('/admin', { method: 'PUT', body: JSON.stringify(data) }),

  // Logistics Requests
  getRequests: (limit, offset, status = '', search = '') => {
    let q = `?limit=${limit}&offset=${offset}`;
    if (status) q += `&status=${status}`;
    if (search) q += `&search=${encodeURIComponent(search)}`;
    return api(`/logistic_request_search${q}`);
  },
  getRequest: (id) => api(`/logistics_request/${id}`),
  updateStatus: (data) => api('/status', { method: 'PUT', body: JSON.stringify(data) }),
  rejectRequest: (id) => api('/reject_logistics_request', { method: 'PUT', body: JSON.stringify({ id }) }),
  getRanking: () => api('/logistic_request_ranking'),
  getMonthlyStats: (year) => api(`/logistic_request_month/${year}`),

  // Reasons
  getReasons: () => api('/reasons'),
  getReasonsCustomer: (storeId) => api(`/reasons_customers?store_id=${storeId}`),
  createReason: (data) => api('/reason', { method: 'POST', body: JSON.stringify(data) }),
  updateReasons: (data) => api('/reason', { method: 'PUT', body: JSON.stringify(data) }),
  deleteReason: (id) => api(`/reason/${id}`, { method: 'DELETE' }),

  // Address
  getAddress: () => api('/address'),
  createAddress: (data) => api('/address', { method: 'POST', body: JSON.stringify(data) }),
  updateAddress: (data) => api('/address', { method: 'PUT', body: JSON.stringify(data) }),

  // Plans
  getPlans: (offset = 0, limit = 20, search = '') => {
    let q = `?offset=${offset}&limit=${limit}`;
    if (search) q += `&search=${encodeURIComponent(search)}`;
    return api(`/plans${q}`);
  },
  getPlan: (id) => api(`/plan/${id}`),
  createPlan: (data) => api('/plan', { method: 'POST', body: JSON.stringify(data) }),
  updatePlan: (data) => api('/plan', { method: 'PUT', body: JSON.stringify(data) }),
  deletePlan: (id) => api(`/plan/${id}`, { method: 'DELETE' }),

  // Shipping
  getShippingServices: () => api('/shipping_services'),
  updateShippingServices: (data) => api('/shipping_service', { method: 'PUT', body: JSON.stringify(data) }),

  // Messages
  getMessageAdmin: () => api('/message_admin'),
  getMessageCustomer: (storeId) => api(`/message_customer/${storeId}`),
  updateMessage: (data) => api('/message', { method: 'PUT', body: JSON.stringify(data) }),

  // Customer
  createCustomer: (data) => api('/customer', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (data) => api('/customer', { method: 'PUT', body: JSON.stringify(data) }),

  // Logistics Request (public - no auth needed)
  createLogisticsRequest: (data) => api('/logistics_request', { method: 'POST', body: JSON.stringify(data) }),

  // CEP
  searchCEP: (cep) => api('/search_cep', { method: 'POST', body: JSON.stringify({ cep }) }),

  // Plans for customer (public)
  // Vindi
  getVindi: () => api('/vindi'),
  getVindiPaymentUrl: (adminId, planId) => api(`/vindi-url-payment?adminId=${adminId}&planId=${planId}`),
};
