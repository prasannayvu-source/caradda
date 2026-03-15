import { create } from 'zustand';
import { createBill as apiCreateBill, getBills, getBillById, type CreateBillDto, type BillFilters } from '../services/billingService';
import toast from 'react-hot-toast';

export interface DraftItem {
  service_id?: string;
  service_name?: string;
  description?: string;
  quantity: number;
  unit_price: number;
}

export interface DraftBill {
  customer_phone: string;
  customer_name: string;
  customer_id?: string;
  car_number: string;
  items: DraftItem[];
  discount: number;
  payment_method: 'cash' | 'upi';
  payment_status: 'paid' | 'pending';
  notes: string;
}

export interface BillSummary {
  id: string;
  bill_number: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
  customers?: { id: string; name: string; phone: string };
}

export interface BillDetail extends BillSummary {
  subtotal: number;
  discount: number;
  vehicle_id?: string;
  items: Array<{
    id: string;
    service_name: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }>;
  customers: { id: string; name: string; phone: string };
  vehicles?: { id: string; car_number: string; car_model?: string };
}

const DEFAULT_DRAFT: DraftBill = {
  customer_phone: '',
  customer_name: '',
  car_number: '',
  items: [],
  discount: 0,
  payment_method: 'cash',
  payment_status: 'paid',
  notes: '',
};

interface BillingState {
  bills: BillSummary[];
  currentBill: BillDetail | null;
  draftBill: DraftBill;
  filters: BillFilters;
  isLoading: boolean;
  isDetailLoading: boolean;
  isSubmitting: boolean;
  totalAmount: number;
  totalBills: number;
  createBill: (data: CreateBillDto) => Promise<string | null>;
  fetchBills: (filters?: BillFilters) => Promise<void>;
  fetchBillById: (id: string) => Promise<void>;
  updateDraft: (partial: Partial<DraftBill>) => void;
  setDraftItems: (items: DraftItem[]) => void;
  resetDraft: () => void;
  setFilters: (f: BillFilters) => void;
}

export const useBillingStore = create<BillingState>((set) => ({
  bills: [],
  currentBill: null,
  draftBill: { ...DEFAULT_DRAFT },
  filters: {},
  isLoading: false,
  isDetailLoading: false,
  isSubmitting: false,
  totalAmount: 0,
  totalBills: 0,

  createBill: async (data) => {
    set({ isSubmitting: true });
    try {
      const res = await apiCreateBill(data);
      toast.success(`Bill ${res.data.bill_number} created successfully!`);
      set({ isSubmitting: false });
      return res.data.id as string;
    } catch (err: any) {
      const msg = err?.response?.data?.detail ?? 'Failed to create bill';
      toast.error(msg);
      set({ isSubmitting: false });
      return null;
    }
  },

  fetchBills: async (filters = {}) => {
    set({ isLoading: true, filters });
    try {
      const res = await getBills(filters);
      set({
        bills: res.data.bills ?? [],
        totalBills: res.data.total ?? 0,
        totalAmount: res.data.total_amount ?? 0,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchBillById: async (id) => {
    set({ isDetailLoading: true, currentBill: null });
    try {
      const res = await getBillById(id);
      set({ currentBill: res.data, isDetailLoading: false });
    } catch {
      set({ isDetailLoading: false });
    }
  },

  updateDraft: (partial) =>
    set((s) => ({ draftBill: { ...s.draftBill, ...partial } })),

  setDraftItems: (items) =>
    set((s) => ({ draftBill: { ...s.draftBill, items } })),

  resetDraft: () => set({ draftBill: { ...DEFAULT_DRAFT } }),

  setFilters: (f) => set({ filters: f }),
}));
