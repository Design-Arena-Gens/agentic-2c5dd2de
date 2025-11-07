export type MealType = "breakfast" | "lunch" | "snacks";

export type Role = "employee" | "admin";

export interface MealItem {
  name: string;
  calories: number;
  allergens: string[];
  tags: string[];
  inventoryUsage: number;
}

export interface MealOption {
  type: MealType;
  items: MealItem[];
  beveragePairings?: string[];
}

export interface DayMenu {
  date: string; // ISO date string
  meals: MealOption[];
  guestChef?: string;
  sustainabilityNote?: string;
}

export interface MealSelectionRecord {
  date: string;
  mealType: MealType;
  optedIn: boolean;
}

export interface EmployeeMealHistory {
  userId: string;
  records: MealSelectionRecord[];
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  current: number;
  parLevel: number;
  vendor?: string;
}

export interface SatisfactionFeedback {
  id: string;
  userId: string;
  rating: number;
  occurredOn: string;
  highlight: string;
  improvement?: string;
}

export interface Announcement {
  id: string;
  createdAt: string;
  title: string;
  message: string;
  audience: Role | "all";
  cta?: {
    label: string;
    href: string;
  };
}
