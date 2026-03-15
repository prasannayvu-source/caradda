import { useNavigate } from 'react-router-dom';
import { Receipt, Clock, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { BillSummary as BillSummaryType } from '../../state/billingStore';

interface BillCardProps {
  bill: BillSummaryType;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const fmtDate = (dt: string) =>
  new Date(dt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const fmtTime = (dt: string) =>
  new Date(dt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

export default function BillCard({ bill }: BillCardProps) {
  const navigate = useNavigate();
  const customer = bill.customers;

  return (
    <div
      onClick={() => navigate(`/billing/${bill.id}`)}
      className="
        bg-navy-800 rounded-2xl border border-navy-700 p-4 sm:p-5
        hover:border-navy-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-navy/40
        transition-all duration-200 cursor-pointer group
        flex items-center gap-4
      "
    >
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
        <Receipt className="w-5 h-5 text-gold" />
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-gold text-sm font-bold">{bill.bill_number}</span>
          <Badge variant={bill.payment_status === 'paid' ? 'success' : 'warning'}>
            {bill.payment_status}
          </Badge>
          <Badge variant="default">{bill.payment_method?.toUpperCase()}</Badge>
        </div>
        {customer && (
          <p className="text-white/90 text-sm font-medium mt-0.5 truncate">{customer.name}</p>
        )}
        <div className="flex items-center gap-1 mt-0.5 text-xs text-muted">
          <Clock className="w-3 h-3" />
          {fmtDate(bill.created_at)} · {fmtTime(bill.created_at)}
        </div>
      </div>

      {/* Amount */}
      <div className="text-right flex-shrink-0">
        <p className="text-lg font-bold text-white tabular-nums">{fmt(bill.total_amount)}</p>
      </div>

      <ChevronRight className="w-4 h-4 text-muted/50 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </div>
  );
}
