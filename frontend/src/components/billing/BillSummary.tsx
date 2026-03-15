interface BillSummaryProps {
  subtotal: number;
  discount: number;
  editable?: boolean;
  onDiscountChange?: (v: number) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function BillSummary({ subtotal, discount, editable, onDiscountChange }: BillSummaryProps) {
  const total = Math.max(0, subtotal - discount);

  return (
    <div className="bg-navy-900/40 border border-navy-700 rounded-2xl p-5 space-y-3">
      {/* Subtotal */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted">Subtotal</span>
        <span className="text-white font-medium tabular-nums">{fmt(subtotal)}</span>
      </div>

      {/* Discount */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted">Discount</span>
        {editable ? (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs">₹</span>
            <input
              type="number"
              min={0}
              max={subtotal}
              step={50}
              value={discount || ''}
              placeholder="0"
              onChange={(e) => onDiscountChange?.(Math.min(subtotal, parseFloat(e.target.value) || 0))}
              className="
                w-[110px] bg-navy-800 border border-navy-700 text-white rounded-lg
                pl-7 pr-3 py-1.5 text-sm tabular-nums text-right
                focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30
                transition-all duration-150
              "
            />
          </div>
        ) : (
          <span className="text-red font-medium tabular-nums">
            {discount > 0 ? `- ${fmt(discount)}` : '—'}
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-navy-700" />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-white font-semibold">Total</span>
        <span className="text-2xl font-extrabold text-gold tabular-nums">{fmt(total)}</span>
      </div>
    </div>
  );
}
