import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 1 minute timeout
});

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
};

export const testimonialAPI = {
  getApproved: (params) => api.get('/testimonials', { params }),
  create: (formData) => api.post('/testimonials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const kitAPI = {
  getAll: (params) => api.get('/kits', { params }),
  getFeatured: () => api.get('/kits?featured=true&limit=12'),
};

export const resourceAPI = {
  getAll: (params) => api.get('/resources', { params }),
  getDownloads: (params) => api.get('/resources/downloads', { params }),
  getFeaturedVideos: () => api.get('/resources', { params: { featured: true, type: 'video' } }),
};

export const generateWhatsAppLink = (productName) => {
  const phone = '+250781676857';
  const text = `Hi Sunlink, I'm interested in ${productName}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

export default api;

export const projectAPI = {
 getAll: (params) => api.get('/projects', { params }),
 getById: (id) => api.get('/projects/' + id),

};
