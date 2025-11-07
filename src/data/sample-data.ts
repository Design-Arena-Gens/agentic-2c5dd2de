import type {
  Announcement,
  DayMenu,
  EmployeeMealHistory,
  InventoryItem,
  MealSelectionRecord,
  MealType,
  SatisfactionFeedback,
} from "@/lib/types";

const today = new Date();

const addDays = (days: number) => {
  const copy = new Date(today);
  copy.setDate(copy.getDate() + days);
  return copy.toISOString().slice(0, 10);
};

const baseMeals = (date: string): MealSelectionRecord[] => [
  { date, mealType: "breakfast", optedIn: Math.random() > 0.25 },
  { date, mealType: "lunch", optedIn: Math.random() > 0.15 },
  { date, mealType: "snacks", optedIn: Math.random() > 0.4 },
];

export const menus: DayMenu[] = [
  {
    date: addDays(1),
    guestChef: "Chef Aparna (Farm-to-Table Collective)",
    sustainabilityNote:
      "Ingredients sourced from within 80km radius, surplus donated to ZeroWaste Bengaluru.",
    meals: [
      {
        type: "breakfast",
        items: [
          {
            name: "Ragi Dosa with Coconut Chutney",
            calories: 280,
            allergens: ["coconut"],
            tags: ["vegan", "gluten-free"],
            inventoryUsage: 140,
          },
          {
            name: "Sprouted Moong Salad Cups",
            calories: 160,
            allergens: [],
            tags: ["high-protein", "diabetic-friendly"],
            inventoryUsage: 90,
          },
        ],
        beveragePairings: ["Filter coffee", "Fresh turmeric latte"],
      },
      {
        type: "lunch",
        items: [
          {
            name: "Millet Biryani with Jackfruit Kebabs",
            calories: 520,
            allergens: [],
            tags: ["sustainable", "chef special"],
            inventoryUsage: 210,
          },
          {
            name: "Thai Basil Tofu with Rice Noodles",
            calories: 470,
            allergens: ["soy", "peanut"],
            tags: ["vegetarian", "spicy"],
            inventoryUsage: 180,
          },
        ],
        beveragePairings: ["Kokum cooler", "Kombucha (ginger-mint)"],
      },
      {
        type: "snacks",
        items: [
          {
            name: "Baked Samosa Bites",
            calories: 210,
            allergens: ["gluten"],
            tags: ["popular", "low-oil"],
            inventoryUsage: 130,
          },
          {
            name: "Chia-Pomegranate Parfait",
            calories: 200,
            allergens: ["nuts"],
            tags: ["vegan", "dessert"],
            inventoryUsage: 85,
          },
        ],
        beveragePairings: ["Kashmiri kahwa", "Cold brew with oat milk"],
      },
    ],
  },
  {
    date: addDays(2),
    guestChef: "Chef Nelson (Zero-Waste Kitchens)",
    sustainabilityNote:
      "Menu utilises 92% of produce harvested this week and relies on batch cooking insights.",
    meals: [
      {
        type: "breakfast",
        items: [
          {
            name: "Foxtail Millet Upma",
            calories: 310,
            allergens: [],
            tags: ["vegan", "fibre-rich"],
            inventoryUsage: 150,
          },
          {
            name: "Greek Yogurt & Berry Granola",
            calories: 260,
            allergens: ["dairy", "nuts"],
            tags: ["vegetarian", "probiotic"],
            inventoryUsage: 120,
          },
        ],
      },
      {
        type: "lunch",
        items: [
          {
            name: "Mangalorean Fish Curry Bowl",
            calories: 490,
            allergens: ["fish"],
            tags: ["omega-3", "regional"],
            inventoryUsage: 230,
          },
          {
            name: "Black Bean Power Bowl",
            calories: 440,
            allergens: [],
            tags: ["vegan", "high-protein"],
            inventoryUsage: 175,
          },
        ],
      },
      {
        type: "snacks",
        items: [
          {
            name: "Sweet Potato Chaat",
            calories: 190,
            allergens: [],
            tags: ["street-food", "gluten-free"],
            inventoryUsage: 110,
          },
          {
            name: "Bajra Energy Bars",
            calories: 180,
            allergens: ["nuts"],
            tags: ["energy", "no-added-sugar"],
            inventoryUsage: 70,
          },
        ],
      },
    ],
  },
  {
    date: addDays(3),
    guestChef: "Nutritionist curated reset menu",
    sustainabilityNote:
      "Hydroponic greens featured. Leftovers partner with DailyMeals NGO.",
    meals: [
      {
        type: "breakfast",
        items: [
          {
            name: "Avocado & Microgreens Toast",
            calories: 280,
            allergens: ["gluten"],
            tags: ["vegan"],
            inventoryUsage: 120,
          },
          {
            name: "Protein Idli Stack",
            calories: 330,
            allergens: ["dairy"],
            tags: ["high-protein"],
            inventoryUsage: 160,
          },
        ],
      },
      {
        type: "lunch",
        items: [
          {
            name: "Kale Dal Tadkewali",
            calories: 420,
            allergens: [],
            tags: ["vegan", "iron-rich"],
            inventoryUsage: 190,
          },
          {
            name: "Sesame Chili Paneer Wrap",
            calories: 450,
            allergens: ["dairy", "sesame"],
            tags: ["fusion", "spicy"],
            inventoryUsage: 160,
          },
        ],
      },
      {
        type: "snacks",
        items: [
          {
            name: "Moringa Hummus & Rainbow Crudité",
            calories: 150,
            allergens: [],
            tags: ["vegan", "detox"],
            inventoryUsage: 90,
          },
          {
            name: "Pearl Millet Cupcakes",
            calories: 220,
            allergens: ["gluten"],
            tags: ["dessert", "limited"],
            inventoryUsage: 80,
          },
        ],
      },
    ],
  },
  {
    date: addDays(4),
    guestChef: "Team Poll Winner Menu",
    sustainabilityNote:
      "Crowd-sourced recipes. Waste oil repurposed via ReOil partner.",
    meals: [
      {
        type: "breakfast",
        items: [
          {
            name: "Masala Oats with Tofu Scramble",
            calories: 300,
            allergens: ["soy"],
            tags: ["vegan"],
            inventoryUsage: 140,
          },
          {
            name: "Banana Walnut Overnight Cups",
            calories: 310,
            allergens: ["nuts"],
            tags: ["vegetarian"],
            inventoryUsage: 100,
          },
        ],
      },
      {
        type: "lunch",
        items: [
          {
            name: "Hyderabadi Paneer Kofta",
            calories: 500,
            allergens: ["dairy"],
            tags: ["popular"],
            inventoryUsage: 220,
          },
          {
            name: "Sesame Udon Stir-Fry",
            calories: 470,
            allergens: ["gluten", "sesame"],
            tags: ["vegan", "chef special"],
            inventoryUsage: 185,
          },
        ],
      },
      {
        type: "snacks",
        items: [
          {
            name: "Stuffed Mini Parathas",
            calories: 210,
            allergens: ["gluten"],
            tags: ["regional"],
            inventoryUsage: 120,
          },
          {
            name: "Roasted Chickpea Trail Mix",
            calories: 170,
            allergens: [],
            tags: ["protein-rich"],
            inventoryUsage: 85,
          },
        ],
      },
    ],
  },
  {
    date: addDays(5),
    guestChef: "Chef Lila (Plant Labs)",
    sustainabilityNote:
      "Upcycled vegetable stems used in broth, compost tracked in dashboard.",
    meals: [
      {
        type: "breakfast",
        items: [
          {
            name: "Moonglet Tacos",
            calories: 260,
            allergens: [],
            tags: ["vegan"],
            inventoryUsage: 145,
          },
          {
            name: "Almond Buckwheat Pancakes",
            calories: 320,
            allergens: ["nuts"],
            tags: ["gluten-free"],
            inventoryUsage: 105,
          },
        ],
      },
      {
        type: "lunch",
        items: [
          {
            name: "Smoked Pumpkin Risotto",
            calories: 480,
            allergens: ["dairy"],
            tags: ["vegetarian", "comfort"],
            inventoryUsage: 200,
          },
          {
            name: "Teriyaki Tempeh Rice Bowl",
            calories: 450,
            allergens: ["soy"],
            tags: ["vegan", "fermented"],
            inventoryUsage: 170,
          },
        ],
      },
      {
        type: "snacks",
        items: [
          {
            name: "Lotus Stem Chips",
            calories: 190,
            allergens: [],
            tags: ["novelty", "low-oil"],
            inventoryUsage: 95,
          },
          {
            name: "Blue Pea Iced Tea",
            calories: 60,
            allergens: [],
            tags: ["hydration"],
            inventoryUsage: 65,
          },
        ],
      },
    ],
  },
];

