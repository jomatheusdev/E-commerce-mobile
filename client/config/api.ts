/**
 * Configuração centralizada para endpoints da API
 */

// URL base do servidor
export const SERVER_URL = 'http://192.168.0.108:3000';

// URL WebSocket para o serviço de IA
export const WEBSOCKET_URL = 'ws://192.168.0.108:3000';

// Endpoints específicos da API
export const API_ENDPOINTS = {
  login: `${SERVER_URL}/api/login`,
  register: `${SERVER_URL}/api/user`,
  user: (userId: string) => `${SERVER_URL}/api/user/${userId}`,
  products: `${SERVER_URL}/api/public/products`,
  product: (productId: string) => `${SERVER_URL}/api/product/${productId}`,
  orders: `${SERVER_URL}/api/orders`,
};
