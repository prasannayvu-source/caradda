import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Car } from 'lucide-react';
import { useBillingStore } from '../../state/billingStore';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import BillSummary from '../../components/billing/BillSummary';
import BillActions from '../../components/billing/BillActions';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const fmtDateTime = (dt: string) =>
  new Date(dt).toLocaleString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

export default function BillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentBill, isDetailLoading, fetchBillById } = useBillingStore();

  useEffect(() => { if (id) fetchBillById(id); }, [id]);

  if (isDetailLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-muted text-sm">Loading bill…</p>
        </div>
      </div>
    );
  }

  if (!currentBill) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-white font-semibold">Bill not found</p>
        <button onClick={() => navigate('/billing')}
          className="mt-4 text-sm text-red hover:text-red-600 transition-colors">
          ← Back to Bills
        </button>
      </div>
    );
  }

  const b = currentBill;
  const customer = b.customers;
  const vehicle = b.vehicles;

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fadeIn print:space-y-3">

      {/* ── Back + Actions ── */}
      <div className="flex items-start justify-between gap-3 print:hidden">
        <button onClick={() => navigate('/billing')}
          className="flex items-center gap-2 text-muted hover:text-white transition-colors text-sm group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Bills
        </button>
        <BillActions billId={b.id} billNumber={b.bill_number} />
      </div>

      {/* ── Bill Header Card ── */}
      <div className="bg-navy-800 rounded-2xl border border-navy-700 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-muted font-semibold uppercase tracking-widest mb-1">Bill Number</p>
            <p className="font-mono text-2xl font-extrabold text-gold">{b.bill_number}</p>
            <p className="text-muted text-sm mt-1">{fmtDateTime(b.created_at)}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant={b.payment_status === 'paid' ? 'success' : 'warning'}>
              {b.payment_status}
            </Badge>
            <Badge variant="default">{b.payment_method?.toUpperCase()}</Badge>
          </div>
        </div>
      </div>

      {/* ── Customer Info ── */}
      <div className="bg-navy-800 rounded-2xl border border-navy-700 p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Customer</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted w-16">Name</span>
            <span className="text-white font-semibold">{customer?.name ?? '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-3.5 h-3.5 text-muted" />
            <span className="text-white font-mono">{customer?.phone ?? '—'}</span>
          </div>
          {vehicle?.car_number && (
            <div className="flex items-center gap-2 text-sm">
              <Car className="w-3.5 h-3.5 text-muted" />
              <span className="font-mono text-gold font-bold">{vehicle.car_number.toUpperCase()}</span>
              {vehicle.car_model && <span className="text-muted">· {vehicle.car_model}</span>}
            </div>
          )}
        </div>
      </div>

      {/* ── Services Table ── */}
      <div className="bg-navy-800 rounded-2xl border border-navy-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-navy-700">
          <h2 className="text-sm font-semibold text-white">Services</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy-700">
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Service</th>
              <th className="px-5 py-3 text-center text-xs font-semibold text-muted uppercase tracking-wide">Qty</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wide">Unit Price</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wide">Total</th>
            </tr>
          </thead>
          <tbody>
            {(b.items ?? []).map((item, i) => (
              <tr key={i} className="border-t border-navy-700 hover:bg-navy-700/40 transition-colors">
                <td className="px-5 py-3 text-white/90">{item.service_name}</td>
                <td className="px-5 py-3 text-center text-white tabular-nums">{item.quantity}</td>
                <td className="px-5 py-3 text-right text-white tabular-nums">{fmt(item.unit_price)}</td>
                <td className="px-5 py-3 text-right font-semibold text-white tabular-nums">{fmt(item.line_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Bill Summary ── */}
      <BillSummary subtotal={b.subtotal} discount={b.discount} />

      {/* ── Print actions (shown only in print) ── */}
      <div className="hidden print:block text-center text-sm text-muted mt-8 pt-6 border-t border-navy-700">
        <p className="font-bold text-lg">Thank you for choosing CAR ADDA 🚗</p>
        <p className="mt-1">For queries, contact your nearest CAR ADDA outlet.</p>
      </div>
    </div>
  );
}
