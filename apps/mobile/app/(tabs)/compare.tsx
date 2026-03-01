import { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Pressable,
  Dimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useCompareStore,
  useOptionStore,
  useBudgetStore,
  OPTION_TYPES,
  STATUSES,
  formatCostRange,
  computeFitLabel,
  FIT_BADGE_TEXT,
  triStateIcon,
  triStateLabel,
  type WeddingOption,
  type FitLabel,
} from "@wedding/shared";
import { Badge } from "../../components/ui/Badge";
import { StarRating } from "../../components/ui/StarRating";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 32; // 16px padding each side

const FIT_VARIANT: Record<FitLabel, "green" | "amber" | "red" | "gray"> = {
  under: "green",
  within: "green",
  over: "red",
  unknown: "gray",
};

const STATUS_VARIANT: Record<string, "blue" | "amber" | "green" | "red" | "gray"> = {
  RESEARCHING: "blue",
  SHORTLISTED: "amber",
  FINALIST: "green",
  ELIMINATED: "red",
};

function CompareField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="py-2.5 border-b border-slate-100">
      <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
        {label}
      </Text>
      {children}
    </View>
  );
}

function TriStateField({ label, value }: { label: string; value: "yes" | "no" | "unknown" }) {
  const color =
    value === "yes"
      ? "text-green-600"
      : value === "no"
        ? "text-red-500"
        : "text-slate-400";

  return (
    <CompareField label={label}>
      <Text className={`text-sm font-medium ${color}`}>
        {triStateIcon(value)} {triStateLabel(value)}
      </Text>
    </CompareField>
  );
}

