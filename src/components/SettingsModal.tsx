import React, { useState } from 'react';
import { X, Cloud, Key, Link2, CheckCircle2, AlertCircle, Database, RefreshCw, FileText } from 'lucide-react';
import { getStoredConfig, saveStoredConfig, isSupabaseConfigured, getSupabaseClient } from '../lib/supabase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged
}) => {
  const currentConfig = getStoredConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [listId, setListId] = useState(currentConfig.listId);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!url.trim() || !anonKey.trim()) {
      setTestStatus('error');
      setTestMessage('Συμπληρώστε το Project URL και το Anon API Key.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Δοκιμή σύνδεσης με το Supabase...');

    // Temporarily save to test client
    saveStoredConfig({ url: url.trim(), anonKey: anonKey.trim(), listId: listId.trim() });
    const client = getSupabaseClient();

    if (!client) {
      setTestStatus('error');
      setTestMessage('Μη έγκυρο URL ή API Key.');
      return;
    }

    try {
      const { error } = await client
        .from('shopping_items')
        .select('id')
        .limit(1);

      if (error) {
        setTestStatus('error');
        setTestMessage(`Σφάλμα Supabase: ${error.message}. Βεβαιωθείτε ότι εκτελέσατε το supabase_schema.sql!`);
      } else {
        setTestStatus('success');
        setTestMessage('Επιτυχής σύνδεση! Ο πίνακας shopping_items αποκρίνεται κανονικά.');
      }
    } catch (err: unknown) {
      setTestStatus('error');
      setTestMessage(`Σφάλμα δικτύου: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredConfig({
      url: url.trim(),
      anonKey: anonKey.trim(),
      listId: listId.trim() || 'family-main'
    });
    onConfigChanged();
    onClose();
  };

  const handleClear = () => {
    localStorage.removeItem('family_shopping_supabase_url');
    localStorage.removeItem('family_shopping_supabase_key');
    setUrl('');
    setAnonKey('');
    setTestStatus('idle');
    setTestMessage('');
    saveStoredConfig({ url: '', anonKey: '' });
    onConfigChanged();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Ρυθμίσεις Συγχρονισμού & Cloud
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Info Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
            <p className="font-semibold mb-1 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-600" />
              Συγχρονισμός σε πραγματικό χρόνο (Supabase Free Tier)
            </p>
            Συνδέστε το δικό σας Supabase project για να βλέπουν όλα τα μέλη της οικογένειας τις προσθήκες και τα τσεκαρίσματα live σε οποιοδήποτε κινητό (Android & iOS).
          </div>

          {/* Project URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5" />
              <span>Supabase Project URL</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Anon Public Key */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Key className="w-3.5 h-3.5" />
              <span>Anon Public Key</span>
            </label>
            <textarea
              rows={2}
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* List ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Αναγνωριστικό Λίστας (List ID)
            </label>
            <input
              type="text"
              value={listId}
              onChange={(e) => setListId(e.target.value)}
              placeholder="family-main"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Χρησιμοποιήστε το ίδιο List ID σε όλα τα κινητά της οικογένειας.
            </span>
          </div>

          {/* Test Status feedback */}
          {testStatus !== 'idle' && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                testStatus === 'success'
                  ? 'bg-emerald-100/70 text-emerald-800 border border-emerald-300'
                  : testStatus === 'error'
                  ? 'bg-rose-100/70 text-rose-800 border border-rose-300'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {testStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              {testStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
              {testStatus === 'testing' && <RefreshCw className="w-4 h-4 text-slate-600 animate-spin shrink-0 mt-0.5" />}
              <span className="break-words">{testMessage}</span>
            </div>
          )}

          {/* Action row */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
              <span>Δοκιμή Σύνδεσης</span>
            </button>

            {isSupabaseConfigured() && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ml-auto"
              >
                Επαναφορά σε Τοπική
              </button>
            )}
          </div>

          {/* Database Setup Helper */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1.5">
            <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Οδηγίες SQL:</span>
            </p>
            <p>
              Εκτελέστε το αρχείο <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-700 dark:text-emerald-400 font-mono">supabase_schema.sql</code> στο SQL Editor του Supabase για να δημιουργηθούν οι πίνακες, τα RLS policies και το Realtime publication.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Κλείσιμο
          </button>
          <button
            onClick={handleSave}
            type="button"
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition-all cursor-pointer"
          >
            Αποθήκευση & Σύνδεση
          </button>
        </div>
      </div>
    </div>
  );
};
