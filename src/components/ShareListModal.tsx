import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle } from 'lucide-react';
import type { ShoppingItem } from '../types';

import { CATEGORY_MAP } from '../constants/categories';
import { getProductEmoji } from '../utils/productEmoji';

interface ShareListModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingItem[];
}

export const ShareListModal: React.FC<ShareListModalProps> = ({
  isOpen,
  onClose,
  items
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const pendingItems = items.filter((i) => !i.is_purchased);

  // Group pending items by category
  const grouped: Record<string, ShoppingItem[]> = {};
  pendingItems.forEach((item) => {
    const catName = CATEGORY_MAP[item.category]?.nameEl || 'Διάφορα';
    if (!grouped[catName]) grouped[catName] = [];
    grouped[catName].push(item);
  });

  let shareText = `🛒 *Οικογενειακή Λίστα Αγορών* (${pendingItems.length} είδη):\n\n`;
  if (pendingItems.length === 0) {
    shareText += 'Όλα τα είδη έχουν ήδη αγοραστεί! 🎉';
  } else {
    for (const [catName, catItems] of Object.entries(grouped)) {
      shareText += `📌 *${catName}*:\n`;
      catItems.forEach((it) => {
        const itemEmoji = getProductEmoji(it.name, it.category);
        shareText += `• ${itemEmoji} ${it.name}`;
        if (it.quantity) shareText += ` (${it.quantity})`;
        if (it.notes) shareText += ` - _${it.notes}_`;
        shareText += '\n';
      });
      shareText += '\n';
    }
  }


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Οικογενειακή Λίστα Αγορών',
          text: shareText
        });
      } catch (err) {
        console.debug('Share dismissed', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Κοινοποίηση Λίστας
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500">
            Αντιγράψτε τη λίστα των εκκρεμών ειδών ταξινομημένη ανά διάδρομο/κατηγορία για αποστολή σε Viber, WhatsApp, ή SMS:
          </p>

          <textarea
            readOnly
            rows={8}
            value={shareText}
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none select-all"
          />

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">Αντιγράφηκε!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Αντιγραφή Κειμένου</span>
                </>
              )}
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Αποστολή (Share)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
