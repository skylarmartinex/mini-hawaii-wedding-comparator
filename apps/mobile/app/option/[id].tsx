import { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  useOptionStore,
  useCompareStore,
  OPTION_TYPES,
  STATUSES,
  formatCostRange,
  triStateIcon,
  triStateLabel,
  type WeddingOption,
} from "@wedding/shared";
import { Badge } from "../../components/ui/Badge";
import { StarRating } from "../../components/ui/StarRating";

const STATUS_BADGE_VARIANT: Record<string, "teal" | "amber" | "blue" | "green" | "red" | "gray"> = {
  RESEARCHING: "blue",
  SHORTLISTED: "amber",
  FINALIST: "green",
  ELIMINATED: "red",
};

const CONFIDENCE_VARIANT: Record<string, "green" | "amber" | "red"> = {
  high: "green",
  med: "amber",
  low: "red",
};

function SectionHeader({ title }: { title: string }) {
  return (
    <View className="mb-2 mt-5">
      <Text className="text-sm font-bold text-slate-500 uppercase tracking-wide">
        {title}
      </Text>
      <View className="h-px bg-slate-200 mt-1" />
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string | undefined | null }) {
  if (!value) return null;
  return (
    <View className="flex-row py-1.5">
      <Text className="text-sm text-slate-500 w-32">{label}</Text>
      <Text className="text-sm text-slate-900 flex-1">{value}</Text>
    </View>
  );
}

function TriStateRow({ label, value }: { label: string; value: "yes" | "no" | "unknown" }) {
  const icon = triStateIcon(value);
  const color =
    value === "yes"
      ? "text-green-600"
      : value === "no"
        ? "text-red-500"
        : "text-slate-400";

  return (
    <View className="flex-row py-1.5">
      <Text className="text-sm text-slate-500 w-32">{label}</Text>
      <Text className={`text-sm font-medium ${color}`}>
        {icon} {triStateLabel(value)}
      </Text>
    </View>
  );
}