export const inventory: InventoryItem[] = [
  {
    id: "inv-millets",
    name: "Mixed Millets",
    unit: "kg",
    current: 44,
    parLevel: 60,
    vendor: "Organic Harvest Collective",
  },
  {
    id: "inv-tofu",
    name: "Organic Tofu Blocks",
    unit: "ct",
    current: 75,
    parLevel: 90,
    vendor: "Plant Labs",
  },
  {
    id: "inv-produce",
    name: "Hydroponic Greens",
    unit: "kg",
    current: 32,
    parLevel: 40,
    vendor: "UrbanLeaf Farms",
  },
  {
    id: "inv-spices",
    name: "Signature Spice Blend",
    unit: "kg",
    current: 18,
    parLevel: 12,
    vendor: "Coastal Spices Collective",
  },
];

export const employeeMealHistory: EmployeeMealHistory[] = [
  {
    userId: "emp-anika",
    records: [
      ...baseMeals(addDays(-4)),
      ...baseMeals(addDays(-3)),
      ...baseMeals(addDays(-2)),
      ...baseMeals(addDays(-1)),
    ],
  },
  {
    userId: "emp-jay",
    records: [
      ...baseMeals(addDays(-4)),
      ...baseMeals(addDays(-3)),
      ...baseMeals(addDays(-2)),
      ...baseMeals(addDays(-1)),
    ],
  },
  {
    userId: "emp-leena",
    records: [
      ...baseMeals(addDays(-4)),
      ...baseMeals(addDays(-3)),
      ...baseMeals(addDays(-2)),
      ...baseMeals(addDays(-1)),
    ],
  },
];

