import { useState, useRef } from 'react';
import { Plus, ChevronDown, Sparkles } from 'lucide-react';
import type { ItemCategory } from '../types';
import { CATEGORIES, COMMON_SUGGESTIONS } from '../constants/categories';



interface QuickAddItemProps {
  onAdd: (data: {
    name: string;
    category: ItemCategory;
    quantity: string;
    unit?: string;
    notes?: string;
  }) => Promise<unknown>;
}

export const QuickAddItem: React.FC<QuickAddItemProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Produce');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        name: name.trim(),
        category,
        quantity: quantity.trim() || '1',
        notes: notes.trim()
      });
      setName('');
      setNotes('');
      setShowNotes(false);
      // Keep selected category or reset if preferred
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestionClick = async (s: typeof COMMON_SUGGESTIONS[0]) => {
    try {
      await onAdd({
        name: s.name,
        category: s.category,
        quantity: s.defaultQty
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-3.5 transition-all">
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="flex items-center gap-2">
          {/* Main item name input */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Προσθήκη προϊόντος (π.χ. Γάλα, Ψωμί)..."
              className="w-full text-sm sm:text-base px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Quick Submit Button */}
          <button
            type="submit"
            disabled={!name.trim() || isSubmitting}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-medium text-sm flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Προσθήκη</span>
          </button>
        </div>

        {/* Secondary options row: Category, Quantity, Notes toggle */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {/* Category Selector */}
          <div className="relative flex-1 min-w-[140px]">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ItemCategory)}
              className="w-full appearance-none px-3 py-1.5 pr-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameEl}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-0.5">
            <span className="text-slate-400 font-medium">Ποσότητα:</span>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="1"
              className="w-16 bg-transparent text-center font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>

          {/* Toggle Notes */}
          <button
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            className={`px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
              showNotes || notes
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            {notes ? '✓ Σημείωση' : '+ Σημείωση'}
          </button>

          {/* Quick Suggestions Toggle */}
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors ml-auto font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Προτάσεις</span>
          </button>
        </div>

        {/* Expandable Notes input */}
        {showNotes && (
          <div className="pt-1">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Σημείωση (π.χ. Μάρκα, συγκεκριμένο είδος, έκπτωση)..."
              className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        )}
      </form>

      {/* Quick suggestions tray */}
      {showSuggestions && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Γρήγορη Προσθήκη με 1 πάτημα:
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(item)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-300 text-slate-700 dark:text-slate-300 text-xs transition-colors border border-transparent hover:border-emerald-300"
              >
                <span>+</span>
                <span>{item.name}</span>
                <span className="text-[10px] text-slate-400 font-normal">({item.defaultQty})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
