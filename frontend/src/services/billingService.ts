import apiClient from './apiClient';

export interface BillItemDto {
  service_id?: string;
  description?: string;
  quantity: number;
  unit_price: number;
}

export interface CreateBillDto {
  customer_phone: string;
  customer_name: string;
  car_number: string;
  items: BillItemDto[];
  discount: number;
  payment_method: 'cash' | 'upi';
  payment_status: 'paid' | 'pending';
  notes?: string;
}

export interface BillFilters {
  date_from?: string;
  date_to?: string;
  payment_method?: string;
  payment_status?: string;
}

export const createBill = (data: CreateBillDto) =>
  apiClient.post('/billing/', data);

export const getBills = (filters?: BillFilters) =>
  apiClient.get('/billing/', { params: filters });

export const getBillById = (id: string) =>
  apiClient.get(`/billing/${id}`);

export const downloadBillPDF = (id: string) =>
  apiClient.get(`/billing/${id}/pdf`, { responseType: 'blob' });

export const sendWhatsApp = (id: string) =>
  apiClient.post(`/billing/${id}/whatsapp`);
