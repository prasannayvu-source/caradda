import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ExpenseCategoryBreakdown } from '../../state/reportStore';

interface ExpenseDoughnutChartProps {
  data: ExpenseCategoryBreakdown[];
}

const PALETTE = [
  '#C9A84C', '#EF4444', '#22C55E', '#3B82F6',
  '#A855F7', '#F97316', '#EC4899', '#14B8A6',
  '#64748B', '#84CC16',
];

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-navy-800 border border-navy-600 rounded-xl px-3 py-2 shadow-xl text-sm">
      <p className="text-white font-semibold capitalize">{d.category}</p>
      <p className="text-gold font-bold tabular-nums">{fmt(d.total)}</p>
    </div>
  );
};

export default function ExpenseDoughnutChart({ data }: ExpenseDoughnutChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-muted text-sm">
        No expense data
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="45%"
            innerRadius="50%"
            outerRadius="75%"
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-xs text-muted capitalize">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
