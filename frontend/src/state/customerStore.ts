import { create } from 'zustand';
import { getCustomers, getCustomerById, getCustomerHistory } from '../services/customerService';

export interface Vehicle {
  id: string;
  car_number: string;
  car_model?: string;
  customer_id: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  vehicles: string[];
  vehicle_details?: Vehicle[];
  total_visits: number;
  last_visit: string | null;
  created_at?: string;
}

export interface CustomerDetail extends Customer {
  total_spent: number;
  vehicle_details: Vehicle[];
}

export interface BillItem {
  id?: string;
  service_name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface BillHistory {
  id: string;
  bill_number: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
  bill_items: BillItem[];
}

interface CustomerState {
  customers: Customer[];
  selectedCustomer: CustomerDetail | null;
  customerHistory: BillHistory[];
  searchQuery: string;
  isLoading: boolean;
  isDetailLoading: boolean;
  total: number;
  setSearchQuery: (q: string) => void;
  fetchCustomers: (query?: string) => Promise<void>;
  fetchCustomerById: (id: string) => Promise<void>;
  fetchCustomerHistory: (id: string) => Promise<void>;
  clearSelected: () => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  selectedCustomer: null,
  customerHistory: [],
  searchQuery: '',
  isLoading: false,
  isDetailLoading: false,
  total: 0,

  setSearchQuery: (q) => set({ searchQuery: q }),

  fetchCustomers: async (query = '') => {
    set({ isLoading: true });
    try {
      const res = await getCustomers(query);
      set({
        customers: res.data.customers ?? [],
        total: res.data.total ?? 0,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchCustomerById: async (id: string) => {
    set({ isDetailLoading: true, selectedCustomer: null });
    try {
      const res = await getCustomerById(id);
      set({ selectedCustomer: res.data, isDetailLoading: false });
    } catch {
      set({ isDetailLoading: false });
    }
  },

  fetchCustomerHistory: async (id: string) => {
    try {
      const res = await getCustomerHistory(id);
      set({ customerHistory: res.data.bills ?? [] });
    } catch {
      set({ customerHistory: [] });
    }
  },

  clearSelected: () => set({ selectedCustomer: null, customerHistory: [] }),
}));
