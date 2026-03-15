import type { ReactNode } from 'react';

type KpiColor = 'gold' | 'red' | 'navy' | 'warning' | 'success';

interface KpiCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  color?: KpiColor;
  isLoading?: boolean;
}

const colorMap: Record<KpiColor, { icon: string; border: string; iconBg: string }> = {
  gold:    { icon: 'text-gold',    border: 'hover:border-gold/40',    iconBg: 'bg-gold/10' },
  red:     { icon: 'text-red',     border: 'hover:border-red/40',     iconBg: 'bg-red/10' },
  navy:    { icon: 'text-white',   border: 'hover:border-white/20',   iconBg: 'bg-white/10' },
  warning: { icon: 'text-warning', border: 'hover:border-warning/40', iconBg: 'bg-warning/10' },
  success: { icon: 'text-success', border: 'hover:border-success/40', iconBg: 'bg-success/10' },
};

export default function KpiCard({ icon, title, value, trend, trendUp, color = 'gold', isLoading }: KpiCardProps) {
  const c = colorMap[color];

  return (
    <div
      className={`bg-navy-800 rounded-2xl border border-navy-700 p-5
                  ${c.border} transition-all duration-200 group animate-fadeInUp`}
    >
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-navy-700" />
          <div className="h-3 w-24 bg-navy-700 rounded" />
          <div className="h-7 w-32 bg-navy-700 rounded" />
        </div>
      ) : (
        <>
          <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center mb-3`}>
            <span className={`${c.icon} [&>svg]:w-5 [&>svg]:h-5`}>{icon}</span>
          </div>
          <p className="text-xs font-semibold text-muted uppercase tracking-widest">{title}</p>
          <p className="text-2xl font-bold text-white mt-1 tabular-nums">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 font-medium ${trendUp ? 'text-success' : 'text-red'}`}>
              {trendUp ? '▲' : '▼'} {trend}
            </p>
          )}
        </>
      )}
    </div>
  );
}
