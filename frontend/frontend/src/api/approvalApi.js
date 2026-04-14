import api from './axiosInstance'

export const approvalApi = {
  processAction: (billId, data) => api.post(`/bills/${billId}/action`, data),
  getLogs:       (billId)       => api.get(`/bills/${billId}/logs`),
}
