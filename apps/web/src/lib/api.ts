import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  register: (data: any) =>
    apiClient.post('/auth/register', data),
};

export const appointmentsAPI = {
  create: (data: any) =>
    apiClient.post('/appointments', data),
  list: (filters?: any) =>
    apiClient.get('/appointments', { params: filters }),
  findById: (id: string) =>
    apiClient.get(`/appointments/${id}`),
  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/appointments/${id}/status`, { status }),
  cancel: (id: string, reason: string) =>
    apiClient.post(`/appointments/${id}/cancel`, { reason }),
};

export const patientsAPI = {
  create: (data: any) =>
    apiClient.post('/patients', data),
  list: () =>
    apiClient.get('/patients'),
  findById: (id: string) =>
    apiClient.get(`/patients/${id}`),
};

export const financialAPI = {
  createInvoice: (data: any) =>
    apiClient.post('/financial/invoices', data),
  listInvoices: (filters?: any) =>
    apiClient.get('/financial/invoices', { params: filters }),
  recordPayment: (invoiceId: string, amount: number) =>
    apiClient.post(`/financial/invoices/${invoiceId}/payment`, { amount }),
  getRevenue: (params?: any) =>
    apiClient.get('/financial/revenue', { params }),
};

export default apiClient;
