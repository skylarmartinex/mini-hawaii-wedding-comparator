import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  useOptionStore,
  useCompareStore,
  useBudgetStore,
  OPTION_TYPES,
  STATUSES,
  formatCostRange,
  type WeddingOption,
  type StatusKey,
} from "@wedding/shared";
import { Badge } from "../../components/ui/Badge";
import { StarRating } from "../../components/ui/StarRating";
import { Chip } from "../../components/ui/Chip";

const STATUS_BADGE_VARIANT: Record<string, "teal" | "amber" | "blue" | "green" | "red" | "gray"> = {
  RESEARCHING: "blue",
  SHORTLISTED: "amber",
  FINALIST: "green",
  ELIMINATED: "red",
};

function OptionCard({ option }: { option: WeddingOption }) {
  const router = useRouter();
  const isPinned = useCompareStore((s) => s.isPinned(option.id));
  const canPin = useCompareStore((s) => s.canPin());
  const pinOption = useCompareStore((s) => s.pinOption);
  const unpinOption = useCompareStore((s) => s.unpinOption);

  const handlePin = useCallback(() => {
    if (isPinned) {
      unpinOption(option.id);
    } else if (canPin) {
      pinOption(option.id);
    }
  }, [isPinned, canPin, option.id, pinOption, unpinOption]);

  return (
    <Pressable
      onPress={() => router.push(`/option/${option.id}`)}
      className="mx-4 mb-3 bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-3">
          <Text className="text-base font-bold text-slate-900" numberOfLines={1}>
            {option.name}
          </Text>
          <Text className="text-xs text-slate-500 mt-0.5">
            {OPTION_TYPES[option.type]}
          </Text>
        </View>
        <Pressable
          onPress={handlePin}
          hitSlop={8}
          className="p-1"
        >
          <Ionicons
            name={isPinned ? "pin" : "pin-outline"}
            size={20}
            color={isPinned ? "#0d9488" : "#94a3b8"}
          />
        </Pressable>
      </View>

      <View className="flex-row items-center mb-2">
        {option.location ? (
          <View className="flex-row items-center mr-3">
            <Ionicons name="location-outline" size={14} color="#64748b" />
            <Text className="text-xs text-slate-500 ml-1">
              {option.location}
              {option.area ? ` \u2022 ${option.area}` : ""}
            </Text>
          </View>
        ) : null}
      </View>

      <View className="flex-row items-center flex-wrap gap-2">
        <Badge
          label={STATUSES[option.status]}
          variant={STATUS_BADGE_VARIANT[option.status] ?? "gray"}
        />
        <Text className="text-xs font-medium text-slate-700">
          {formatCostRange(option)}
        </Text>
        {option.photoRating != null && (
          <StarRating value={option.photoRating} size="sm" />
        )}
      </View>
    </Pressable>
  );
}

export default function OptionsListScreen() {
  const router = useRouter();
  const guestCount = useBudgetStore((s) => s.budget.guestCount);
  const setFilter = useOptionStore((s) => s.setFilter);
  const filteredOptions = useOptionStore((s) => s.filteredOptions(guestCount));
  const filters = useOptionStore((s) => s.filters);

  const [activeStatuses, setActiveStatuses] = useState<Set<StatusKey>>(new Set());

  const handleSearch = useCallback(
    (text: string) => {
      setFilter("searchQuery", text);
    },
    [setFilter]
  );

  const toggleStatus = useCallback(
    (key: StatusKey) => {
      setActiveStatuses((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        // Apply filter: if any statuses selected, filter by them
        // We use the first active status for the store filter
        // For multi-status, we filter locally
        setFilter("status", null);
        return next;
      });
    },
    [setFilter]
  );

  // Apply local multi-status filter
  const displayOptions =
    activeStatuses.size > 0
      ? filteredOptions.filter((o) => activeStatuses.has(o.status as StatusKey))
      : filteredOptions;

  return (
    <View className="flex-1 bg-slate-50">
      {/* Search Bar */}
      <View className="px-4 pt-3 pb-1">
        <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-3 py-2">
          <Ionicons name="search" size={18} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-2 text-sm text-slate-900"
            placeholder="Search options..."
            placeholderTextColor="#94a3b8"
            value={filters.searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
        <Text className="text-xs text-slate-400 mt-1.5 ml-1">
          {displayOptions.length} option{displayOptions.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Status Filter Chips */}
      <View className="px-4 pb-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="py-1"
        >
          {(Object.entries(STATUSES) as [StatusKey, string][]).map(
            ([key, label]) => (
              <Chip
                key={key}
                label={label}
                active={activeStatuses.has(key)}
                onPress={() => toggleStatus(key)}
              />
            )
          )}
        </ScrollView>
      </View>

      {/* Options List */}
      <FlatList<WeddingOption>
        data={displayOptions}
        keyExtractor={(item: WeddingOption) => item.id}
        renderItem={({ item }: { item: WeddingOption }) => <OptionCard option={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20 px-8">
            <Ionicons name="search-outline" size={48} color="#cbd5e1" />
            <Text className="text-base font-medium text-slate-400 mt-4 text-center">
              No options found
            </Text>
            <Text className="text-sm text-slate-400 mt-1 text-center">
              Add your first wedding option to get started
            </Text>
          </View>
        }
      />

      {/* FAB */}
      <Pressable
        onPress={() => router.push("/option/edit")}
        className="absolute bottom-6 right-6 w-14 h-14 bg-teal-600 rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: "#0d9488",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </Pressable>
    </View>
  );
}
