import { Inbox } from 'lucide-react';
import type { ServiceRevenue } from '../../state/reportStore';

interface TopServicesTableProps {
  services: ServiceRevenue[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const RANK_COLORS = ['text-gold', 'text-muted', 'text-orange-500'];

export default function TopServicesTable({ services }: TopServicesTableProps) {
  if (!services.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Inbox className="w-10 h-10 text-navy-600 mb-3" />
        <p className="text-muted text-sm">No service data for this period</p>
      </div>
    );
  }

  const maxRevenue = services[0]?.revenue ?? 1;

  return (
    <div className="space-y-2.5">
      {services.map((s, i) => {
        const pct = Math.min(100, (s.revenue / maxRevenue) * 100);
        return (
          <div key={s.name} className="group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold w-5 ${RANK_COLORS[i] ?? 'text-muted'}`}>
                  #{i + 1}
                </span>
                <span className="text-sm font-medium text-white">{s.name}</span>
                <span className="text-xs text-muted">× {s.count}</span>
              </div>
              <span className="font-bold text-sm tabular-nums text-white">{fmt(s.revenue)}</span>
            </div>
            <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gold transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
