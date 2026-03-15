import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useExpenseStore } from '../../state/expenseStore';
import { EXPENSE_CATEGORIES } from '../../components/expenses/ExpenseCategoryBadge';

const TODAY = new Date().toISOString().split('T')[0];

interface FormData {
  name: string;
  category: string;
  amount: string;
  expense_date: string;
  description: string;
  notes: string;
}

const EMPTY: FormData = {
  name: '', category: 'other', amount: '',
  expense_date: TODAY, description: '', notes: '',
};

export default function AddExpensePage() {
  const navigate = useNavigate();
  const { isSubmitting, createExpense } = useExpenseStore();
  const [form, setForm] = useState<FormData>(EMPTY);

  const set = (field: keyof FormData, val: string) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) return;

    const ok = await createExpense({
      name: form.name.trim(),
      category: form.category,
      amount,
      expense_date: form.expense_date,
      description: form.description || undefined,
      notes: form.notes || undefined,
    });
    if (ok) navigate('/expenses');
  };

  const inputClass = `
    w-full bg-[#1E293B] border border-navy-700 text-white rounded-xl
    px-4 py-2.5 text-sm placeholder:text-muted/60
    focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30
    transition-all duration-150
  `;
  const labelClass = "block text-sm font-medium text-muted mb-1.5";

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fadeIn">

      {/* Header */}
      <div>
        <button onClick={() => navigate('/expenses')}
          className="flex items-center gap-2 text-muted hover:text-white transition-colors text-sm mb-5 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Expenses
        </button>
        <p className="text-xs font-semibold uppercase tracking-widest text-red mb-1">Finance</p>
        <h1 className="text-2xl font-bold text-white">Log Expense</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-navy-800 rounded-2xl border border-navy-700 p-6 space-y-5">

        {/* Name */}
        <div>
          <label className={labelClass}>Expense Name <span className="text-red">*</span></label>
          <input required type="text" value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Electricity Bill" className={inputClass} />
        </div>

        {/* Category + Amount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}
              style={{ colorScheme: 'dark' }}
              className={inputClass}>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Amount <span className="text-red">*</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
              <input required type="number" min={0.01} step={0.5} value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
                placeholder="0" className={`${inputClass} pl-8`} />
            </div>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className={labelClass}>Date <span className="text-red">*</span></label>
          <input required type="date" value={form.expense_date} max={TODAY}
            onChange={(e) => set('expense_date', e.target.value)}
            style={{ colorScheme: 'dark' }}
            className={inputClass} />
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description (optional)</label>
          <input type="text" value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Short description" className={inputClass} />
        </div>

        {/* Notes */}
        <div>
          <label className={labelClass}>Notes (optional)</label>
          <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)}
            placeholder="Any additional context…" rows={2}
            className={`${inputClass} resize-y min-h-[60px]`} />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/expenses')}
            className="flex-1 px-4 py-2.5 rounded-xl bg-navy-700 border border-navy-600 text-white text-sm font-medium hover:bg-navy-600 transition-all">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red text-white font-semibold text-sm hover:bg-red-600 active:scale-95 disabled:opacity-40 transition-all shadow-lg shadow-red/20">
            {isSubmitting ? '⏳ Saving…' : <><Save className="w-4 h-4" /> Log Expense</>}
          </button>
        </div>
      </form>
    </div>
  );
}
