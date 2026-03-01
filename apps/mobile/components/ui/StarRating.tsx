import { View, Pressable, Text } from "react-native";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
};

export function StarRating({ value, onChange, size = "md" }: StarRatingProps) {
  const sizeClass = SIZE_CLASSES[size];

  return (
    <View className="flex-row items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        if (onChange) {
          return (
            <Pressable
              key={star}
              onPress={() => onChange(star)}
              hitSlop={4}
              className="px-0.5"
            >
              <Text className={`${sizeClass} ${filled ? "text-amber-400" : "text-slate-300"}`}>
                {filled ? "\u2605" : "\u2606"}
              </Text>
            </Pressable>
          );
        }
        return (
          <Text
            key={star}
            className={`${sizeClass} ${filled ? "text-amber-400" : "text-slate-300"}`}
          >
            {filled ? "\u2605" : "\u2606"}
          </Text>
        );
      })}
    </View>
  );
}
