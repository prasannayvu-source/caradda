import { Package, AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LowStockItem {
  id: string;
  item_name: string;
  quantity: number;
  unit: string | null;
  low_stock_threshold: number;
}

interface LowStockAlertProps {
  items: LowStockItem[];
  isLoading?: boolean;
}

export default function LowStockAlert({ items, isLoading }: LowStockAlertProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-navy-800 rounded-2xl border border-navy-700 p-5 space-y-3 animate-pulse">
        <div className="h-5 w-40 bg-navy-700 rounded" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 bg-navy-700 rounded-xl" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-navy-800 rounded-2xl border border-navy-700 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-4 h-4 text-success" />
          <h3 className="text-sm font-semibold text-white">Stock Alerts</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center mb-3">
            <Package className="w-5 h-5 text-success" />
          </div>
          <p className="text-success text-sm font-medium">All items well stocked</p>
          <p className="text-muted/60 text-xs mt-1">No items below their thresholds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy-800 rounded-2xl border border-warning/30 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-warning/10 flex items-center justify-center">
            <AlertTriangle className="w-3.5 h-3.5 text-warning" />
          </div>
          <h3 className="text-sm font-semibold text-white">Low Stock Alerts</h3>
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-warning/20 text-warning text-[10px] font-bold">
            {items.length}
          </span>
        </div>
        <button
          onClick={() => navigate('/inventory')}
          className="text-xs text-muted hover:text-white transition-colors flex items-center gap-1 group"
        >
          View all
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const isOut = item.quantity === 0;
          return (
            <div
              key={item.id}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl border
                ${isOut
                  ? 'bg-red/5 border-red/20'
                  : 'bg-warning/5 border-warning/20'
                }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isOut ? 'bg-red' : 'bg-warning'}`} />
                <span className="text-sm text-white/90 font-medium truncate">{item.item_name}</span>
              </div>
              <span className={`text-xs font-bold tabular-nums ml-3 flex-shrink-0
                ${isOut ? 'text-red' : 'text-warning'}`}>
                {item.quantity} {item.unit ?? ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
