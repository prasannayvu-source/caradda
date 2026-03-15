import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';

interface DailyRevenue {
  date: string;
  revenue: number;
}

interface SalesChartProps {
  data: DailyRevenue[];
  isLoading?: boolean;
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
};

const formatINR = (val: number) =>
  val >= 1000 ? `₹${(val / 1000).toFixed(1)}k` : `₹${val}`;

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-navy-800 border border-navy-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-muted text-xs mb-1">{label}</p>
        <p className="text-gold font-bold text-base tabular-nums">
          ₹{Number(payload[0].value).toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
};

export default function SalesChart({ data, isLoading }: SalesChartProps) {
  const today = new Date().toISOString().split('T')[0];
  
  const chartData = data.map((d) => ({
    name: formatDate(d.date),
    revenue: d.revenue,
    isToday: d.date === today,
  }));

  if (isLoading) {
    return (
      <div className="bg-navy-800 rounded-2xl border border-navy-700 p-5 animate-pulse">
        <div className="h-5 w-40 bg-navy-700 rounded mb-6" />
        <div className="h-[200px] bg-navy-700/50 rounded-xl" />
      </div>
    );
  }

  const hasData = data.some((d) => d.revenue > 0);

  return (
    <div className="bg-navy-800 rounded-2xl border border-navy-700 p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white">Weekly Revenue</h3>
          <p className="text-xs text-muted mt-0.5">Last 7 days sales performance</p>
        </div>
        <span className="text-xs text-muted font-medium bg-navy-700 px-3 py-1.5 rounded-lg">
          7-Day View
        </span>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-[200px] text-center">
          <p className="text-muted text-sm">No sales data yet</p>
          <p className="text-muted/60 text-xs mt-1">Create your first bill to see it here</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barSize={28} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatINR}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(51, 65, 85, 0.4)', radius: 8 }}
            />
            <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.isToday ? '#EF4444' : '#FACC15'}
                  fillOpacity={entry.isToday ? 1 : 0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-gold/70 inline-block" />
          Previous days
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-red inline-block" />
          Today
        </span>
      </div>
    </div>
  );
}
