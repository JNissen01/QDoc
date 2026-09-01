"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, Pencil, ScanLine, Search, Trash2, X } from "lucide-react";
import { CirclePlusIcon } from "@/components/brand/circle-plus-icon";
import { OnboardingShell } from "@/components/onboarding/shell";
import {
  CheckBox,
  InfoNote,
  inputValueClass,
  PrimaryButton,
  SelectorCard,
  StepFooter,
} from "@/components/onboarding/primitives";
import { useStepNav } from "@/components/onboarding/use-step-nav";
import {
  ALLERGY_REACTIONS,
  COMMON_ALLERGIES,
  COMMON_CONDITIONS,
  COMMON_MEDICATIONS,
  COMMON_SURGERIES,
  CONDITION_DIAGNOSIS_YEARS_OPTIONS,
  CONDITION_STATUS_OPTIONS,
  delay,
  MEDICATION_DOSAGES,
  MEDICATION_FREQUENCIES,
  MOCK_MEDICATION,
} from "@/lib/mocks";
import type {
  Allergy,
  Condition,
  ConditionDiagnosisYears,
  ConditionStatus,
  HistoryCategory,
  Medication,
  Severity,
} from "@/lib/onboarding-state";
import type { StepId } from "@/lib/onboarding-flow";
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

  function handleSelect(category: HistoryCategory) {
    if (category === "none") {
      update({
        historyCategories: selected.includes("none") ? [] : ["none"],
      });
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
            onClick={() => handleSelect(option.value)}
          />
        ))}
      </div>
      <div className="mt-5">
        <InfoNote align="start" tone="tertiary">
          You can always add more later from your profile.
        </InfoNote>
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
  appearance = "filled",
  children,
  onClick,
  onRemove,
  removeLabel,
}: {
  selected?: boolean;
  /** filled = solid action (meds); outlined = tint + action border (allergy reactions) */
  appearance?: "filled" | "outlined";
  children: ReactNode;
  onClick: () => void;
  onRemove?: () => void;
  removeLabel?: string;
}) {
  const chipClass = cn(
    "rounded-[0.625rem] px-3.5 py-2 text-[14px] leading-[18px] transition-colors",
    selected
      ? appearance === "outlined"
        ? "border border-action bg-canvas font-medium text-action"
        : "bg-action font-medium text-white"
      : "border border-line bg-white font-normal text-ink",
  );
  const removeClass =
    selected && appearance === "filled" ? "text-white" : "text-ink";

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
          removeClass,
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
      className="flex h-12 shrink-0 items-center self-stretch rounded-[12px] bg-canvas p-1"
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

const SEVERITY_OPTIONS: { value: Severity; label: string }[] = [
  { value: "mild", label: "Mild" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" },
];

function CanvasSegmented<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  compact,
}: {
  value: T | null;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  ariaLabel: string;
  compact?: boolean;
}) {
  return (
    <div
      className="flex h-12 shrink-0 items-center self-stretch rounded-[12px] bg-canvas p-1"
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex h-full flex-1 items-center justify-center rounded-[10px] px-1 text-center font-medium transition-colors",
              compact
                ? "text-[12px] leading-[14px]"
                : "text-[14px] leading-[18px]",
              selected ? "bg-action text-white" : "bg-transparent text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function SeveritySegmented({
  value,
  onChange,
}: {
  value: Severity | null;
  onChange: (value: Severity) => void;
}) {
  return (
    <CanvasSegmented
      value={value}
      options={SEVERITY_OPTIONS}
      onChange={onChange}
      ariaLabel="Severity"
    />
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
      <Label
        className={cn(
          "font-medium text-ink",
          size === "compact"
            ? "text-[14px] leading-4"
            : "text-[16px] leading-[1rem]",
        )}
      >
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
            "rounded-[14px] border border-line bg-white py-0 pl-4 pr-11 shadow-none focus-visible:border-2 focus-visible:border-action focus-visible:ring-0 font-normal text-ink placeholder:font-normal placeholder:text-fog",
            size === "compact"
              ? "h-[42px] text-[16px] leading-[22px] placeholder:text-[16px] md:text-[16px]"
              : cn("h-[70px]", inputValueClass),
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
          <p className="mb-2 text-[14px] leading-4 font-medium text-ink">Dosage</p>
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
              className="mt-3 text-[15px] font-medium text-caption"
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
          <p className="mb-2 text-[14px] leading-4 font-medium text-ink">Frequency</p>
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
              className="mt-3 text-[15px] font-medium text-caption"
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
        className="mt-5 inline-flex w-full items-center justify-center text-[16px] font-semibold text-action disabled:text-caption"
        disabled={!isMedicationComplete(draft)}
        onClick={onSave}
      >
        <span className="inline-flex items-center justify-center gap-2">
          <CirclePlusIcon className="size-5 shrink-0" />
          Add medication
        </span>
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
      <p className="mb-2 text-[16px] leading-[1rem] font-medium text-ink">
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
          className={cn(
            "h-[70px] rounded-[14px] border border-line bg-white pr-4 pl-11 shadow-none focus-visible:border-2 focus-visible:border-action focus-visible:ring-0",
            inputValueClass,
          )}
        />
      </div>
      <p className="mt-5 mb-2 text-[16px] leading-[1rem] font-medium text-ink">
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
  const canContinue = state.medications.some(isMedicationComplete);

  return (
    <OnboardingShell
      step="medications"
      title="What medications are you currently taking?"
      subtitle="Enter the name, dosage and frequency of your current medications or scan the label to enter automatically."
      footer={
        <StepFooter hideSkip disabled={!canContinue}>
          <PrimaryButton disabled={!canContinue} onClick={() => goNext()}>
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

function emptyAllergy(name = ""): Allergy {
  return {
    id: crypto.randomUUID(),
    name,
    reactions: [],
    severity: null,
  };
}

function isAllergyComplete(allergy: Allergy) {
  return Boolean(
    allergy.name.trim() &&
      allergy.reactions.length > 0 &&
      allergy.severity,
  );
}

function isPresetReaction(value: string) {
  return ALLERGY_REACTIONS.includes(value);
}

function AllergyEntryCard({
  draft,
  onChange,
  onDismiss,
  onSave,
}: {
  draft: Allergy;
  onChange: (next: Allergy) => void;
  onDismiss: () => void;
  onSave: () => void;
}) {
  const customReactions = draft.reactions.filter(
    (reaction) => !isPresetReaction(reaction),
  );
  const [showCustomReaction, setShowCustomReaction] = useState(false);
  const [customReaction, setCustomReaction] = useState("");

  function toggleReaction(reaction: string) {
    const reactions = draft.reactions.includes(reaction)
      ? draft.reactions.filter((item) => item !== reaction)
      : [...draft.reactions, reaction];
    onChange({ ...draft, reactions });
  }

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
          aria-label="Cancel allergy entry"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-[14px] leading-4 font-medium text-ink">Reaction</p>
          <p className="mt-1 mb-2 text-[13px] leading-4 text-caption">
            Select all that apply
          </p>
          <div className="flex flex-wrap gap-2">
            {ALLERGY_REACTIONS.map((reaction) => (
              <SoftChip
                key={reaction}
                appearance="outlined"
                selected={draft.reactions.includes(reaction)}
                onClick={() => toggleReaction(reaction)}
              >
                {reaction}
              </SoftChip>
            ))}
            {!showCustomReaction
              ? customReactions.map((reaction) => (
                  <SoftChip
                    key={reaction}
                    appearance="outlined"
                    selected
                    onClick={() => {
                      setCustomReaction(reaction);
                      setShowCustomReaction(true);
                    }}
                    onRemove={() => {
                      onChange({
                        ...draft,
                        reactions: draft.reactions.filter(
                          (item) => item !== reaction,
                        ),
                      });
                    }}
                    removeLabel="Remove custom reaction"
                  >
                    {reaction}
                  </SoftChip>
                ))
              : null}
          </div>
          {showCustomReaction ? (
            <div className="mt-3">
              <ClearableInput
                label="Specific Reaction"
                size="compact"
                value={customReaction}
                placeholder="e.g. Itchy throat"
                onChange={(value) => {
                  setCustomReaction(value);
                }}
                onClear={() => {
                  const previous = customReaction.trim();
                  setCustomReaction("");
                  setShowCustomReaction(false);
                  if (previous && !isPresetReaction(previous)) {
                    onChange({
                      ...draft,
                      reactions: draft.reactions.filter(
                        (item) => item !== previous,
                      ),
                    });
                  }
                }}
                onConfirm={() => {
                  const value = customReaction.trim();
                  if (!value) return;
                  const withoutOldCustom = draft.reactions.filter(
                    (item) => isPresetReaction(item) || item === value,
                  );
                  const reactions = withoutOldCustom.includes(value)
                    ? withoutOldCustom
                    : [...withoutOldCustom, value];
                  setCustomReaction(value);
                  setShowCustomReaction(false);
                  onChange({ ...draft, reactions });
                }}
              />
            </div>
          ) : (
            <button
              type="button"
              className="mt-3 text-[15px] font-medium text-caption"
              onClick={() => setShowCustomReaction(true)}
            >
              + Add Specific Reaction
            </button>
          )}
        </div>

        <div>
          <p className="mb-2 text-[14px] leading-4 font-medium text-ink">
            Severity
          </p>
          <SeveritySegmented
            value={draft.severity}
            onChange={(severity) => onChange({ ...draft, severity })}
          />
        </div>
      </div>

      <button
        type="button"
        className="mt-5 inline-flex w-full items-center justify-center text-[16px] font-semibold text-action disabled:text-caption"
        disabled={!isAllergyComplete(draft)}
        onClick={onSave}
      >
        <span className="inline-flex items-center justify-center gap-2">
          <CirclePlusIcon className="size-5 shrink-0" />
          Add allergy
        </span>
      </button>
    </div>
  );
}

export function AllergiesStep() {
  const { state, update, goNext } = useStepNav("allergies");
  const [draft, setDraft] = useState<Allergy | null>(null);
  const [query, setQuery] = useState("");

  function openEntry(name: string, existing?: Allergy) {
    const trimmed = name.trim();
    if (!trimmed && !existing) return;
    setQuery("");
    if (existing) {
      setDraft({ ...existing });
      return;
    }
    setDraft(emptyAllergy(trimmed));
  }

  function saveDraft() {
    if (!draft || !isAllergyComplete(draft)) return;
    const next: Allergy = {
      ...draft,
      name: draft.name.trim(),
      reactions: draft.reactions.map((item) => item.trim()).filter(Boolean),
    };
    const exists = state.allergies.some((item) => item.id === next.id);
    const allergies = exists
      ? state.allergies.map((item) => (item.id === next.id ? next : item))
      : [...state.allergies, next];
    update({ allergies });
    setDraft(null);
  }

  function remove(id: string) {
    update({
      allergies: state.allergies.filter((item) => item.id !== id),
    });
  }

  const listedAllergies = state.allergies.filter(
    (allergy) => draft?.id !== allergy.id,
  );
  const canContinue = state.allergies.some(isAllergyComplete);

  return (
    <OnboardingShell
      step="allergies"
      title="Any allergies we should know about?"
      subtitle="Enter the name of any drug, food, or environmental allergies, or scan a label to enter automatically."
      footer={
        <StepFooter onSkip={() => goNext()}>
          <PrimaryButton disabled={!canContinue} onClick={() => goNext()}>
            Continue
          </PrimaryButton>
        </StepFooter>
      }
    >
      {listedAllergies.length > 0 && !draft ? (
        <div className="mb-4 space-y-3">
          {listedAllergies.map((allergy) => (
            <div
              key={allergy.id}
              className="flex items-center justify-between rounded-[14px] border border-line bg-white px-4 py-3"
            >
              <div>
                <p className="text-[16px] font-semibold text-ink">
                  {allergy.name}
                </p>
                <p className="text-[14px] text-body">
                  {[
                    allergy.severity
                      ? allergy.severity.charAt(0).toUpperCase() +
                        allergy.severity.slice(1)
                      : null,
                    allergy.reactions.join(", "),
                  ]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  aria-label="Edit allergy"
                  onClick={() => openEntry(allergy.name, allergy)}
                  className="text-caption"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Delete allergy"
                  onClick={() => remove(allergy.id)}
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
        <AllergyEntryCard
          key={draft.id}
          draft={draft}
          onChange={setDraft}
          onDismiss={() => setDraft(null)}
          onSave={saveDraft}
        />
      ) : (
        <NamedHistorySearchBlock
          fieldLabel="Allergy name"
          placeholder="e.g. Peanuts"
          commonLabel="Common allergies"
          commonItems={COMMON_ALLERGIES}
          query={query}
          onQueryChange={setQuery}
          onCommitName={(name) => openEntry(name)}
        />
      )}
    </OnboardingShell>
  );
}

function emptyCondition(name = ""): Condition {
  return {
    id: crypto.randomUUID(),
    name,
    severity: null,
    status: null,
    diagnosisYears: null,
  };
}

function isConditionComplete(condition: Condition) {
  return Boolean(
    condition.name.trim() &&
      condition.severity &&
      condition.status &&
      condition.diagnosisYears,
  );
}

function formatConditionStatus(status: ConditionStatus) {
  return (
    CONDITION_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    status
  );
}

function formatConditionDiagnosisYears(years: ConditionDiagnosisYears) {
  return (
    CONDITION_DIAGNOSIS_YEARS_OPTIONS.find((option) => option.value === years)
      ?.label ?? years
  );
}

function formatConditionSummary(condition: Condition) {
  return [
    condition.severity
      ? condition.severity.charAt(0).toUpperCase() + condition.severity.slice(1)
      : null,
    condition.status ? formatConditionStatus(condition.status) : null,
    condition.diagnosisYears
      ? formatConditionDiagnosisYears(condition.diagnosisYears)
      : null,
  ]
    .filter(Boolean)
    .join(" • ");
}

function ConditionEntryCard({
  draft,
  onChange,
  onDismiss,
  onSave,
}: {
  draft: Condition;
  onChange: (next: Condition) => void;
  onDismiss: () => void;
  onSave: () => void;
}) {
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
          aria-label="Cancel condition entry"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <p className="mb-2 text-[14px] leading-4 font-medium text-ink">
            Severity
          </p>
          <CanvasSegmented
            value={draft.severity}
            options={SEVERITY_OPTIONS}
            onChange={(severity) => onChange({ ...draft, severity })}
            ariaLabel="Severity"
          />
        </div>

        <div>
          <p className="mb-2 text-[14px] leading-4 font-medium text-ink">
            Status
          </p>
          <CanvasSegmented
            value={draft.status}
            options={CONDITION_STATUS_OPTIONS}
            onChange={(status) => onChange({ ...draft, status })}
            ariaLabel="Status"
            compact
          />
        </div>

        <div>
          <p className="mb-2 text-[14px] leading-4 font-medium text-ink">
            How many years has it been since your diagnosis
          </p>
          <CanvasSegmented
            value={draft.diagnosisYears}
            options={CONDITION_DIAGNOSIS_YEARS_OPTIONS}
            onChange={(diagnosisYears) => onChange({ ...draft, diagnosisYears })}
            ariaLabel="Years since diagnosis"
            compact
          />
        </div>
      </div>

      <button
        type="button"
        className="mt-5 inline-flex w-full items-center justify-center text-[16px] font-semibold text-action disabled:text-caption"
        disabled={!isConditionComplete(draft)}
        onClick={onSave}
      >
        <span className="inline-flex items-center justify-center gap-2">
          <CirclePlusIcon className="size-5 shrink-0" />
          Add condition
        </span>
      </button>
    </div>
  );
}

export function ConditionsStep() {
  const { state, update, goNext } = useStepNav("conditions");
  const [draft, setDraft] = useState<Condition | null>(null);
  const [query, setQuery] = useState("");

  function openEntry(name: string, existing?: Condition) {
    const trimmed = name.trim();
    if (!trimmed && !existing) return;
    setQuery("");
    if (existing) {
      setDraft({ ...existing });
      return;
    }
    setDraft(emptyCondition(trimmed));
  }

  function saveDraft() {
    if (!draft || !isConditionComplete(draft)) return;
    const next: Condition = {
      ...draft,
      name: draft.name.trim(),
    };
    const duplicate = state.conditions.some(
      (item) => item.id !== next.id && namesMatch(item.name, next.name),
    );
    if (duplicate) {
      setDraft(null);
      return;
    }
    const exists = state.conditions.some((item) => item.id === next.id);
    const conditions = exists
      ? state.conditions.map((item) => (item.id === next.id ? next : item))
      : [...state.conditions, next];
    update({ conditions });
    setDraft(null);
  }

  function remove(id: string) {
    update({
      conditions: state.conditions.filter((item) => item.id !== id),
    });
  }

  const listedConditions = state.conditions.filter(
    (condition) => draft?.id !== condition.id,
  );
  const canContinue = state.conditions.some(isConditionComplete);

  return (
    <OnboardingShell
      step="conditions"
      title="Do you have any ongoing conditions?"
      subtitle="Enter diagnoses you’re currently managing so your provider has the full picture."
      footer={
        <StepFooter onSkip={() => goNext()}>
          <PrimaryButton disabled={!canContinue} onClick={() => goNext()}>
            Continue
          </PrimaryButton>
        </StepFooter>
      }
    >
      {listedConditions.length > 0 && !draft ? (
        <div className="mb-4 space-y-3">
          {listedConditions.map((condition) => (
            <div
              key={condition.id}
              className="flex items-center justify-between rounded-[14px] border border-line bg-white px-4 py-3"
            >
              <div>
                <p className="text-[16px] font-semibold text-ink">
                  {condition.name}
                </p>
                <p className="text-[14px] text-body">
                  {formatConditionSummary(condition)}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  aria-label="Edit condition"
                  onClick={() => openEntry(condition.name, condition)}
                  className="text-caption"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Delete condition"
                  onClick={() => remove(condition.id)}
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
        <ConditionEntryCard
          draft={draft}
          onChange={setDraft}
          onDismiss={() => setDraft(null)}
          onSave={saveDraft}
        />
      ) : (
        <NamedHistorySearchBlock
          fieldLabel="Condition name"
          placeholder="e.g. Asthma"
          commonLabel="Common conditions"
          commonItems={COMMON_CONDITIONS}
          query={query}
          onQueryChange={setQuery}
          onCommitName={(name) => openEntry(name)}
        />
      )}
    </OnboardingShell>
  );
}

type NamedHistoryKey = "surgeries";

function namesMatch(left: string, right: string) {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

function NamedHistorySearchBlock({
  fieldLabel,
  placeholder,
  commonLabel,
  commonItems,
  query,
  onQueryChange,
  onCommitName,
}: {
  fieldLabel: string;
  placeholder: string;
  commonLabel: string;
  commonItems: string[];
  query: string;
  onQueryChange: (value: string) => void;
  onCommitName: (name: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[16px] leading-[1rem] font-medium text-ink">
        {fieldLabel}
      </p>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-caption" />
        <Input
          value={query}
          placeholder={placeholder}
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
          className={cn(
            "h-[70px] rounded-[14px] border border-line bg-white pr-4 pl-11 shadow-none focus-visible:border-2 focus-visible:border-action focus-visible:ring-0",
            inputValueClass,
          )}
        />
      </div>
      <p className="mt-5 mb-2 text-[16px] leading-[1rem] font-medium text-ink">
        {commonLabel}
      </p>
      <div className="flex flex-wrap gap-2">
        {commonItems.map((item) => (
          <SoftChip key={item} onClick={() => onCommitName(item)}>
            {item}
          </SoftChip>
        ))}
      </div>
    </div>
  );
}

function NamedHistoryEntryCard({
  name,
  itemNoun,
  onDismiss,
  onSave,
}: {
  name: string;
  itemNoun: string;
  onDismiss: () => void;
  onSave: () => void;
}) {
  return (
    <div className="rounded-[14px] border border-line bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <p className="text-[18px] leading-6 font-semibold text-ink">{name}</p>
        <button
          type="button"
          className="shrink-0 text-caption"
          onClick={onDismiss}
          aria-label={`Cancel ${itemNoun} entry`}
        >
          <X className="size-5" />
        </button>
      </div>
      <button
        type="button"
        className="mt-5 inline-flex w-full items-center justify-center text-[16px] font-semibold text-action"
        onClick={onSave}
      >
        <span className="inline-flex items-center justify-center gap-2">
          <CirclePlusIcon className="size-5 shrink-0" />
          Add {itemNoun}
        </span>
      </button>
    </div>
  );
}

function NamedHistoryListStep({
  step,
  title,
  subtitle,
  fieldLabel,
  placeholder,
  commonLabel,
  commonItems,
  scanLabel,
  mockScanValue,
  itemNoun,
}: {
  step: StepId & NamedHistoryKey;
  title: string;
  subtitle: string;
  fieldLabel: string;
  placeholder: string;
  commonLabel: string;
  commonItems: string[];
  scanLabel?: string;
  mockScanValue?: string;
  itemNoun: string;
}) {
  const { state, update, goNext } = useStepNav(step);
  const items = state[step];
  const [draft, setDraft] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [scanning, setScanning] = useState(false);

  function includesName(name: string) {
    return items.some((item) => namesMatch(item, name));
  }

  function openEntry(name: string) {
    const value = name.trim();
    if (!value) return;
    setQuery("");
    setDraft(value);
  }

  function saveDraft() {
    if (!draft) return;
    const value = draft.trim();
    if (!value) return;
    if (!includesName(value)) {
      update({ [step]: [...items, value] });
    }
    setDraft(null);
  }

  function remove(name: string) {
    update({
      [step]: items.filter((item) => !namesMatch(item, name)),
    });
  }

  async function scan() {
    if (!mockScanValue) return;
    setScanning(true);
    await delay(1000);
    openEntry(mockScanValue);
    setScanning(false);
  }

  const listedItems = items.filter(
    (item) => !draft || !namesMatch(item, draft),
  );
  const canContinue = items.length > 0;

  return (
    <OnboardingShell
      step={step}
      title={title}
      subtitle={subtitle}
      footer={
        <StepFooter onSkip={() => goNext()}>
          <PrimaryButton disabled={!canContinue} onClick={() => goNext()}>
            Continue
          </PrimaryButton>
        </StepFooter>
      }
    >
      {scanLabel ? (
        <button
          type="button"
          className="mb-5 inline-flex items-center gap-2 text-[16px] font-semibold text-action disabled:text-caption"
          disabled={scanning}
          onClick={scan}
        >
          <ScanLine className="size-4" />
          {scanning ? "Scanning label…" : scanLabel}
        </button>
      ) : null}

      {listedItems.length > 0 && !draft ? (
        <div className="mb-4 space-y-3">
          {listedItems.map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-[14px] border border-line bg-white px-4 py-3"
            >
              <p className="text-[16px] font-semibold text-ink">{item}</p>
              <button
                type="button"
                aria-label={`Delete ${itemNoun}`}
                onClick={() => remove(item)}
                className="text-danger"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {draft ? (
        <NamedHistoryEntryCard
          name={draft}
          itemNoun={itemNoun}
          onDismiss={() => setDraft(null)}
          onSave={saveDraft}
        />
      ) : (
        <NamedHistorySearchBlock
          fieldLabel={fieldLabel}
          placeholder={placeholder}
          commonLabel={commonLabel}
          commonItems={commonItems}
          query={query}
          onQueryChange={setQuery}
          onCommitName={openEntry}
        />
      )}
    </OnboardingShell>
  );
}

export function SurgeriesStep() {
  return (
    <NamedHistoryListStep
      step="surgeries"
      title="Have you had any past surgeries?"
      subtitle="Add prior procedures or operations so they’re on file for this visit."
      fieldLabel="Surgery name"
      placeholder="e.g. Appendectomy"
      commonLabel="Common surgeries"
      commonItems={COMMON_SURGERIES}
      itemNoun="surgery"
    />
  );
}
