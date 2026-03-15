import { useEffect, useState } from 'react';
import {
  BarChart2, TrendingUp, Users, ReceiptText,
  RefreshCw, Trophy, Download
} from 'lucide-react';
import { useReportStore } from '../../state/reportStore';
import ReportKpiCard from '../../components/reports/ReportKpiCard';
import SalesBarChart from '../../components/reports/SalesBarChart';
import ExpenseDoughnutChart from '../../components/reports/ExpenseDoughnutChart';
import TopServicesTable from '../../components/reports/TopServicesTable';
import ExportButton from '../../components/reports/ExportButton';
import { Spinner } from '../../components/ui/Spinner';

const padTwo = (n: number) => String(n).padStart(2, '0');
const todayDate = new Date();
const THIS_MONTH_START = `${todayDate.getFullYear()}-${padTwo(todayDate.getMonth() + 1)}-01`;
const TODAY = todayDate.toISOString().split('T')[0];

const PRESETS = [
  { label: 'Today', from: TODAY, to: TODAY },
  {
    label: 'This Month',
    from: THIS_MONTH_START,
    to: TODAY,
  },
  {
    label: 'Last 30 Days',
    from: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
    to: TODAY,
  },
  {
    label: 'This Year',
    from: `${todayDate.getFullYear()}-01-01`,
    to: TODAY,
  },
];

