import api from './axiosInstance'

export const raBillApi = {
  getAll:        ()              => api.get('/bills'),
  getById:       (id)            => api.get(`/bills/${id}`),
  getByProject:  (projectId)     => api.get(`/bills/project/${projectId}`),
  getMyPending:  ()              => api.get('/bills/my-pending'),
  upload:        (projectId, file) => {
    const form = new FormData()
    form.append('file', file)
    form.append('projectId', projectId)
    return api.post('/bills/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  submit:        (id)            => api.post(`/bills/${id}/submit`),
  reupload:      (id, file)      => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/bills/${id}/reupload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  downloadFile:    (id)            => api.get(`/bills/${id}/download`, { responseType: 'blob' }),
  paymentAction:   (id, data)      => api.post(`/bills/${id}/payment-action`, data),
}
