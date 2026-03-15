import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, History } from 'lucide-react';
import StockLevelBadge from './StockLevelBadge';
import AddStockModal from './AddStockModal';
import type { InventoryItem } from '../../state/inventoryStore';
import { useInventoryStore } from '../../state/inventoryStore';

interface InventoryTableProps {
  items: InventoryItem[];
}

const CATEGORY_COLORS: Record<string, string> = {
  chemical: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  cloth: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  accessory: 'bg-gold/10 text-gold border-gold/20',
  equipment: 'bg-success/10 text-success border-success/20',
  other: 'bg-navy-600 text-muted border-navy-500',
};

export default function InventoryTable({ items }: InventoryTableProps) {
  const navigate = useNavigate();
  const { addStock } = useInventoryStore();
  const [modalItem, setModalItem] = useState<InventoryItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <p className="text-muted text-sm">No inventory items match your filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto rounded-2xl border border-navy-700">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-navy-700">
              {['Item', 'Category', 'Stock Level', 'Threshold', 'Last Updated', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const catClass = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.other;
              const lastUpdated = item.last_updated
                ? new Date(item.last_updated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : '—';

              return (
                <tr
                  key={item.id}
                  className="border-t border-navy-700 hover:bg-navy-700/40 transition-colors duration-100"
                >
                  {/* Name */}
                  <td className="px-4 py-3">
                    <span className="font-medium text-white">{item.item_name}</span>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-lg border text-xs font-medium capitalize ${catClass}`}>
                      {item.category}
                    </span>
                  </td>

                  {/* Stock level badge */}
                  <td className="px-4 py-3">
                    <StockLevelBadge
                      status={item.stock_status}
                      quantity={item.quantity}
                      unit={item.unit}
                      size="sm"
                    />
                  </td>

                  {/* Threshold */}
                  <td className="px-4 py-3 text-muted text-xs">
                    {item.low_stock_threshold} {item.unit}
                  </td>

                  {/* Last updated */}
                  <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">
                    {lastUpdated}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModalItem(item)}
                        title="Add Stock"
                        className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => navigate(`/inventory/${item.id}/edit`)}
                        title="Edit"
                        className="p-1.5 rounded-lg bg-navy-700 text-muted hover:text-white hover:bg-navy-600 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => navigate(`/inventory/${item.id}`)}
                        title="View History"
                        className="p-1.5 rounded-lg bg-navy-700 text-muted hover:text-white hover:bg-navy-600 transition-colors"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Stock Modal */}
      {modalItem && (
        <AddStockModal
          item={modalItem}
          onConfirm={async (qty) => {
            await addStock(modalItem.id, qty);
            setModalItem(null);
          }}
          onClose={() => setModalItem(null)}
        />
      )}
    </>
  );
}
