/* eslint-disable no-param-reassign */
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-troque-rapido.comprainteligente.app.br/'
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `bearer ${token}`;
  }

  return config;
});

export default api;
