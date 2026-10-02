import React, { useState } from 'react';
import { X, User, Check, Volume2, VolumeX } from 'lucide-react';
import type { UserProfile } from '../types';

import { AVATAR_COLORS, PRESET_NAMES, saveUserProfile } from '../utils/userProfile';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile
}) => {
  const [name, setName] = useState(userProfile.name);
  const [avatarColor, setAvatarColor] = useState(userProfile.avatarColor);
  const [soundEnabled, setSoundEnabled] = useState(userProfile.soundEnabled);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated = saveUserProfile({
      name: name.trim(),
      avatarColor,
      soundEnabled
    });
    onUpdateProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Ποιος Ψωνίζει;
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center justify-center gap-2 pb-1">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-md ${avatarColor}`}
            >
              {(name.trim() || '?').slice(0, 1).toUpperCase()}
            </div>
            <p className="text-xs text-slate-500">
              Το όνομά σας θα φαίνεται στα αντικείμενα που αγοράζετε
            </p>
          </div>

          {/* Name input */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Όνομα Χρήστη
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="π.χ. Μαρία, Γιάννης, Μπαμπάς..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Quick Name Presets */}
          <div>
            <span className="block text-xs text-slate-400 mb-1.5">
              Γρήγορη επιλογή:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_NAMES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setName(preset)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    name === preset
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent hover:border-slate-300'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Avatar Color Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Χρώμα Avatar
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {AVATAR_COLORS.map((col, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarColor(col)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${col} ${
                    avatarColor === col ? 'scale-125 ring-2 ring-offset-2 ring-emerald-500' : 'hover:scale-110'
                  }`}
                >
                  {avatarColor === col && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
              <span>Ήχοι επιβεβαίωσης</span>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                soundEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Ακύρωση
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition-all cursor-pointer"
            >
              Αποθήκευση
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
