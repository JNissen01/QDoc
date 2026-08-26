"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, Pencil, Plus, ScanLine, Search, Trash2, X } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/shell";
import {
  CheckBox,
  Chip,
  Field,
  InfoNote,
  PrimaryButton,
  SearchField,
  SelectorCard,
  StepFooter,
} from "@/components/onboarding/primitives";
import { useStepNav } from "@/components/onboarding/use-step-nav";
import {
  COMMON_ALLERGIES,
  COMMON_CONDITIONS,
  COMMON_MEDICATIONS,
  delay,
  MEDICATION_DOSAGES,
  MEDICATION_FREQUENCIES,
  MOCK_MEDICATION,
} from "@/lib/mocks";
import type { HistoryCategory, Medication } from "@/lib/onboarding-state";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const HISTORY_OPTIONS: {
  value: HistoryCategory;
  title: string;
  description?: string;
}[] = [
  {
    value: "medications",
    title: "Medications",
    description: "Prescriptions, OTC drugs, or supplements",
  },
  {
    value: "allergies",
    title: "Allergies",
    description: "Drug, food, or environmental allergies",
  },
  {
    value: "conditions",
    title: "Ongoing conditions",
    description: "Diagnoses you’re currently managing",
  },
  {
    value: "surgeries",
    title: "Past surgeries",
    description: "Any prior procedures or operations",
  },
  { value: "none", title: "None of these apply to me" },
];

export function MedicalHistoryStep() {
  const { state, update, goNext } = useStepNav("medical-history");
  const selected = state.historyCategories;

  function toggle(category: HistoryCategory) {
    if (category === "none") {
      update({ historyCategories: selected.includes("none") ? [] : ["none"] });
      return;
    }
    const withoutNone = selected.filter((item) => item !== "none");
    const next = withoutNone.includes(category)
      ? withoutNone.filter((item) => item !== category)
      : [...withoutNone, category];
    update({ historyCategories: next });
  }

  return (
    <OnboardingShell
      step="medical-history"
      title="What does your medical history look like?"
      subtitle="Select all categories that apply to your medical history. We will only ask about what’s relevant to you."
      footer={
        <StepFooter onSkip={() => goNext()}>
          <PrimaryButton
            disabled={selected.length === 0}
            onClick={() => goNext()}
          >
            Continue
          </PrimaryButton>
        </StepFooter>
      }
    >
      <div className="space-y-3">
        {HISTORY_OPTIONS.map((option) => (
          <SelectorCard
            key={option.value}
            selected={selected.includes(option.value)}
            title={option.title}
            description={option.description}
            leading={<CheckBox selected={selected.includes(option.value)} />}
            trailing={null}
            variant="choice"
            onClick={() => toggle(option.value)}
          />
        ))}
      </div>
      <div className="mt-5">
        <InfoNote>You can always add more later from your profile.</InfoNote>
      </div>
    </OnboardingShell>
  );
}

type FrequencyOption = (typeof MEDICATION_FREQUENCIES)[number];

function emptyMedication(name = ""): Medication {
  return {
    id: crypto.randomUUID(),
    name,
    dosage: "",
    frequency: "",
  };
}

function isMedicationComplete(medication: Medication) {
  return Boolean(
    medication.name.trim() &&
      medication.dosage.trim() &&
      medication.frequency.trim(),
  );
}

function isPresetDosage(value: string) {
  return MEDICATION_DOSAGES.includes(value);
}

function isPresetFrequency(value: string): value is FrequencyOption {
  return (MEDICATION_FREQUENCIES as readonly string[]).includes(value);
}

