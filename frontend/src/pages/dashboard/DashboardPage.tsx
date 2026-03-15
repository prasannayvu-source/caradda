import { useEffect } from 'react';
import { IndianRupee, ShoppingBag, Users, AlertTriangle, RefreshCw } from 'lucide-react';
import { useDashboardStore } from '../../state/dashboardStore';
import KpiCard from '../../components/dashboard/KpiCard';
import LowStockAlert from '../../components/dashboard/LowStockAlert';
import SalesChart from '../../components/dashboard/SalesChart';
import QuickBillButton from '../../components/dashboard/QuickBillButton';

const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const formatDate = (d: Date) =>
  d.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

export default function DashboardPage() {
  const {
    todaySales, todayExpenses, customersToday, lowStockCount,
    lowStockItems, weeklyChart, isLoading, lastFetched, fetchDashboard,
  } = useDashboardStore();

  // Initial fetch + 60-second polling
  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 60_000);
    return () => clearInterval(interval);
  }, []);

  const netProfit = todaySales - todayExpenses;

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red mb-1">Overview</p>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-muted text-sm mt-0.5">{formatDate(new Date())}</p>
        </div>
        <div className="flex items-center gap-3">
          {lastFetched && (
            <span className="text-xs text-muted hidden sm:block">
              Updated {lastFetched.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={fetchDashboard}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-800 border border-navy-700
                       text-muted hover:text-white hover:border-navy-600 transition-all text-sm
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* ── KPI Grid (4 cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<IndianRupee />}
          title="Today's Sales"
          value={formatINR(todaySales)}
          color="gold"
          isLoading={isLoading}
        />
        <KpiCard
          icon={<ShoppingBag />}
          title="Today's Expenses"
          value={formatINR(todayExpenses)}
          color="red"
          isLoading={isLoading}
        />
        <KpiCard
          icon={<Users />}
          title="Customers Today"
          value={String(customersToday)}
          color="navy"
          isLoading={isLoading}
        />
        <KpiCard
          icon={<AlertTriangle />}
          title="Low Stock Alerts"
          value={String(lowStockCount)}
          color="warning"
          isLoading={isLoading}
        />
      </div>

      {/* ── Net Profit Banner ── */}
      {!isLoading && (
        <div className={`rounded-2xl border px-6 py-4 flex items-center justify-between
          ${netProfit >= 0
            ? 'bg-success/5 border-success/20'
            : 'bg-red/5 border-red/20'
          }`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-0.5">
              Today's Net
            </p>
            <p className={`text-2xl font-bold tabular-nums ${netProfit >= 0 ? 'text-gold' : 'text-red'}`}>
              {formatINR(netProfit)}
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted">Sales vs Expenses</p>
            <p className="text-sm font-medium text-white mt-0.5">
              {formatINR(todaySales)} &minus; {formatINR(todayExpenses)}
            </p>
          </div>
        </div>
      )}

      {/* ── Main Grid: Chart + Low Stock ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart spans 2/3 */}
        <div className="lg:col-span-2">
          <SalesChart data={weeklyChart} isLoading={isLoading} />
        </div>
        {/* Low stock spans 1/3 */}
        <div className="lg:col-span-1">
          <LowStockAlert items={lowStockItems} isLoading={isLoading} />
        </div>
      </div>

      {/* ── Floating Quick Bill Button ── */}
      <QuickBillButton />
    </div>
  );
}
