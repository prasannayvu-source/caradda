import { useEffect, useState } from 'react';
import { Users, Inbox } from 'lucide-react';
import { useCustomerStore } from '../../state/customerStore';
import { useDebounce } from '../../hooks/useDebounce';
import CustomerSearchBar from '../../components/customers/CustomerSearchBar';
import CustomerCard from '../../components/customers/CustomerCard';

export default function CustomersPage() {
  const { customers, total, isLoading, fetchCustomers } = useCustomerStore();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    fetchCustomers(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red mb-1">Management</p>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-muted text-sm mt-0.5">
            {isLoading ? 'Loading…' : `${total} customer${total !== 1 ? 's' : ''} registered`}
          </p>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <CustomerSearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by name or phone number…"
      />

      {/* ── Loading skeletons ── */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-navy-800 rounded-2xl border border-navy-700 p-5 animate-pulse space-y-3 h-40">
              <div className="flex gap-3">
                <div className="w-11 h-11 rounded-xl bg-navy-700" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 bg-navy-700 rounded w-3/4" />
                  <div className="h-3 bg-navy-700 rounded w-1/2" />
                </div>
              </div>
              <div className="h-6 bg-navy-700 rounded-lg w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* ── Customer Grid ── */}
      {!isLoading && customers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      {!isLoading && customers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          {search ? (
            <>
              <Inbox className="w-14 h-14 text-navy-600 mb-4" />
              <p className="text-white font-semibold text-base">No results for "{search}"</p>
              <p className="text-muted text-sm mt-1">Try a different name or phone number</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-navy-700 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-navy-600" />
              </div>
              <p className="text-white font-semibold text-base">No customers yet</p>
              <p className="text-muted text-sm mt-1">
                Customers are added automatically when you create their first bill
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
