import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Plus } from 'lucide-react';
import { useVendorStore } from '../../state/vendorStore';
import VendorCard from '../../components/vendors/VendorCard';

export default function VendorsPage() {
  const navigate = useNavigate();
  const { vendors, isLoading, fetchVendors } = useVendorStore();

  useEffect(() => { fetchVendors(); }, []);

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red mb-1">Supply Chain</p>
          <h1 className="text-2xl font-bold text-white">Vendors</h1>
          <p className="text-muted text-sm mt-0.5">
            {isLoading ? 'Loading…' : `${vendors.length} vendor${vendors.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => navigate('/vendors/new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-red text-white rounded-xl font-semibold text-sm hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red/20"
        >
          <Plus className="w-4 h-4" />
          Add Vendor
        </button>
      </div>

      {/* Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-navy-800 rounded-2xl border border-navy-700 p-5 h-[140px] animate-pulse" />
          ))}
        </div>
      )}

      {/* Vendor grid */}
      {!isLoading && vendors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((v) => <VendorCard key={v.id} vendor={v} />)}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && vendors.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Store className="w-14 h-14 text-navy-600 mb-4" />
          <p className="text-white font-semibold">No vendors yet</p>
          <p className="text-muted text-sm mt-1">Add your suppliers to start recording purchases</p>
          <button
            onClick={() => navigate('/vendors/new')}
            className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-red text-white rounded-xl font-semibold text-sm hover:bg-red-600 transition-all"
          >
            <Plus className="w-4 h-4" /> Add First Vendor
          </button>
        </div>
      )}
    </div>
  );
}
