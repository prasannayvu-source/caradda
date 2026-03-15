import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findOrCreateCustomer } from '../../services/customerService';
import { useBillingStore } from '../../state/billingStore';
import type { DraftItem } from '../../state/billingStore';
import ServiceSelector from '../../components/billing/ServiceSelector';
import BillItemRow from '../../components/billing/BillItemRow';
import BillSummary from '../../components/billing/BillSummary';
import PaymentMethodToggle from '../../components/billing/PaymentMethodToggle';
import { useDebounce } from '../../hooks/useDebounce';
import { Phone, Car, AlertCircle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateBillPage() {
  const navigate = useNavigate();
  const { draftBill, isSubmitting, updateDraft, setDraftItems, resetDraft, createBill } = useBillingStore();

  const [phoneLookup, setPhoneLookup] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [customerFound, setCustomerFound] = useState<boolean | null>(null);
  const debouncedPhone = useDebounce(phoneLookup, 600);

  // Auto-look up customer when 10 digits entered
  useEffect(() => {
    if (debouncedPhone.length !== 10) {
      setCustomerFound(null);
      return;
    }
    setIsLookingUp(true);
    findOrCreateCustomer(debouncedPhone, draftBill.customer_name || 'Customer')
      .then((res) => {
        if (res.data && !res.data.is_new) {
          updateDraft({
            customer_phone: debouncedPhone,
            customer_name: res.data.name,
            customer_id: res.data.id,
          });
          setCustomerFound(true);
          toast.success(`Found: ${res.data.name}`, { id: 'customer-lookup', duration: 2500 });
        } else {
          updateDraft({ customer_phone: debouncedPhone, customer_id: undefined });
          setCustomerFound(false);
        }
      })
      .catch(() => {
        updateDraft({ customer_phone: debouncedPhone });
        setCustomerFound(false);
      })
      .finally(() => setIsLookingUp(false));
  }, [debouncedPhone]);

  const handleAddItem = (item: DraftItem) => {
    setDraftItems([...draftBill.items, item]);
  };

  const handleChangeItem = (index: number, field: keyof DraftItem, value: string | number) => {
    const updated = draftBill.items.map((it, i) =>
      i === index ? { ...it, [field]: value } : it
    );
    setDraftItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setDraftItems(draftBill.items.filter((_, i) => i !== index));
  };

  const subtotal = draftBill.items.reduce((acc, it) => acc + it.quantity * it.unit_price, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftBill.customer_phone || draftBill.customer_phone.length !== 10) {
      toast.error('Valid 10-digit phone is required'); return;
    }
    if (!draftBill.customer_name.trim()) {
      toast.error('Customer name is required'); return;
    }
    if (!draftBill.car_number.trim()) {
      toast.error('Car number is required'); return;
    }
    if (draftBill.items.length === 0) {
      toast.error('Add at least one service'); return;
    }

    const billId = await createBill({
      customer_phone: draftBill.customer_phone,
      customer_name: draftBill.customer_name,
      car_number: draftBill.car_number.toUpperCase(),
      items: draftBill.items.map((it) => ({
        service_id: it.service_id,
        description: it.description,
        quantity: it.quantity,
        unit_price: it.unit_price,
      })),
      discount: draftBill.discount,
      payment_method: draftBill.payment_method,
      payment_status: draftBill.payment_status,
      notes: draftBill.notes || undefined,
    });

    if (billId) {
      resetDraft();
      navigate(`/billing/${billId}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">

      {/* ── Header ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-red mb-1">Billing</p>
        <h1 className="text-2xl font-bold text-white">Create Bill</h1>
        <p className="text-muted text-sm mt-0.5">Fill in customer details and add services</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Customer Section ── */}
        <div className="bg-navy-800 rounded-2xl border border-navy-700 p-5 space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted" />
            Customer Details
          </h2>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">
              Phone Number <span className="text-red">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                maxLength={10}
                value={phoneLookup}
                onChange={(e) => setPhoneLookup(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile number"
                style={{ colorScheme: 'dark' }}
                className={`
                  w-full bg-[#0F172A] border text-white rounded-xl px-4 py-2.5 text-sm font-mono
                  placeholder:text-muted/60 focus:outline-none transition-all duration-150
                  ${customerFound === true ? 'border-success/60 ring-1 ring-success/20' :
                    customerFound === false ? 'border-warning/60 ring-1 ring-warning/20' :
                    'border-navy-700 focus:border-red/60 focus:ring-1 focus:ring-red/30'}
                `}
              />
              {isLookingUp && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted animate-pulse">
                  Looking up…
                </span>
              )}
            </div>
            {customerFound === true && (
              <p className="text-xs text-success mt-1 flex items-center gap-1">
                ✓ Returning customer found
              </p>
            )}
            {customerFound === false && (
              <p className="text-xs text-warning mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> New customer — enter name below
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">
              Customer Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              value={draftBill.customer_name}
              onChange={(e) => updateDraft({ customer_name: e.target.value })}
              placeholder="Full name"
              className="
                w-full bg-[#0F172A] border border-navy-700 text-white rounded-xl
                px-4 py-2.5 text-sm placeholder:text-muted/60
                focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30
                transition-all duration-150
              "
            />
          </div>

          {/* Car Number */}
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">
              <Car className="w-3.5 h-3.5 inline mr-1" />
              Car Number <span className="text-red">*</span>
            </label>
            <input
              type="text"
              value={draftBill.car_number}
              onChange={(e) => updateDraft({ car_number: e.target.value.toUpperCase() })}
              placeholder="e.g. MH12AB1234"
              className="
                w-full bg-[#0F172A] border border-navy-700 text-white rounded-xl
                px-4 py-2.5 text-sm font-mono uppercase placeholder:normal-case placeholder:text-muted/60
                focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30
                transition-all duration-150
              "
            />
          </div>
        </div>

        {/* ── Services ── */}
        <div className="bg-navy-800 rounded-2xl border border-navy-700 p-5 space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-muted" />
            Services
          </h2>

          <ServiceSelector onAdd={handleAddItem} />

          {/* Column headers */}
          {draftBill.items.length > 0 && (
            <>
              <div className="grid grid-cols-[1fr_80px_110px_90px_36px] gap-2 text-xs font-semibold text-muted uppercase tracking-wide px-0.5">
                <span>Service</span>
                <span className="text-center">Qty</span>
                <span className="text-center">Price</span>
                <span className="text-right">Total</span>
                <span />
              </div>
              <div className="space-y-2">
                {draftBill.items.map((item, i) => (
                  <BillItemRow
                    key={i}
                    item={item}
                    index={i}
                    onChange={handleChangeItem}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </>
          )}

          {draftBill.items.length === 0 && (
            <p className="text-muted/60 text-sm text-center py-4">
              No services added yet. Select from the dropdown above.
            </p>
          )}
        </div>

        {/* ── Bill Summary ── */}
        {draftBill.items.length > 0 && (
          <BillSummary
            subtotal={subtotal}
            discount={draftBill.discount}
            editable
            onDiscountChange={(v) => updateDraft({ discount: v })}
          />
        )}

        {/* ── Payment Method ── */}
        <div className="bg-navy-800 rounded-2xl border border-navy-700 p-5 space-y-4">
          <h2 className="text-base font-semibold text-white">Payment</h2>
          <PaymentMethodToggle
            value={draftBill.payment_method}
            onChange={(v) => updateDraft({ payment_method: v })}
          />
          <div className="flex items-center gap-4">
            <label className="text-sm text-muted font-medium">Status</label>
            <div className="bg-navy-900/60 rounded-xl p-1 inline-flex border border-navy-700">
              {(['paid', 'pending'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateDraft({ payment_status: s })}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 capitalize
                    ${draftBill.payment_status === s
                      ? s === 'paid' ? 'bg-success/20 text-success border border-success/30'
                                    : 'bg-warning/20 text-warning border border-warning/30'
                      : 'text-muted hover:text-white'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">Notes (optional)</label>
            <textarea
              value={draftBill.notes}
              onChange={(e) => updateDraft({ notes: e.target.value })}
              placeholder="Any additional notes…"
              rows={2}
              className="
                w-full bg-[#0F172A] border border-navy-700 text-white rounded-xl
                px-4 py-2.5 text-sm resize-y min-h-[60px]
                placeholder:text-muted/60
                focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30
                transition-all duration-150
              "
            />
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => { resetDraft(); navigate('/billing'); }}
            className="px-5 py-2.5 rounded-xl bg-navy-700 border border-navy-600 text-white text-sm font-medium hover:bg-navy-600 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || draftBill.items.length === 0}
            className="
              flex items-center gap-2 px-6 py-2.5 rounded-xl
              bg-red text-white font-semibold text-sm
              hover:bg-red-600 active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-150 shadow-lg shadow-red/20
            "
          >
            {isSubmitting ? '⏳ Creating…' : '✓ Create Bill'}
          </button>
        </div>
      </form>
    </div>
  );
}
