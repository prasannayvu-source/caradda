import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useInventoryStore } from '../../state/inventoryStore';
import { Spinner } from '../../components/ui/Spinner';

const UNITS = ['ml', 'litre', 'pcs', 'kg', 'gm'] as const;
const CATEGORIES = ['chemical', 'cloth', 'accessory', 'equipment', 'other'] as const;

interface FormData {
  item_name: string;
  category: string;
  quantity: string;
  unit: string;
  low_stock_threshold: string;
}

const EMPTY: FormData = {
  item_name: '', category: 'chemical',
  quantity: '', unit: 'pcs', low_stock_threshold: '1',
};

export default function InventoryFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { selectedItem, isDetailLoading, isSubmitting, fetchItemById, addItem, updateItem } = useInventoryStore();

  const [form, setForm] = useState<FormData>(EMPTY);

  useEffect(() => {
    if (isEdit && id) fetchItemById(id);
  }, [id]);

  useEffect(() => {
    if (isEdit && selectedItem) {
      setForm({
        item_name: selectedItem.item_name,
        category: selectedItem.category,
        quantity: String(selectedItem.quantity),
        unit: selectedItem.unit,
        low_stock_threshold: String(selectedItem.low_stock_threshold),
      });
    }
  }, [selectedItem]);

  const set = (field: keyof FormData, val: string) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      item_name: form.item_name.trim(),
      category: form.category,
      quantity: parseFloat(form.quantity) || 0,
      unit: form.unit,
      low_stock_threshold: parseFloat(form.low_stock_threshold) || 1,
    };

    let ok = false;
    if (isEdit && id) {
      const { quantity: _q, ...updateData } = data;
      ok = await updateItem(id, updateData);
    } else {
      ok = await addItem(data);
    }
    if (ok) navigate('/inventory');
  };

  if (isEdit && isDetailLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

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
        <button onClick={() => navigate('/inventory')}
          className="flex items-center gap-2 text-muted hover:text-white transition-colors text-sm mb-5 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Inventory
        </button>
        <p className="text-xs font-semibold uppercase tracking-widest text-red mb-1">Inventory</p>
        <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Item' : 'Add New Item'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-navy-800 rounded-2xl border border-navy-700 p-6 space-y-5">

        {/* Item name */}
        <div>
          <label className={labelClass}>Item Name <span className="text-red">*</span></label>
          <input type="text" required value={form.item_name} onChange={(e) => set('item_name', e.target.value)}
            placeholder="e.g. Foam Shampoo" className={inputClass} />
        </div>

        {/* Category + Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}
              style={{ colorScheme: 'dark' }}
              className={inputClass}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Unit</label>
            <select value={form.unit} onChange={(e) => set('unit', e.target.value)}
              style={{ colorScheme: 'dark' }}
              className={inputClass}>
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {/* Quantity (only on create) */}
        {!isEdit && (
          <div>
            <label className={labelClass}>Opening Stock <span className="text-red">*</span></label>
            <input type="number" min={0} step={0.5} value={form.quantity}
              onChange={(e) => set('quantity', e.target.value)}
              placeholder="0" className={inputClass} />
          </div>
        )}

        {/* Low stock threshold */}
        <div>
          <label className={labelClass}>Low Stock Threshold <span className="text-red">*</span></label>
          <input type="number" min={0.01} step={0.5} value={form.low_stock_threshold}
            onChange={(e) => set('low_stock_threshold', e.target.value)}
            placeholder="1" className={inputClass} />
          <p className="text-xs text-muted/70 mt-1">Alert will trigger when quantity falls to or below this value</p>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/inventory')}
            className="flex-1 px-4 py-2.5 rounded-xl bg-navy-700 border border-navy-600 text-white text-sm font-medium hover:bg-navy-600 transition-all">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red text-white font-semibold text-sm hover:bg-red-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-red/20">
            {isSubmitting ? '⏳ Saving…' : <><Save className="w-4 h-4" />{isEdit ? 'Update Item' : 'Add to Inventory'}</>}
          </button>
        </div>
      </form>
    </div>
  );
}
