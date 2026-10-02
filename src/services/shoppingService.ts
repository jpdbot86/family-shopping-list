import type { RealtimeChannel } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type { ShoppingItem } from '../types';
import { storageService, LOCAL_EVENT_NAME } from './storageService';

export const shoppingService = {
  async getItems(listId: string = 'family-main'): Promise<{ items: ShoppingItem[]; isRemote: boolean }> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('shopping_items')
          .select('*')
          .eq('list_id', listId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return { items: data as ShoppingItem[], isRemote: true };
        }
        console.warn('Supabase fetch failed, falling back to local storage:', error?.message);
      } catch (err) {
        console.warn('Supabase fetch error, using local fallback:', err);
      }
    }

    return {
      items: storageService.getLocalItems(listId),
      isRemote: false
    };
  },

  async addItem(item: Omit<ShoppingItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShoppingItem> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('shopping_items')
          .insert([
            {
              name: item.name.trim(),
              category: item.category,
              quantity: item.quantity.trim() || '1',
              unit: item.unit?.trim() || '',
              notes: item.notes?.trim() || '',
              is_purchased: item.is_purchased,
              purchased_by: item.purchased_by || null,
              list_id: item.list_id || 'family-main'
            }
          ])
          .select()
          .single();

        if (!error && data) {
          return data as ShoppingItem;
        }
        console.error('Supabase addItem error:', error);
      } catch (err) {
        console.error('Supabase addItem exception:', err);
      }
    }

    return storageService.addItem(item);
  },

  async updateItem(id: string, updates: Partial<ShoppingItem>): Promise<ShoppingItem | null> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const payload: Record<string, unknown> = {};
        if (updates.name !== undefined) payload.name = updates.name.trim();
        if (updates.category !== undefined) payload.category = updates.category;
        if (updates.quantity !== undefined) payload.quantity = updates.quantity.trim();
        if (updates.unit !== undefined) payload.unit = updates.unit.trim();
        if (updates.notes !== undefined) payload.notes = updates.notes.trim();
        if (updates.is_purchased !== undefined) {
          payload.is_purchased = updates.is_purchased;
          payload.purchased_by = updates.purchased_by !== undefined ? updates.purchased_by : null;
        }

        const { data, error } = await supabase
          .from('shopping_items')
          .update(payload)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          return data as ShoppingItem;
        }
        console.error('Supabase updateItem error:', error);
      } catch (err) {
        console.error('Supabase updateItem exception:', err);
      }
    }

    return storageService.updateItem(id, updates);
  },

  async togglePurchased(
    id: string,
    isPurchased: boolean,
    purchasedBy: string | null
  ): Promise<ShoppingItem | null> {
    return this.updateItem(id, {
      is_purchased: isPurchased,
      purchased_by: isPurchased ? (purchasedBy || 'Family Member') : null
    });
  },

  async deleteItem(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('shopping_items')
          .delete()
          .eq('id', id);

        if (!error) return true;
        console.error('Supabase deleteItem error:', error);
      } catch (err) {
        console.error('Supabase deleteItem exception:', err);
      }
    }

    return storageService.deleteItem(id);
  },

  async clearPurchased(listId: string = 'family-main'): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('shopping_items')
          .delete()
          .eq('list_id', listId)
          .eq('is_purchased', true);

        if (!error) return true;
        console.error('Supabase clearPurchased error:', error);
      } catch (err) {
        console.error('Supabase clearPurchased exception:', err);
      }
    }

    storageService.clearPurchased(listId);
    return true;
  },

  subscribeToChanges(
    listId: string,
    callbacks: {
      onInsert: (item: ShoppingItem) => void;
      onUpdate: (item: ShoppingItem) => void;
      onDelete: (id: string) => void;
      onReload: () => void;
      onStatusChange: (status: 'connected' | 'connecting' | 'disconnected' | 'local_demo') => void;
    }
  ): () => void {
    const supabase = getSupabaseClient();

    if (!supabase || !isSupabaseConfigured()) {
      callbacks.onStatusChange('local_demo');

      const handleLocalEvent = () => {
        callbacks.onReload();
      };

      const handleStorageEvent = (e: StorageEvent) => {
        if (e.key === 'family_shopping_local_items_v1') {
          callbacks.onReload();
        }
      };

      window.addEventListener(LOCAL_EVENT_NAME, handleLocalEvent);
      window.addEventListener('storage', handleStorageEvent);

      return () => {
        window.removeEventListener(LOCAL_EVENT_NAME, handleLocalEvent);
        window.removeEventListener('storage', handleStorageEvent);
      };
    }

    callbacks.onStatusChange('connecting');

    const channelName = `realtime-list-${listId}-${Math.random().toString(36).substring(2, 6)}`;
    let channel: RealtimeChannel | null = supabase.channel(channelName);

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'shopping_items',
          filter: `list_id=eq.${listId}`
        },
        (payload) => {
          if (payload.new) {
            callbacks.onInsert(payload.new as ShoppingItem);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'shopping_items',
          filter: `list_id=eq.${listId}`
        },
        (payload) => {
          if (payload.new) {
            callbacks.onUpdate(payload.new as ShoppingItem);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'shopping_items',
          filter: `list_id=eq.${listId}`
        },
        (payload) => {
          if (payload.old && payload.old.id) {
            callbacks.onDelete(payload.old.id);
          } else {
            callbacks.onReload();
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          callbacks.onStatusChange('connected');
        } else if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') {
          callbacks.onStatusChange('disconnected');
        } else if (status === 'CLOSED') {
          callbacks.onStatusChange('connecting');
        }
      });

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
        channel = null;
      }
    };
  }
};
