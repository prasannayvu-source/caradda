interface VehicleTagProps {
  carNumber: string;
  carModel?: string;
  size?: 'sm' | 'md';
}

export default function VehicleTag({ carNumber, carModel, size = 'md' }: VehicleTagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border border-navy-600
        bg-navy-700 font-mono font-semibold text-gold
        ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'}`}
      title={carModel}
    >
      🚗 {carNumber.toUpperCase()}
      {carModel && <span className="text-muted font-sans font-normal">· {carModel}</span>}
    </span>
  );
}
