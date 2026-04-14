import api from './axiosInstance'

export const authApi = {
  login:  (data)  => api.post('/auth/login', data),
  me:     (token) => api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
  logout: ()      => api.post('/auth/logout'),
}
