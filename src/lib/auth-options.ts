import { users } from "@/data/users";
import type { Role } from "@/lib/types";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  dietaryNotes?: string;
  defaultOptIn: {
    breakfast: boolean;
    lunch: boolean;
    snacks: boolean;
  };
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? "karmic-canteen-dev-secret",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Corporate SSO",
      credentials: {
        email: { label: "Corporate Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = users.find(
          (candidate) =>
            candidate.email.toLowerCase() === credentials.email.toLowerCase(),
        );

        if (!user) {
          return null;
        }

        const matches = await compare(credentials.password, user.passwordHash);

        if (!matches) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
          dietaryNotes: user.dietaryNotes,
          defaultOptIn: user.defaultOptIn,
        } satisfies SessionUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as SessionUser).id;
        token.role = (user as SessionUser).role;
        token.department = (user as SessionUser).department;
        token.dietaryNotes = (user as SessionUser).dietaryNotes;
        token.defaultOptIn = (user as SessionUser).defaultOptIn;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.department = token.department as string;
        session.user.dietaryNotes = token.dietaryNotes as string | undefined;
        session.user.defaultOptIn = token.defaultOptIn as SessionUser["defaultOptIn"];
      }
      return session;
    },
  },
};
