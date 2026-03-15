import { Inbox } from 'lucide-react';
import type { PurchaseRecord } from '../../state/vendorStore';

interface PurchaseTableProps {
  purchases: PurchaseRecord[];
  showVendor?: boolean;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function PurchaseTable({ purchases, showVendor = false }: PurchaseTableProps) {
  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <Inbox className="w-12 h-12 text-navy-600 mb-3" />
        <p className="text-muted text-sm">No purchases recorded yet</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-navy-700">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-navy-700">
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Date</th>
            {showVendor && (
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Vendor</th>
            )}
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Item</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wide">Qty</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wide">Unit Price</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wide">Total</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((p) => {
            const vendorName = p.vendors?.name ?? '—';
            const itemName = p.inventory?.item_name ?? p.item_name ?? '—';
            const unit = p.inventory?.unit ?? p.unit ?? '';

            return (
              <tr key={p.id} className="border-t border-navy-700 hover:bg-navy-700/40 transition-colors">
                <td className="px-4 py-3">
                  <span className="text-muted text-xs">{fmtDate(p.purchase_date)}</span>
                </td>
                {showVendor && (
                  <td className="px-4 py-3">
                    <span className="text-white text-sm font-medium">{vendorName}</span>
                  </td>
                )}
                <td className="px-4 py-3">
                  <div>
                    <span className="text-white">{itemName}</span>
                    {p.notes && (
                      <p className="text-muted/60 text-xs mt-0.5 truncate max-w-[200px]">{p.notes}</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-white tabular-nums">
                  {p.quantity} <span className="text-muted text-xs">{unit}</span>
                </td>
                <td className="px-4 py-3 text-right text-muted tabular-nums text-xs">
                  {fmt(p.unit_price)}
                </td>
                <td className="px-4 py-3 text-right font-bold text-white tabular-nums">
                  {fmt(p.total_price)}
                </td>
              </tr>
            );
          })}
        </tbody>
        {/* Footer total */}
        <tfoot>
          <tr className="border-t-2 border-navy-600 bg-navy-700/50">
            <td colSpan={showVendor ? 5 : 4} className="px-4 py-3 text-right text-sm font-semibold text-muted">
              Total
            </td>
            <td className="px-4 py-3 text-right font-extrabold text-gold tabular-nums">
              {fmt(purchases.reduce((acc, p) => acc + p.total_price, 0))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
