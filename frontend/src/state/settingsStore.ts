import { create } from 'zustand';
import { getSettings, updateSettings, type SettingsDto } from '../services/settingsService';
import toast from 'react-hot-toast';

export interface ShopSettings {
  shop_name: string;
  address: string;
  phone: string;
  email: string;
  logo_url: string;
  wa_phone_number_id: string;
  wa_access_token: string;
}

interface SettingsState {
  settings: ShopSettings | null;
  isLoading: boolean;
  isSubmitting: boolean;
  fetchSettings: () => Promise<void>;
  saveSettings: (data: SettingsDto) => Promise<boolean>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  isLoading: false,
  isSubmitting: false,

  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      const res = await getSettings();
      set({ settings: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  saveSettings: async (data) => {
    set({ isSubmitting: true });
    try {
      const res = await updateSettings(data);
      set({ settings: res.data, isSubmitting: false });
      toast.success('Settings saved!');
      return true;
    } catch (e: any) {
      toast.error(e?.response?.data?.detail ?? 'Failed to save settings');
      set({ isSubmitting: false });
      return false;
    }
  },
}));
