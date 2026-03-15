import { IndianRupee, Calendar } from 'lucide-react';

interface CustomerStatBadgeProps {
  totalVisits: number;
  totalSpent?: number;
}

const formatINR = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function CustomerStatBadge({ totalVisits, totalSpent }: CustomerStatBadgeProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-700 border border-navy-600 text-sm">
        <Calendar className="w-3.5 h-3.5 text-muted" />
        <span className="font-semibold text-white">{totalVisits}</span>
        <span className="text-muted text-xs">{totalVisits === 1 ? 'visit' : 'visits'}</span>
      </span>
      {totalSpent !== undefined && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/10 border border-gold/20 text-sm">
          <IndianRupee className="w-3.5 h-3.5 text-gold" />
          <span className="font-bold text-gold tabular-nums">{formatINR(totalSpent)}</span>
          <span className="text-muted text-xs">total spent</span>
        </span>
      )}
    </div>
  );
}
