import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import {
  setPersistenceAdapter,
  useOptionStore,
  useBudgetStore,
  useCompareStore,
} from "@wedding/shared";
import { createMobilePersistenceAdapter } from "../lib/persistence";

export function StoreHydration({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        setPersistenceAdapter(createMobilePersistenceAdapter());
        await Promise.all([
          useOptionStore.getState().hydrate(),
          useBudgetStore.getState().hydrate(),
          useCompareStore.getState().hydrate(),
        ]);
        setReady(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to initialize");
      }
    }
    init();
  }, []);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6">
        <Text className="text-lg font-bold text-red-600 mb-2">Initialization Error</Text>
        <Text className="text-sm text-slate-500 text-center">{error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#0d9488" />
        <Text className="mt-4 text-sm text-slate-500">Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
}
