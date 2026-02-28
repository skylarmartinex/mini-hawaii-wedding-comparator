"use client";

import { useEffect, useState } from "react";
import { useOptionStore } from "@/store/useOptionStore";
import { useBudgetStore } from "@/store/useBudgetStore";
import { useCompareStore } from "@/store/useCompareStore";

export function StoreHydration({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([
      useOptionStore.getState().hydrate(),
      useBudgetStore.getState().hydrate(),
      useCompareStore.getState().hydrate(),
    ]).then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
