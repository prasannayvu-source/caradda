import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Calculator } from 'lucide-react';
import { useVendorStore } from '../../state/vendorStore';
import { useInventoryStore } from '../../state/inventoryStore';

const TODAY = new Date().toISOString().split('T')[0];

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function RecordPurchasePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preVendorId = searchParams.get('vendor_id') ?? '';

  const { vendors, isSubmitting, fetchVendors, recordPurchase } = useVendorStore();
  const { items: invItems, fetchInventory } = useInventoryStore();

  const [vendorId, setVendorId]     = useState(preVendorId);
  const [inventoryId, setInventoryId] = useState('');
  const [qty, setQty]               = useState('');
  const [unitPrice, setUnitPrice]   = useState('');
  const [date, setDate]             = useState(TODAY);
  const [notes, setNotes]           = useState('');
  const [createExpense, setCreateExpense] = useState(true);

  const quantity = parseFloat(qty) || 0;
  const price    = parseFloat(unitPrice) || 0;
  const total    = quantity * price;

  // Derive unit for selected inventory item
  const selectedItem = invItems.find((i) => i.id === inventoryId);

  useEffect(() => {
    fetchVendors();
    fetchInventory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId || !inventoryId || quantity <= 0 || price <= 0) return;

    const ok = await recordPurchase({
      vendor_id: vendorId,
      inventory_id: inventoryId,
      quantity,
      unit_price: price,
      purchase_date: date,
      notes: notes || undefined,
      auto_create_expense: createExpense,
    });
    if (ok) navigate('/purchases');
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
        <button onClick={() => navigate('/purchases')}
          className="flex items-center gap-2 text-muted hover:text-white transition-colors text-sm mb-5 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Purchases
        </button>
        <p className="text-xs font-semibold uppercase tracking-widest text-red mb-1">Purchases</p>
        <h1 className="text-2xl font-bold text-white">Record Purchase</h1>
        <p className="text-muted text-sm mt-0.5">Inventory will be restocked automatically</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-navy-800 rounded-2xl border border-navy-700 p-6 space-y-5">

        {/* Vendor */}
        <div>
          <label className={labelClass}>Vendor <span className="text-red">*</span></label>
          <div className="flex gap-2">
            <select required value={vendorId} onChange={(e) => setVendorId(e.target.value)}
              style={{ colorScheme: 'dark' }}
              className={`${inputClass} flex-1`}>
              <option value="">Select vendor…</option>
              {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            <button type="button" onClick={() => navigate('/vendors/new')}
              title="Add new vendor"
              className="px-3 py-2.5 bg-navy-700 border border-navy-600 text-muted hover:text-white rounded-xl text-sm transition-all">
              + New
            </button>
          </div>
        </div>

        {/* Inventory Item */}
        <div>
          <label className={labelClass}>Inventory Item <span className="text-red">*</span></label>
          <select required value={inventoryId} onChange={(e) => setInventoryId(e.target.value)}
            style={{ colorScheme: 'dark' }}
            className={inputClass}>
            <option value="">Select item…</option>
            {invItems.map((i) => (
              <option key={i.id} value={i.id}>
                {i.item_name} — {i.quantity} {i.unit}
              </option>
            ))}
          </select>
        </div>

        {/* Qty + Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Quantity <span className="text-red">*</span></label>
            <div className="relative">
              <input type="number" required min={0.01} step={0.5} value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="0" className={inputClass} />
              {selectedItem && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-xs pointer-events-none">
                  {selectedItem.unit}
                </span>
              )}
            </div>
          </div>
          <div>
            <label className={labelClass}>Unit Price <span className="text-red">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
              <input type="number" required min={0.01} step={0.5} value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="0" className={`${inputClass} pl-7`} />
            </div>
          </div>
        </div>

        {/* Total preview */}
        {total > 0 && (
          <div className="flex items-center gap-3 bg-gold/5 border border-gold/20 rounded-xl px-4 py-3">
            <Calculator className="w-4 h-4 text-gold" />
            <span className="text-sm text-muted">Total amount</span>
            <span className="ml-auto text-xl font-extrabold text-gold tabular-nums">{fmt(total)}</span>
          </div>
        )}

        {/* Date */}
        <div>
          <label className={labelClass}>Purchase Date <span className="text-red">*</span></label>
          <input type="date" required value={date} max={TODAY}
            onChange={(e) => setDate(e.target.value)}
            style={{ colorScheme: 'dark' }}
            className={inputClass} />
        </div>

        {/* Notes */}
        <div>
          <label className={labelClass}>Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Monthly restock, bulk discount applied"
            rows={2} className={`${inputClass} resize-y min-h-[60px]`} />
        </div>

        {/* Create expense toggle */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => setCreateExpense(!createExpense)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${createExpense ? 'bg-success' : 'bg-navy-600'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${createExpense ? 'translate-x-5' : ''}`} />
          </div>
          <span className="text-sm text-white">Auto-create expense record</span>
          <span className="text-xs text-muted">(recommended)</span>
        </label>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/purchases')}
            className="flex-1 px-4 py-2.5 rounded-xl bg-navy-700 border border-navy-600 text-white text-sm font-medium hover:bg-navy-600 transition-all">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting || !vendorId || !inventoryId || quantity <= 0 || price <= 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red text-white font-semibold text-sm hover:bg-red-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-red/20">
            {isSubmitting ? '⏳ Recording…' : <><ShoppingCart className="w-4 h-4" /> Record Purchase</>}
          </button>
        </div>
      </form>
    </div>
  );
}
