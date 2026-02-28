"use client";

import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { OPTION_TYPES, ISLANDS, STATUSES, TRI_STATE, NOISE_LEVELS, COST_CONFIDENCE } from "@/lib/constants";
import { OptionCreateSchema } from "@/lib/schemas";
import type { WeddingOption, OptionCreate, OptionImage } from "@/lib/types";
import { useOptionStore } from "@/store/useOptionStore";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";

interface OptionFormProps {
  open: boolean;
  onClose: () => void;
  editOption?: WeddingOption;
}

function emptyForm(): OptionCreate {
  return {
    name: "",
    type: "EVENT_FRIENDLY_RENTAL",
    island: "Maui",
    area: "",
    addressText: "",
    mapsUrl: "",
    sourceLinks: [],
    guestCapacitySeated: undefined,
    guestCapacityStanding: undefined,
    ceremonyOnSite: "unknown",
    receptionOnSite: "unknown",
    curfewTime: "",
    noiseRisk: "unknown",
    parkingNotes: "",
    costRangeLow: undefined,
    costRangeHigh: undefined,
    costConfidence: "low",
    costNotes: "",
    pros: [],
    cons: [],
    questionsToAsk: [],
    tags: [],
    images: [],
    photoRating: undefined,
    status: "RESEARCHING",
    notes: "",
  };
}

