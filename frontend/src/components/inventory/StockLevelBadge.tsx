import type { StockStatus } from '../../state/inventoryStore';

interface StockLevelBadgeProps {
  status: StockStatus;
  quantity: number;
  unit: string;
  threshold?: number;
  size?: 'sm' | 'md';
}

const config: Record<StockStatus, { label: string; classes: string; dot: string }> = {
  ok:  { label: 'In Stock', classes: 'bg-success/10 text-success border-success/20', dot: 'bg-success' },
  low: { label: 'Low Stock', classes: 'bg-warning/10 text-warning border-warning/20', dot: 'bg-warning' },
  out: { label: 'Out of Stock', classes: 'bg-red/10 text-red border-red/20', dot: 'bg-red' },
};

export default function StockLevelBadge({ status, quantity, unit, size = 'md' }: StockLevelBadgeProps) {
  const { label, classes, dot } = config[status];
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-xl border font-medium ${classes} ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
      <span>{label}</span>
      <span className="opacity-60 font-normal">· {quantity} {unit}</span>
    </div>
  );
}
