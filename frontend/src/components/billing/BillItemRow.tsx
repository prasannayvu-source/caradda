import { Trash2 } from 'lucide-react';
import type { DraftItem } from '../../state/billingStore';

interface BillItemRowProps {
  item: DraftItem;
  index: number;
  onChange: (index: number, field: keyof DraftItem, value: string | number) => void;
  onRemove: (index: number) => void;
}

const formatINR = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function BillItemRow({ item, index, onChange, onRemove }: BillItemRowProps) {
  const lineTotal = item.quantity * item.unit_price;

  return (
    <div className="grid grid-cols-[1fr_80px_110px_90px_36px] gap-2 items-center">
      {/* Service name (read-only from selector, or free-text if no service_id) */}
      <div className="bg-navy-900/40 border border-navy-700 rounded-xl px-4 py-2.5 text-sm text-white/90 truncate">
        {item.service_name || item.description || 'Custom Service'}
      </div>

      {/* Quantity */}
      <input
        type="number"
        min={1}
        value={item.quantity}
        onChange={(e) => onChange(index, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
        className="
          w-full bg-navy-800 border border-navy-700 text-white rounded-xl
          px-3 py-2.5 text-sm text-center tabular-nums
          focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30
          transition-all duration-150
        "
      />

      {/* Unit price */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
        <input
          type="number"
          min={0}
          step={50}
          value={item.unit_price}
          onChange={(e) => onChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
          className="
            w-full bg-navy-800 border border-navy-700 text-white rounded-xl
            pl-7 pr-3 py-2.5 text-sm tabular-nums
            focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30
            transition-all duration-150
          "
        />
      </div>

      {/* Line total */}
      <div className="text-right text-sm font-bold text-gold tabular-nums">
        {formatINR(lineTotal)}
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="p-2 rounded-lg text-muted hover:text-red hover:bg-red/10 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
