import api from './axiosInstance'

export const userApi = {
  getAll:        (search = '') => api.get('/users', { params: search ? { search } : {} }),
  getById:       (id)          => api.get(`/users/${id}`),
  create:        (data)        => api.post('/users', data),
  update:        (id, data)    => api.put(`/users/${id}`, data),
  toggleActive:  (id)          => api.patch(`/users/${id}/toggle-active`),
  resetPassword: (id, password)=> api.patch(`/users/${id}/reset-password`, { password }),
}
