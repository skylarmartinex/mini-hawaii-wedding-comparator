import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StoreHydration } from "../components/StoreHydration";

export default function RootLayout() {
  return (
    <StoreHydration>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#ffffff" },
          headerTintColor: "#0f172a",
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: "#f8fafc" },
        }}
      />
    </StoreHydration>
  );
}