export function OptionForm({ open, onClose, editOption }: OptionFormProps) {
  const { addOption, updateOption } = useOptionStore();
  const [form, setForm] = useState<OptionCreate>(emptyForm());
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Temp fields for list inputs
  const [sourceLink, setSourceLink] = useState("");
  const [pro, setPro] = useState("");
  const [con, setCon] = useState("");
  const [question, setQuestion] = useState("");
  const [tag, setTag] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");

  useEffect(() => {
    if (editOption) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, ...rest } = editOption;
      setForm(rest as OptionCreate);
    } else {
      setForm(emptyForm());
    }
    setErrors({});
  }, [editOption, open]);

  const set = <K extends keyof OptionCreate>(key: K, val: OptionCreate[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = OptionCreateSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        fieldErrors[path] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    if (editOption) {
      await updateOption(editOption.id, result.data);
    } else {
      await addOption(result.data);
    }
    onClose();
  };

  const addToList = (
    key: "sourceLinks" | "pros" | "cons" | "questionsToAsk" | "tags",
    value: string,
    clear: () => void
  ) => {
    if (!value.trim()) return;
    set(key, [...(form[key] as string[]), value.trim()]);
    clear();
  };

  const removeFromList = (
    key: "sourceLinks" | "pros" | "cons" | "questionsToAsk" | "tags",
    index: number
  ) => {
    set(
      key,
      (form[key] as string[]).filter((_, i) => i !== index)
    );
  };

  const addImage = () => {
    if (!imageUrl.trim()) return;
    const img: OptionImage = {
      id: nanoid(),
      url: imageUrl.trim(),
      caption: imageCaption.trim() || undefined,
    };
    set("images", [...form.images, img]);
    setImageUrl("");
    setImageCaption("");
  };

  const removeImage = (id: string) => {
    set("images", form.images.filter((i) => i.id !== id));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editOption ? "Edit Option" : "Add Option"}
      className="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-6 overflow-y-auto pr-2">
        {/* Basic Info */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-gray-900">Basic Info</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              id="name"
              label="Name *"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              error={errors.name}
            />
            <Select
              id="type"
              label="Type *"
              value={form.type}
              onChange={(e) => set("type", e.target.value as OptionCreate["type"])}
              options={Object.entries(OPTION_TYPES).map(([k, v]) => ({
                value: k,
                label: v,
              }))}
            />
            <Select
              id="island"
              label="Island *"
              value={form.island}
              onChange={(e) => set("island", e.target.value)}
              options={ISLANDS.map((i) => ({ value: i, label: i }))}
            />
            <Input
              id="area"
              label="Area"
              value={form.area}
              onChange={(e) => set("area", e.target.value)}
              placeholder="e.g. Wailea, North Shore"
            />
            <Select
              id="status"
              label="Status"
              value={form.status}
              onChange={(e) => set("status", e.target.value as OptionCreate["status"])}
              options={Object.entries(STATUSES).map(([k, v]) => ({
                value: k,
                label: v,
              }))}
            />
          </div>
          <Input
            id="address"
            label="Address"
            value={form.addressText ?? ""}
            onChange={(e) => set("addressText", e.target.value)}
          />
          <Input
            id="mapsUrl"
            label="Google Maps URL"
            value={form.mapsUrl ?? ""}
            onChange={(e) => set("mapsUrl", e.target.value)}
          />
        </fieldset>

        {/* Capacity & Logistics */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-gray-900">Capacity & Logistics</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              id="capSeated"
              label="Guest Capacity (Seated)"
              type="number"
              value={form.guestCapacitySeated ?? ""}
              onChange={(e) =>
                set("guestCapacitySeated", e.target.value ? Number(e.target.value) : undefined)
              }
            />
            <Input
              id="capStanding"
              label="Guest Capacity (Standing)"
              type="number"
              value={form.guestCapacityStanding ?? ""}
              onChange={(e) =>
                set("guestCapacityStanding", e.target.value ? Number(e.target.value) : undefined)
              }
            />
            <Select
              id="ceremony"
              label="Ceremony On-Site"
              value={form.ceremonyOnSite}
              onChange={(e) => set("ceremonyOnSite", e.target.value as "yes" | "no" | "unknown")}
              options={TRI_STATE.map((v) => ({
                value: v,
                label: v === "yes" ? "Yes" : v === "no" ? "No" : "Unknown",
              }))}
            />
            <Select
              id="reception"
              label="Reception On-Site"
              value={form.receptionOnSite}
              onChange={(e) => set("receptionOnSite", e.target.value as "yes" | "no" | "unknown")}
              options={TRI_STATE.map((v) => ({
                value: v,
                label: v === "yes" ? "Yes" : v === "no" ? "No" : "Unknown",
              }))}
            />
            <Input
              id="curfew"
              label="Curfew Time"
              value={form.curfewTime ?? ""}
              onChange={(e) => set("curfewTime", e.target.value)}
              placeholder="e.g. 10:00 PM"
            />
            <Select
              id="noise"
              label="Noise Risk"
              value={form.noiseRisk}
              onChange={(e) => set("noiseRisk", e.target.value as OptionCreate["noiseRisk"])}
              options={NOISE_LEVELS.map((v) => ({
                value: v,
                label: v.charAt(0).toUpperCase() + v.slice(1),
              }))}
            />
          </div>
          <Input
            id="parking"
            label="Parking Notes"
            value={form.parkingNotes ?? ""}
            onChange={(e) => set("parkingNotes", e.target.value)}
          />
        </fieldset>

        {/* Cost */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-gray-900">Cost</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              id="costLow"
              label="Cost Range Low ($)"
              type="number"
              value={form.costRangeLow ?? ""}
              onChange={(e) =>
                set("costRangeLow", e.target.value ? Number(e.target.value) : undefined)
              }
            />
            <Input
              id="costHigh"
              label="Cost Range High ($)"
              type="number"
              value={form.costRangeHigh ?? ""}
              onChange={(e) =>
                set("costRangeHigh", e.target.value ? Number(e.target.value) : undefined)
              }
            />
            <Select
              id="costConf"
              label="Cost Confidence"
              value={form.costConfidence}
              onChange={(e) =>
                set("costConfidence", e.target.value as OptionCreate["costConfidence"])
              }
              options={COST_CONFIDENCE.map((v) => ({
                value: v,
                label: v.charAt(0).toUpperCase() + v.slice(1),
              }))}
            />
          </div>
          <Textarea
            id="costNotes"
            label="Cost Notes"
            value={form.costNotes ?? ""}
            onChange={(e) => set("costNotes", e.target.value)}
            rows={2}
          />
        </fieldset>

        {/* Photo Rating */}
        <fieldset>
          <Rating
            label="Photo / Visibility Potential"
            value={form.photoRating}
            onChange={(v) => set("photoRating", v === 0 ? undefined : v)}
          />
        </fieldset>

        {/* Notes */}
        <fieldset>
          <Textarea
            id="notes"
            label="Notes"
            value={form.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
            rows={3}
          />
        </fieldset>

        {/* Source Links */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-gray-900">Source Links</legend>
          <div className="flex gap-2">
            <Input
              value={sourceLink}
              onChange={(e) => setSourceLink(e.target.value)}
              placeholder="https://..."
              className="flex-1"
            />
            <Button type="button" variant="secondary" size="sm" onClick={() => addToList("sourceLinks", sourceLink, () => setSourceLink(""))}>
              Add
            </Button>
          </div>
          <ul className="space-y-1">
            {form.sourceLinks.map((link, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <a href={link} target="_blank" rel="noopener noreferrer" className="truncate text-blue-600 hover:underline">
                  {link}
                </a>
                <button type="button" onClick={() => removeFromList("sourceLinks", i)} className="text-red-500 hover:text-red-700">
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </fieldset>

        {/* Pros */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-gray-900">Pros</legend>
          <div className="flex gap-2">
            <Input value={pro} onChange={(e) => setPro(e.target.value)} placeholder="Add a pro" className="flex-1" />
            <Button type="button" variant="secondary" size="sm" onClick={() => addToList("pros", pro, () => setPro(""))}>
              Add
            </Button>
          </div>
          <ul className="space-y-1">
            {form.pros.map((p, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-green-700">
                + {p}
                <button type="button" onClick={() => removeFromList("pros", i)} className="text-red-500 hover:text-red-700">&times;</button>
              </li>
            ))}
          </ul>
        </fieldset>

        {/* Cons */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-gray-900">Cons</legend>
          <div className="flex gap-2">
            <Input value={con} onChange={(e) => setCon(e.target.value)} placeholder="Add a con" className="flex-1" />
            <Button type="button" variant="secondary" size="sm" onClick={() => addToList("cons", con, () => setCon(""))}>
              Add
            </Button>
          </div>
          <ul className="space-y-1">
            {form.cons.map((c, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-red-700">
                - {c}
                <button type="button" onClick={() => removeFromList("cons", i)} className="text-red-500 hover:text-red-700">&times;</button>
              </li>
            ))}
          </ul>
        </fieldset>

        {/* Questions */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-gray-900">Questions to Ask</legend>
          <div className="flex gap-2">
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Add a question" className="flex-1" />
            <Button type="button" variant="secondary" size="sm" onClick={() => addToList("questionsToAsk", question, () => setQuestion(""))}>
              Add
            </Button>
          </div>
          <ul className="space-y-1">
            {form.questionsToAsk.map((q, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                ? {q}
                <button type="button" onClick={() => removeFromList("questionsToAsk", i)} className="text-red-500 hover:text-red-700">&times;</button>
              </li>
            ))}
          </ul>
        </fieldset>

        {/* Tags */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-gray-900">Tags</legend>
          <div className="flex gap-2">
            <Input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Add a tag" className="flex-1" />
            <Button type="button" variant="secondary" size="sm" onClick={() => addToList("tags", tag, () => setTag(""))}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {form.tags.map((t, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs">
                {t}
                <button type="button" onClick={() => removeFromList("tags", i)} className="text-red-500 hover:text-red-700">&times;</button>
              </span>
            ))}
          </div>
        </fieldset>

        {/* Images */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-gray-900">Images</legend>
          <div className="flex gap-2">
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" className="flex-1" />
            <Input value={imageCaption} onChange={(e) => setImageCaption(e.target.value)} placeholder="Caption (optional)" className="w-40" />
            <Button type="button" variant="secondary" size="sm" onClick={addImage}>
              Add
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {form.images.map((img) => (
              <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img src={img.url} alt={img.caption ?? ""} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Submit */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {editOption ? "Save Changes" : "Add Option"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
