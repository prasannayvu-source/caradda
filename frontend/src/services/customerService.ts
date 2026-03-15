import apiClient from './apiClient';

export const getCustomers = (search: string = '') =>
  apiClient.get('/customers/', { params: { search } });

export const getCustomerById = (id: string) =>
  apiClient.get(`/customers/${id}`);

export const getCustomerHistory = (id: string) =>
  apiClient.get(`/customers/${id}/history`);

export const findOrCreateCustomer = (phone: string, name: string) =>
  apiClient.post('/customers/find-or-create', { phone, name });

export const updateCustomer = (id: string, name: string) =>
  apiClient.put(`/customers/${id}`, { name });
