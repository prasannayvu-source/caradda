import { create } from 'zustand';
import {
  getExpenses, createExpense as apiCreate, updateExpense as apiUpdate,
  deleteExpense as apiDelete, type CreateExpenseDto, type UpdateExpenseDto, type ExpenseFilters,
} from '../services/expenseService';
import toast from 'react-hot-toast';

export interface Expense {
  id: string;
  name?: string;
  description?: string;
  category: string;
  amount: number;
  expense_date: string;
  notes?: string;
  created_at?: string;
}

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  isSubmitting: boolean;
  totalAmount: number;
  totalCount: number;
  fetchExpenses: (filters?: ExpenseFilters) => Promise<void>;
  createExpense: (data: CreateExpenseDto) => Promise<boolean>;
  updateExpense: (id: string, data: UpdateExpenseDto) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  isLoading: false,
  isSubmitting: false,
  totalAmount: 0,
  totalCount: 0,

  fetchExpenses: async (filters) => {
    set({ isLoading: true });
    try {
      const res = await getExpenses(filters);
      set({
        expenses: res.data.expenses ?? [],
        totalAmount: res.data.total_amount ?? 0,
        totalCount: res.data.total ?? 0,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  createExpense: async (data) => {
    set({ isSubmitting: true });
    try {
      await apiCreate(data);
      toast.success('Expense logged!');
      set({ isSubmitting: false });
      return true;
    } catch (e: any) {
      toast.error(e?.response?.data?.detail ?? 'Failed to log expense');
      set({ isSubmitting: false });
      return false;
    }
  },

  updateExpense: async (id, data) => {
    set({ isSubmitting: true });
    try {
      await apiUpdate(id, data);
      toast.success('Expense updated!');
      set({ isSubmitting: false });
      return true;
    } catch {
      toast.error('Update failed');
      set({ isSubmitting: false });
      return false;
    }
  },

  deleteExpense: async (id) => {
    try {
      await apiDelete(id);
      toast.success('Expense deleted');
      set((s) => ({
        expenses: s.expenses.filter((e) => e.id !== id),
        totalCount: s.totalCount - 1,
      }));
    } catch {
      toast.error('Delete failed');
    }
  },
}));
