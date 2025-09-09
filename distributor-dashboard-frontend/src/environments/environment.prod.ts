export const environment = {
  production: true,
  // In production, we use a relative path. This assumes the frontend (served by Nginx)
  // and the backend API are behind the same domain, and a reverse proxy
  // will forward requests starting with /api to the backend service.
  apiUrl: '/api'
};