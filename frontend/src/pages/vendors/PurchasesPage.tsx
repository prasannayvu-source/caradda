import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, IndianRupee } from 'lucide-react';
import { useVendorStore } from '../../state/vendorStore';
import PurchaseTable from '../../components/vendors/PurchaseTable';

const TODAY = new Date().toISOString().split('T')[0];

export default function PurchasesPage() {
  const navigate = useNavigate();
  const { vendors, purchases, isLoading, totalPurchases, totalAmount, fetchVendors, fetchPurchases } = useVendorStore();

  const [dateFrom, setDateFrom] = useState(TODAY);
  const [dateTo, setDateTo]     = useState(TODAY);
  const [vendorId, setVendorId] = useState('');

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const doFetch = () =>
    fetchPurchases({
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      vendor_id: vendorId || undefined,
    });

  useEffect(() => {
    fetchVendors();
    doFetch();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red mb-1">Supply Chain</p>
          <h1 className="text-2xl font-bold text-white">Purchases</h1>
          <p className="text-muted text-sm mt-0.5">
            {isLoading ? 'Loading…' : `${totalPurchases} purchase${totalPurchases !== 1 ? 's' : ''} · ${fmt(totalAmount)}`}
          </p>
        </div>
        <button
          onClick={() => navigate('/purchases/new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-red text-white rounded-xl font-semibold text-sm hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red/20"
        >
          <Plus className="w-4 h-4" />
          Record Purchase
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
            <label className="block text-xs text-muted mb-1">Vendor</label>
            <select value={vendorId} onChange={(e) => setVendorId(e.target.value)}
              style={{ colorScheme: 'dark' }}
              className="w-full bg-navy-900 border border-navy-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30 transition-all">
              <option value="">All Vendors</option>
              {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
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

      {/* Summary stats */}
      {!isLoading && totalPurchases > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-navy-800 rounded-2xl border border-navy-700 px-5 py-4">
            <p className="text-xs text-muted uppercase tracking-wide font-semibold">Total Purchases</p>
            <p className="text-2xl font-bold text-white mt-1">{totalPurchases}</p>
          </div>
          <div className="bg-navy-800 rounded-2xl border border-gold/20 px-5 py-4">
            <p className="text-xs text-muted uppercase tracking-wide font-semibold flex items-center gap-1">
              <IndianRupee className="w-3 h-3" /> Amount Spent
            </p>
            <p className="text-2xl font-bold text-gold mt-1 tabular-nums">{fmt(totalAmount)}</p>
          </div>
        </div>
      )}

      {/* Skeleton */}
      {isLoading && (
        <div className="rounded-2xl border border-navy-700 animate-pulse">
          <div className="bg-navy-700 h-11 rounded-t-2xl" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-navy-700 h-12" />
          ))}
        </div>
      )}

      {/* Table */}
      {!isLoading && <PurchaseTable purchases={purchases} showVendor />}
    </div>
  );
}
