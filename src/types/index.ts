export type ItemCategory =
  | 'Produce'
  | 'Dairy'
  | 'Bakery'
  | 'Meat & Fish'
  | 'Pantry'
  | 'Beverages'
  | 'Snacks'
  | 'Household'
  | 'Personal Care'
  | 'Other';

export interface ShoppingItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: string;
  unit?: string;
  notes?: string;
  is_purchased: boolean;
  purchased_by?: string | null;
  list_id: string;
  created_at: string;
  updated_at?: string;
}

export type FilterStatus = 'all' | 'pending' | 'purchased';

export interface CategoryDefinition {
  id: ItemCategory;
  nameEl: string;
  nameEn: string;
  iconName: string;
  color: string;
  bgLight: string;
  borderLight: string;
}

export interface UserProfile {
  name: string;
  avatarColor: string;
  soundEnabled: boolean;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  listId: string;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'local_demo';