export default function ReportsPage() {
  const { summary, salesChart, expenseChart, topServices, isLoading, fetchReport, setDateRange } = useReportStore();

  const [from, setFrom] = useState(THIS_MONTH_START);
  const [to, setTo]     = useState(TODAY);
  const [activePreset, setActivePreset] = useState('This Month');

  const doFetch = (f = from, t = to) => {
    setDateRange(f, t);
    fetchReport(f, t);
  };

  useEffect(() => { doFetch(); }, []);

  const handlePreset = (preset: typeof PRESETS[0]) => {
    setFrom(preset.from);
    setTo(preset.to);
    setActivePreset(preset.label);
    doFetch(preset.from, preset.to);
  };

  const inputClass = `
    bg-[#0F172A] border border-navy-700 text-white rounded-xl
    px-3 py-2 text-sm focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30
    transition-all duration-150
  `;

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* ── Header ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-red mb-1">Analytics</p>
        <h1 className="text-2xl font-bold text-white">Business Reports</h1>
        <p className="text-muted text-sm mt-0.5">
          {summary ? `${summary.period.from} → ${summary.period.to}` : 'Select a date range to view your report'}
        </p>
      </div>

      {/* ── Date controls ── */}
      <div className="bg-navy-800 rounded-2xl border border-navy-700 p-4 space-y-3">
        {/* Presets */}
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => handlePreset(p)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all
                ${activePreset === p.label
                  ? 'bg-red text-white shadow shadow-red/20'
                  : 'bg-navy-700 border border-navy-600 text-muted hover:text-white'
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        {/* Custom date range */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted">From</label>
            <input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setActivePreset(''); }}
              style={{ colorScheme: 'dark' }}
              className={inputClass} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted">To</label>
            <input type="date" value={to} onChange={(e) => { setTo(e.target.value); setActivePreset(''); }}
              style={{ colorScheme: 'dark' }}
              className={inputClass} />
          </div>
          <button
            onClick={() => doFetch()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-red text-white rounded-xl font-semibold text-sm hover:bg-red-600 active:scale-95 disabled:opacity-50 transition-all"
          >
            {isLoading
              ? <Spinner size="sm" />
              : <RefreshCw className="w-3.5 h-3.5" />
            }
            Apply
          </button>
        </div>
      </div>

      {/* ── Loading skeleton ── */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-navy-800 rounded-2xl border border-navy-700 h-28" />
          ))}
        </div>
      )}

      {summary && !isLoading && (
        <>
          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ReportKpiCard
              label="Total Revenue"
              value={summary.total_revenue}
              subLabel={`${summary.total_bills} bill${summary.total_bills !== 1 ? 's' : ''}`}
            />
            <ReportKpiCard
              label="Total Expenses"
              value={summary.total_expenses}
              isRed
            />
            <ReportKpiCard
              label="Net Profit"
              value={summary.net_profit}
              isGold
            />
            <ReportKpiCard
              label="Customers Served"
              value={summary.total_customers}
              prefix=""
              subLabel="Unique customers"
            />
          </div>

          {/* ── Profit summary banner ── */}
          <div className={`rounded-2xl border px-6 py-4 flex items-center justify-between gap-4 flex-wrap
            ${summary.net_profit >= 0
              ? 'bg-success/5 border-success/20'
              : 'bg-red/5 border-red/20'
            }`}>
            <div className="flex items-center gap-3">
              <TrendingUp className={`w-6 h-6 ${summary.net_profit >= 0 ? 'text-success' : 'text-red'}`} />
              <div>
                <p className="text-sm font-semibold text-white">
                  {summary.net_profit >= 0 ? 'Business is Profitable' : 'Running at a Loss'}
                </p>
                <p className="text-muted text-xs mt-0.5">
                  Revenue ₹{summary.total_revenue.toLocaleString('en-IN')} − Expenses ₹{summary.total_expenses.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            <p className={`text-2xl font-extrabold tabular-nums ${summary.net_profit >= 0 ? 'text-success' : 'text-red'}`}>
              {summary.net_profit >= 0 ? '+' : ''}
              ₹{Math.abs(summary.net_profit).toLocaleString('en-IN')}
            </p>
          </div>

          {/* ── Charts row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Sales chart — takes 2/3 */}
            <div className="lg:col-span-2 bg-navy-800 rounded-2xl border border-navy-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="w-4 h-4 text-muted" />
                <h2 className="text-sm font-semibold text-white">Daily Revenue</h2>
                <span className="text-xs text-muted ml-auto">{salesChart.length} days</span>
              </div>
              <SalesBarChart data={salesChart} />
            </div>

            {/* Expense breakdown — takes 1/3 */}
            <div className="bg-navy-800 rounded-2xl border border-navy-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <ReceiptText className="w-4 h-4 text-muted" />
                <h2 className="text-sm font-semibold text-white">Expense Breakdown</h2>
              </div>
              <ExpenseDoughnutChart data={expenseChart} />
            </div>
          </div>

          {/* ── Top Services ── */}
          <div className="bg-navy-800 rounded-2xl border border-navy-700 p-5">
            <div className="flex items-center gap-2 mb-5">
              <Trophy className="w-4 h-4 text-gold" />
              <h2 className="text-sm font-semibold text-white">Top Services by Revenue</h2>
              <span className="text-xs text-muted ml-auto">{topServices.length} services</span>
            </div>
            <TopServicesTable services={topServices} />
          </div>

          {/* ── Customers stat ── */}
          <div className="bg-navy-800 rounded-2xl border border-navy-700 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-muted" />
              <h2 className="text-sm font-semibold text-white">Customer Volume</h2>
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-3xl font-extrabold text-white tabular-nums">{summary.total_customers}</p>
                <p className="text-muted text-xs mt-1">Unique customers served</p>
              </div>
              <div className="border-l border-navy-700 pl-6">
                <p className="text-3xl font-extrabold text-gold tabular-nums">{summary.total_bills}</p>
                <p className="text-muted text-xs mt-1">Total bills raised</p>
              </div>
              {summary.total_bills > 0 && (
                <div className="border-l border-navy-700 pl-6">
                  <p className="text-3xl font-extrabold text-success tabular-nums">
                    ₹{Math.round(summary.total_revenue / summary.total_bills).toLocaleString('en-IN')}
                  </p>
                  <p className="text-muted text-xs mt-1">Avg bill value</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Export row ── */}
          <div className="bg-navy-800 rounded-2xl border border-navy-700 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Download className="w-4 h-4 text-muted" />
              <h2 className="text-sm font-semibold text-white">Export Data</h2>
              <span className="text-xs text-muted ml-1">
                ({from} → {to})
              </span>
            </div>
            <div className="flex gap-3 flex-wrap">
              <ExportButton type="bills" from={from} to={to} />
              <ExportButton type="expenses" from={from} to={to} />
            </div>
          </div>
        </>
      )}

      {/* Empty state — no data after fetch */}
      {!isLoading && !summary && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BarChart2 className="w-14 h-14 text-navy-600 mb-4" />
          <p className="text-white font-semibold">No data yet</p>
          <p className="text-muted text-sm mt-1">Select a date range and click Apply</p>
        </div>
      )}
    </div>
  );
}
