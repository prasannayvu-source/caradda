import { Inbox } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { BillHistory } from '../../state/customerStore';

interface CustomerHistoryTableProps {
  bills: BillHistory[];
}

const formatINR = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const formatDateTime = (dt: string) =>
  new Date(dt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function CustomerHistoryTable({ bills }: CustomerHistoryTableProps) {
  if (bills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Inbox className="w-12 h-12 text-navy-600 mb-4" />
        <p className="text-muted text-sm font-medium">No billing history yet</p>
        <p className="text-muted/60 text-xs mt-1">Bills will appear here after the first service</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-navy-700">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-navy-700">
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide whitespace-nowrap">
              Bill #
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide whitespace-nowrap">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">
              Services
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wide whitespace-nowrap">
              Amount
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-muted uppercase tracking-wide">
              Payment
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-muted uppercase tracking-wide">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr
              key={bill.id}
              className="border-t border-navy-700 hover:bg-navy-700/50 transition-colors duration-100"
            >
              {/* Bill number */}
              <td className="px-4 py-3">
                <span className="font-mono text-gold text-xs">{bill.bill_number}</span>
              </td>

              {/* Date */}
              <td className="px-4 py-3">
                <span className="text-muted font-mono text-xs">{formatDateTime(bill.created_at)}</span>
              </td>

              {/* Services */}
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {bill.bill_items?.map((item, i) => (
                    <span
                      key={i}
                      className="text-xs bg-navy-700 border border-navy-600 px-2 py-0.5 rounded-lg text-white/90"
                    >
                      {item.service_name}
                    </span>
                  ))}
                  {(!bill.bill_items || bill.bill_items.length === 0) && (
                    <span className="text-muted text-xs">—</span>
                  )}
                </div>
              </td>

              {/* Amount */}
              <td className="px-4 py-3 text-right">
                <span className="font-semibold text-white tabular-nums">
                  {formatINR(bill.total_amount)}
                </span>
              </td>

              {/* Payment method */}
              <td className="px-4 py-3 text-center">
                <Badge variant="default">
                  {bill.payment_method?.toUpperCase()}
                </Badge>
              </td>

              {/* Status */}
              <td className="px-4 py-3 text-center">
                <Badge variant={bill.payment_status === 'paid' ? 'success' : 'warning'}>
                  {bill.payment_status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
