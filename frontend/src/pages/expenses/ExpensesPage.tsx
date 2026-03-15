import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, IndianRupee } from 'lucide-react';
import { useExpenseStore } from '../../state/expenseStore';
import ExpenseTable from '../../components/expenses/ExpenseTable';
import { EXPENSE_CATEGORIES } from '../../components/expenses/ExpenseCategoryBadge';

const TODAY = new Date().toISOString().split('T')[0];
const MONTH_START = `${TODAY.slice(0, 7)}-01`;

export default function ExpensesPage() {
  const navigate = useNavigate();
  const { expenses, isLoading, totalAmount, totalCount, fetchExpenses, deleteExpense } = useExpenseStore();

  const [dateFrom, setDateFrom] = useState(MONTH_START);
  const [dateTo, setDateTo]     = useState(TODAY);
  const [category, setCategory] = useState('');

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const doFetch = () =>
    fetchExpenses({
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      category: category || undefined,
    });

  useEffect(() => { doFetch(); }, []);

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red mb-1">Finance</p>
          <h1 className="text-2xl font-bold text-white">Expenses</h1>
          <p className="text-muted text-sm mt-0.5">
            {isLoading ? 'Loading…' : `${totalCount} entries · ${fmt(totalAmount)}`}
          </p>
        </div>
        <button
          onClick={() => navigate('/expenses/new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-red text-white rounded-xl font-semibold text-sm hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red/20"
        >
          <Plus className="w-4 h-4" />
          Log Expense
        </button>
      </div>

      {/* Filters */}
      <div className="bg-navy-800 rounded-2xl border border-navy-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-muted" />
          <span className="text-sm font-semibold text-white">Filters</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-muted mb-1">From</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              style={{ colorScheme: 'dark' }}
              className="w-full bg-navy-900 border border-navy-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30 transition-all" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">To</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              style={{ colorScheme: 'dark' }}
              className="w-full bg-navy-900 border border-navy-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30 transition-all" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              style={{ colorScheme: 'dark' }}
              className="w-full bg-navy-900 border border-navy-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30 transition-all">
              <option value="">All Categories</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button onClick={doFetch}
            className="px-5 py-2 bg-red text-white font-semibold text-sm rounded-xl hover:bg-red-600 active:scale-95 transition-all">
            Apply
          </button>
        </div>
      </div>

      {/* Summary stat */}
      {!isLoading && totalCount > 0 && (
        <div className="bg-navy-800 rounded-2xl border border-red/20 px-5 py-4 flex items-center gap-3">
          <IndianRupee className="w-5 h-5 text-red" />
          <div>
            <p className="text-xs text-muted uppercase tracking-wide font-semibold">Total Expenses</p>
            <p className="text-2xl font-extrabold text-red tabular-nums mt-0.5">{fmt(totalAmount)}</p>
          </div>
        </div>
      )}

      {/* Skeleton */}
      {isLoading && (
        <div className="rounded-2xl border border-navy-700 animate-pulse">
          <div className="bg-navy-700 h-11 rounded-t-2xl" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-navy-700 h-14 flex gap-4 px-4 py-4">
              <div className="h-3 bg-navy-700 rounded w-20" />
              <div className="h-3 bg-navy-700 rounded w-36" />
              <div className="h-3 bg-navy-700 rounded w-24 ml-auto" />
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      {!isLoading && <ExpenseTable expenses={expenses} onDelete={deleteExpense} />}
    </div>
  );
}
