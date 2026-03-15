import { Search, X } from 'lucide-react';

interface CustomerSearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function CustomerSearchBar({
  value,
  onChange,
  placeholder = 'Search by name or phone…',
}: CustomerSearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-muted" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full bg-navy-800 border border-navy-700 text-white rounded-xl
          pl-11 pr-10 py-3 text-sm
          placeholder:text-muted/60
          hover:border-navy-600
          focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30
          transition-all duration-150
        "
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-3 flex items-center px-1 text-muted hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
