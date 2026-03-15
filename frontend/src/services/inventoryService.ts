import apiClient from './apiClient';

export interface CreateInventoryDto {
  item_name: string;
  category: string;
  quantity: number;
  unit: string;
  low_stock_threshold: number;
}

export interface UpdateInventoryDto {
  item_name?: string;
  category?: string;
  unit?: string;
  low_stock_threshold?: number;
}

export interface ServiceMappingDto {
  service_id: string;
  inventory_id: string;
  qty_per_service: number;
}

export const getInventory = (category?: string, search?: string) =>
  apiClient.get('/inventory/', { params: { category, search } });

export const getInventoryById = (id: string) =>
  apiClient.get(`/inventory/${id}`);

export const createInventoryItem = (data: CreateInventoryDto) =>
  apiClient.post('/inventory/', data);

export const updateInventoryItem = (id: string, data: UpdateInventoryDto) =>
  apiClient.put(`/inventory/${id}`, data);

export const addStock = (id: string, quantity: number) =>
  apiClient.post(`/inventory/${id}/add-stock`, { quantity });

export const getUsageHistory = (id: string) =>
  apiClient.get(`/inventory/${id}/usage`);

export const getServiceMappings = () =>
  apiClient.get('/inventory/service-mappings');

export const upsertServiceMapping = (data: ServiceMappingDto) =>
  apiClient.post('/inventory/service-mappings', data);

export const deleteServiceMapping = (mappingId: string) =>
  apiClient.delete(`/inventory/service-mappings/${mappingId}`);