function CompareCard({
  option,
  onRemove,
}: {
  option: WeddingOption;
  onRemove: () => void;
}) {
  const budget = useBudgetStore((s) => s.budget);
  const fitLabel = computeFitLabel(option, budget);

  return (
    <View style={{ width: CARD_WIDTH }} className="mx-4">
      <ScrollView
        className="bg-white rounded-2xl border border-slate-200 shadow-sm"
        contentContainerClassName="p-5 pb-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text className="text-xl font-bold text-slate-900 mb-1">
          {option.name}
        </Text>
        <View className="flex-row items-center flex-wrap gap-2 mb-3">
          <Badge label={OPTION_TYPES[option.type]} variant="teal" />
          <Badge
            label={STATUSES[option.status]}
            variant={STATUS_VARIANT[option.status] ?? "gray"}
          />
        </View>

        {/* Location */}
        <CompareField label="Location">
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={14} color="#64748b" />
            <Text className="text-sm text-slate-700 ml-1">
              {[option.location, option.area].filter(Boolean).join(" \u2022 ") || "N/A"}
            </Text>
          </View>
        </CompareField>

        {/* Cost */}
        <CompareField label="Cost Range">
          <Text className="text-sm font-medium text-slate-900">
            {formatCostRange(option)}
          </Text>
        </CompareField>

        <CompareField label="Budget Fit">
          <Badge label={FIT_BADGE_TEXT[fitLabel]} variant={FIT_VARIANT[fitLabel]} />
        </CompareField>

        {/* Capacity */}
        <CompareField label="Capacity">
          <Text className="text-sm text-slate-700">
            {option.guestCapacitySeated != null
              ? `${option.guestCapacitySeated} seated`
              : ""}
            {option.guestCapacitySeated != null && option.guestCapacityStanding != null
              ? " / "
              : ""}
            {option.guestCapacityStanding != null
              ? `${option.guestCapacityStanding} standing`
              : ""}
            {option.guestCapacitySeated == null && option.guestCapacityStanding == null
              ? "N/A"
              : ""}
          </Text>
        </CompareField>

        {/* On-site */}
        <TriStateField label="Ceremony On-Site" value={option.ceremonyOnSite} />
        <TriStateField label="Reception On-Site" value={option.receptionOnSite} />

        {/* Logistics */}
        <CompareField label="Noise Risk">
          <Text className="text-sm text-slate-700">
            {option.noiseRisk !== "unknown"
              ? option.noiseRisk.charAt(0).toUpperCase() + option.noiseRisk.slice(1)
              : "Unknown"}
          </Text>
        </CompareField>

        <CompareField label="Curfew">
          <Text className="text-sm text-slate-700">
            {option.curfewTime || "N/A"}
          </Text>
        </CompareField>

        <CompareField label="Parking">
          <Text className="text-sm text-slate-700">
            {option.parkingNotes || "N/A"}
          </Text>
        </CompareField>

        {/* Pros */}
        {option.pros.length > 0 && (
          <CompareField label="Pros">
            {option.pros.map((pro, i) => (
              <View key={i} className="flex-row items-start py-0.5">
                <Text className="text-green-600 mr-1.5 text-xs font-bold">{"\u2713"}</Text>
                <Text className="text-sm text-slate-700 flex-1">{pro}</Text>
              </View>
            ))}
          </CompareField>
        )}

        {/* Cons */}
        {option.cons.length > 0 && (
          <CompareField label="Cons">
            {option.cons.map((con, i) => (
              <View key={i} className="flex-row items-start py-0.5">
                <Text className="text-red-500 mr-1.5 text-xs font-bold">{"\u2717"}</Text>
                <Text className="text-sm text-slate-700 flex-1">{con}</Text>
              </View>
            ))}
          </CompareField>
        )}

        {/* Photo Rating */}
        <CompareField label="Photo Rating">
          {option.photoRating != null ? (
            <StarRating value={option.photoRating} size="md" />
          ) : (
            <Text className="text-sm text-slate-400">Not rated</Text>
          )}
        </CompareField>

        {/* Remove Button */}
        <Pressable
          onPress={onRemove}
          className="mt-5 py-3 rounded-xl border border-red-200 bg-red-50 items-center"
        >
          <Text className="text-sm font-semibold text-red-600">
            Remove from Compare
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

export default function CompareScreen() {
  const pinnedIds = useCompareStore((s) => s.board.pinnedOptionIds);
  const unpinOption = useCompareStore((s) => s.unpinOption);
  const options = useOptionStore((s) => s.options);
  const flatListRef = useRef<FlatList<WeddingOption>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pinnedOptions = pinnedIds
    .map((id) => options.find((o) => o.id === id))
    .filter(Boolean) as WeddingOption[];

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const idx = Math.round(x / SCREEN_WIDTH);
      setCurrentIndex(idx);
    },
    []
  );

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= pinnedOptions.length) return;
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setCurrentIndex(index);
    },
    [pinnedOptions.length]
  );

  if (pinnedOptions.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-8">
        <Ionicons name="git-compare-outline" size={56} color="#cbd5e1" />
        <Text className="text-lg font-semibold text-slate-400 mt-4 text-center">
          No pinned options
        </Text>
        <Text className="text-sm text-slate-400 mt-1 text-center">
          Pin options to compare them side-by-side
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Pagination Header */}
      <View className="flex-row items-center justify-between px-4 pt-3 pb-2">
        <Pressable
          onPress={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="p-2"
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={currentIndex === 0 ? "#cbd5e1" : "#0d9488"}
          />
        </Pressable>

        <View className="flex-row items-center gap-1.5">
          {pinnedOptions.map((_, i) => (
            <View
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === currentIndex ? "bg-teal-600" : "bg-slate-300"
              }`}
            />
          ))}
        </View>

        <Pressable
          onPress={() => goTo(currentIndex + 1)}
          disabled={currentIndex === pinnedOptions.length - 1}
          className="p-2"
        >
          <Ionicons
            name="chevron-forward"
            size={22}
            color={
              currentIndex === pinnedOptions.length - 1 ? "#cbd5e1" : "#0d9488"
            }
          />
        </Pressable>
      </View>

      <Text className="text-center text-xs text-slate-400 mb-2">
        {currentIndex + 1} of {pinnedOptions.length}
      </Text>

      {/* Horizontal Paging Cards */}
      <FlatList<WeddingOption>
        ref={flatListRef}
        data={pinnedOptions}
        keyExtractor={(item: WeddingOption) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(_: unknown, index: number) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        renderItem={({ item }: { item: WeddingOption }) => (
          <CompareCard
            option={item}
            onRemove={() => unpinOption(item.id)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}
