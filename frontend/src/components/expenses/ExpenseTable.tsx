import { useState } from 'react';
import { Trash2, Inbox } from 'lucide-react';
import ExpenseCategoryBadge from './ExpenseCategoryBadge';
import type { Expense } from '../../state/expenseStore';

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete?: (id: string) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function ExpenseTable({ expenses, onDelete }: ExpenseTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <Inbox className="w-12 h-12 text-navy-600 mb-3" />
        <p className="text-muted text-sm">No expenses recorded for this period</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-navy-700">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-navy-700">
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Category</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wide">Amount</th>
            {onDelete && <th className="px-4 py-3 w-10" />}
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => {
            const displayName = e.name ?? e.description ?? '—';
            return (
              <tr key={e.id} className="border-t border-navy-700 hover:bg-navy-700/40 transition-colors">
                <td className="px-4 py-3">
                  <span className="text-muted text-xs">{fmtDate(e.expense_date)}</span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-white font-medium">{displayName}</p>
                    {e.notes && (
                      <p className="text-muted/60 text-xs mt-0.5 max-w-[200px] truncate">{e.notes}</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <ExpenseCategoryBadge category={e.category} size="sm" />
                </td>
                <td className="px-4 py-3 text-right font-bold text-white tabular-nums">
                  {fmt(e.amount)}
                </td>
                {onDelete && (
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(e.id)}
                      disabled={deletingId === e.id}
                      className="p-1.5 rounded-lg text-muted hover:text-red hover:bg-red/10 transition-all disabled:opacity-40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
        {/* Footer total */}
        <tfoot>
          <tr className="border-t-2 border-navy-600 bg-navy-700/50">
            <td colSpan={onDelete ? 3 : 2} className="px-4 py-3 text-right text-sm font-semibold text-muted">
              Total
            </td>
            <td className="px-4 py-3 text-right font-extrabold text-red tabular-nums">
              {fmt(expenses.reduce((acc, e) => acc + e.amount, 0))}
            </td>
            {onDelete && <td />}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
