import { create } from 'zustand';
import {
  getInventory, getInventoryById, createInventoryItem,
  updateInventoryItem, addStock as apiAddStock,
  getUsageHistory, getServiceMappings, upsertServiceMapping, deleteServiceMapping,
  type CreateInventoryDto, type UpdateInventoryDto, type ServiceMappingDto,
} from '../services/inventoryService';
import toast from 'react-hot-toast';

export type StockStatus = 'ok' | 'low' | 'out';

export interface InventoryItem {
  id: string;
  item_name: string;
  category: string;
  quantity: number;
  unit: string;
  low_stock_threshold: number;
  last_updated?: string;
  stock_status: StockStatus;
}

export interface UsageRecord {
  id: string;
  bill_id?: string;
  bill_number: string;
  quantity_used: number;
  date: string;
  created_at: string;
}

export interface ServiceMapping {
  id: string;
  service_id: string;
  inventory_id: string;
  qty_per_service: number;
  services?: { name: string };
  inventory?: { item_name: string; unit: string };
}

interface InventoryState {
  items: InventoryItem[];
  selectedItem: InventoryItem | null;
  usageHistory: UsageRecord[];
  serviceMappings: ServiceMapping[];
  categoryFilter: string;
  searchQuery: string;
  isLoading: boolean;
  isDetailLoading: boolean;
  isSubmitting: boolean;
  lowStockCount: number;
  total: number;
  fetchInventory: (category?: string, search?: string) => Promise<void>;
  fetchItemById: (id: string) => Promise<void>;
  fetchUsageHistory: (id: string) => Promise<void>;
  fetchServiceMappings: () => Promise<void>;
  addItem: (data: CreateInventoryDto) => Promise<boolean>;
  updateItem: (id: string, data: UpdateInventoryDto) => Promise<boolean>;
  addStock: (id: string, qty: number) => Promise<boolean>;
  saveMapping: (data: ServiceMappingDto) => Promise<void>;
  removeMapping: (id: string) => Promise<void>;
  setCategoryFilter: (cat: string) => void;
  setSearchQuery: (q: string) => void;
  clearSelected: () => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  selectedItem: null,
  usageHistory: [],
  serviceMappings: [],
  categoryFilter: '',
  searchQuery: '',
  isLoading: false,
  isDetailLoading: false,
  isSubmitting: false,
  lowStockCount: 0,
  total: 0,

  fetchInventory: async (category = '', search = '') => {
    set({ isLoading: true });
    try {
      const res = await getInventory(category || undefined, search || undefined);
      set({
        items: res.data.items ?? [],
        total: res.data.total ?? 0,
        lowStockCount: res.data.low_stock_count ?? 0,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchItemById: async (id) => {
    set({ isDetailLoading: true, selectedItem: null });
    try {
      const res = await getInventoryById(id);
      set({ selectedItem: res.data, isDetailLoading: false });
    } catch {
      set({ isDetailLoading: false });
    }
  },

  fetchUsageHistory: async (id) => {
    const res = await getUsageHistory(id);
    set({ usageHistory: res.data.usage ?? [] });
  },

  fetchServiceMappings: async () => {
    const res = await getServiceMappings();
    set({ serviceMappings: res.data.mappings ?? [] });
  },

  addItem: async (data) => {
    set({ isSubmitting: true });
    try {
      await createInventoryItem(data);
      toast.success(`${data.item_name} added to inventory!`);
      set({ isSubmitting: false });
      return true;
    } catch (e: any) {
      toast.error(e?.response?.data?.detail ?? 'Failed to add item');
      set({ isSubmitting: false });
      return false;
    }
  },

  updateItem: async (id, data) => {
    set({ isSubmitting: true });
    try {
      await updateInventoryItem(id, data);
      toast.success('Item updated!');
      set({ isSubmitting: false });
      return true;
    } catch {
      toast.error('Update failed');
      set({ isSubmitting: false });
      return false;
    }
  },

  addStock: async (id, qty) => {
    set({ isSubmitting: true });
    try {
      await apiAddStock(id, qty);
      toast.success(`Stock updated! Added ${qty} units.`);
      // Refresh the list
      const { categoryFilter, searchQuery } = get();
      await get().fetchInventory(categoryFilter, searchQuery);
      set({ isSubmitting: false });
      return true;
    } catch {
      toast.error('Stock update failed');
      set({ isSubmitting: false });
      return false;
    }
  },

  saveMapping: async (data) => {
    await upsertServiceMapping(data);
    toast.success('Mapping saved!');
    get().fetchServiceMappings();
  },

  removeMapping: async (id) => {
    await deleteServiceMapping(id);
    toast.success('Mapping removed');
    get().fetchServiceMappings();
  },

  setCategoryFilter: (cat) => set({ categoryFilter: cat }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  clearSelected: () => set({ selectedItem: null, usageHistory: [] }),
}));
