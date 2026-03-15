import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useVendorStore } from '../../state/vendorStore';
import { Spinner } from '../../components/ui/Spinner';

interface FormData {
  name: string;
  phone: string;
  address: string;
  email: string;
}

const EMPTY: FormData = { name: '', phone: '', address: '', email: '' };

export default function VendorFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const {
    selectedVendor, isDetailLoading, isSubmitting,
    fetchVendorById, createVendor, updateVendor, clearSelected,
  } = useVendorStore();

  const [form, setForm] = useState<FormData>(EMPTY);

  useEffect(() => {
    if (isEdit && id) fetchVendorById(id);
    return () => clearSelected();
  }, [id]);

  useEffect(() => {
    if (isEdit && selectedVendor) {
      setForm({
        name: selectedVendor.name,
        phone: selectedVendor.phone ?? '',
        address: selectedVendor.address ?? '',
        email: selectedVendor.email ?? '',
      });
    }
  }, [selectedVendor]);

  const set = (field: keyof FormData, val: string) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name.trim(),
      phone: form.phone || undefined,
      address: form.address || undefined,
      email: form.email || undefined,
    };

    let ok = false;
    if (isEdit && id) {
      ok = await updateVendor(id, data);
    } else {
      ok = await createVendor(data);
    }
    if (ok) navigate('/vendors');
  };

  if (isEdit && isDetailLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const inputClass = `
    w-full bg-navy-800 border border-navy-700 text-white rounded-xl
    px-4 py-2.5 text-sm placeholder:text-muted/60
    focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30
    transition-all duration-150
  `;
  const labelClass = "block text-sm font-medium text-muted mb-1.5";

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fadeIn">
      <div>
        <button onClick={() => navigate('/vendors')}
          className="flex items-center gap-2 text-muted hover:text-white transition-colors text-sm mb-5 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Vendors
        </button>
        <p className="text-xs font-semibold uppercase tracking-widest text-red mb-1">Vendors</p>
        <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Vendor' : 'Add New Vendor'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-navy-800 rounded-2xl border border-navy-700 p-6 space-y-5">
        <div>
          <label className={labelClass}>Business / Vendor Name <span className="text-red">*</span></label>
          <input required type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Auto Chemicals Ltd" className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Phone</label>
            <input type="tel" maxLength={10} value={form.phone}
              onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))}
              placeholder="10-digit number" className={`${inputClass} font-mono`} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
              placeholder="vendor@example.com" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Address</label>
          <textarea value={form.address} onChange={(e) => set('address', e.target.value)}
            placeholder="City, State" rows={2}
            className={`${inputClass} resize-y min-h-[60px]`} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/vendors')}
            className="flex-1 px-4 py-2.5 rounded-xl bg-navy-700 border border-navy-600 text-white text-sm font-medium hover:bg-navy-600 transition-all">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red text-white font-semibold text-sm hover:bg-red-600 active:scale-95 disabled:opacity-40 transition-all shadow-lg shadow-red/20">
            {isSubmitting ? '⏳ Saving…' : <><Save className="w-4 h-4" />{isEdit ? 'Update Vendor' : 'Add Vendor'}</>}
          </button>
        </div>
      </form>
    </div>
  );
}
