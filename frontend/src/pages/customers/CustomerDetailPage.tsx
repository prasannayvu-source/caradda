import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Calendar, Car, History } from 'lucide-react';
import { useCustomerStore } from '../../state/customerStore';
import { Spinner } from '../../components/ui/Spinner';
import VehicleTag from '../../components/customers/VehicleTag';
import CustomerStatBadge from '../../components/customers/CustomerStatBadge';
import CustomerHistoryTable from '../../components/customers/CustomerHistoryTable';

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const avatarColor = (name: string) => {
  const colors = ['from-red/30 to-red/10', 'from-gold/30 to-gold/10',
    'from-success/30 to-success/10', 'from-warning/30 to-warning/10'];
  return colors[name.charCodeAt(0) % colors.length];
};

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedCustomer,
    customerHistory,
    isDetailLoading,
    fetchCustomerById,
    fetchCustomerHistory,
    clearSelected,
  } = useCustomerStore();

  useEffect(() => {
    if (!id) return;
    fetchCustomerById(id);
    fetchCustomerHistory(id);
    return () => clearSelected();
  }, [id]);

  if (isDetailLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-muted text-sm">Loading customer…</p>
        </div>
      </div>
    );
  }

  if (!selectedCustomer) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-white font-semibold">Customer not found</p>
        <button
          onClick={() => navigate('/customers')}
          className="mt-4 text-sm text-red hover:text-red-600 transition-colors"
        >
          ← Back to Customers
        </button>
      </div>
    );
  }

  const c = selectedCustomer;
  const gradientClass = avatarColor(c.name);

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">

      {/* ── Back button + Header ── */}
      <div>
        <button
          onClick={() => navigate('/customers')}
          className="flex items-center gap-2 text-muted hover:text-white transition-colors text-sm mb-5 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Customers
        </button>

        {/* Profile card */}
        <div className="bg-navy-800 rounded-2xl border border-navy-700 p-6">
          <div className="flex items-start gap-5 flex-wrap sm:flex-nowrap">
            {/* Avatar */}
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-2xl font-extrabold text-white flex-shrink-0`}>
              {c.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white">{c.name}</h1>

              <div className="flex flex-wrap items-center gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-sm text-muted">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="font-mono">{c.phone}</span>
                </span>
                {c.created_at && (
                  <span className="flex items-center gap-1.5 text-sm text-muted">
                    <Calendar className="w-3.5 h-3.5" />
                    Customer since {formatDate(c.created_at)}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <CustomerStatBadge
                  totalVisits={c.total_visits}
                  totalSpent={c.total_spent}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Vehicles section ── */}
      <div className="bg-navy-800 rounded-2xl border border-navy-700 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Car className="w-4 h-4 text-muted" />
          <h2 className="text-base font-semibold text-white">Registered Vehicles</h2>
          <span className="text-xs text-muted ml-1">({c.vehicle_details?.length ?? 0})</span>
        </div>
        {c.vehicle_details && c.vehicle_details.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {c.vehicle_details.map((v) => (
              <VehicleTag key={v.id} carNumber={v.car_number} carModel={v.car_model} />
            ))}
          </div>
        ) : (
          <p className="text-muted text-sm">No vehicles registered for this customer yet.</p>
        )}
      </div>

      {/* ── Billing history ── */}
      <div className="bg-navy-800 rounded-2xl border border-navy-700 p-5">
        <div className="flex items-center gap-2 mb-5">
          <History className="w-4 h-4 text-muted" />
          <h2 className="text-base font-semibold text-white">Service History</h2>
          <span className="text-xs text-muted ml-1">({customerHistory.length} bills)</span>
        </div>
        <CustomerHistoryTable bills={customerHistory} />
      </div>
    </div>
  );
}
