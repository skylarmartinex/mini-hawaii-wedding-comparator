import { useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useBudgetStore,
  useOptionStore,
  useCompareStore,
  SEED_OPTIONS,
  BAR_STYLES,
  RENTAL_LEVELS,
  BAR_STYLE_LABELS,
  RENTAL_LEVEL_LABELS,
  getAdapter,
  type BarStyle,
  type RentalLevel,
} from "@wedding/shared";

function SectionHeader({ title }: { title: string }) {
  return (
    <View className="mt-6 mb-3">
      <Text className="text-sm font-bold text-slate-500 uppercase tracking-wide">
        {title}
      </Text>
      <View className="h-px bg-slate-200 mt-1.5" />
    </View>
  );
}

function SettingRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-slate-100">
      <Text className="text-sm text-slate-700 flex-1">{label}</Text>
      <View className="ml-3">{children}</View>
    </View>
  );
}

interface PickerRowProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (val: T) => void;
  labels: Record<string, string>;
}

function InlinePicker<T extends string>({
  options,
  value,
  onChange,
  labels,
}: PickerRowProps<T>) {
  return (
    <View className="flex-row gap-1.5">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-full border ${
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
              {labels[opt] ?? opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function SettingsScreen() {
  const budget = useBudgetStore((s) => s.budget);
  const updateBudget = useBudgetStore((s) => s.update);
  const importOptions = useOptionStore((s) => s.importOptions);
  const options = useOptionStore((s) => s.options);

  const handleLoadSample = useCallback(() => {
    Alert.alert(
      "Load Sample Data",
      `This will add ${SEED_OPTIONS.length} sample wedding options. Your existing data will be replaced. Continue?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Load",
          onPress: async () => {
            await importOptions(SEED_OPTIONS);
          },
        },
      ]
    );
  }, [importOptions]);

  const handleClearAll = useCallback(() => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your options, budget settings, and compare pins. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: async () => {
            const adapter = getAdapter();
            await adapter.clearAll();
            // Re-hydrate stores from empty DB
            await useOptionStore.getState().hydrate();
            await useBudgetStore.getState().hydrate();
            await useCompareStore.getState().hydrate();
          },
        },
      ]
    );
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerClassName="px-4 pb-10"
    >
      {/* Budget Assumptions */}
      <SectionHeader title="Budget Assumptions" />

      <SettingRow label="Guest Count">
        <TextInput
          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-900 w-20 text-right"
          keyboardType="number-pad"
          value={budget.guestCount.toString()}
          onChangeText={(text: string) => {
            const num = parseInt(text, 10);
            if (!isNaN(num) && num > 0) {
              updateBudget({ guestCount: num });
            }
          }}
        />
      </SettingRow>

      <SettingRow label="Target Budget ($)">
        <TextInput
          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-900 w-28 text-right"
          keyboardType="number-pad"
          placeholder="Not set"
          placeholderTextColor="#94a3b8"
          value={budget.targetBudget?.toString() ?? ""}
          onChangeText={(text: string) => {
            const num = parseFloat(text);
            updateBudget({
              targetBudget: !isNaN(num) && num > 0 ? num : undefined,
            });
          }}
        />
      </SettingRow>

      <View className="py-3 border-b border-slate-100">
        <Text className="text-sm text-slate-700 mb-2">Bar Style</Text>
        <InlinePicker
          options={BAR_STYLES}
          value={budget.barStyle}
          onChange={(val) => updateBudget({ barStyle: val as BarStyle })}
          labels={BAR_STYLE_LABELS}
        />
      </View>

      <View className="py-3 border-b border-slate-100">
        <Text className="text-sm text-slate-700 mb-2">Rentals Level</Text>
        <InlinePicker
          options={RENTAL_LEVELS}
          value={budget.rentalsLevel}
          onChange={(val) => updateBudget({ rentalsLevel: val as RentalLevel })}
          labels={RENTAL_LEVEL_LABELS}
        />
      </View>

      <SettingRow label="Wedding Planner">
        <Switch
          value={budget.planner}
          onValueChange={(val: boolean) => updateBudget({ planner: val })}
          trackColor={{ false: "#e2e8f0", true: "#99f6e4" }}
          thumbColor={budget.planner ? "#0d9488" : "#f8fafc"}
        />
      </SettingRow>

      {/* Data Management */}
      <SectionHeader title="Data Management" />

      <View className="bg-white rounded-xl border border-slate-200 p-4 mt-1">
        <View className="flex-row items-center mb-3">
          <Ionicons name="information-circle-outline" size={18} color="#64748b" />
          <Text className="text-xs text-slate-500 ml-2">
            {options.length} option{options.length !== 1 ? "s" : ""} saved locally
          </Text>
        </View>

        <Pressable
          onPress={handleLoadSample}
          className="flex-row items-center justify-center py-3 rounded-xl bg-teal-600 mb-3"
        >
          <Ionicons name="download-outline" size={18} color="#ffffff" />
          <Text className="ml-2 text-sm font-semibold text-white">
            Load Sample Data
          </Text>
        </Pressable>

        <Pressable
          onPress={handleClearAll}
          className="flex-row items-center justify-center py-3 rounded-xl border border-red-200 bg-red-50"
        >
          <Ionicons name="trash-outline" size={18} color="#ef4444" />
          <Text className="ml-2 text-sm font-semibold text-red-600">
            Clear All Data
          </Text>
        </Pressable>
      </View>

      {/* App Info */}
      <View className="mt-8 items-center">
        <Text className="text-xs text-slate-400">
          Wedding Research Engine v0.1.0
        </Text>
      </View>
    </ScrollView>
  );
}
