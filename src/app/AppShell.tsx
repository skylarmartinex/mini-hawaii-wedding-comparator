"use client";

import { StoreHydration } from "@/components/layout/StoreHydration";
import { Header } from "@/components/layout/Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <StoreHydration>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
    </StoreHydration>
  );
}
