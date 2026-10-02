import React from 'react';
import { ShoppingBag, Settings, Share2, WifiOff, Cloud } from 'lucide-react';
import type { ConnectionStatus, UserProfile } from '../types';

interface HeaderProps {
  connectionStatus: ConnectionStatus;
  userProfile: UserProfile;
  pendingCount: number;
  onOpenUserModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenShareModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  connectionStatus,
  userProfile,
  pendingCount,
  onOpenUserModal,
  onOpenSettingsModal,
  onOpenShareModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 pt-safe">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Logo and Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight flex items-center gap-1.5 truncate">
              <span>Family List</span>
              {pendingCount > 0 && (
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                  {pendingCount}
                </span>
              )}
            </h1>
            
            {/* Realtime Status Indicator */}
            <div className="flex items-center gap-1.5 text-xs">
              {connectionStatus === 'connected' && (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              )}
              {connectionStatus === 'connecting' && (
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Σύνδεση...
                </span>
              )}
              {connectionStatus === 'disconnected' && (
                <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                  <WifiOff className="w-3 h-3" />
                  Εκτός σύνδεσης
                </span>
              )}
              {connectionStatus === 'local_demo' && (
                <button
                  onClick={onOpenSettingsModal}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-600 font-medium transition-colors cursor-pointer"
                  title="Κάντε κλικ για σύνδεση στο Supabase"
                >
                  <Cloud className="w-3 h-3" />
                  Τοπική λειτουργία
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* User profile button */}
          <button
            onClick={onOpenUserModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
            title="Αλλαγή ονόματος χρήστη"
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${userProfile.avatarColor}`}>
              {userProfile.name.slice(0, 1).toUpperCase()}
            </span>
            <span className="max-w-[70px] truncate hidden sm:inline">{userProfile.name}</span>
          </button>

          {/* Share list button */}
          <button
            onClick={onOpenShareModal}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Κοινοποίηση λίστας"
            aria-label="Κοινοποίηση"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettingsModal}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Ρυθμίσεις & Supabase"
            aria-label="Ρυθμίσεις"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
