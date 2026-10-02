import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { ShoppingItem, FilterStatus, ItemCategory, ConnectionStatus, UserProfile } from '../types';
import { shoppingService } from '../services/shoppingService';
import { playCheckSound, playUncheckSound, playAddSound } from '../utils/sound';
import { getUserProfile } from '../utils/userProfile';
import { getStoredConfig } from '../lib/supabase';

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfileState] = useState<UserProfile>(getUserProfile());
  const [listId, setListId] = useState<string>(getStoredConfig().listId);

  const prevPendingCountRef = useRef<number | null>(null);

  // Load items
  const reloadItems = useCallback(async () => {
    try {
      const res = await shoppingService.getItems(listId);
      setItems(res.items);
    } catch (err) {
      console.error('Error reloading items:', err);
    } finally {
      setLoading(false);
    }
  }, [listId]);

  const [configVersion, setConfigVersion] = useState(0);

  const reconnect = useCallback(() => {
    setConfigVersion((v) => v + 1);
  }, []);

  // Realtime subscription setup
  useEffect(() => {
    setLoading(true);
    reloadItems();

    const unsubscribe = shoppingService.subscribeToChanges(listId, {
      onInsert: (newItem) => {
        setItems((prev) => {
          if (prev.some((i) => i.id === newItem.id)) return prev;
          return [newItem, ...prev];
        });
      },
      onUpdate: (updatedItem) => {
        setItems((prev) =>
          prev.map((i) => (i.id === updatedItem.id ? updatedItem : i))
        );
      },
      onDelete: (deletedId) => {
        setItems((prev) => prev.filter((i) => i.id !== deletedId));
      },
      onReload: () => {
        reloadItems();
      },
      onStatusChange: (status) => {
        setConnectionStatus(status);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [listId, reloadItems, configVersion]);


  // Check for 100% completion celebration
  useEffect(() => {
    const pendingCount = items.filter((i) => !i.is_purchased).length;
    if (
      prevPendingCountRef.current !== null &&
      prevPendingCountRef.current > 0 &&
      pendingCount === 0 &&
      items.length > 0
    ) {
      // Confetti celebration
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899']
        });
      } catch (e) {
        console.debug('Confetti error', e);
      }
    }
    prevPendingCountRef.current = pendingCount;
  }, [items]);

  // Add Item
  const addItem = useCallback(
    async (itemData: {
      name: string;
      category: ItemCategory;
      quantity: string;
      unit?: string;
      notes?: string;
    }) => {
      if (userProfile.soundEnabled) {
        playAddSound();
      }

      // Optimistic temporary item
      const tempId = 'temp-' + Date.now();
      const optimisticItem: ShoppingItem = {
        id: tempId,
        name: itemData.name,
        category: itemData.category,
        quantity: itemData.quantity || '1',
        unit: itemData.unit || '',
        notes: itemData.notes || '',
        is_purchased: false,
        purchased_by: null,
        list_id: listId,
        created_at: new Date().toISOString()
      };

      setItems((prev) => [optimisticItem, ...prev]);

      try {
        const saved = await shoppingService.addItem({
          ...itemData,
          is_purchased: false,
          purchased_by: null,
          list_id: listId
        });
        setItems((prev) =>
          prev.map((i) => (i.id === tempId ? saved : i))
        );
        return saved;
      } catch (err) {
        console.error('Failed to add item:', err);
        setItems((prev) => prev.filter((i) => i.id !== tempId));
        throw err;
      }
    },
    [listId, userProfile.soundEnabled]
  );

  // Toggle purchased status
  const togglePurchased = useCallback(
    async (id: string, currentlyPurchased: boolean) => {
      const nextPurchased = !currentlyPurchased;
      const buyerName = nextPurchased ? userProfile.name : null;

      if (userProfile.soundEnabled) {
        if (nextPurchased) playCheckSound();
        else playUncheckSound();
      }

      // Optimistic update
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, is_purchased: nextPurchased, purchased_by: buyerName }
            : i
        )
      );

      try {
        await shoppingService.togglePurchased(id, nextPurchased, buyerName);
      } catch (err) {
        console.error('Failed to toggle item:', err);
        // Rollback
        setItems((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  is_purchased: currentlyPurchased,
                  purchased_by: currentlyPurchased ? i.purchased_by : null
                }
              : i
          )
        );
      }
    },
    [userProfile.name, userProfile.soundEnabled]
  );

  // Update item details
  const updateItem = useCallback(
    async (id: string, updates: Partial<ShoppingItem>) => {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
      );
      try {
        await shoppingService.updateItem(id, updates);
      } catch (err) {
        console.error('Failed to update item:', err);
        reloadItems();
      }
    },
    [reloadItems]
  );

  // Delete single item
  const deleteItem = useCallback(async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await shoppingService.deleteItem(id);
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  }, []);

  // Clear all purchased items
  const clearPurchased = useCallback(async () => {
    setItems((prev) => prev.filter((i) => !i.is_purchased));
    try {
      await shoppingService.clearPurchased(listId);
    } catch (err) {
      console.error('Failed to clear purchased items:', err);
      reloadItems();
    }
  }, [listId, reloadItems]);

  // Filtered and computed items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Status filter
      if (filterStatus === 'pending' && item.is_purchased) return false;
      if (filterStatus === 'purchased' && !item.is_purchased) return false;

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesNotes = item.notes?.toLowerCase().includes(q) || false;
        const matchesBuyer = item.purchased_by?.toLowerCase().includes(q) || false;
        if (!matchesName && !matchesNotes && !matchesBuyer) return false;
      }

      return true;
    });
  }, [items, filterStatus, selectedCategory, searchQuery]);

  const counts = useMemo(() => {
    const total = items.length;
    const purchased = items.filter((i) => i.is_purchased).length;
    const pending = total - purchased;
    return { total, pending, purchased };
  }, [items]);

  return {
    items,
    filteredItems,
    counts,
    loading,
    connectionStatus,
    filterStatus,
    setFilterStatus,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    userProfile,
    setUserProfile: setUserProfileState,
    listId,
    setListId,
    addItem,
    togglePurchased,
    updateItem,
    deleteItem,
    clearPurchased,
    reloadItems,
    reconnect
  };
}

