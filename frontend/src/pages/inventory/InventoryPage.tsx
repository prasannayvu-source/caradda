import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, X, AlertTriangle } from 'lucide-react';
import { useInventoryStore } from '../../state/inventoryStore';
import { useDebounce } from '../../hooks/useDebounce';
import InventoryTable from '../../components/inventory/InventoryTable';

const CATEGORIES = ['all', 'chemical', 'cloth', 'accessory', 'equipment', 'other'];

export default function InventoryPage() {
  const navigate = useNavigate();
  const {
    items, isLoading, lowStockCount, total,
    categoryFilter, fetchInventory, setCategoryFilter,
  } = useInventoryStore();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    fetchInventory(categoryFilter || undefined, debouncedSearch);
  }, [categoryFilter, debouncedSearch]);

  const filtered = categoryFilter && categoryFilter !== 'all'
    ? items.filter(i => i.category === categoryFilter)
    : items;

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red mb-1">Stock Management</p>
          <h1 className="text-2xl font-bold text-white">Inventory</h1>
          <p className="text-muted text-sm mt-0.5">
            {isLoading ? 'Loading…' : `${total} items`}
            {lowStockCount > 0 && !isLoading && (
              <span className="ml-2 inline-flex items-center gap-1 text-warning text-xs font-semibold">
                <AlertTriangle className="w-3 h-3" />
                {lowStockCount} low/out of stock
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => navigate('/inventory/new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-red text-white rounded-xl font-semibold text-sm hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red/20"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* ── Category Filter Tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat === 'all' ? '' : cat)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium capitalize transition-all duration-150
              ${(cat === 'all' ? !categoryFilter : categoryFilter === cat)
                ? 'bg-red text-white shadow shadow-red/20'
                : 'bg-navy-800 border border-navy-700 text-muted hover:text-white hover:border-navy-600'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Search bar ── */}
      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items…"
          className="
            w-full bg-navy-800 border border-navy-700 text-white rounded-xl
            pl-11 pr-10 py-2.5 text-sm placeholder:text-muted/60
            focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30
            transition-all duration-150
          "
        />
        {search && (
          <button onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Low stock alert panel ── */}
      {lowStockCount > 0 && !isLoading && (
        <div className="bg-warning/5 border border-warning/20 rounded-2xl px-5 py-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
          <div>
            <p className="text-warning font-semibold text-sm">
              {lowStockCount} item{lowStockCount !== 1 ? 's' : ''} need restocking
            </p>
            <p className="text-muted text-xs mt-0.5">
              Items highlighted in amber/red are at or below their stock threshold
            </p>
          </div>
        </div>
      )}

      {/* ── Skeleton loader ── */}
      {isLoading && (
        <div className="rounded-2xl border border-navy-700 overflow-hidden animate-pulse">
          <div className="bg-navy-700 h-11" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-navy-700 flex gap-4 px-4 py-3">
              <div className="h-4 bg-navy-700 rounded w-1/4" />
              <div className="h-4 bg-navy-700 rounded w-1/6" />
              <div className="h-4 bg-navy-700 rounded w-1/5" />
            </div>
          ))}
        </div>
      )}

      {/* ── Table ── */}
      {!isLoading && <InventoryTable items={filtered} />}
    </div>
  );
}
