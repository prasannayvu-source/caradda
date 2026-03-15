import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, ChevronRight, ShoppingCart } from 'lucide-react';
import type { Vendor } from '../../state/vendorStore';

interface VendorCardProps { vendor: Vendor }

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const avatarColor = (name: string) => {
  const colors = [
    'bg-red/20 text-red', 'bg-gold/20 text-gold',
    'bg-success/20 text-success', 'bg-blue-500/20 text-blue-400',
  ];
  return colors[name.charCodeAt(0) % colors.length];
};

export default function VendorCard({ vendor }: VendorCardProps) {
  const navigate = useNavigate();
  const colorClass = avatarColor(vendor.name);
  const initial = vendor.name.charAt(0).toUpperCase();

  return (
    <div
      onClick={() => navigate(`/vendors/${vendor.id}`)}
      className="
        bg-navy-800 rounded-2xl border border-navy-700 p-5
        hover:border-navy-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-navy/40
        transition-all duration-200 cursor-pointer group flex flex-col gap-4
      "
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${colorClass}`}>
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white truncate group-hover:text-gold transition-colors">
            {vendor.name}
          </h3>
          {vendor.phone && (
            <div className="flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3 text-muted" />
              <span className="text-muted text-xs font-mono">{vendor.phone}</span>
            </div>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-muted/50 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
      </div>

      {/* Address */}
      {vendor.address && (
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{vendor.address}</span>
        </div>
      )}

      {/* Footer stats */}
      <div className="flex items-center justify-between pt-2 border-t border-navy-700">
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <ShoppingCart className="w-3 h-3" />
          <span className="font-semibold text-white">{vendor.purchase_count}</span>{' '}
          purchase{vendor.purchase_count !== 1 ? 's' : ''}
        </span>
        <span className="text-sm font-bold text-gold tabular-nums">{fmt(vendor.total_spent)}</span>
      </div>
    </div>
  );
}
