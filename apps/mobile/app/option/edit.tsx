import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  useOptionStore,
  OPTION_TYPES,
  STATUSES,
  TRI_STATE,
  NOISE_LEVELS,
  COST_CONFIDENCE,
  OptionCreateSchema,
  type OptionTypeKey,
  type StatusKey,
  type TriState,
  type NoiseLevel,
  type CostConfidence,
} from "@wedding/shared";
import { StarRating } from "../../components/ui/StarRating";

// ── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <Text className="text-sm font-bold text-slate-500 uppercase tracking-wide mt-5 mb-2">
      {text}
    </Text>
  );
}

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <Text className="text-sm font-medium text-slate-700 mb-1">
      {text}
      {required && <Text className="text-red-500"> *</Text>}
    </Text>
  );
}

interface PickerRowProps<T extends string> {
  options: readonly T[] | Record<string, string>;
  value: T;
  onChange: (val: T) => void;
  labels?: Record<string, string>;
}

function PickerRow<T extends string>({
  options,
  value,
  onChange,
  labels,
}: PickerRowProps<T>) {
  const entries: [string, string][] = Array.isArray(options)
    ? options.map((o) => [o, labels?.[o] ?? o])
    : Object.entries(options);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 pb-1"
    >
      {entries.map(([key, label]) => {
        const active = value === key;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key as T)}
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
              numberOfLines={1}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// ── Dynamic list (for pros, cons, questions, tags) ──────────────────────────

function DynamicList({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  const addItem = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setDraft("");
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <View>
      {items.map((item, i) => (
        <View key={i} className="flex-row items-center bg-slate-50 rounded-lg px-3 py-2 mb-1.5">
          <Text className="text-sm text-slate-700 flex-1">{item}</Text>
          <Pressable onPress={() => removeItem(i)} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color="#ef4444" />
          </Pressable>
        </View>
      ))}
      <View className="flex-row items-center gap-2">
        <TextInput
          className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900"
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={addItem}
          returnKeyType="done"
        />
        <Pressable
          onPress={addItem}
          className="w-9 h-9 bg-teal-600 rounded-lg items-center justify-center"
        >
          <Ionicons name="add" size={20} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

// ── Main Screen ─────────────────────────────────────────────────────────────

export default function EditOptionScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const existing = useOptionStore((s) => (id ? s.getOption(id) : undefined));
  const addOption = useOptionStore((s) => s.addOption);
  const updateOption = useOptionStore((s) => s.updateOption);

  const isEdit = !!id && !!existing;
  const title = isEdit ? "Edit Option" : "Add Option";

  // ── Form state ─────────────────────────────────────────────────────────────

  const [name, setName] = useState("");
  const [type, setType] = useState<OptionTypeKey>("EVENT_FRIENDLY_RENTAL");
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [status, setStatus] = useState<StatusKey>("RESEARCHING");
  const [seatedCap, setSeatedCap] = useState("");
  const [standingCap, setStandingCap] = useState("");
  const [ceremonyOnSite, setCeremonyOnSite] = useState<TriState>("unknown");
  const [receptionOnSite, setReceptionOnSite] = useState<TriState>("unknown");
  const [costLow, setCostLow] = useState("");
  const [costHigh, setCostHigh] = useState("");
  const [costConfidence, setCostConfidence] = useState<CostConfidence>("low");
  const [costNotes, setCostNotes] = useState("");
  const [noiseRisk, setNoiseRisk] = useState<NoiseLevel>("unknown");
  const [curfewTime, setCurfewTime] = useState("");
  const [parkingNotes, setParkingNotes] = useState("");
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [photoRating, setPhotoRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  // Populate form when editing
  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setType(existing.type as OptionTypeKey);
      setLocation(existing.location);
      setArea(existing.area);
      setStatus(existing.status as StatusKey);
      setSeatedCap(existing.guestCapacitySeated?.toString() ?? "");
      setStandingCap(existing.guestCapacityStanding?.toString() ?? "");
      setCeremonyOnSite(existing.ceremonyOnSite);
      setReceptionOnSite(existing.receptionOnSite);
      setCostLow(existing.costRangeLow?.toString() ?? "");
      setCostHigh(existing.costRangeHigh?.toString() ?? "");
      setCostConfidence(existing.costConfidence);
      setCostNotes(existing.costNotes ?? "");
      setNoiseRisk(existing.noiseRisk);
      setCurfewTime(existing.curfewTime ?? "");
      setParkingNotes(existing.parkingNotes ?? "");
      setPros([...existing.pros]);
      setCons([...existing.cons]);
      setQuestions([...existing.questionsToAsk]);
      setTags([...existing.tags]);
      setPhotoRating(existing.photoRating ?? 0);
      setNotes(existing.notes ?? "");
    }
  }, [existing]);

  const handleSave = useCallback(async () => {
    const data = {
      name: name.trim(),
      type,
      location: location.trim(),
      area: area.trim(),
      status,
      guestCapacitySeated: seatedCap ? parseInt(seatedCap, 10) : undefined,
      guestCapacityStanding: standingCap ? parseInt(standingCap, 10) : undefined,
      ceremonyOnSite,
      receptionOnSite,
      costRangeLow: costLow ? parseFloat(costLow) : undefined,
      costRangeHigh: costHigh ? parseFloat(costHigh) : undefined,
      costConfidence,
      costNotes: costNotes.trim() || undefined,
      noiseRisk,
      curfewTime: curfewTime.trim() || undefined,
      parkingNotes: parkingNotes.trim() || undefined,
      pros,
      cons,
      questionsToAsk: questions,
      tags,
      photoRating: photoRating > 0 ? photoRating : undefined,
      notes: notes.trim() || undefined,
      images: existing?.images ?? [],
      sourceLinks: existing?.sourceLinks ?? [],
      addressText: existing?.addressText ?? "",
      mapsUrl: existing?.mapsUrl ?? "",
    };

    const result = OptionCreateSchema.safeParse(data);
    if (!result.success) {
      const msgs = result.error.issues.map(
        (iss) => `${iss.path.join(".")}: ${iss.message}`
      );
      setErrors(msgs);
      Alert.alert("Validation Error", msgs.join("\n"));
      return;
    }

    try {
      if (isEdit && id) {
        await updateOption(id, result.data);
      } else {
        await addOption(result.data);
      }
      router.back();
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Failed to save");
    }
  }, [
    name, type, location, area, status, seatedCap, standingCap,
    ceremonyOnSite, receptionOnSite, costLow, costHigh, costConfidence,
    costNotes, noiseRisk, curfewTime, parkingNotes, pros, cons,
    questions, tags, photoRating, notes, existing, isEdit, id,
    addOption, updateOption, router,
  ]);

  const TRI_LABELS: Record<TriState, string> = {
    yes: "Yes",
    no: "No",
    unknown: "Unknown",
  };

  const NOISE_LABELS: Record<NoiseLevel, string> = {
    low: "Low",
    med: "Medium",
    high: "High",
    unknown: "Unknown",
  };

  const CONFIDENCE_LABELS: Record<CostConfidence, string> = {
    low: "Low",
    med: "Medium",
    high: "High",
  };

  return (
    <>
      <Stack.Screen options={{ title }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 bg-slate-50"
          contentContainerClassName="px-4 pb-10"
          keyboardShouldPersistTaps="handled"
        >
          {/* Errors */}
          {errors.length > 0 && (
            <View className="bg-red-50 border border-red-200 rounded-xl p-3 mt-3">
              {errors.map((e, i) => (
                <Text key={i} className="text-xs text-red-600">{e}</Text>
              ))}
            </View>
          )}

          {/* Basic Info */}
          <SectionLabel text="Basic Info" />

          <FieldLabel text="Name" required />
          <TextInput
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 mb-3"
            placeholder="e.g. Haiku Mill"
            placeholderTextColor="#94a3b8"
            value={name}
            onChangeText={setName}
          />

          <FieldLabel text="Type" />
          <View className="mb-3">
            <PickerRow
              options={OPTION_TYPES}
              value={type}
              onChange={(v) => setType(v as OptionTypeKey)}
            />
          </View>

          <FieldLabel text="Location" />
          <TextInput
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 mb-3"
            placeholder="e.g. Maui, Tuscany"
            placeholderTextColor="#94a3b8"
            value={location}
            onChangeText={setLocation}
          />

          <FieldLabel text="Area" />
          <TextInput
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 mb-3"
            placeholder="e.g. Wailea, Haiku"
            placeholderTextColor="#94a3b8"
            value={area}
            onChangeText={setArea}
          />

          <FieldLabel text="Status" />
          <View className="mb-3">
            <PickerRow
              options={STATUSES}
              value={status}
              onChange={(v) => setStatus(v as StatusKey)}
            />
          </View>

          {/* Capacity */}
          <SectionLabel text="Capacity" />

          <FieldLabel text="Guest Capacity (Seated)" />
          <TextInput
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 mb-3"
            placeholder="e.g. 100"
            placeholderTextColor="#94a3b8"
            keyboardType="number-pad"
            value={seatedCap}
            onChangeText={setSeatedCap}
          />

          <FieldLabel text="Guest Capacity (Standing)" />
          <TextInput
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 mb-3"
            placeholder="e.g. 150"
            placeholderTextColor="#94a3b8"
            keyboardType="number-pad"
            value={standingCap}
            onChangeText={setStandingCap}
          />

          <FieldLabel text="Ceremony On-Site" />
          <View className="mb-3">
            <PickerRow
              options={TRI_STATE}
              value={ceremonyOnSite}
              onChange={setCeremonyOnSite}
              labels={TRI_LABELS}
            />
          </View>

          <FieldLabel text="Reception On-Site" />
          <View className="mb-3">
            <PickerRow
              options={TRI_STATE}
              value={receptionOnSite}
              onChange={setReceptionOnSite}
              labels={TRI_LABELS}
            />
          </View>

          {/* Cost */}
          <SectionLabel text="Cost" />

          <View className="flex-row gap-3 mb-3">
            <View className="flex-1">
              <FieldLabel text="Cost Low ($)" />
              <TextInput
                className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                placeholder="0"
                placeholderTextColor="#94a3b8"
                keyboardType="number-pad"
                value={costLow}
                onChangeText={setCostLow}
              />
            </View>
            <View className="flex-1">
              <FieldLabel text="Cost High ($)" />
              <TextInput
                className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                placeholder="0"
                placeholderTextColor="#94a3b8"
                keyboardType="number-pad"
                value={costHigh}
                onChangeText={setCostHigh}
              />
            </View>
          </View>

          <FieldLabel text="Cost Confidence" />
          <View className="mb-3">
            <PickerRow
              options={COST_CONFIDENCE}
              value={costConfidence}
              onChange={setCostConfidence}
              labels={CONFIDENCE_LABELS}
            />
          </View>

          <FieldLabel text="Cost Notes" />
          <TextInput
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 mb-3"
            placeholder="Additional cost details..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={costNotes}
            onChangeText={setCostNotes}
          />

          {/* Logistics */}
          <SectionLabel text="Logistics" />

          <FieldLabel text="Noise Risk" />
          <View className="mb-3">
            <PickerRow
              options={NOISE_LEVELS}
              value={noiseRisk}
              onChange={setNoiseRisk}
              labels={NOISE_LABELS}
            />
          </View>

          <FieldLabel text="Curfew Time" />
          <TextInput
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 mb-3"
            placeholder="e.g. 10:00 PM"
            placeholderTextColor="#94a3b8"
            value={curfewTime}
            onChangeText={setCurfewTime}
          />

          <FieldLabel text="Parking Notes" />
          <TextInput
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 mb-3"
            placeholder="Parking details..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={2}
            textAlignVertical="top"
            value={parkingNotes}
            onChangeText={setParkingNotes}
          />

          {/* Pros / Cons / Questions / Tags */}
          <SectionLabel text="Pros" />
          <DynamicList items={pros} onChange={setPros} placeholder="Add a pro..." />

          <SectionLabel text="Cons" />
          <DynamicList items={cons} onChange={setCons} placeholder="Add a con..." />

          <SectionLabel text="Questions to Ask" />
          <DynamicList items={questions} onChange={setQuestions} placeholder="Add a question..." />

          <SectionLabel text="Tags" />
          <DynamicList items={tags} onChange={setTags} placeholder="Add a tag..." />

          {/* Photo Rating */}
          <SectionLabel text="Photo Rating" />
          <View className="mb-3">
            <StarRating
              value={photoRating}
              onChange={setPhotoRating}
              size="lg"
            />
          </View>

          {/* Notes */}
          <SectionLabel text="Notes" />
          <TextInput
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 mb-6"
            placeholder="Additional notes..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />

          {/* Save Button */}
          <Pressable
            onPress={handleSave}
            className="bg-teal-600 py-4 rounded-xl items-center mb-4"
          >
            <Text className="text-base font-bold text-white">
              {isEdit ? "Save Changes" : "Add Option"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            className="py-3 rounded-xl items-center border border-slate-200 bg-white"
          >
            <Text className="text-sm font-medium text-slate-600">Cancel</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
