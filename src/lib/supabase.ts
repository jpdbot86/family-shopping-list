import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { SupabaseConfig } from '../types';

const STORAGE_KEY_URL = 'family_shopping_supabase_url';
const STORAGE_KEY_KEY = 'family_shopping_supabase_key';
const STORAGE_KEY_LIST_ID = 'family_shopping_list_id';

export function normalizeUrl(rawUrl: string): string {
  let url = rawUrl.trim();
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url.replace(/\/+$/, '');
}

export function getStoredConfig(): SupabaseConfig {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const envListId = import.meta.env.VITE_DEFAULT_LIST_ID || 'family-main';

  const localUrl = localStorage.getItem(STORAGE_KEY_URL) || '';
  const localKey = localStorage.getItem(STORAGE_KEY_KEY) || '';
  const localListId = localStorage.getItem(STORAGE_KEY_LIST_ID) || '';

  const finalUrl = normalizeUrl(localUrl || envUrl);

  return {
    url: finalUrl,
    anonKey: (localKey || envKey).trim(),
    listId: (localListId || envListId || 'family-main').trim()
  };
}

export function saveStoredConfig(config: Partial<SupabaseConfig>) {
  if (config.url !== undefined) {
    const clean = normalizeUrl(config.url);
    if (clean) localStorage.setItem(STORAGE_KEY_URL, clean);
    else localStorage.removeItem(STORAGE_KEY_URL);
  }
  if (config.anonKey !== undefined) {
    const cleanKey = config.anonKey.trim();
    if (cleanKey) localStorage.setItem(STORAGE_KEY_KEY, cleanKey);
    else localStorage.removeItem(STORAGE_KEY_KEY);
  }
  if (config.listId !== undefined) {
    const cleanList = config.listId.trim();
    if (cleanList) localStorage.setItem(STORAGE_KEY_LIST_ID, cleanList);
    else localStorage.removeItem(STORAGE_KEY_LIST_ID);
  }
  cachedClient = null; // reset cached client
}

export function isSupabaseConfigured(): boolean {
  const cfg = getStoredConfig();
  return Boolean(
    cfg.url &&
    cfg.url.startsWith('http') &&
    !cfg.url.includes('your-project-id') &&
    cfg.anonKey &&
    cfg.anonKey.length > 20 &&
    !cfg.anonKey.includes('your-anon-key')
  );
}


let cachedClient: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const cfg = getStoredConfig();
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (cachedClient && lastUrl === cfg.url && lastKey === cfg.anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(cfg.url, cfg.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    lastUrl = cfg.url;
    lastKey = cfg.anonKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}
