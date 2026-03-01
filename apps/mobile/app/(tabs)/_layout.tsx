import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { useCompareStore } from "@wedding/shared";

function CompareBadge() {
  const pinnedCount = useCompareStore((s) => s.board.pinnedOptionIds.length);

  if (pinnedCount === 0) return null;

  return (
    <View className="absolute -top-1 -right-2 bg-teal-600 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
      <Text className="text-[10px] font-bold text-white">{pinnedCount}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#ffffff" },
        headerTintColor: "#0f172a",
        headerTitleStyle: { fontWeight: "700" },
        tabBarActiveTintColor: "#0d9488",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e2e8f0",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Options",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          title: "Compare",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <View>
              <Ionicons name="git-compare-outline" size={size} color={color} />
              <CompareBadge />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
