import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach authorization token if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('terraquest_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 unauth session expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('terraquest_token');
        localStorage.removeItem('terraquest_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const destinationAPI = {
  getAll: (params) => api.get('/destinations', { params }),
  getById: (id) => api.get(`/destinations/${id}`),
  getHotels: (id) => api.get(`/destinations/${id}/hotels`),
  getAttractions: (id) => api.get(`/destinations/${id}/attractions`),
  getTravelInfo: (id) => api.get(`/destinations/${id}/travel-info`),
  getNearby: (id) => api.get(`/destinations/${id}/nearby-destinations`),
  getSearchHistory: () => api.get('/destinations/history/my-searches'),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  createDestination: (data) => api.post('/admin/destinations', data),
  updateDestination: (id, data) => api.put(`/admin/destinations/${id}`, data),
  deleteDestination: (id) => api.delete(`/admin/destinations/${id}`),

  createHotel: (data) => api.post('/admin/hotels', data),
  updateHotel: (id, data) => api.put(`/admin/hotels/${id}`, data),
  deleteHotel: (id) => api.delete(`/admin/hotels/${id}`),
  createAttraction: (data) => api.post('/admin/attractions', data),
  updateAttraction: (id, data) => api.put(`/admin/attractions/${id}`, data),
  deleteAttraction: (id) => api.delete(`/admin/attractions/${id}`),
  upsertTravelInfo: (destId, data) => api.put(`/admin/travel-info/${destId}`, data),
};

export default api;
