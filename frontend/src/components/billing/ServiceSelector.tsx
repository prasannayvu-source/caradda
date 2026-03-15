import { useEffect, useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { getServices } from '../../services/servicesService';
import type { DraftItem } from '../../state/billingStore';

interface Service {
  id: string;
  name: string;
  base_price: number;
  category: string;
}

interface ServiceSelectorProps {
  onAdd: (item: DraftItem) => void;
}

export default function ServiceSelector({ onAdd }: ServiceSelectorProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    getServices().then((res) => setServices(res.data ?? [])).catch(() => {});
  }, []);

  const handleServiceChange = (id: string) => {
    if (id === '__custom__') {
      setIsCustom(true);
      setSelectedId('__custom__');
      setPrice(0);
      return;
    }
    setIsCustom(false);
    setSelectedId(id);
    const svc = services.find((s) => s.id === id);
    if (svc) setPrice(svc.base_price);
  };

  const handleAdd = () => {
    if (!selectedId || price <= 0) return;
    if (isCustom && !customDesc.trim()) return;

    const svc = services.find((s) => s.id === selectedId);
    onAdd({
      service_id: isCustom ? undefined : selectedId,
      service_name: isCustom ? customDesc.trim() : (svc?.name ?? 'Service'),
      description: isCustom ? customDesc.trim() : (svc?.name ?? ''),
      quantity: 1,
      unit_price: price,
    });

    // Reset
    setSelectedId('');
    setCustomDesc('');
    setPrice(0);
    setIsCustom(false);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px_auto] gap-2">
        {/* Service dropdown */}
        <div className="relative">
          <select
            value={selectedId}
            onChange={(e) => handleServiceChange(e.target.value)}
            style={{ colorScheme: 'dark' }}
            className="
              w-full bg-[#1E293B] border border-navy-700 text-white rounded-xl
              px-4 py-2.5 text-sm
              focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30
              transition-all duration-150
            "
          >
            <option value="">Select a service…</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.base_price > 0 ? `— ₹${s.base_price}` : ''}
              </option>
            ))}
            <option value="__custom__">➕ Custom Service</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        </div>

        {/* Price input */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
          <input
            type="number"
            min={0}
            step={50}
            value={price || ''}
            placeholder="Price"
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
          className="
            w-full bg-[#1E293B] border border-navy-700 text-white rounded-xl
            px-4 py-2.5 text-sm
            placeholder:text-muted/60
            focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30
            transition-all duration-150
          "
          />
        </div>

        {/* Add button */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectedId || price <= 0}
          className="
            flex items-center gap-2 px-4 py-2.5 bg-red text-white rounded-xl
            text-sm font-semibold
            hover:bg-red-600 active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-150
          "
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Custom description input */}
      {isCustom && (
        <input
          type="text"
          placeholder="Custom service description…"
          value={customDesc}
          onChange={(e) => setCustomDesc(e.target.value)}
          className="
            w-full bg-navy-800 border border-navy-700 text-white rounded-xl
            px-4 py-2.5 text-sm
            placeholder:text-muted/60
            focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30
            transition-all duration-150
          "
        />
      )}
    </div>
  );
}
