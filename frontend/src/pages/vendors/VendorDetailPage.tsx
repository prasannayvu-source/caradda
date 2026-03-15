import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Mail, Pencil, ShoppingCart, IndianRupee } from 'lucide-react';
import { useVendorStore } from '../../state/vendorStore';
import { Spinner } from '../../components/ui/Spinner';
import PurchaseTable from '../../components/vendors/PurchaseTable';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedVendor, isDetailLoading, fetchVendorById, clearSelected } = useVendorStore();

  useEffect(() => {
    if (id) fetchVendorById(id);
    return () => clearSelected();
  }, [id]);

  if (isDetailLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-muted text-sm">Loading vendor…</p>
        </div>
      </div>
    );
  }

  if (!selectedVendor) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-white font-semibold">Vendor not found</p>
        <button onClick={() => navigate('/vendors')} className="mt-4 text-sm text-red hover:text-red-600 transition-colors">
          ← Back to Vendors
        </button>
      </div>
    );
  }

  const v = selectedVendor;
  const initial = v.name.charAt(0).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-fadeIn">

      {/* Nav */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => navigate('/vendors')}
          className="flex items-center gap-2 text-muted hover:text-white transition-colors text-sm group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Vendors
        </button>
        <button onClick={() => navigate(`/vendors/${v.id}/edit`)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-800 border border-navy-700 text-white text-sm font-medium hover:bg-navy-700 transition-all">
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
      </div>

      {/* Vendor profile card */}
      <div className="bg-navy-800 rounded-2xl border border-navy-700 p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red/10 border border-red/20 flex items-center justify-center text-2xl font-bold text-red flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white">{v.name}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {v.phone && (
                <span className="flex items-center gap-1.5 text-sm text-muted">
                  <Phone className="w-3.5 h-3.5" /><span className="font-mono">{v.phone}</span>
                </span>
              )}
              {v.email && (
                <span className="flex items-center gap-1.5 text-sm text-muted">
                  <Mail className="w-3.5 h-3.5" />{v.email}
                </span>
              )}
              {v.address && (
                <span className="flex items-center gap-1.5 text-sm text-muted">
                  <MapPin className="w-3.5 h-3.5" />{v.address}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-navy-700">
          <div className="bg-navy-700/40 rounded-xl px-4 py-3">
            <p className="text-xs text-muted font-semibold uppercase tracking-wide flex items-center gap-1">
              <ShoppingCart className="w-3 h-3" /> Purchases
            </p>
            <p className="text-2xl font-bold text-white mt-1">{v.purchase_count}</p>
          </div>
          <div className="bg-navy-700/40 rounded-xl px-4 py-3">
            <p className="text-xs text-muted font-semibold uppercase tracking-wide flex items-center gap-1">
              <IndianRupee className="w-3 h-3" /> Total Spent
            </p>
            <p className="text-2xl font-bold text-gold mt-1 tabular-nums">{fmt(v.total_spent)}</p>
          </div>
        </div>
      </div>

      {/* Purchase history */}
      <div className="bg-navy-800 rounded-2xl border border-navy-700 p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Purchase History</h2>
          <button
            onClick={() => navigate(`/purchases/new?vendor_id=${v.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all"
          >
            + Record Purchase
          </button>
        </div>
        <PurchaseTable purchases={v.purchases ?? []} showVendor={false} />
      </div>
    </div>
  );
}
