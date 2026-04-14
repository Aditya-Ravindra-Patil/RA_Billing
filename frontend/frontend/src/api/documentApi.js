import api from './axiosInstance'

export const documentApi = {
  getAll: (projectId) =>
    api.get(`/projects/${projectId}/documents`),

  upload: (projectId, documentType, file, remarks = '') => {
    const form = new FormData()
    form.append('file', file)
    form.append('documentType', documentType)
    if (remarks) form.append('remarks', remarks)
    return api.post(`/projects/${projectId}/documents`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  download: (projectId, docId) =>
    api.get(`/projects/${projectId}/documents/${docId}/download`, { responseType: 'blob' }),

  delete: (projectId, docId) =>
    api.delete(`/projects/${projectId}/documents/${docId}`),
}
