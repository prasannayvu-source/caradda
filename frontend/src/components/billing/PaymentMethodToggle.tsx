interface PaymentMethodToggleProps {
  value: 'cash' | 'upi';
  onChange: (v: 'cash' | 'upi') => void;
}

export default function PaymentMethodToggle({ value, onChange }: PaymentMethodToggleProps) {
  return (
    <div className="bg-navy-900/60 rounded-xl p-1 inline-flex border border-navy-700">
      {(['cash', 'upi'] as const).map((method) => (
        <button
          key={method}
          type="button"
          onClick={() => onChange(method)}
          className={`
            px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 uppercase tracking-wide
            ${value === method
              ? 'bg-red text-white shadow-md shadow-red/20'
              : 'text-muted hover:text-white'
            }
          `}
        >
          {method === 'cash' ? '💵 Cash' : '📱 UPI'}
        </button>
      ))}
    </div>
  );
}
