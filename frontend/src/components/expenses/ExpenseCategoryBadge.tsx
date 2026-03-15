const CATEGORY_CONFIG: Record<string, { label: string; classes: string }> = {
  electricity: { label: '⚡ Electricity',  classes: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  water:       { label: '💧 Water',         classes: 'bg-blue-400/10 text-blue-300 border-blue-400/20' },
  rent:        { label: '🏠 Rent',          classes: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  salary:      { label: '👤 Salary',        classes: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  chemical:    { label: '🧪 Chemical',      classes: 'bg-red/10 text-red border-red/20' },
  equipment:   { label: '🔧 Equipment',     classes: 'bg-success/10 text-success border-success/20' },
  purchase:    { label: '🛒 Purchase',      classes: 'bg-gold/10 text-gold border-gold/20' },
  transport:   { label: '🚗 Transport',     classes: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  maintenance: { label: '🔨 Maintenance',   classes: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  other:       { label: '📦 Other',         classes: 'bg-navy-600 text-muted border-navy-500' },
};

export const EXPENSE_CATEGORIES = Object.keys(CATEGORY_CONFIG);

interface ExpenseCategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md';
}

export default function ExpenseCategoryBadge({ category, size = 'md' }: ExpenseCategoryBadgeProps) {
  const cfg = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.other;
  return (
    <span className={`inline-flex items-center border rounded-xl font-medium whitespace-nowrap
      ${cfg.classes}
      ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'}`}>
      {cfg.label}
    </span>
  );
}

export { CATEGORY_CONFIG };
