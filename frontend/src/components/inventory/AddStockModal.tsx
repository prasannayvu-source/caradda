import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { InventoryItem } from '../../state/inventoryStore';

interface AddStockModalProps {
  item: InventoryItem;
  onConfirm: (qty: number) => Promise<void>;
  onClose: () => void;
}

export default function AddStockModal({ item, onConfirm, onClose }: AddStockModalProps) {
  const [qty, setQty] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const numQty = parseFloat(qty) || 0;

  const handleConfirm = async () => {
    if (numQty <= 0) return;
    setIsLoading(true);
    await onConfirm(numQty);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 bg-navy-800 rounded-2xl border border-navy-700 p-6 w-full max-w-sm shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-white">Add Stock</h2>
            <p className="text-muted text-sm mt-0.5">{item.item_name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-navy-700 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current stock */}
        <div className="bg-navy-700/50 rounded-xl px-4 py-3 mb-4 flex justify-between items-center">
          <span className="text-sm text-muted">Current stock</span>
          <span className="text-white font-bold tabular-nums">{item.quantity} {item.unit}</span>
        </div>

        {/* Quantity input */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-muted mb-1.5">
            Quantity to add <span className="text-red">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min={0.01}
              step={0.5}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="e.g. 5"
              autoFocus
              className="
                w-full bg-[#0F172A] border border-navy-700 text-white rounded-xl
                px-4 py-2.5 text-sm tabular-nums
                placeholder:text-muted/60
                focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30
                transition-all duration-150
              "
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-sm">{item.unit}</span>
          </div>
        </div>

        {/* New total preview */}
        {numQty > 0 && (
          <div className="bg-success/5 border border-success/20 rounded-xl px-4 py-3 mb-5 flex justify-between items-center">
            <span className="text-sm text-muted">New total</span>
            <span className="text-success font-bold tabular-nums">
              {(item.quantity + numQty).toFixed(2)} {item.unit}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-navy-700 border border-navy-600 text-white text-sm font-medium hover:bg-navy-600 transition-all">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={numQty <= 0 || isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-success/90 text-white text-sm font-semibold hover:bg-success active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            {isLoading ? '…' : <><Plus className="w-4 h-4" /> Add Stock</>}
          </button>
        </div>
      </div>
    </div>
  );
}
