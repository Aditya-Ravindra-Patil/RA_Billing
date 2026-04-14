import api from './axiosInstance'

export const projectApi = {
  getAll:       (search = '') => api.get('/projects', { params: search ? { search } : {} }),
  getById:      (id)          => api.get(`/projects/${id}`),
  getByWorkKey: (workKey)     => api.get(`/projects/by-key/${workKey}`),
  create:       (data)        => api.post('/projects', data),
  update:       (id, d)       => api.put(`/projects/${id}`, d),
  delete:       (id)          => api.delete(`/projects/${id}`),
}