export default function OptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const option = useOptionStore((s) => s.getOption(id));
  const removeOption = useOptionStore((s) => s.removeOption);
  const isPinned = useCompareStore((s) => s.isPinned(id));
  const canPin = useCompareStore((s) => s.canPin());
  const pinOption = useCompareStore((s) => s.pinOption);
  const unpinOption = useCompareStore((s) => s.unpinOption);

  const handlePin = useCallback(() => {
    if (isPinned) {
      unpinOption(id);
    } else if (canPin) {
      pinOption(id);
    }
  }, [isPinned, canPin, id, pinOption, unpinOption]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      "Delete Option",
      `Are you sure you want to delete "${option?.name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await removeOption(id);
            if (isPinned) {
              await unpinOption(id);
            }
            router.back();
          },
        },
      ]
    );
  }, [option?.name, id, removeOption, isPinned, unpinOption, router]);

  if (!option) {
    return (
      <>
        <Stack.Screen options={{ title: "Not Found" }} />
        <View className="flex-1 items-center justify-center bg-slate-50 px-6">
          <Ionicons name="alert-circle-outline" size={48} color="#cbd5e1" />
          <Text className="text-base font-medium text-slate-400 mt-4">
            Option not found
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="mt-4 px-4 py-2 bg-teal-600 rounded-lg"
          >
            <Text className="text-sm font-medium text-white">Go Back</Text>
          </Pressable>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: option.name }} />
      <ScrollView className="flex-1 bg-slate-50" contentContainerClassName="pb-10">
        {/* Header Section */}
        <View className="bg-white px-4 pt-4 pb-4 border-b border-slate-100">
          <View className="flex-row items-center flex-wrap gap-2 mb-2">
            <Badge label={OPTION_TYPES[option.type]} variant="teal" />
            <Badge
              label={STATUSES[option.status]}
              variant={STATUS_BADGE_VARIANT[option.status] ?? "gray"}
            />
          </View>
          <Text className="text-2xl font-bold text-slate-900 mb-1">
            {option.name}
          </Text>
          {(option.location || option.area) && (
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={16} color="#64748b" />
              <Text className="text-sm text-slate-500 ml-1">
                {[option.location, option.area].filter(Boolean).join(" \u2022 ")}
              </Text>
            </View>
          )}
          {option.photoRating != null && (
            <View className="flex-row items-center mt-2">
              <Text className="text-xs text-slate-500 mr-2">Photo Rating</Text>
              <StarRating value={option.photoRating} size="sm" />
            </View>
          )}
        </View>

        <View className="px-4">
          {/* Cost Section */}
          <SectionHeader title="Cost" />
          <InfoRow label="Cost Range" value={formatCostRange(option)} />
          {option.costConfidence && (
            <View className="flex-row py-1.5">
              <Text className="text-sm text-slate-500 w-32">Confidence</Text>
              <Badge
                label={option.costConfidence.toUpperCase()}
                variant={CONFIDENCE_VARIANT[option.costConfidence] ?? "gray"}
              />
            </View>
          )}
          <InfoRow label="Cost Notes" value={option.costNotes} />

          {/* Capacity Section */}
          <SectionHeader title="Capacity" />
          <InfoRow
            label="Seated"
            value={
              option.guestCapacitySeated != null
                ? `${option.guestCapacitySeated} guests`
                : undefined
            }
          />
          <InfoRow
            label="Standing"
            value={
              option.guestCapacityStanding != null
                ? `${option.guestCapacityStanding} guests`
                : undefined
            }
          />
          <TriStateRow label="Ceremony On-Site" value={option.ceremonyOnSite} />
          <TriStateRow label="Reception On-Site" value={option.receptionOnSite} />

          {/* Logistics Section */}
          <SectionHeader title="Logistics" />
          <InfoRow label="Curfew" value={option.curfewTime} />
          <InfoRow
            label="Noise Risk"
            value={option.noiseRisk !== "unknown" ? option.noiseRisk.toUpperCase() : "Unknown"}
          />
          <InfoRow label="Parking" value={option.parkingNotes} />

          {/* Pros / Cons */}
          {(option.pros.length > 0 || option.cons.length > 0) && (
            <>
              <SectionHeader title="Pros & Cons" />
              {option.pros.length > 0 && (
                <View className="mb-2">
                  {option.pros.map((pro, i) => (
                    <View key={`pro-${i}`} className="flex-row items-start py-1">
                      <Text className="text-green-600 mr-2 text-sm font-bold">{"\u2713"}</Text>
                      <Text className="text-sm text-slate-700 flex-1">{pro}</Text>
                    </View>
                  ))}
                </View>
              )}
              {option.cons.length > 0 && (
                <View className="mb-2">
                  {option.cons.map((con, i) => (
                    <View key={`con-${i}`} className="flex-row items-start py-1">
                      <Text className="text-red-500 mr-2 text-sm font-bold">{"\u2717"}</Text>
                      <Text className="text-sm text-slate-700 flex-1">{con}</Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          {/* Questions to Ask */}
          {option.questionsToAsk.length > 0 && (
            <>
              <SectionHeader title="Questions to Ask" />
              {option.questionsToAsk.map((q, i) => (
                <View key={`q-${i}`} className="flex-row items-start py-1">
                  <Text className="text-teal-600 mr-2 text-sm">{"\u2022"}</Text>
                  <Text className="text-sm text-slate-700 flex-1">{q}</Text>
                </View>
              ))}
            </>
          )}

          {/* Tags */}
          {option.tags.length > 0 && (
            <>
              <SectionHeader title="Tags" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="py-1 gap-2"
              >
                {option.tags.map((tag) => (
                  <Badge key={tag} label={tag} variant="gray" />
                ))}
              </ScrollView>
            </>
          )}

          {/* Notes */}
          {option.notes ? (
            <>
              <SectionHeader title="Notes" />
              <Text className="text-sm text-slate-700 leading-5">
                {option.notes}
              </Text>
            </>
          ) : null}

          {/* Actions */}
          <View className="mt-8 gap-3 mb-4">
            <Pressable
              onPress={handlePin}
              className={`flex-row items-center justify-center py-3 rounded-xl border ${
                isPinned
                  ? "bg-teal-50 border-teal-200"
                  : "bg-white border-slate-200"
              }`}
            >
              <Ionicons
                name={isPinned ? "pin" : "pin-outline"}
                size={18}
                color={isPinned ? "#0d9488" : "#64748b"}
              />
              <Text
                className={`ml-2 text-sm font-semibold ${
                  isPinned ? "text-teal-700" : "text-slate-700"
                }`}
              >
                {isPinned ? "Unpin from Compare" : "Pin to Compare"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push(`/option/edit?id=${id}`)}
              className="flex-row items-center justify-center py-3 rounded-xl bg-teal-600"
            >
              <Ionicons name="create-outline" size={18} color="#ffffff" />
              <Text className="ml-2 text-sm font-semibold text-white">
                Edit Option
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              className="flex-row items-center justify-center py-3 rounded-xl border border-red-200 bg-red-50"
            >
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
              <Text className="ml-2 text-sm font-semibold text-red-600">
                Delete Option
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
