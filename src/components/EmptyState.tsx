import React from 'react';
import { ShoppingCart, CheckCircle2, SearchX } from 'lucide-react';
import type { FilterStatus } from '../types';


interface EmptyStateProps {
  filterStatus: FilterStatus;
  hasItemsAtAll: boolean;
  searchQuery: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  filterStatus,
  hasItemsAtAll,
  searchQuery
}) => {
  if (searchQuery) {
    return (
      <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
          Δεν βρέθηκαν αποτελέσματα
        </h3>
        <p className="text-xs text-slate-500">
          Δεν υπάρχει προϊόν που να ταιριάζει με "{searchQuery}"
        </p>
      </div>
    );
  }

  if (filterStatus === 'pending' && hasItemsAtAll) {
    return (
      <div className="text-center py-12 px-4 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 mx-auto flex items-center justify-center mb-3 shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200 mb-1">
          Όλα τα ψώνια ολοκληρώθηκαν! 🎉
        </h3>
        <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80 max-w-xs mx-auto">
          Δεν υπάρχουν εκκρεμή είδη. Προσθέστε νέα είδη παραπάνω ή δείτε τα αγορασμένα στη σχετική καρτέλα.
        </p>
      </div>
    );
  }

  if (filterStatus === 'purchased' && hasItemsAtAll) {
    return (
      <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <ShoppingCart className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
          Κανένα αγορασμένο είδος ακόμα
        </h3>
        <p className="text-xs text-slate-500">
          Τσεκάρετε τα προϊόντα που τοποθετείτε στο καλάθι σας για να φαίνονται εδώ.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-14 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 mx-auto flex items-center justify-center mb-3">
        <ShoppingCart className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
        Η λίστα είναι άδεια
      </h3>
      <p className="text-xs text-slate-500 max-w-xs mx-auto">
        Προσθέστε προϊόντα χρησιμοποιώντας το παραπάνω πεδίο ή επιλέξτε από τις γρήγορες προτάσεις!
      </p>
    </div>
  );
};
