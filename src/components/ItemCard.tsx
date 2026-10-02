import React from 'react';
import {
  Check,
  Edit2,
  Trash2,
  Apple,
  Milk,
  Croissant,
  Beef,
  Package,
  Coffee,
  Cookie,
  Home,
  Sparkles,
  Tag,
  UserCheck
} from 'lucide-react';
import type { ShoppingItem } from '../types';
import { CATEGORY_MAP } from '../constants/categories';


interface ItemCardProps {
  item: ShoppingItem;
  onToggle: (id: string, isPurchased: boolean) => void;
  onEdit: (item: ShoppingItem) => void;
  onDelete: (id: string) => void;
}

const CategoryIconMap: Record<string, React.FC<{ className?: string }>> = {
  Apple,
  Milk,
  Croissant,
  Beef,
  Package,
  Coffee,
  Cookie,
  Home,
  Sparkles,
  Tag
};

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onToggle,
  onEdit,
  onDelete
}) => {
  const categoryDef = CATEGORY_MAP[item.category] || CATEGORY_MAP['Other'];
  const IconComponent = CategoryIconMap[categoryDef.iconName] || Tag;

  return (
    <div
      className={`group relative flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
        item.is_purchased
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-75'
          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800'
      }`}
    >
      {/* Checkbox Touch Target */}
      <button
        type="button"
        onClick={() => onToggle(item.id, item.is_purchased)}
        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
          item.is_purchased
            ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30 ring-2 ring-emerald-500/20'
            : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500 bg-white dark:bg-slate-800'
        }`}
        aria-label={item.is_purchased ? 'Σημείωση ως εκκρεμές' : 'Σημείωση ως αγορασμένο'}
      >
        {item.is_purchased && <Check className="w-4 h-4 stroke-[3]" />}
      </button>

      {/* Main content body */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onToggle(item.id, item.is_purchased)}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`font-semibold text-base leading-snug transition-all ${
              item.is_purchased
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-800 dark:text-slate-100'
            }`}
          >
            {item.name}
          </span>

          {/* Quantity Badge */}
          {item.quantity && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                item.is_purchased
                  ? 'bg-slate-200/70 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800'
              }`}
            >
              {item.quantity}
            </span>
          )}
        </div>

        {/* Notes and Category Row */}
        <div className="flex items-center gap-2 mt-1 flex-wrap text-xs">
          {/* Category Chip */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium ${categoryDef.bgLight} ${categoryDef.color} ${categoryDef.borderLight}`}
          >
            <IconComponent className="w-3 h-3" />
            <span>{categoryDef.nameEl}</span>
          </span>

          {/* Notes display */}
          {item.notes && (
            <span className="text-slate-500 dark:text-slate-400 text-[11px] italic truncate max-w-[200px]">
              "{item.notes}"
            </span>
          )}

          {/* Purchased By Tag (Realtime Family Member) */}
          {item.is_purchased && item.purchased_by && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
              <UserCheck className="w-3 h-3" />
              <span>Αγοράστηκε από {item.purchased_by}</span>
            </span>
          )}
        </div>
      </div>

      {/* Action buttons (Edit & Delete) */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Επεξεργασία"
          aria-label="Επεξεργασία"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          title="Διαγραφή"
          aria-label="Διαγραφή"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
