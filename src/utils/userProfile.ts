import type { UserProfile } from '../types';

const USER_PROFILE_KEY = 'family_shopping_user_profile';

export const AVATAR_COLORS = [
  'bg-emerald-500 text-white',
  'bg-blue-500 text-white',
  'bg-violet-500 text-white',
  'bg-rose-500 text-white',
  'bg-amber-500 text-white',
  'bg-teal-500 text-white',
  'bg-indigo-500 text-white',
  'bg-pink-500 text-white'
];

export const PRESET_NAMES = ['Μαμά', 'Μπαμπάς', 'Γιάννης', 'Μαρία', 'Νίκος', 'Ελένη', 'Κώστας', 'Άννα'];

const DEFAULT_PROFILE: UserProfile = {
  name: 'Μαμά',
  avatarColor: AVATAR_COLORS[0],
  soundEnabled: true
};

export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  const raw = localStorage.getItem(USER_PROFILE_KEY);
  if (!raw) {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  }
  try {
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: Partial<UserProfile>): UserProfile {
  const current = getUserProfile();
  const updated = { ...current, ...profile };
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
  return updated;
}
