import apiClient from './apiClient';

export interface SettingsDto {
  shop_name?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  wa_phone_number_id?: string;
  wa_access_token?: string;
}

export const getSettings = () => apiClient.get('/settings/');
export const updateSettings = (data: SettingsDto) => apiClient.put('/settings/', data);
