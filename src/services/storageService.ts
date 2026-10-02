import type { ShoppingItem } from '../types';

const LOCAL_STORAGE_ITEMS_KEY = 'family_shopping_local_items_v1';
export const LOCAL_EVENT_NAME = 'family-shopping-local-sync';

const SEED_ITEMS: ShoppingItem[] = [
  {
    id: 'seed-1',
    name: 'Φρέσκο Γάλα 3.5%',
    category: 'Dairy',
    quantity: '2 lt',
    is_purchased: false,
    purchased_by: null,
    notes: 'Πλήρες για τα παιδιά',
    list_id: 'family-main',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'seed-2',
    name: 'Ψωμί Τοστ Ολικής',
    category: 'Bakery',
    quantity: '1 πακέτο',
    is_purchased: false,
    purchased_by: null,
    notes: '',
    list_id: 'family-main',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'seed-3',
    name: 'Μήλα Starking & Μπανάνες',
    category: 'Produce',
    quantity: '1.5 kg',
    is_purchased: false,
    purchased_by: null,
    notes: 'Όχι πολύ γινωμένες',
    list_id: 'family-main',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'seed-4',
    name: 'Ελαιόλαδο Εξαιρετικό Παρθένο',
    category: 'Pantry',
    quantity: '1 lt',
    is_purchased: false,
    purchased_by: null,
    notes: '',
    list_id: 'family-main',
    created_at: new Date(Date.now() - 1800000).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'seed-5',
    name: 'Τυρί Φέτα Π.Ο.Π.',
    category: 'Dairy',
    quantity: '500g',
    is_purchased: true,
    purchased_by: 'Μαρία',
    notes: 'Σκληρή',
    list_id: 'family-main',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 900000).toISOString()
  },
  {
    id: 'seed-6',
    name: 'Χαρτί Κουζίνας',
    category: 'Household',
    quantity: '1 πακέτο',
    is_purchased: false,
    purchased_by: null,
    notes: '',
    list_id: 'family-main',
    created_at: new Date(Date.now() - 600000).toISOString(),
    updated_at: new Date(Date.now() - 600000).toISOString()
  }
];

function notifyChange() {
  window.dispatchEvent(new CustomEvent(LOCAL_EVENT_NAME));
}

export const storageService = {
  getLocalItems(listId: string = 'family-main'): ShoppingItem[] {
    const raw = localStorage.getItem(LOCAL_STORAGE_ITEMS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(SEED_ITEMS));
      return SEED_ITEMS.filter((i) => i.list_id === listId);
    }
    try {
      const items: ShoppingItem[] = JSON.parse(raw);
      return items.filter((i) => i.list_id === listId);
    } catch {
      return SEED_ITEMS;
    }
  },

  saveLocalItems(items: ShoppingItem[]) {
    localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(items));
    notifyChange();
  },

  addItem(item: Omit<ShoppingItem, 'id' | 'created_at' | 'updated_at'>): ShoppingItem {
    const all = this.getLocalItems();
    const newItem: ShoppingItem = {
      ...item,
      id: 'local-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    all.unshift(newItem);
    this.saveLocalItems(all);
    return newItem;
  },

  updateItem(id: string, updates: Partial<ShoppingItem>): ShoppingItem | null {
    const all = this.getLocalItems();
    const index = all.findIndex((i) => i.id === id);
    if (index === -1) return null;

    all[index] = {
      ...all[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.saveLocalItems(all);
    return all[index];
  },

  deleteItem(id: string): boolean {
    const all = this.getLocalItems();
    const filtered = all.filter((i) => i.id !== id);
    this.saveLocalItems(filtered);
    return true;
  },

  clearPurchased(listId: string = 'family-main'): number {
    const all = this.getLocalItems();
    const kept = all.filter((i) => !(i.list_id === listId && i.is_purchased));
    const count = all.length - kept.length;
    this.saveLocalItems(kept);
    return count;
  }
};
