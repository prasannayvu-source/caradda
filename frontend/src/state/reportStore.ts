import { create } from 'zustand';
import {
  getReportSummary, getSalesChart, getExpenseBreakdown, getTopServices,
} from '../services/reportService';

export interface ReportSummary {
  period: { from: string; to: string };
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  total_customers: number;
  total_bills: number;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
}

export interface ExpenseCategoryBreakdown {
  category: string;
  total: number;
}

export interface ServiceRevenue {
  name: string;
  count: number;
  revenue: number;
}

interface ReportState {
  summary: ReportSummary | null;
  salesChart: DailyRevenue[];
  expenseChart: ExpenseCategoryBreakdown[];
  topServices: ServiceRevenue[];
  dateRange: { from: string; to: string };
  isLoading: boolean;
  fetchReport: (from: string, to: string) => Promise<void>;
  setDateRange: (from: string, to: string) => void;
}

// Month helpers
const padTwo = (n: number) => String(n).padStart(2, '0');
const today = new Date();
const MONTH_START = `${today.getFullYear()}-${padTwo(today.getMonth() + 1)}-01`;
const MONTH_END = today.toISOString().split('T')[0];

export const useReportStore = create<ReportState>((set) => ({
  summary: null,
  salesChart: [],
  expenseChart: [],
  topServices: [],
  dateRange: { from: MONTH_START, to: MONTH_END },
  isLoading: false,

  fetchReport: async (from, to) => {
    set({ isLoading: true });
    try {
      const [summaryRes, salesRes, expRes, topRes] = await Promise.all([
        getReportSummary(from, to),
        getSalesChart(from, to),
        getExpenseBreakdown(from, to),
        getTopServices(from, to),
      ]);
      set({
        summary: summaryRes.data,
        salesChart: salesRes.data.data ?? [],
        expenseChart: expRes.data.breakdown ?? [],
        topServices: topRes.data.services ?? [],
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  setDateRange: (from, to) => set({ dateRange: { from, to } }),
}));
