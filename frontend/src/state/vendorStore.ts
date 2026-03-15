import { create } from 'zustand';
import {
  getVendors, getVendorById, createVendor as apiCreateVendor,
  updateVendor as apiUpdateVendor, getPurchases, recordPurchase as apiRecordPurchase,
  type CreateVendorDto, type UpdateVendorDto, type CreatePurchaseDto, type PurchaseFilters,
} from '../services/vendorService';
import toast from 'react-hot-toast';

export interface Vendor {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  total_spent: number;
  purchase_count: number;
  created_at?: string;
}

export interface PurchaseRecord {
  id: string;
  vendor_id?: string;
  inventory_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  purchase_date: string;
  notes?: string;
  created_at?: string;
  item_name?: string;
  unit?: string;
  vendors?: { id: string; name: string };
  inventory?: { id: string; item_name: string; unit: string };
}

export interface VendorDetail extends Vendor {
  purchases: PurchaseRecord[];
}

interface VendorState {
  vendors: Vendor[];
  selectedVendor: VendorDetail | null;
  purchases: PurchaseRecord[];
  isLoading: boolean;
  isDetailLoading: boolean;
  isSubmitting: boolean;
  totalPurchases: number;
  totalAmount: number;
  fetchVendors: () => Promise<void>;
  fetchVendorById: (id: string) => Promise<void>;
  createVendor: (data: CreateVendorDto) => Promise<boolean>;
  updateVendor: (id: string, data: UpdateVendorDto) => Promise<boolean>;
  fetchPurchases: (filters?: PurchaseFilters) => Promise<void>;
  recordPurchase: (data: CreatePurchaseDto) => Promise<boolean>;
  clearSelected: () => void;
}

export const useVendorStore = create<VendorState>((set) => ({
  vendors: [],
  selectedVendor: null,
  purchases: [],
  isLoading: false,
  isDetailLoading: false,
  isSubmitting: false,
  totalPurchases: 0,
  totalAmount: 0,

  fetchVendors: async () => {
    set({ isLoading: true });
    try {
      const res = await getVendors();
      set({ vendors: res.data.vendors ?? [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchVendorById: async (id) => {
    set({ isDetailLoading: true, selectedVendor: null });
    try {
      const res = await getVendorById(id);
      set({ selectedVendor: res.data, isDetailLoading: false });
    } catch {
      set({ isDetailLoading: false });
    }
  },

  createVendor: async (data) => {
    set({ isSubmitting: true });
    try {
      await apiCreateVendor(data);
      toast.success(`${data.name} added as vendor!`);
      set({ isSubmitting: false });
      return true;
    } catch (e: any) {
      toast.error(e?.response?.data?.detail ?? 'Failed to add vendor');
      set({ isSubmitting: false });
      return false;
    }
  },

  updateVendor: async (id, data) => {
    set({ isSubmitting: true });
    try {
      await apiUpdateVendor(id, data);
      toast.success('Vendor updated!');
      set({ isSubmitting: false });
      return true;
    } catch {
      toast.error('Update failed');
      set({ isSubmitting: false });
      return false;
    }
  },

  fetchPurchases: async (filters) => {
    set({ isLoading: true });
    try {
      const res = await getPurchases(filters);
      set({
        purchases: res.data.purchases ?? [],
        totalPurchases: res.data.total ?? 0,
        totalAmount: res.data.total_amount ?? 0,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  recordPurchase: async (data) => {
    set({ isSubmitting: true });
    try {
      await apiRecordPurchase(data);
      toast.success(`Purchase recorded! Inventory updated.`);
      set({ isSubmitting: false });
      return true;
    } catch (e: any) {
      toast.error(e?.response?.data?.detail ?? 'Failed to record purchase');
      set({ isSubmitting: false });
      return false;
    }
  },

  clearSelected: () => set({ selectedVendor: null }),
}));
