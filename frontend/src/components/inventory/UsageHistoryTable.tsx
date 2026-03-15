import { Package, Inbox } from 'lucide-react';
import type { UsageRecord } from '../../state/inventoryStore';

interface UsageHistoryTableProps {
  usage: UsageRecord[];
  unit: string;
}

export default function UsageHistoryTable({ usage, unit }: UsageHistoryTableProps) {
  if (usage.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <Inbox className="w-12 h-12 text-navy-600 mb-3" />
        <p className="text-muted text-sm">No usage history yet</p>
        <p className="text-muted/60 text-xs mt-1">Usage is recorded when this item is auto-deducted by billing</p>
      </div>
    );
  }

  const totalUsed = usage.reduce((acc, u) => acc + u.quantity_used, 0);

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="flex items-center gap-2 bg-navy-700/40 rounded-xl px-4 py-2.5">
        <Package className="w-4 h-4 text-muted" />
        <span className="text-sm text-muted">Total consumed:</span>
        <span className="text-white font-bold tabular-nums">{totalUsed.toFixed(2)} {unit}</span>
        <span className="text-muted text-xs ml-auto">across {usage.length} bill{usage.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-navy-700 overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-navy-700">
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Bill #</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Date</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wide">Qty Used</th>
            </tr>
          </thead>
          <tbody>
            {usage.map((u) => (
              <tr key={u.id} className="border-t border-navy-700 hover:bg-navy-700/40 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-mono text-gold text-xs">{u.bill_number}</span>
                </td>
                <td className="px-4 py-3 text-muted text-xs">
                  {new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-white tabular-nums">
                  {u.quantity_used.toFixed(2)} {unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
