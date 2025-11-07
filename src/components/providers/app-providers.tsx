'use client';

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { ReactNode } from "react";

interface AppProvidersProps {
  children: ReactNode;
  session: Session | null;
}

export const AppProviders = ({ children, session }: AppProvidersProps) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
