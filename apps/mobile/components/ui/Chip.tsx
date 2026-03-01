import { Pressable, Text } from "react-native";

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-3 py-1.5 rounded-full border mr-2 ${
        active
          ? "bg-teal-600 border-teal-600"
          : "bg-white border-slate-300"
      }`}
    >
      <Text
        className={`text-xs font-medium ${
          active ? "text-white" : "text-slate-600"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
