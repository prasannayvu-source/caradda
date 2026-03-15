import { create } from 'zustand';
import { getDashboardSummary, getLowStockItems, getWeeklyRevenue } from '../services/dashboardService';

interface LowStockItem {
  id: string;
  item_name: string;
  quantity: number;
  unit: string | null;
  low_stock_threshold: number;
  category: string | null;
}

interface DailyRevenue {
  date: string;
  revenue: number;
}

interface DashboardState {
  todaySales: number;
  todayExpenses: number;
  customersToday: number;
  lowStockCount: number;
  lowStockItems: LowStockItem[];
  weeklyChart: DailyRevenue[];
  isLoading: boolean;
  lastFetched: Date | null;
  fetchDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  todaySales: 0,
  todayExpenses: 0,
  customersToday: 0,
  lowStockCount: 0,
  lowStockItems: [],
  weeklyChart: [],
  isLoading: false,
  lastFetched: null,

  fetchDashboard: async () => {
    set({ isLoading: true });
    try {
      const [summaryRes, lowStockRes, weeklyRes] = await Promise.all([
        getDashboardSummary(),
        getLowStockItems(),
        getWeeklyRevenue(),
      ]);

      set({
        todaySales: summaryRes.data.today_sales ?? 0,
        todayExpenses: summaryRes.data.today_expenses ?? 0,
        customersToday: summaryRes.data.customers_today ?? 0,
        lowStockCount: summaryRes.data.low_stock_count ?? 0,
        lowStockItems: lowStockRes.data.items ?? [],
        weeklyChart: weeklyRes.data.data ?? [],
        isLoading: false,
        lastFetched: new Date(),
      });
    } catch {
      set({ isLoading: false });
    }
  },
}));
