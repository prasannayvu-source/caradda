import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import type { DailyRevenue } from '../../state/reportStore';

interface SalesBarChartProps {
  data: DailyRevenue[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const value = payload[0].value ?? 0;
  return (
    <div className="bg-navy-800 border border-navy-600 rounded-xl px-3 py-2 shadow-xl text-sm">
      <p className="text-muted text-xs mb-1">{label}</p>
      <p className="font-bold text-gold tabular-nums">
        ₹{new Intl.NumberFormat('en-IN').format(value)}
      </p>
    </div>
  );
};

export default function SalesBarChart({ data }: SalesBarChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-muted text-sm">
        No data for selected period
      </div>
    );
  }

  // For many days, only show every N-th label to avoid clutter
  const step = data.length > 14 ? 5 : 1;

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#94A3B8', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val, i) => (i % step === 0 ? val.slice(5) : '')}
          />
          <YAxis
            tick={{ fill: '#94A3B8', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar
            dataKey="revenue"
            fill="#C9A84C"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
