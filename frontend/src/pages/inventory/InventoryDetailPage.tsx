import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Plus, History, Package } from 'lucide-react';
import { useInventoryStore } from '../../state/inventoryStore';
import { Spinner } from '../../components/ui/Spinner';
import StockLevelBadge from '../../components/inventory/StockLevelBadge';
import UsageHistoryTable from '../../components/inventory/UsageHistoryTable';
import AddStockModal from '../../components/inventory/AddStockModal';

const fmtDate = (d?: string) => d
  ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  : '—';

export default function InventoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedItem, usageHistory, isDetailLoading,
    fetchItemById, fetchUsageHistory, addStock, clearSelected,
  } = useInventoryStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchItemById(id);
    fetchUsageHistory(id);
    return () => clearSelected();
  }, [id]);

  if (isDetailLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-muted text-sm">Loading item…</p>
        </div>
      </div>
    );
  }

  if (!selectedItem) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-white font-semibold">Item not found</p>
        <button onClick={() => navigate('/inventory')}
          className="mt-4 text-sm text-red hover:text-red-600 transition-colors">
          ← Back to Inventory
        </button>
      </div>
    );
  }

  const item = selectedItem;

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fadeIn">

      {/* ── Nav ── */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => navigate('/inventory')}
          className="flex items-center gap-2 text-muted hover:text-white transition-colors text-sm group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Inventory
        </button>
        <div className="flex gap-2">
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-success/10 border border-success/30 text-success text-sm font-medium hover:bg-success/20 transition-all">
            <Plus className="w-3.5 h-3.5" /> Add Stock
          </button>
          <button onClick={() => navigate(`/inventory/${item.id}/edit`)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-800 border border-navy-700 text-white text-sm font-medium hover:bg-navy-700 transition-all">
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
      </div>

      {/* ── Item detail card ── */}
      <div className="bg-navy-800 rounded-2xl border border-navy-700 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6 text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white">{item.item_name}</h1>
            <p className="text-muted text-sm capitalize mt-0.5">{item.category}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {/* Stock status */}
          <div>
            <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-1.5">Status</p>
            <StockLevelBadge status={item.stock_status} quantity={item.quantity} unit={item.unit} />
          </div>

          {/* Threshold */}
          <div>
            <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-1.5">Threshold</p>
            <p className="text-white font-bold">{item.low_stock_threshold} <span className="text-muted font-normal">{item.unit}</span></p>
          </div>

          {/* Last updated */}
          <div>
            <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-1.5">Last Updated</p>
            <p className="text-white text-sm">{fmtDate(item.last_updated)}</p>
          </div>
        </div>
      </div>

      {/* ── Usage history ── */}
      <div className="bg-navy-800 rounded-2xl border border-navy-700 p-5">
        <div className="flex items-center gap-2 mb-5">
          <History className="w-4 h-4 text-muted" />
          <h2 className="text-base font-semibold text-white">Usage History</h2>
          <span className="text-xs text-muted ml-1">({usageHistory.length} records)</span>
        </div>
        <UsageHistoryTable usage={usageHistory} unit={item.unit} />
      </div>

      {/* ── Add Stock Modal ── */}
      {showModal && (
        <AddStockModal
          item={item}
          onConfirm={async (qty) => {
            await addStock(item.id, qty);
            fetchItemById(item.id);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
