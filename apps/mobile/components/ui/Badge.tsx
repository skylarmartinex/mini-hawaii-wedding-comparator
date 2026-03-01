import { View, Text } from "react-native";

const VARIANT_CLASSES: Record<string, { bg: string; text: string }> = {
  teal: { bg: "bg-teal-100", text: "text-teal-700" },
  amber: { bg: "bg-amber-100", text: "text-amber-700" },
  blue: { bg: "bg-blue-100", text: "text-blue-700" },
  green: { bg: "bg-green-100", text: "text-green-700" },
  red: { bg: "bg-red-100", text: "text-red-700" },
  gray: { bg: "bg-slate-100", text: "text-slate-600" },
};

interface BadgeProps {
  label: string;
  variant?: keyof typeof VARIANT_CLASSES;
}

export function Badge({ label, variant = "gray" }: BadgeProps) {
  const colors = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.gray;

  return (
    <View className={`px-2.5 py-0.5 rounded-full ${colors.bg}`}>
      <Text className={`text-xs font-semibold ${colors.text}`}>{label}</Text>
    </View>
  );
}
