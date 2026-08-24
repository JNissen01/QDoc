"use client";

import { useState } from "react";
import { Pencil, Plus, ScanLine, Trash2, X } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/shell";
import {
  CheckBox,
  Chip,
  Field,
  GhostButton,
  InfoNote,
  PrimaryButton,
  SearchField,
  SegmentedControl,
  SelectorCard,
} from "@/components/onboarding/primitives";
import { useStepNav } from "@/components/onboarding/use-step-nav";
import {
  COMMON_ALLERGIES,
  COMMON_CONDITIONS,
  delay,
  MEDICATION_REACTIONS,
  MOCK_MEDICATION,
} from "@/lib/mocks";
import type {
  HistoryCategory,
  Medication,
  Severity,
} from "@/lib/onboarding-state";

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
        <PrimaryButton
          disabled={selected.length === 0}
          onClick={() => goNext()}
        >
          Continue
        </PrimaryButton>
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

function emptyMedication(): Medication {
  return {
    id: crypto.randomUUID(),
    name: "",
    dosage: "",
    frequency: "",
    reactions: [],
    severity: null,
  };
}

export function MedicationsStep() {
  const { state, update, goNext } = useStepNav("medications");
  const [draft, setDraft] = useState<Medication | null>(
    state.medications.length === 0 ? emptyMedication() : null,
  );
  const [scanning, setScanning] = useState(false);

  function saveDraft() {
    if (!draft?.name.trim()) return;
    const exists = state.medications.some((item) => item.id === draft.id);
    const medications = exists
      ? state.medications.map((item) => (item.id === draft.id ? draft : item))
      : [...state.medications, draft];
    update({ medications });
    setDraft(null);
  }

  async function scanMedication() {
    setScanning(true);
    await delay(1000);
    const scanned: Medication = {
      ...emptyMedication(),
      ...MOCK_MEDICATION,
      reactions: ["Rash"],
      severity: "moderate",
    };
    update({ medications: [...state.medications, scanned] });
    setDraft(null);
    setScanning(false);
  }

  function remove(id: string) {
    update({
      medications: state.medications.filter((item) => item.id !== id),
    });
  }

  return (
    <OnboardingShell
      step="medications"
      title="What medications are you currently taking?"
      subtitle="Enter the name, dosage and frequency of your current medications or scan the label to enter automatically."
      footer={<PrimaryButton onClick={() => goNext()}>Next</PrimaryButton>}
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

      <div className="space-y-3">
        {state.medications.map((medication) =>
          draft?.id === medication.id ? null : (
            <div
              key={medication.id}
              className="flex items-start justify-between rounded-[14px] border border-line bg-white px-4 py-3"
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
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Edit medication"
                  onClick={() => setDraft(medication)}
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
          ),
        )}
      </div>

      {draft ? (
        <div className="mt-4 rounded-[14px] border border-line bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <Field
              className="flex-1"
              placeholder="Medication name"
              value={draft.name}
              onChange={(event) =>
                setDraft({ ...draft, name: event.target.value })
              }
            />
            <button
              type="button"
              className="ml-2 text-caption"
              onClick={() => setDraft(null)}
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Dosage"
              placeholder="25mg"
              value={draft.dosage}
              onChange={(event) =>
                setDraft({ ...draft, dosage: event.target.value })
              }
            />
            <Field
              label="Frequency"
              placeholder="Twice daily"
              value={draft.frequency}
              onChange={(event) =>
                setDraft({ ...draft, frequency: event.target.value })
              }
            />
          </div>
          <p className="mt-4 mb-2 text-[14px] text-body">Reaction</p>
          <div className="flex flex-wrap gap-2">
            {MEDICATION_REACTIONS.map((reaction) => (
              <Chip
                key={reaction}
                variant="soft"
                selected={draft.reactions.includes(reaction)}
                onClick={() => {
                  const reactions = draft.reactions.includes(reaction)
                    ? draft.reactions.filter((item) => item !== reaction)
                    : [...draft.reactions, reaction];
                  setDraft({ ...draft, reactions });
                }}
              >
                {reaction}
              </Chip>
            ))}
          </div>
          <p className="mt-2 text-[13px] text-caption">Select all that apply</p>
          <p className="mt-4 mb-2 text-[14px] text-body">Severity</p>
          <SegmentedControl<Severity>
            value={draft.severity}
            options={[
              { value: "mild", label: "Mild" },
              { value: "moderate", label: "Moderate" },
              { value: "severe", label: "Severe" },
            ]}
            onChange={(severity) => setDraft({ ...draft, severity })}
          />
          <button
            type="button"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 text-[16px] font-semibold text-action"
            onClick={saveDraft}
          >
            <Plus className="size-4" />
            Add medication
          </button>
        </div>
      ) : (
        <GhostButton onClick={() => setDraft(emptyMedication())}>
          + Add medication
        </GhostButton>
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
      footer={<PrimaryButton onClick={() => goNext()}>Next</PrimaryButton>}
    >
      <div>
        <p className="mb-2 text-[13px] font-semibold text-body">Allergen</p>
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
        <p className="mt-5 mb-2 text-[13px] font-semibold text-body">Common allergies</p>
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
      footer={<PrimaryButton onClick={() => goNext()}>Continue</PrimaryButton>}
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
