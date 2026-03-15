import { useState } from 'react';
import { Printer, Download, MessageCircle, Loader2 } from 'lucide-react';
import { downloadBillPDF, sendWhatsApp } from '../../services/billingService';
import toast from 'react-hot-toast';

interface BillActionsProps {
  billId: string;
  billNumber: string;
}

export default function BillActions({ billId, billNumber }: BillActionsProps) {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isWaLoading, setIsWaLoading] = useState(false);

  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {
    setIsPdfLoading(true);
    try {
      const res = await downloadBillPDF(billId);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `CarAdda-${billNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded!');
    } catch {
      toast.error('Failed to generate PDF');
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleWhatsApp = async () => {
    setIsWaLoading(true);
    try {
      const res = await sendWhatsApp(billId);
      const waUrl = res.data?.whatsapp_url;
      if (waUrl) {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        toast.success('WhatsApp opened!');
      }
    } catch {
      toast.error('Failed to generate WhatsApp link');
    } finally {
      setIsWaLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* Print */}
      <button
        onClick={handlePrint}
        className="
          flex items-center gap-2 px-5 py-2.5 rounded-xl
          bg-navy-700 border border-navy-600 text-white font-medium text-sm
          hover:bg-navy-600 hover:border-navy-500 active:scale-95
          transition-all duration-150 print:hidden
        "
      >
        <Printer className="w-4 h-4" />
        Print
      </button>

      {/* Download PDF */}
      <button
        onClick={handleDownloadPDF}
        disabled={isPdfLoading}
        className="
          flex items-center gap-2 px-5 py-2.5 rounded-xl
          bg-navy-700 border border-navy-600 text-white font-medium text-sm
          hover:bg-navy-600 active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-150
        "
      >
        {isPdfLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {isPdfLoading ? 'Generating…' : 'Download PDF'}
      </button>

      {/* WhatsApp */}
      <button
        onClick={handleWhatsApp}
        disabled={isWaLoading}
        className="
          flex items-center gap-2 px-5 py-2.5 rounded-xl
          bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-medium text-sm
          hover:bg-[#25D366]/20 hover:border-[#25D366]/50 active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-150
        "
      >
        {isWaLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <MessageCircle className="w-4 h-4" />
        )}
        {isWaLoading ? 'Opening…' : 'WhatsApp'}
      </button>
    </div>
  );
}