export const aggregateOptInHistory: MealSelectionRecord[] = [
  { date: addDays(-9), mealType: "breakfast", optedIn: true },
  { date: addDays(-9), mealType: "lunch", optedIn: true },
  { date: addDays(-9), mealType: "snacks", optedIn: false },
  { date: addDays(-7), mealType: "breakfast", optedIn: true },
  { date: addDays(-7), mealType: "lunch", optedIn: true },
  { date: addDays(-7), mealType: "snacks", optedIn: true },
  { date: addDays(-5), mealType: "breakfast", optedIn: true },
  { date: addDays(-5), mealType: "lunch", optedIn: false },
  { date: addDays(-5), mealType: "snacks", optedIn: false },
  { date: addDays(-3), mealType: "breakfast", optedIn: true },
  { date: addDays(-3), mealType: "lunch", optedIn: true },
  { date: addDays(-3), mealType: "snacks", optedIn: true },
  { date: addDays(-1), mealType: "breakfast", optedIn: true },
  { date: addDays(-1), mealType: "lunch", optedIn: true },
  { date: addDays(-1), mealType: "snacks", optedIn: false },
];

export const feedbackEntries: SatisfactionFeedback[] = [
  {
    id: "fb-01",
    userId: "emp-anika",
    rating: 5,
    occurredOn: addDays(-1),
    highlight: "Loved the millet biryani and the sustainability note!",
    improvement: "Would appreciate a low-sugar dessert option.",
  },
  {
    id: "fb-02",
    userId: "emp-jay",
    rating: 4,
    occurredOn: addDays(-2),
    highlight: "Inventory tracker helped me plan for client lunch meets.",
  },
  {
    id: "fb-03",
    userId: "emp-leena",
    rating: 3,
    occurredOn: addDays(-3),
    highlight: "Breakfast has become more diverse.",
    improvement: "Could we get nutritional macros for snacks?",
  },
];

export const announcements: Announcement[] = [
  {
    id: "ann-01",
    createdAt: addDays(-1),
    title: "Tomorrow is Indigenous Grains Day",
    message:
      "We are showcasing heirloom millets sourced from farmer co-ops. Opt-in early so we can plan procurement sustainably.",
    audience: "all",
  },
  {
    id: "ann-02",
    createdAt: addDays(-2),
    title: "Admin Workshop on Menu Forecasting",
    message:
      "Operations team: join the 30-min walkthrough on using predictive demand tools with our new dashboard view.",
    audience: "admin",
    cta: {
      label: "Reserve Seat",
      href: "https://cal.com/karmiccanteen/forecasting",
    },
  },
  {
    id: "ann-03",
    createdAt: addDays(-3),
    title: "Employee Pilot: Smart Snacks",
    message:
      "Snacks now adapt to your opt-in history. Share feedback to help us calibrate the recommendation engine.",
    audience: "employee",
  },
];

export const mealTypeLabels: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snacks: "Evening Snacks",
};
