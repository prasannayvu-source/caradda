import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickBillButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/billing/new')}
      title="Create New Bill"
      id="quick-bill-fab"
      className="
        fixed bottom-6 right-6 z-40
        flex items-center gap-2 px-5 py-3.5
        bg-red text-white font-bold text-sm rounded-2xl
        shadow-lg shadow-red/30
        hover:bg-red-600 hover:shadow-red/50 hover:scale-105
        active:scale-95
        transition-all duration-200
        md:bottom-8 md:right-8
      "
    >
      <Plus className="w-5 h-5" />
      <span>New Bill</span>
    </button>
  );
}
