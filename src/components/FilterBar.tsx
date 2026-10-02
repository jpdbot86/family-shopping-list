import React from 'react';
import { Search, X, Trash2 } from 'lucide-react';
import type { FilterStatus, ItemCategory } from '../types';
import { CATEGORIES } from '../constants/categories';


interface FilterBarProps {
  filterStatus: FilterStatus;
  onFilterStatusChange: (status: FilterStatus) => void;
  selectedCategory: ItemCategory | 'All';
  onSelectCategory: (cat: ItemCategory | 'All') => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  counts: {
    total: number;
    pending: number;
    purchased: number;
  };
  onClearPurchased: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterStatus,
  onFilterStatusChange,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchQueryChange,
  counts,
  onClearPurchased
}) => {
  return (
    <div className="space-y-3">
      {/* Search and Tabs Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Status segmented control tabs */}
        <div className="flex bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => onFilterStatusChange('all')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>Όλα</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800">
              {counts.total}
            </span>
          </button>

          <button
            onClick={() => onFilterStatusChange('pending')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'pending'
                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
            }`}
          >
            <span>Εκκρεμή</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {counts.pending}
            </span>
          </button>

          <button
            onClick={() => onFilterStatusChange('purchased')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'purchased'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>Αγορασμένα</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800">
              {counts.purchased}
            </span>
          </button>
        </div>

        {/* Clear Purchased button */}
        {counts.purchased > 0 && (
          <button
            onClick={onClearPurchased}
            className="self-end sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 transition-colors"
            title="Καθαρισμός όλων των αγορασμένων ειδών"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Εκκαθάριση Αγορασμένων ({counts.purchased})</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Αναζήτηση προϊόντος ή σημείωσης..."
          className="w-full text-xs sm:text-sm pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchQueryChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Pills (Horizontal scrollable on mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
        <button
          onClick={() => onSelectCategory('All')}
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            selectedCategory === 'All'
              ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          Όλες οι Κατηγορίες
        </button>

        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? 'All' : cat.id)}
              className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <span>{cat.nameEl}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
