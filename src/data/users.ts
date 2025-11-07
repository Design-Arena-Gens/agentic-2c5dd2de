import type { Role } from "@/lib/types";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  passwordHash: string;
  avatarFallback: string;
  defaultOptIn: {
    breakfast: boolean;
    lunch: boolean;
    snacks: boolean;
  };
  dietaryNotes?: string;
}

export const users: AppUser[] = [
  {
    id: "emp-anika",
    name: "Anika Rao",
    email: "anika.rao@karmic.solutions",
    role: "employee",
    department: "Product Design",
    passwordHash:
      "$2b$10$BIaI5ORAY294Hs5MBgS/4evDZIcdRKyQTgKKTwBr8i4Sl/Y6SQeVq",
    avatarFallback: "AR",
    defaultOptIn: {
      breakfast: true,
      lunch: true,
      snacks: false,
    },
    dietaryNotes: "Allergic to peanuts, prefers high-protein lunch options.",
  },
  {
    id: "emp-jay",
    name: "Jay Mehta",
    email: "jay.mehta@karmic.solutions",
    role: "employee",
    department: "Engineering",
    passwordHash:
      "$2b$10$BIaI5ORAY294Hs5MBgS/4evDZIcdRKyQTgKKTwBr8i4Sl/Y6SQeVq",
    avatarFallback: "JM",
    defaultOptIn: {
      breakfast: false,
      lunch: true,
      snacks: true,
    },
    dietaryNotes: "Vegetarian on Tuesdays and Thursdays.",
  },
  {
    id: "emp-leena",
    name: "Leena Dsouza",
    email: "leena.dsouza@karmic.solutions",
    role: "employee",
    department: "Customer Success",
    passwordHash:
      "$2b$10$BIaI5ORAY294Hs5MBgS/4evDZIcdRKyQTgKKTwBr8i4Sl/Y6SQeVq",
    avatarFallback: "LD",
    defaultOptIn: {
      breakfast: true,
      lunch: false,
      snacks: false,
    },
    dietaryNotes: "Prefers low-carb breakfast alternatives.",
  },
  {
    id: "admin-ria",
    name: "Ria Kapoor",
    email: "ria.kapoor@karmic.solutions",
    role: "admin",
    department: "Canteen Operations",
    passwordHash:
      "$2b$10$I3kY5j..L9HjUWqan.EYiuMyHunHD0NMNYYLkHY5dzXpx/vdNukRm",
    avatarFallback: "RK",
    defaultOptIn: {
      breakfast: false,
      lunch: false,
      snacks: false,
    },
  },
];
