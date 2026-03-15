import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, Filter, IndianRupee, Inbox } from 'lucide-react';
import { useBillingStore } from '../../state/billingStore';
import BillCard from '../../components/billing/BillCard';

const TODAY = new Date().toISOString().split('T')[0];

export default function BillListPage() {
  const navigate = useNavigate();
  const { bills, isLoading, totalBills, totalAmount, fetchBills } = useBillingStore();
  const [dateFrom, setDateFrom] = useState(TODAY);
  const [dateTo, setDateTo]     = useState(TODAY);
  const [payMethod, setPayMethod] = useState('');
  const [payStatus, setPayStatus] = useState('');

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const doFetch = () =>
    fetchBills({
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      payment_method: payMethod || undefined,
      payment_status: payStatus || undefined,
    });

  useEffect(() => { doFetch(); }, []);

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red mb-1">Billing</p>
          <h1 className="text-2xl font-bold text-white">Bills</h1>
          <p className="text-muted text-sm mt-0.5">
            {isLoading ? 'Loading…' : `${totalBills} bill${totalBills !== 1 ? 's' : ''} · ${fmt(totalAmount)}`}
          </p>
        </div>
        <button
          onClick={() => navigate('/billing/new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-red text-white rounded-xl font-semibold text-sm hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red/20"
        >
          <Receipt className="w-4 h-4" />
          New Bill
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="bg-navy-800 rounded-2xl border border-navy-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-muted" />
          <span className="text-sm font-semibold text-white">Filters</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
            <label className="block text-xs text-muted mb-1">Payment</label>
            <select value={payMethod} onChange={(e) => setPayMethod(e.target.value)}
              style={{ colorScheme: 'dark' }}
              className="w-full bg-navy-900 border border-navy-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30 transition-all">
              <option value="">All</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Status</label>
            <select value={payStatus} onChange={(e) => setPayStatus(e.target.value)}
              style={{ colorScheme: 'dark' }}
              className="w-full bg-navy-900 border border-navy-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30 transition-all">
              <option value="">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button onClick={doFetch}
            className="px-5 py-2 bg-red text-white font-semibold text-sm rounded-xl hover:bg-red-600 active:scale-95 transition-all">
            Apply Filters
          </button>
        </div>
      </div>

      {/* ── Summary Banner ── */}
      {!isLoading && totalBills > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-navy-800 rounded-2xl border border-navy-700 px-5 py-4">
            <p className="text-xs text-muted uppercase tracking-wide font-semibold">Total Bills</p>
            <p className="text-2xl font-bold text-white mt-1">{totalBills}</p>
          </div>
          <div className="bg-navy-800 rounded-2xl border border-gold/20 px-5 py-4">
            <p className="text-xs text-muted uppercase tracking-wide font-semibold flex items-center gap-1">
              <IndianRupee className="w-3 h-3" /> Revenue
            </p>
            <p className="text-2xl font-bold text-gold mt-1 tabular-nums">{fmt(totalAmount)}</p>
          </div>
        </div>
      )}

      {/* ── Bills list ── */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-navy-800 rounded-2xl border border-navy-700 p-4 h-[68px] animate-pulse" />
          ))}
        </div>
      ) : bills.length > 0 ? (
        <div className="space-y-3">
          {bills.map((b) => <BillCard key={b.id} bill={b} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Inbox className="w-14 h-14 text-navy-600 mb-4" />
          <p className="text-white font-semibold">No bills found</p>
          <p className="text-muted text-sm mt-1">Try adjusting filters or create a new bill</p>
        </div>
      )}
    </div>
  );
}
