import type { CategoryDefinition, ItemCategory } from '../types';

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'Produce',
    nameEl: 'Φρούτα & Λαχανικά',
    nameEn: 'Produce',
    iconName: 'Apple',
    color: 'text-emerald-700 dark:text-emerald-300',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderLight: 'border-emerald-200 dark:border-emerald-800'
  },
  {
    id: 'Dairy',
    nameEl: 'Γαλακτοκομικά & Τυριά',
    nameEn: 'Dairy & Cheese',
    iconName: 'Milk',
    color: 'text-blue-700 dark:text-blue-300',
    bgLight: 'bg-blue-50 dark:bg-blue-950/40',
    borderLight: 'border-blue-200 dark:border-blue-800'
  },
  {
    id: 'Bakery',
    nameEl: 'Αρτοποιείο & Ψωμί',
    nameEn: 'Bakery & Bread',
    iconName: 'Croissant',
    color: 'text-amber-700 dark:text-amber-300',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40',
    borderLight: 'border-amber-200 dark:border-amber-800'
  },
  {
    id: 'Meat & Fish',
    nameEl: 'Κρεοπωλείο & Ψάρια',
    nameEn: 'Meat & Fish',
    iconName: 'Beef',
    color: 'text-rose-700 dark:text-rose-300',
    bgLight: 'bg-rose-50 dark:bg-rose-950/40',
    borderLight: 'border-rose-200 dark:border-rose-800'
  },
  {
    id: 'Pantry',
    nameEl: 'Παντοπωλείο & Βασικά',
    nameEn: 'Pantry & Staples',
    iconName: 'Package',
    color: 'text-orange-700 dark:text-orange-300',
    bgLight: 'bg-orange-50 dark:bg-orange-950/40',
    borderLight: 'border-orange-200 dark:border-orange-800'
  },
  {
    id: 'Beverages',
    nameEl: 'Ποτά & Αναψυκτικά',
    nameEn: 'Beverages',
    iconName: 'Coffee',
    color: 'text-cyan-700 dark:text-cyan-300',
    bgLight: 'bg-cyan-50 dark:bg-cyan-950/40',
    borderLight: 'border-cyan-200 dark:border-cyan-800'
  },
  {
    id: 'Snacks',
    nameEl: 'Σνακ & Γλυκά',
    nameEn: 'Snacks & Sweets',
    iconName: 'Cookie',
    color: 'text-pink-700 dark:text-pink-300',
    bgLight: 'bg-pink-50 dark:bg-pink-950/40',
    borderLight: 'border-pink-200 dark:border-pink-800'
  },
  {
    id: 'Household',
    nameEl: 'Είδη Σπιτιού & Καθαριστικά',
    nameEn: 'Household & Cleaning',
    iconName: 'Home',
    color: 'text-purple-700 dark:text-purple-300',
    bgLight: 'bg-purple-50 dark:bg-purple-950/40',
    borderLight: 'border-purple-200 dark:border-purple-800'
  },
  {
    id: 'Personal Care',
    nameEl: 'Προσωπική Φροντίδα',
    nameEn: 'Personal Care',
    iconName: 'Sparkles',
    color: 'text-teal-700 dark:text-teal-300',
    bgLight: 'bg-teal-50 dark:bg-teal-950/40',
    borderLight: 'border-teal-200 dark:border-teal-800'
  },
  {
    id: 'Other',
    nameEl: 'Διάφορα / Άλλα',
    nameEn: 'Other / General',
    iconName: 'Tag',
    color: 'text-slate-700 dark:text-slate-300',
    bgLight: 'bg-slate-100 dark:bg-slate-800/50',
    borderLight: 'border-slate-200 dark:border-slate-700'
  }
];

export const CATEGORY_MAP: Record<ItemCategory, CategoryDefinition> = CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  },
  {} as Record<ItemCategory, CategoryDefinition>
);

export const DEFAULT_CATEGORY: ItemCategory = 'Produce';

// Fast suggestion presets for quick item addition
export const COMMON_SUGGESTIONS = [
  { name: 'Γάλα 3.5%', category: 'Dairy' as ItemCategory, defaultQty: '2 lt' },
  { name: 'Ψωμί', category: 'Bakery' as ItemCategory, defaultQty: '1' },
  { name: 'Αυγά (10άδα)', category: 'Dairy' as ItemCategory, defaultQty: '1 κουτί' },
  { name: 'Ελαιόλαδο', category: 'Pantry' as ItemCategory, defaultQty: '1 lt' },
  { name: 'Μήλα', category: 'Produce' as ItemCategory, defaultQty: '1 kg' },
  { name: 'Μπανάνες', category: 'Produce' as ItemCategory, defaultQty: '1 kg' },
  { name: 'Φέτα', category: 'Dairy' as ItemCategory, defaultQty: '500g' },
  { name: 'Κοτόπουλο φιλέτο', category: 'Meat & Fish' as ItemCategory, defaultQty: '1 kg' },
  { name: 'Καφές Espresso', category: 'Pantry' as ItemCategory, defaultQty: '250g' },
  { name: 'Χαρτί Υγείας', category: 'Household' as ItemCategory, defaultQty: '1 πακέτο' },
  { name: 'Απορρυπαντικό πιάτων', category: 'Household' as ItemCategory, defaultQty: '1' },
  { name: 'Ντομάτες', category: 'Produce' as ItemCategory, defaultQty: '1.5 kg' },
  { name: 'Ζυμαρικά Μακαρόνια', category: 'Pantry' as ItemCategory, defaultQty: '2 πακέτα' },
  { name: 'Νερό εμφιαλωμένο 6x1.5L', category: 'Beverages' as ItemCategory, defaultQty: '1 εξάδα' }
];
