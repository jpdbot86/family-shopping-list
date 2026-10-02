import React, { useState } from 'react';
import { Cloud, ArrowRight, X } from 'lucide-react';

interface ConnectionBannerProps {
  onOpenSettings: () => void;
}

export const ConnectionBanner: React.FC<ConnectionBannerProps> = ({ onOpenSettings }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/20 text-xs">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Cloud className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
            Τοπική Λειτουργία (Demo)
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            Συνδέστε το δωρεάν Supabase για πραγματικό live συγχρονισμό μεταξύ συσκευών.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onOpenSettings}
          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] flex items-center gap-1 shadow-xs transition-colors"
        >
          <span>Σύνδεση</span>
          <ArrowRight className="w-3 h-3" />
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
          title="Απόκρυψη"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
