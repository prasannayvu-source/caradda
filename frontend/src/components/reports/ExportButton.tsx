import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { exportBillsCsv, exportExpensesCsv } from '../../services/reportService';
import toast from 'react-hot-toast';

interface ExportButtonProps {
  type: 'bills' | 'expenses';
  from: string;
  to: string;
}

export default function ExportButton({ type, from, to }: ExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const res = type === 'bills'
        ? await exportBillsCsv(from, to)
        : await exportExpensesCsv(from, to);

      // Create browser download from blob
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `caradda-${type}-${from}-to-${to}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${type === 'bills' ? 'Bills' : 'Expenses'} CSV downloaded!`);
    } catch {
      toast.error('Export failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const label = type === 'bills' ? 'Download Bills CSV' : 'Download Expenses CSV';

  return (
    <button
      onClick={handleExport}
      disabled={isLoading}
      className="
        flex items-center gap-2 px-5 py-2.5 
        bg-navy-800 border border-navy-700 rounded-xl
        text-sm font-medium text-white
        hover:bg-navy-700 hover:border-navy-600
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-150
      "
    >
      {isLoading
        ? <Loader2 className="w-4 h-4 animate-spin" />
        : <Download className="w-4 h-4 text-gold" />
      }
      {label}
    </button>
  );
}
