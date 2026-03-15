import { useNavigate } from 'react-router-dom';
import { Phone, Clock, ChevronRight } from 'lucide-react';
import VehicleTag from './VehicleTag';
import type { Customer } from '../../state/customerStore';

interface CustomerCardProps {
  customer: Customer;
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'No visits yet';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

// Generate a consistent colour from name initial
const avatarColor = (name: string) => {
  const colors = ['bg-red/20 text-red', 'bg-gold/20 text-gold', 'bg-success/20 text-success',
                  'bg-warning/20 text-warning', 'bg-white/10 text-white'];
  return colors[name.charCodeAt(0) % colors.length];
};

export default function CustomerCard({ customer }: CustomerCardProps) {
  const navigate = useNavigate();
  const color = avatarColor(customer.name);
  const initial = customer.name?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <div
      onClick={() => navigate(`/customers/${customer.id}`)}
      className="
        bg-navy-800 rounded-2xl border border-navy-700 p-5
        hover:border-navy-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-navy/40
        transition-all duration-200 cursor-pointer group
        flex flex-col gap-4
      "
    >
      {/* Header: avatar + name + phone */}
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${color}`}>
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white truncate group-hover:text-gold transition-colors">
            {customer.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Phone className="w-3 h-3 text-muted flex-shrink-0" />
            <span className="text-muted text-sm font-mono">{customer.phone}</span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted/50 group-hover:text-white group-hover:translate-x-0.5 transition-all mt-1 flex-shrink-0" />
      </div>

      {/* Vehicles */}
      {customer.vehicles.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {customer.vehicles.slice(0, 3).map((cn) => (
            <VehicleTag key={cn} carNumber={cn} size="sm" />
          ))}
          {customer.vehicles.length > 3 && (
            <span className="px-2 py-0.5 text-[11px] rounded-lg bg-navy-700 text-muted">
              +{customer.vehicles.length - 3} more
            </span>
          )}
        </div>
      ) : (
        <p className="text-muted/60 text-xs">No vehicles registered</p>
      )}

      {/* Footer: visits + last visit */}
      <div className="flex items-center justify-between pt-2 border-t border-navy-700">
        <span className="text-xs text-muted">
          <span className="font-semibold text-white">{customer.total_visits}</span>{' '}
          {customer.total_visits === 1 ? 'visit' : 'visits'}
        </span>
        <div className="flex items-center gap-1 text-xs text-muted">
          <Clock className="w-3 h-3" />
          {formatDate(customer.last_visit)}
        </div>
      </div>
    </div>
  );
}
