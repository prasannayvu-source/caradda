import apiClient from './apiClient';

export interface CreateVendorDto {
  name: string;
  phone?: string;
  address?: string;
  email?: string;
}

export interface UpdateVendorDto {
  name?: string;
  phone?: string;
  address?: string;
  email?: string;
}

export interface CreatePurchaseDto {
  vendor_id: string;
  inventory_id: string;
  quantity: number;
  unit_price: number;
  purchase_date: string;
  notes?: string;
  auto_create_expense?: boolean;
}

export interface PurchaseFilters {
  vendor_id?: string;
  date_from?: string;
  date_to?: string;
}

// Vendors
export const getVendors = () => apiClient.get('/vendors/');
export const getVendorById = (id: string) => apiClient.get(`/vendors/${id}`);
export const createVendor = (data: CreateVendorDto) => apiClient.post('/vendors/', data);
export const updateVendor = (id: string, data: UpdateVendorDto) => apiClient.put(`/vendors/${id}`, data);

// Purchases
export const getPurchases = (filters?: PurchaseFilters) =>
  apiClient.get('/purchases/', { params: filters });
export const recordPurchase = (data: CreatePurchaseDto) =>
  apiClient.post('/purchases/', data);