function SoftChip({
  selected,
  children,
  onClick,
  onRemove,
  removeLabel,
}: {
  selected?: boolean;
  children: ReactNode;
  onClick: () => void;
  onRemove?: () => void;
  removeLabel?: string;
}) {
  const chipClass = cn(
    "rounded-[0.625rem] px-3.5 py-2 text-[14px] leading-[18px] font-medium transition-colors",
    selected
      ? "bg-action text-white"
      : "border border-line bg-white text-ink",
  );

  if (!onRemove) {
    return (
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={onClick}
        className={chipClass}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={cn(chipClass, "inline-flex flex-row items-center gap-1")}>
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={onClick}
        className="min-w-0"
      >
        {children}
      </button>
      <button
        type="button"
        aria-label={removeLabel ?? "Remove"}
        className={cn(
          "-mr-0.5 inline-flex shrink-0 items-center justify-center",
          selected ? "text-white" : "text-ink",
        )}
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onRemove();
        }}
      >
        <X className="size-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}

function FrequencySegmented({
  value,
  onChange,
}: {
  value: FrequencyOption | null;
  onChange: (value: FrequencyOption) => void;
}) {
  return (
    <div
      className="flex h-12 shrink-0 items-center self-stretch rounded-[12px] border border-line bg-white p-1"
      role="group"
      aria-label="Frequency"
    >
      {MEDICATION_FREQUENCIES.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={cn(
              "flex h-full flex-1 items-center justify-center rounded-[10px] px-1.5 text-center text-[13px] leading-[16px] font-medium transition-colors",
              selected ? "bg-action text-white" : "bg-transparent text-ink",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function ClearableInput({
  label,
  value,
  placeholder,
  onChange,
  onClear,
  onConfirm,
  size = "default",
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onConfirm?: () => void;
  size?: "default" | "compact";
}) {
  const hasValue = value.trim().length > 0;
  const showConfirm = Boolean(onConfirm) && hasValue;

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-[13px] leading-4 font-normal text-ink">
        {label}
      </Label>
      <div className="relative">
        <Input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && showConfirm) {
              event.preventDefault();
              onConfirm?.();
            }
          }}
          className={cn(
            "rounded-[14px] border border-line bg-white py-0 pl-4 pr-11 text-[16px] leading-[22px] text-ink shadow-none placeholder:text-fog focus-visible:border-2 focus-visible:border-action focus-visible:ring-0 md:text-[16px]",
            size === "compact" ? "h-[42px]" : "h-[70px]",
          )}
        />
        <div className="absolute inset-y-0 right-1.5 flex items-center">
          {showConfirm ? (
            <button
              type="button"
              aria-label={`Confirm ${label}`}
              onClick={onConfirm}
              className="flex size-7 items-center justify-center text-action"
            >
              <ArrowRight className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              aria-label={`Close ${label}`}
              onClick={onClear}
              className="flex size-7 items-center justify-center text-caption"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MedicationEntryCard({
  draft,
  onChange,
  onDismiss,
  onSave,
}: {
  draft: Medication;
  onChange: (next: Medication) => void;
  onDismiss: () => void;
  onSave: () => void;
}) {
  const presetDosage = isPresetDosage(draft.dosage);
  const presetFrequency = isPresetFrequency(draft.frequency);
  const [showCustomDosage, setShowCustomDosage] = useState(
    Boolean(draft.dosage) && !presetDosage,
  );
  const [showCustomFrequency, setShowCustomFrequency] = useState(
    Boolean(draft.frequency) && !presetFrequency,
  );
  const [customDosage, setCustomDosage] = useState(
    presetDosage ? "" : draft.dosage,
  );
  const [customFrequency, setCustomFrequency] = useState(
    presetFrequency ? "" : draft.frequency,
  );

  return (
    <div className="rounded-[14px] border border-line bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <p className="text-[18px] leading-6 font-semibold text-ink">
          {draft.name}
        </p>
        <button
          type="button"
          className="shrink-0 text-caption"
          onClick={onDismiss}
          aria-label="Cancel medication entry"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-2 text-[13px] leading-4 text-ink">Dosage</p>
          <div className="flex flex-wrap gap-2">
            {MEDICATION_DOSAGES.map((dosage) => (
              <SoftChip
                key={dosage}
                selected={draft.dosage === dosage && !showCustomDosage}
                onClick={() => {
                  setShowCustomDosage(false);
                  setCustomDosage("");
                  onChange({ ...draft, dosage });
                }}
              >
                {dosage}
              </SoftChip>
            ))}
            {!showCustomDosage &&
            draft.dosage &&
            !isPresetDosage(draft.dosage) ? (
              <SoftChip
                selected
                onClick={() => {
                  setCustomDosage(draft.dosage);
                  setShowCustomDosage(true);
                }}
                onRemove={() => {
                  setCustomDosage("");
                  setShowCustomDosage(false);
                  onChange({ ...draft, dosage: "" });
                }}
                removeLabel="Remove custom dosage"
              >
                {draft.dosage}
              </SoftChip>
            ) : null}
          </div>
          {showCustomDosage ? (
            <div className="mt-3">
              <ClearableInput
                label="Custom Dosage"
                size="compact"
                value={customDosage}
                placeholder="e.g. 10mg"
                onChange={(value) => {
                  setCustomDosage(value);
                  onChange({ ...draft, dosage: value });
                }}
                onClear={() => {
                  setCustomDosage("");
                  setShowCustomDosage(false);
                  onChange({
                    ...draft,
                    dosage: isPresetDosage(draft.dosage) ? draft.dosage : "",
                  });
                }}
                onConfirm={() => {
                  const value = customDosage.trim();
                  if (!value) return;
                  setCustomDosage(value);
                  setShowCustomDosage(false);
                  onChange({ ...draft, dosage: value });
                }}
              />
            </div>
          ) : (
            <button
              type="button"
              className="mt-3 text-[15px] font-semibold text-action"
              onClick={() => {
                if (draft.dosage && !isPresetDosage(draft.dosage)) {
                  setCustomDosage(draft.dosage);
                }
                setShowCustomDosage(true);
              }}
            >
              + Add Custom Dosage
            </button>
          )}
        </div>

        <div>
          <p className="mb-2 text-[13px] leading-4 text-ink">Frequency</p>
          <FrequencySegmented
            value={
              showCustomFrequency || !presetFrequency
                ? null
                : (draft.frequency as FrequencyOption)
            }
            onChange={(frequency) => {
              setShowCustomFrequency(false);
              setCustomFrequency("");
              onChange({ ...draft, frequency });
            }}
          />
          {!showCustomFrequency &&
          draft.frequency &&
          !isPresetFrequency(draft.frequency) ? (
            <div className="mt-2 flex flex-wrap gap-2">
              <SoftChip
                selected
                onClick={() => {
                  setCustomFrequency(draft.frequency);
                  setShowCustomFrequency(true);
                }}
                onRemove={() => {
                  setCustomFrequency("");
                  setShowCustomFrequency(false);
                  onChange({ ...draft, frequency: "" });
                }}
                removeLabel="Remove custom frequency"
              >
                {draft.frequency}
              </SoftChip>
            </div>
          ) : null}
          {showCustomFrequency ? (
            <div className="mt-3">
              <ClearableInput
                label="Custom Frequency"
                size="compact"
                value={customFrequency}
                placeholder="e.g. Before activity"
                onChange={(value) => {
                  setCustomFrequency(value);
                  onChange({ ...draft, frequency: value });
                }}
                onClear={() => {
                  setCustomFrequency("");
                  setShowCustomFrequency(false);
                  onChange({
                    ...draft,
                    frequency: isPresetFrequency(draft.frequency)
                      ? draft.frequency
                      : "",
                  });
                }}
                onConfirm={() => {
                  const value = customFrequency.trim();
                  if (!value) return;
                  setCustomFrequency(value);
                  setShowCustomFrequency(false);
                  onChange({ ...draft, frequency: value });
                }}
              />
            </div>
          ) : (
            <button
              type="button"
              className="mt-3 text-[15px] font-semibold text-action"
              onClick={() => {
                if (draft.frequency && !isPresetFrequency(draft.frequency)) {
                  setCustomFrequency(draft.frequency);
                }
                setShowCustomFrequency(true);
              }}
            >
              + Add Custom Frequency
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 text-[16px] font-semibold text-action disabled:text-caption"
        disabled={!isMedicationComplete(draft)}
        onClick={onSave}
      >
        <span className="flex size-[18px] items-center justify-center rounded-full bg-action text-white">
          <Plus className="size-[11px]" strokeWidth={2.5} />
        </span>
        Add medication
      </button>
    </div>
  );
}

function MedicationSearchBlock({
  query,
  onQueryChange,
  onCommitName,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onCommitName: (name: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[13px] leading-4 font-normal text-ink">
        Medication name
      </p>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-caption" />
        <Input
          value={query}
          placeholder="e.g. Lexapro"
          onChange={(event) => onQueryChange(event.target.value)}
          onBlur={() => {
            const value = query.trim();
            if (value) onCommitName(value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              const value = query.trim();
              if (value) onCommitName(value);
            }
          }}
          className="h-[70px] rounded-[14px] border border-line bg-white pr-4 pl-11 text-[16px] leading-[22px] text-ink shadow-none placeholder:text-fog focus-visible:border-2 focus-visible:border-action focus-visible:ring-0 md:text-[16px]"
        />
      </div>
      <p className="mt-5 mb-2 text-[13px] leading-4 font-normal text-ink">
        Common medications
      </p>
      <div className="flex flex-wrap gap-2">
        {COMMON_MEDICATIONS.map((medication) => (
          <SoftChip
            key={medication}
            onClick={() => onCommitName(medication)}
          >
            {medication}
          </SoftChip>
        ))}
      </div>
    </div>
  );
}

export function MedicationsStep() {
  const { state, update, goNext } = useStepNav("medications");
  const [draft, setDraft] = useState<Medication | null>(null);
  const [query, setQuery] = useState("");
  const [scanning, setScanning] = useState(false);

  function openEntry(name: string, existing?: Medication) {
    const trimmed = name.trim();
    if (!trimmed && !existing) return;
    setQuery("");
    if (existing) {
      setDraft({ ...existing });
      return;
    }
    setDraft(emptyMedication(trimmed));
  }

  function saveDraft() {
    if (!draft || !isMedicationComplete(draft)) return;
    const next: Medication = {
      ...draft,
      name: draft.name.trim(),
      dosage: draft.dosage.trim(),
      frequency: draft.frequency.trim(),
    };
    const exists = state.medications.some((item) => item.id === next.id);
    const medications = exists
      ? state.medications.map((item) => (item.id === next.id ? next : item))
      : [...state.medications, next];
    update({ medications });
    setDraft(null);
  }

  async function scanMedication() {
    setScanning(true);
    await delay(1000);
    setDraft({
      ...emptyMedication(),
      ...MOCK_MEDICATION,
    });
    setQuery("");
    setScanning(false);
  }

  function remove(id: string) {
    update({
      medications: state.medications.filter((item) => item.id !== id),
    });
  }

  const listedMedications = state.medications.filter(
    (medication) => draft?.id !== medication.id,
  );

  return (
    <OnboardingShell
      step="medications"
      title="What medications are you currently taking?"
      subtitle="Enter the name, dosage and frequency of your current medications or scan the label to enter automatically."
      footer={
        <StepFooter hideSkip>
          <PrimaryButton
            disabled={state.medications.length === 0}
            onClick={() => goNext()}
          >
            Continue
          </PrimaryButton>
        </StepFooter>
      }
    >
      <button
        type="button"
        className="mb-5 inline-flex items-center gap-2 text-[16px] font-semibold text-action disabled:text-caption"
        disabled={scanning}
        onClick={scanMedication}
      >
        <ScanLine className="size-4" />
        {scanning ? "Scanning label…" : "Scan Medication"}
      </button>

      {listedMedications.length > 0 && !draft ? (
        <div className="mb-4 space-y-3">
          {listedMedications.map((medication) => (
            <div
              key={medication.id}
              className="flex items-center justify-between rounded-[14px] border border-line bg-white px-4 py-3"
            >
              <div>
                <p className="text-[16px] font-semibold text-ink">
                  {medication.name}
                </p>
                <p className="text-[14px] text-body">
                  {[medication.dosage, medication.frequency]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  aria-label="Edit medication"
                  onClick={() => openEntry(medication.name, medication)}
                  className="text-caption"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Delete medication"
                  onClick={() => remove(medication.id)}
                  className="text-danger"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {draft ? (
        <MedicationEntryCard
          key={draft.id}
          draft={draft}
          onChange={setDraft}
          onDismiss={() => setDraft(null)}
          onSave={saveDraft}
        />
      ) : (
        <MedicationSearchBlock
          query={query}
          onQueryChange={setQuery}
          onCommitName={(name) => openEntry(name)}
        />
      )}
    </OnboardingShell>
  );
}

export function AllergiesStep() {
  const { state, update, goNext } = useStepNav("allergies");
  const [query, setQuery] = useState("");

  function toggle(allergy: string) {
    const allergies = state.allergies.includes(allergy)
      ? state.allergies.filter((item) => item !== allergy)
      : [...state.allergies, allergy];
    update({ allergies });
  }

  function addQuery() {
    const value = query.trim();
    if (!value) return;
    if (!state.allergies.includes(value)) {
      update({ allergies: [...state.allergies, value] });
    }
    setQuery("");
  }

  return (
    <OnboardingShell
      step="allergies"
      title="Any allergies we should know about?"
      subtitle="Search or pick common allergens. You can skip this if nothing applies."
      footer={
        <StepFooter onSkip={() => goNext()}>
          <PrimaryButton onClick={() => goNext()}>Next</PrimaryButton>
        </StepFooter>
      }
    >
      <div>
        <p className="mb-2 text-[13px] leading-4 font-normal text-body">Allergen</p>
        <SearchField
          placeholder="e.g. Peanuts"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addQuery();
            }
          }}
        />
        {query.trim() ? (
          <button
            type="button"
            className="mt-2 text-[14px] font-semibold text-action"
            onClick={addQuery}
          >
            Add “{query.trim()}”
          </button>
        ) : null}
        {state.allergies.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {state.allergies.map((allergy) => (
              <Chip key={allergy} selected onClick={() => toggle(allergy)}>
                {allergy} ×
              </Chip>
            ))}
          </div>
        ) : null}
        <p className="mt-5 mb-2 text-[13px] leading-4 font-normal text-body">
          Common allergies
        </p>
        <div className="flex flex-wrap gap-2">
          {COMMON_ALLERGIES.map((allergy) => (
            <Chip
              key={allergy}
              selected={state.allergies.includes(allergy)}
              onClick={() => toggle(allergy)}
            >
              {allergy}
            </Chip>
          ))}
        </div>
      </div>
    </OnboardingShell>
  );
}

export function ConditionsStep() {
  const { state, update, goNext } = useStepNav("conditions");
  const [conditionQuery, setConditionQuery] = useState("");
  const [surgery, setSurgery] = useState("");
  const showConditions = state.historyCategories.includes("conditions");
  const showSurgeries = state.historyCategories.includes("surgeries");

  function toggleCondition(value: string) {
    const conditions = state.conditions.includes(value)
      ? state.conditions.filter((item) => item !== value)
      : [...state.conditions, value];
    update({ conditions });
  }

  return (
    <OnboardingShell
      step="conditions"
      title="Conditions and surgeries"
      subtitle="Add only what you want your provider to see for this visit."
      footer={
        <StepFooter onSkip={() => goNext()}>
          <PrimaryButton onClick={() => goNext()}>Continue</PrimaryButton>
        </StepFooter>
      }
    >
      <div className="space-y-6 text-left">
        {showConditions ? (
          <div>
            <p className="mb-2 text-[16px] font-medium text-ink">
              Ongoing conditions
            </p>
            <Field
              placeholder="Add a condition"
              value={conditionQuery}
              onChange={(event) => setConditionQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && conditionQuery.trim()) {
                  event.preventDefault();
                  toggleCondition(conditionQuery.trim());
                  setConditionQuery("");
                }
              }}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {COMMON_CONDITIONS.map((condition) => (
                <Chip
                  key={condition}
                  selected={state.conditions.includes(condition)}
                  onClick={() => toggleCondition(condition)}
                >
                  {condition}
                </Chip>
              ))}
            </div>
          </div>
        ) : null}
        {showSurgeries ? (
          <div>
            <p className="mb-2 text-[16px] font-medium text-ink">
              Past surgeries
            </p>
            <Field
              placeholder="e.g. Appendectomy, 2019"
              value={surgery}
              onChange={(event) => setSurgery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && surgery.trim()) {
                  event.preventDefault();
                  update({ surgeries: [...state.surgeries, surgery.trim()] });
                  setSurgery("");
                }
              }}
            />
            <button
              type="button"
              className="mt-2 text-[14px] font-semibold text-action"
              onClick={() => {
                if (!surgery.trim()) return;
                update({ surgeries: [...state.surgeries, surgery.trim()] });
                setSurgery("");
              }}
            >
              Add surgery
            </button>
            <ul className="mt-3 space-y-2">
              {state.surgeries.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="flex items-center justify-between rounded-[14px] border border-line bg-white px-4 py-3 text-[16px] text-ink"
                >
                  {item}
                  <button
                    type="button"
                    className="text-danger"
                    onClick={() =>
                      update({
                        surgeries: state.surgeries.filter((_, i) => i !== index),
                      })
                    }
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </OnboardingShell>
  );
}
