/**
 * Configuración centralizada de la API
 * Simplificada para hacer más comprensible el proyecto
 */

// URL base para todas las llamadas a la API - Cambiar esto para usar otro backend
export const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Construye una URL completa para la API
 */
export const getApiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
};

/**
 * Rutas de la API organizadas por categoría
 * Añadir nuevas rutas aquí para mantener todo centralizado
 */
export const API_ROUTES = {
  // Autenticación
  LOGIN: getApiUrl('token/'),
  LOGOUT: getApiUrl('usuarios/log-out/'),
  REFRESH_TOKEN: getApiUrl('token/refresh/'),
  REGISTER: getApiUrl('usuarios/registro/'),
  USER_PROFILE: getApiUrl('usuarios/profile/'),
  CHANGE_PASSWORD: getApiUrl('usuarios/change-password/'),
  
  // Subastas
  AUCTIONS: getApiUrl('subastas/'),
  AUCTION_BY_ID: (id) => getApiUrl(`subastas/${id}/`),
  AUCTION_CATEGORIES: getApiUrl('subastas/categorias/'),
  MY_AUCTIONS: getApiUrl('misSubastas/'),
  
  // Pujas
  MY_BIDS: getApiUrl('misPujas/'),
  AUCTION_BIDS: (auctionId) => getApiUrl(`subastas/${auctionId}/pujas/`),
  BID_BY_ID: (auctionId, bidId) => getApiUrl(`subastas/${auctionId}/pujas/${bidId}/`),
  
  // Comentarios
  AUCTION_COMMENTS: (auctionId) => getApiUrl(`subastas/${auctionId}/comentarios/`),
  COMMENT_BY_ID: (auctionId, commentId) => getApiUrl(`subastas/${auctionId}/comentarios/${commentId}/`),
  
  // Valoraciones
  AUCTION_RATINGS: (auctionId) => getApiUrl(`subastas/${auctionId}/ratings/`),
  RATING_BY_ID: (auctionId, ratingId) => getApiUrl(`subastas/${auctionId}/ratings/${ratingId}/`),
};

export default {
  API_BASE_URL,
  getApiUrl,
  API_ROUTES
};