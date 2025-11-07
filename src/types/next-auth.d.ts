import type { Role } from "@/lib/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: Role;
      department: string;
      dietaryNotes?: string;
      defaultOptIn: {
        breakfast: boolean;
        lunch: boolean;
        snacks: boolean;
      };
    };
  }

  interface User {
    id: string;
    role: Role;
    department: string;
    dietaryNotes?: string;
    defaultOptIn: {
      breakfast: boolean;
      lunch: boolean;
      snacks: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    department: string;
    dietaryNotes?: string;
    defaultOptIn: {
      breakfast: boolean;
      lunch: boolean;
      snacks: boolean;
    };
  }
}
