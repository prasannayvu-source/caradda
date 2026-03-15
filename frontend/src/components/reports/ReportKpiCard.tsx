import { TrendingUp, TrendingDown } from 'lucide-react';

interface ReportKpiCardProps {
  label: string;
  value: number;
  prefix?: string;
  isGold?: boolean;
  isRed?: boolean;
  subLabel?: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);

export default function ReportKpiCard({
  label, value, prefix = '₹', isGold, isRed, subLabel,
}: ReportKpiCardProps) {
  const valueColor = isGold ? 'text-gold' : isRed ? 'text-red' : 'text-white';

  return (
    <div className={`
      bg-navy-800 rounded-2xl border p-5 flex flex-col gap-2 transition-all duration-200
      ${isGold ? 'border-gold/20 shadow-lg shadow-gold/5' : 'border-navy-700'}
    `}>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">{label}</p>
      <p className={`text-2xl sm:text-3xl font-extrabold tabular-nums leading-none ${valueColor}`}>
        {prefix}{fmt(value)}
      </p>
      {subLabel && (
        <p className="text-xs text-muted/70 mt-0.5">{subLabel}</p>
      )}
      {isGold && value > 0 && (
        <div className="flex items-center gap-1 text-success text-xs font-semibold mt-1">
          <TrendingUp className="w-3.5 h-3.5" /> Profitable
        </div>
      )}
      {isGold && value < 0 && (
        <div className="flex items-center gap-1 text-red text-xs font-semibold mt-1">
          <TrendingDown className="w-3.5 h-3.5" /> Loss
        </div>
      )}
    </div>
  );
}
