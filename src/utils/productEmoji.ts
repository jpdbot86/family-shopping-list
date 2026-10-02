import type { ItemCategory } from '../types';

export const CATEGORY_DEFAULT_EMOJIS: Record<ItemCategory, string> = {
  Produce: '🥗',
  Dairy: '🥛',
  Bakery: '🍞',
  'Meat & Fish': '🥩',
  Pantry: '🥫',
  Beverages: '🥤',
  Snacks: '🍪',
  Household: '🧼',
  'Personal Care': '🧴',
  Other: '🛒'
};

// Normalize string by removing Greek accents/diacritics and lowercasing
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

interface EmojiRule {
  keywords: string[];
  emoji: string;
}

const EMOJI_RULES: EmojiRule[] = [
  // Dairy & Breakfast
  { keywords: ['γαλα', 'milk'], emoji: '🥛' },
  { keywords: ['φετα', 'τυρι', 'κασσερι', 'κασattribute', 'γραβιερα', 'γουδα', 'μοτσαρελα', 'gouda', 'mozzarella', 'parmesan', 'παρμεζανα', 'cheese'], emoji: '🧀' },
  { keywords: ['αυγ', 'egg'], emoji: '🥚' },
  { keywords: ['βουτυρ', 'butter'], emoji: '🧈' },
  { keywords: ['γιαουρτ', 'yogurt'], emoji: '🥣' },
  { keywords: ['κρεμα γαλακτ', 'cream'], emoji: '🥛' },

  // Fruits
  { keywords: ['μηλ', 'apple'], emoji: '🍎' },
  { keywords: ['μπαναν', 'banana'], emoji: '🍌' },
  { keywords: ['πορτοκαλ', 'orange'], emoji: '🍊' },
  { keywords: ['λεμον', 'lemon'], emoji: '🍋' },
  { keywords: ['φραουλ', 'strawberry'], emoji: '🍓' },
  { keywords: ['σταφυλ', 'grape'], emoji: '🍇' },
  { keywords: ['καρπουζ', 'watermelon'], emoji: '🍉' },
  { keywords: ['πεπον', 'melon'], emoji: '🍈' },
  { keywords: ['ροδακιν', 'peach'], emoji: '🍑' },
  { keywords: ['κερασ', 'cherry'], emoji: '🍒' },
  { keywords: ['αναν', 'pineapple'], emoji: '🍍' },
  { keywords: ['ακτινιδ', 'kiwi'], emoji: '🥝' },
  { keywords: ['μανταριν'], emoji: '🍊' },
  { keywords: ['αχλαδ', 'pear'], emoji: '🍐' },
  { keywords: ['συκα', 'fig'], emoji: '🫐' },

  // Vegetables
  { keywords: ['ντοματ', 'τοματ', 'tomato'], emoji: '🍅' },
  { keywords: ['πατατ', 'potato'], emoji: '🥔' },
  { keywords: ['κρεμμυδ', 'onion'], emoji: '🧅' },
  { keywords: ['σκορδ', 'garlic'], emoji: '🧄' },
  { keywords: ['καροτ', 'carrot'], emoji: '🥕' },
  { keywords: ['αγγουρ', 'cucumber'], emoji: '🥒' },
  { keywords: ['μαρουλ', 'σαλατ', 'lettuce', 'salad'], emoji: '🥬' },
  { keywords: ['αβοκαντ', 'avocado'], emoji: '🥑' },
  { keywords: ['μπροκολ', 'broccoli'], emoji: '🥦' },
  { keywords: ['πιπερι', 'pepper'], emoji: '🫑' },
  { keywords: ['μανιταρ', 'mushroom'], emoji: '🍄' },
  { keywords: ['καλαμποκ', 'corn'], emoji: '🌽' },
  { keywords: ['κολοκυθ', 'zucchini', 'pumpkin'], emoji: '🎃' },
  { keywords: ['μελιτζαν', 'eggplant'], emoji: '🍆' },
  { keywords: ['σπανακ', 'spinach'], emoji: '🥬' },
  { keywords: ['χορτα'], emoji: '🥬' },

  // Bakery
  { keywords: ['ψωμ', 'bread', 'μπαγκετ'], emoji: '🥖' },
  { keywords: ['τοστ', 'toast'], emoji: '🍞' },
  { keywords: ['κρουασαν', 'croissant'], emoji: '🥐' },
  { keywords: ['κουλουρ', 'bagel'], emoji: '🥯' },
  { keywords: ['πιτα', 'pita', 'τυροπιτ', 'σπανακοπιτ'], emoji: '🥧' },
  { keywords: ['κεικ', 'cake'], emoji: '🍰' },
  { keywords: ['τσουρεκ'], emoji: '🍞' },
  { keywords: ['φρυγανι'], emoji: '🍞' },
  { keywords: ['donuts', 'ντονατ'], emoji: '🍩' },

  // Meat & Fish
  { keywords: ['κοτοπουλ', 'chicken', 'γαλοπουλ', 'turkey'], emoji: '🍗' },
  { keywords: ['κιμα', 'μοσχαρ', 'βοδιν', 'beef', 'steak', 'μπριζολ', 'σνιτσελ', 'χοιριν', 'pork'], emoji: '🥩' },
  { keywords: ['μπεικον', 'bacon'], emoji: '🥓' },
  { keywords: ['λουκανικ', 'sausage'], emoji: '🌭' },
  { keywords: ['μπιφτεκ', 'burger'], emoji: '🍔' },
  { keywords: ['ψαρ', 'fish', 'τσιπουρ', 'σολομ', 'salmon', 'λαβρακ', 'βακαλα'], emoji: '🐟' },
  { keywords: ['γαριδ', 'shrimp'], emoji: '🍤' },
  { keywords: ['τονο', 'tuna'], emoji: '🐟' },
  { keywords: ['χταποδ', 'καλαμαρ', 'squid'], emoji: '🦑' },

  // Pantry & Staples
  { keywords: ['ελαιολαδ', 'λαδι', 'oil', 'olive'], emoji: '🫒' },
  { keywords: ['καφ', 'coffee', 'espresso', 'nescafe', 'freddo'], emoji: '☕' },
  { keywords: ['ζαχαρ', 'sugar'], emoji: '🧂' },
  { keywords: ['αλατ', 'salt'], emoji: '🧂' },
  { keywords: ['μακαρον', 'ζυμαρικ', 'σπαγγετ', 'pasta', 'spaghetti'], emoji: '🍝' },
  { keywords: ['ρυζ', 'rice'], emoji: '🍚' },
  { keywords: ['αλευρ', 'flour'], emoji: '🌾' },
  { keywords: ['δημητριακ', 'cereal', 'βρωμη', 'oats'], emoji: '🥣' },
  { keywords: ['μελ', 'honey'], emoji: '🍯' },
  { keywords: ['μαρμελαδ', 'jam'], emoji: '🍯' },
  { keywords: ['σαλτσ', 'ντοματοπελτ', 'sauce'], emoji: '🥫' },
  { keywords: ['κονσερβ', 'can'], emoji: '🥫' },
  { keywords: ['φακ', 'φασολ', 'ρεβυθ', 'οσπρι', 'beans'], emoji: '🫘' },
  { keywords: ['ξυδ', 'vinegar'], emoji: '🍶' },
  { keywords: ['μουσταρδ', 'mustard'], emoji: '🌭' },
  { keywords: ['μαγιονεζ', 'mayo'], emoji: '🥪' },
  { keywords: ['κετσαπ', 'ketchup'], emoji: '🍅' },
  { keywords: ['πιτσ', 'pizza'], emoji: '🍕' },

  // Beverages
  { keywords: ['νερ', 'water'], emoji: '💧' },
  { keywords: ['κοκα', 'cola', 'coca', 'pepsi', 'σπραιτ', 'sprite', 'φαντα', 'fanta', 'σοδα', 'soda', 'αναψυκτικ'], emoji: '🥤' },
  { keywords: ['χυμ', 'juice'], emoji: '🧃' },
  { keywords: ['μπυρ', 'μπιρ', 'beer'], emoji: '🍺' },
  { keywords: ['κρασ', 'wine'], emoji: '🍷' },
  { keywords: ['τσαι', 'tea'], emoji: '🫖' },

  // Snacks & Sweets
  { keywords: ['σοκολατ', 'chocolate', 'merenda', 'νουτελ', 'nutella'], emoji: '🍫' },
  { keywords: ['πατατακ', 'chips', 'lays', 'doritos'], emoji: '🥔' },
  { keywords: ['μπισκοτ', 'cookie', 'biscuit', 'oreo', 'πτι μπερ'], emoji: '🍪' },
  { keywords: ['παγωτ', 'ice cream'], emoji: '🍨' },
  { keywords: ['ποπ κορν', 'popcorn'], emoji: '🍿' },
  { keywords: ['ξηροι καρπ', 'nuts', 'αμυγδαλ', 'φουντουκ', 'καρυδ'], emoji: '🥜' },
  { keywords: ['καραμελ', 'candy'], emoji: '🍬' },
  { keywords: ['γκοφρετ', 'wafer'], emoji: '🍫' },

  // Household & Cleaning
  { keywords: ['χαρτι υγει', 'τουαλετ', 'toilet paper'], emoji: '🧻' },
  { keywords: ['χαρτι κουζιν', 'kitchen roll', 'χαρτοπετσετ', 'serviettes'], emoji: '🧻' },
  { keywords: ['απορρυπαντικ', 'πλυντηρι', 'detergent', 'ariel', 'skip'], emoji: '🫧' },
  { keywords: ['πιατων', 'fairy', 'πιατα'], emoji: '🧼' },
  { keywords: ['σαπουν', 'soap'], emoji: '🧼' },
  { keywords: ['χλωριν', 'bleach', 'detol', 'dettol'], emoji: '🧴' },
  { keywords: ['σακουλ', 'σκουπιδ', 'trash'], emoji: '🗑️' },
  { keywords: ['σφουγγαρ', 'sponge'], emoji: '🧽' },
  { keywords: ['αλουμινοχαρτ', 'foil', 'μεμβραν'], emoji: '📦' },
  { keywords: ['μαλακτικ', 'softener'], emoji: '🌸' },

  // Personal Care
  { keywords: ['σαμπουαν', 'shampoo'], emoji: '🧴' },
  { keywords: ['αφρολουτρ', 'shower gel'], emoji: '🧴' },
  { keywords: ['οδοντοκρεμ', 'οδοντοβουρτσ', 'colgate', 'toothpaste'], emoji: '🪥' },
  { keywords: ['αποσμητικ', 'deodorant'], emoji: '🧴' },
  { keywords: ['ξυραφακ', 'razor', 'gillette'], emoji: '🪒' },
  { keywords: ['μωρομαντηλ', 'wipes'], emoji: '🧻' },
  { keywords: ['σερβιετ', 'βαμβακ'], emoji: '🩹' },
  { keywords: ['κρεμα', 'lotion'], emoji: '🧴' }
];

export function getProductEmoji(name: string, category: ItemCategory): string {
  if (!name) return CATEGORY_DEFAULT_EMOJIS[category] || '🛒';

  const normalized = normalizeText(name);

  // Check keyword rules
  for (const rule of EMOJI_RULES) {
    for (const keyword of rule.keywords) {
      if (normalized.includes(keyword)) {
        return rule.emoji;
      }
    }
  }

  // Fallback to category default emoji
  return CATEGORY_DEFAULT_EMOJIS[category] || '🛒';
}
