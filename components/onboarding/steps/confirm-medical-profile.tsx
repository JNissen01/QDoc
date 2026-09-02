"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import {
  ConfirmChip,
  ConfirmRow,
  confirmControlClass,
} from "@/components/onboarding/confirm-primitives";
import { OnboardingShell } from "@/components/onboarding/shell";
import {
  GhostButton,
  PrimaryButton,
  RadioDot,
  SearchField,
  SelectorCard,
} from "@/components/onboarding/primitives";
import { useStepNav } from "@/components/onboarding/use-step-nav";
import {
  formatHeightDisplay,
  formatWeightDisplay,
  parseHeightToCm,
  parseWeightToKg,
} from "@/lib/biometrics-units";
import { HISTORY_OPTIONS } from "@/lib/history-options";
import {
  ALLERGY_REACTIONS,
  CONDITION_DIAGNOSIS_YEARS_OPTIONS,
  CONDITION_STATUS_OPTIONS,
  filterByQuery,
  MEDICATION_DOSAGES,
  MEDICATION_FREQUENCIES,
  MOCK_CLINICS,
  MOCK_PHARMACIES,
} from "@/lib/mocks";
import {
  formatAllergiesList,
  formatBiometricsRow,
  formatConditionsList,
  formatFamilyDoctorSummary,
  formatHistoryCategoriesSummary,
  formatMedicationsList,
  formatPharmacySummary,
  formatSurgeriesList,
} from "@/lib/medical-profile-display";
import type {
  HistoryCategory,
  MeasurementSystem,
  OnboardingState,
  Severity,
} from "@/lib/onboarding-state";
import { cn } from "@/lib/utils";

const PRONOUNS = ["She/her", "He/him", "They/them", "Prefer not to say"];

const SEVERITY_OPTIONS: { value: Severity; label: string }[] = [
  { value: "mild", label: "Mild" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" },
];

type ConfirmField =
  | "biometrics"
  | "pronouns"
  | "history"
  | "medications"
  | "allergies"
  | "conditions"
  | "surgeries"
  | "family-doctor"
  | "pharmacy";

type MedicalProfileDraft = Pick<
  OnboardingState,
  | "measurementSystem"
  | "height"
  | "weight"
  | "pronouns"
  | "historyCategories"
  | "medications"
  | "allergies"
  | "conditions"
  | "surgeries"
  | "hasFamilyDoctor"
  | "familyDoctor"
  | "pharmacy"
>;

function shouldShowCategory(
  category: HistoryCategory,
  state: OnboardingState,
  exitMode: boolean,
) {
  if (exitMode) {
    switch (category) {
      case "medications":
        return state.medications.length > 0;
      case "allergies":
        return state.allergies.length > 0;
      case "conditions":
        return state.conditions.length > 0;
      case "surgeries":
        return state.surgeries.length > 0;
      default:
        return false;
    }
  }
  return state.historyCategories.includes(category);
}

function CompactSegmented<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: T | null;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      className="mt-2 flex h-10 shrink-0 items-center self-stretch rounded-[12px] bg-canvas p-1"
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
              "flex h-full flex-1 items-center justify-center rounded-[10px] px-1 text-center text-[12px] leading-[14px] font-medium transition-colors",
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

function MeasurementToggle({
  value,
  onChange,
}: {
  value: MeasurementSystem;
  onChange: (value: MeasurementSystem) => void;
}) {
  const options: { value: MeasurementSystem; label: string }[] = [
    { value: "metric", label: "Metric" },
    { value: "imperial", label: "Imperial" },
  ];
  return (
    <div
      className="mt-2 flex h-10 items-center rounded-[12px] border border-line bg-white p-1"
      role="group"
      aria-label="Measurement System"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex h-full flex-1 items-center justify-center rounded-[10px] text-[13px] font-medium",
            value === option.value ? "bg-secondary text-ink" : "text-ink",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function ConfirmMedicalProfileStep() {
  const [exitMode, setExitMode] = useState(false);
  const { state, update, goNext, goTo, router, ready } = useStepNav(
    "confirm-medical-profile",
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setExitMode(params.get("exit") === "1");
  }, []);
  const [editing, setEditing] = useState(false);
  const [activeField, setActiveField] = useState<ConfirmField | null>(null);
  const [draft, setDraft] = useState<MedicalProfileDraft | null>(null);
  const [heightDraft, setHeightDraft] = useState("");
  const [weightDraft, setWeightDraft] = useState("");
  const [clinicQuery, setClinicQuery] = useState("");
  const [pharmacyQuery, setPharmacyQuery] = useState("");

  const system = state.measurementSystem;
  const clinicResults = useMemo(
    () => filterByQuery(MOCK_CLINICS, clinicQuery),
    [clinicQuery],
  );
  const pharmacyResults = useMemo(
    () => filterByQuery(MOCK_PHARMACIES, pharmacyQuery),
    [pharmacyQuery],
  );

  useEffect(() => {
    if (!ready) return;
    setHeightDraft(formatHeightDisplay(state.height, system));
    setWeightDraft(formatWeightDisplay(state.weight, system));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync when system toggles
  }, [ready, system]);

  function startEditing() {
    setDraft({
      measurementSystem: state.measurementSystem,
      height: state.height,
      weight: state.weight,
      pronouns: state.pronouns,
      historyCategories: [...state.historyCategories],
      medications: state.medications.map((item) => ({ ...item })),
      allergies: state.allergies.map((item) => ({
        ...item,
        reactions: [...item.reactions],
      })),
      conditions: state.conditions.map((item) => ({ ...item })),
      surgeries: state.surgeries.map((item) => ({ ...item })),
      hasFamilyDoctor: state.hasFamilyDoctor,
      familyDoctor: state.familyDoctor ? { ...state.familyDoctor } : null,
      pharmacy: state.pharmacy ? { ...state.pharmacy } : null,
    });
    setHeightDraft(formatHeightDisplay(state.height, system));
    setWeightDraft(formatWeightDisplay(state.weight, system));
    setEditing(true);
    setActiveField("biometrics");
  }

  function stopEditing() {
    setEditing(false);
    setActiveField(null);
    setDraft(null);
    setClinicQuery("");
    setPharmacyQuery("");
  }

  function cancelEdits() {
    if (draft) {
      update(draft);
      setHeightDraft(formatHeightDisplay(draft.height, draft.measurementSystem));
      setWeightDraft(formatWeightDisplay(draft.weight, draft.measurementSystem));
    }
    stopEditing();
  }

  function handleHistorySelect(category: HistoryCategory) {
    if (category === "none") {
      const next: HistoryCategory[] = state.historyCategories.includes("none")
        ? []
        : ["none"];
      update({
        historyCategories: next,
        ...(next.includes("none")
          ? {
              medications: [],
              allergies: [],
              conditions: [],
              surgeries: [],
            }
          : {}),
      });
      return;
    }
    const withoutNone = state.historyCategories.filter((item) => item !== "none");
    const next = withoutNone.includes(category)
      ? withoutNone.filter((item) => item !== category)
      : [...withoutNone, category];
    const removed = state.historyCategories.includes(category);
    update({
      historyCategories: next,
      ...(removed && category === "medications" ? { medications: [] } : {}),
      ...(removed && category === "allergies" ? { allergies: [] } : {}),
      ...(removed && category === "conditions" ? { conditions: [] } : {}),
      ...(removed && category === "surgeries" ? { surgeries: [] } : {}),
    });
  }

  const showMedications = shouldShowCategory("medications", state, exitMode);
  const showAllergies = shouldShowCategory("allergies", state, exitMode);
  const showConditions = shouldShowCategory("conditions", state, exitMode);
  const showSurgeries = shouldShowCategory("surgeries", state, exitMode);
  const showHistory =
    exitMode ||
    state.historyCategories.length > 0 ||
    showMedications ||
    showAllergies ||
    showConditions ||
    showSurgeries;

  const heightSuffix = system === "metric" ? "cm" : "ft";
  const weightSuffix = system === "metric" ? "kg" : "lbs";

  return (
    <OnboardingShell
      step="confirm-medical-profile"
      showExit={false}
      onBack={exitMode ? () => router.back() : undefined}
      title={
        exitMode ? "Review your medical profile" : "Confirm your information"
      }
      subtitle={
        exitMode
          ? "Review what you've entered so far. You can exit when you're ready."
          : "Ensure your medical profile is correct before continuing."
      }
      footer={
        <PrimaryButton
          disabled={editing}
          onClick={() => (exitMode ? goTo("dashboard") : goNext())}
        >
          {exitMode ? "Exit" : "Confirm"}
        </PrimaryButton>
      }
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[14px] border bg-white px-4",
          editing ? "border-action" : "border-line",
        )}
      >
        {editing ? null : (
          <button
            type="button"
            onClick={startEditing}
            aria-label="Edit information"
            className="absolute top-3 right-3 z-10 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-action"
          >
            <Pencil className="size-4" strokeWidth={1.8} />
          </button>
        )}

        <ConfirmRow
          label="Height / weight"
          value={formatBiometricsRow(state.height, state.weight, system)}
          editing={editing}
          active={activeField === "biometrics"}
          reserveAction={!editing}
          onActivate={() => setActiveField("biometrics")}
        >
          {activeField === "biometrics" ? (
            <div className="space-y-3">
              <MeasurementToggle
                value={system}
                onChange={(measurementSystem) => update({ measurementSystem })}
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[13px] text-caption">Height ({heightSuffix})</p>
                  <input
                    aria-label="Height"
                    inputMode="decimal"
                    className={confirmControlClass()}
                    value={heightDraft}
                    onChange={(event) => {
                      const next = event.target.value;
                      setHeightDraft(next);
                      const metric = parseHeightToCm(next, system);
                      if (metric !== null) update({ height: metric });
                    }}
                  />
                </div>
                <div>
                  <p className="text-[13px] text-caption">Weight ({weightSuffix})</p>
                  <input
                    aria-label="Weight"
                    inputMode="decimal"
                    className={confirmControlClass()}
                    value={weightDraft}
                    onChange={(event) => {
                      const next = event.target.value;
                      setWeightDraft(next);
                      const metric = parseWeightToKg(next, system);
                      if (metric !== null) update({ weight: metric });
                    }}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </ConfirmRow>

        <ConfirmRow
          label="Pronouns"
          value={state.pronouns || "—"}
          editing={editing}
          active={activeField === "pronouns"}
          onActivate={() => setActiveField("pronouns")}
        >
          {activeField === "pronouns" ? (
            <div className="mt-2 grid grid-cols-2 gap-2" role="group" aria-label="Pronouns">
              {PRONOUNS.map((option) => (
                <ConfirmChip
                  key={option}
                  selected={state.pronouns === option}
                  className={option === "Prefer not to say" ? "col-span-2" : undefined}
                  onClick={() => update({ pronouns: option })}
                >
                  {option}
                </ConfirmChip>
              ))}
            </div>
          ) : null}
        </ConfirmRow>

        {showHistory ? (
          <ConfirmRow
            label="Medical history"
            value={formatHistoryCategoriesSummary(state.historyCategories)}
            editing={editing}
            active={activeField === "history"}
            onActivate={() => setActiveField("history")}
          >
            {activeField === "history" ? (
              <div className="mt-2 space-y-2">
                {HISTORY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleHistorySelect(option.value)}
                    className={cn(
                      "w-full rounded-[10px] border px-3 py-2 text-left text-[14px]",
                      state.historyCategories.includes(option.value)
                        ? "border-action bg-canvas font-medium text-action"
                        : "border-line text-ink",
                    )}
                  >
                    {option.title}
                  </button>
                ))}
              </div>
            ) : null}
          </ConfirmRow>
        ) : null}

        {showMedications ? (
          <ConfirmRow
            label="Medications"
            value={formatMedicationsList(state.medications)}
            editing={editing}
            active={activeField === "medications"}
            onActivate={() => setActiveField("medications")}
          >
            {activeField === "medications" ? (
              <div className="mt-2 space-y-4">
                {state.medications.map((medication) => (
                  <div key={medication.id} className="space-y-2 border-b border-line pb-3 last:border-b-0">
                    <p className="text-[14px] font-semibold text-ink">{medication.name}</p>
                    <p className="text-[13px] text-caption">Dosage</p>
                    <div className="flex flex-wrap gap-2">
                      {MEDICATION_DOSAGES.map((dosage) => (
                        <ConfirmChip
                          key={dosage}
                          selected={medication.dosage === dosage}
                          onClick={() =>
                            update({
                              medications: state.medications.map((item) =>
                                item.id === medication.id
                                  ? { ...item, dosage }
                                  : item,
                              ),
                            })
                          }
                        >
                          {dosage}
                        </ConfirmChip>
                      ))}
                    </div>
                    <p className="text-[13px] text-caption">Frequency</p>
                    <CompactSegmented
                      value={
                        (MEDICATION_FREQUENCIES as readonly string[]).includes(
                          medication.frequency,
                        )
                          ? (medication.frequency as (typeof MEDICATION_FREQUENCIES)[number])
                          : null
                      }
                      options={MEDICATION_FREQUENCIES.map((value) => ({
                        value,
                        label: value,
                      }))}
                      ariaLabel={`Frequency for ${medication.name}`}
                      onChange={(frequency) =>
                        update({
                          medications: state.medications.map((item) =>
                            item.id === medication.id
                              ? { ...item, frequency }
                              : item,
                          ),
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </ConfirmRow>
        ) : null}

        {showAllergies ? (
          <ConfirmRow
            label="Allergies"
            value={formatAllergiesList(state.allergies)}
            editing={editing}
            active={activeField === "allergies"}
            onActivate={() => setActiveField("allergies")}
          >
            {activeField === "allergies" ? (
              <div className="mt-2 space-y-4">
                {state.allergies.map((allergy) => (
                  <div key={allergy.id} className="space-y-2 border-b border-line pb-3 last:border-b-0">
                    <p className="text-[14px] font-semibold text-ink">{allergy.name}</p>
                    <p className="text-[13px] text-caption">Reactions</p>
                    <div className="flex flex-wrap gap-2">
                      {ALLERGY_REACTIONS.map((reaction) => (
                        <ConfirmChip
                          key={reaction}
                          selected={allergy.reactions.includes(reaction)}
                          onClick={() => {
                            const reactions = allergy.reactions.includes(reaction)
                              ? allergy.reactions.filter((item) => item !== reaction)
                              : [...allergy.reactions, reaction];
                            update({
                              allergies: state.allergies.map((item) =>
                                item.id === allergy.id ? { ...item, reactions } : item,
                              ),
                            });
                          }}
                        >
                          {reaction}
                        </ConfirmChip>
                      ))}
                    </div>
                    <p className="text-[13px] text-caption">Severity</p>
                    <CompactSegmented
                      value={allergy.severity}
                      options={SEVERITY_OPTIONS}
                      ariaLabel={`Severity for ${allergy.name}`}
                      onChange={(severity) =>
                        update({
                          allergies: state.allergies.map((item) =>
                            item.id === allergy.id ? { ...item, severity } : item,
                          ),
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </ConfirmRow>
        ) : null}

        {showConditions ? (
          <ConfirmRow
            label="Ongoing conditions"
            value={formatConditionsList(state.conditions)}
            editing={editing}
            active={activeField === "conditions"}
            onActivate={() => setActiveField("conditions")}
          >
            {activeField === "conditions" ? (
              <div className="mt-2 space-y-4">
                {state.conditions.map((condition) => (
                  <div key={condition.id} className="space-y-2 border-b border-line pb-3 last:border-b-0">
                    <p className="text-[14px] font-semibold text-ink">{condition.name}</p>
                    <p className="text-[13px] text-caption">Severity</p>
                    <CompactSegmented
                      value={condition.severity}
                      options={SEVERITY_OPTIONS}
                      ariaLabel={`Severity for ${condition.name}`}
                      onChange={(severity) =>
                        update({
                          conditions: state.conditions.map((item) =>
                            item.id === condition.id ? { ...item, severity } : item,
                          ),
                        })
                      }
                    />
                    <p className="text-[13px] text-caption">Status</p>
                    <CompactSegmented
                      value={condition.status}
                      options={CONDITION_STATUS_OPTIONS}
                      ariaLabel={`Status for ${condition.name}`}
                      onChange={(status) =>
                        update({
                          conditions: state.conditions.map((item) =>
                            item.id === condition.id ? { ...item, status } : item,
                          ),
                        })
                      }
                    />
                    <p className="text-[13px] text-caption">Years since diagnosis</p>
                    <CompactSegmented
                      value={condition.diagnosisYears}
                      options={CONDITION_DIAGNOSIS_YEARS_OPTIONS}
                      ariaLabel={`Diagnosis years for ${condition.name}`}
                      onChange={(diagnosisYears) =>
                        update({
                          conditions: state.conditions.map((item) =>
                            item.id === condition.id
                              ? { ...item, diagnosisYears }
                              : item,
                          ),
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </ConfirmRow>
        ) : null}

        {showSurgeries ? (
          <ConfirmRow
            label="Past surgeries"
            value={formatSurgeriesList(state.surgeries)}
            editing={editing}
            active={activeField === "surgeries"}
            onActivate={() => setActiveField("surgeries")}
          >
            {activeField === "surgeries" ? (
              <div className="mt-2 space-y-4">
                {state.surgeries.map((surgery) => (
                  <div key={surgery.id} className="space-y-2 border-b border-line pb-3 last:border-b-0">
                    <p className="text-[14px] font-semibold text-ink">{surgery.name}</p>
                    <input
                      aria-label={`Year for ${surgery.name}`}
                      inputMode="numeric"
                      placeholder="Year"
                      className={confirmControlClass()}
                      value={surgery.year}
                      onChange={(event) =>
                        update({
                          surgeries: state.surgeries.map((item) =>
                            item.id === surgery.id
                              ? {
                                  ...item,
                                  year: event.target.value.replace(/\D/g, "").slice(0, 4),
                                }
                              : item,
                          ),
                        })
                      }
                    />
                    <input
                      aria-label={`Complications for ${surgery.name}`}
                      placeholder="Complications"
                      className={confirmControlClass()}
                      value={surgery.complications}
                      onChange={(event) =>
                        update({
                          surgeries: state.surgeries.map((item) =>
                            item.id === surgery.id
                              ? { ...item, complications: event.target.value.slice(0, 75) }
                              : item,
                          ),
                        })
                      }
                    />
                    <input
                      aria-label={`Implants for ${surgery.name}`}
                      placeholder="Implants / hardware"
                      className={confirmControlClass()}
                      value={surgery.implants}
                      onChange={(event) =>
                        update({
                          surgeries: state.surgeries.map((item) =>
                            item.id === surgery.id
                              ? { ...item, implants: event.target.value.slice(0, 75) }
                              : item,
                          ),
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </ConfirmRow>
        ) : null}

        <ConfirmRow
          label="Family doctor"
          value={formatFamilyDoctorSummary(
            state.hasFamilyDoctor,
            state.familyDoctor,
          )}
          editing={editing}
          active={activeField === "family-doctor"}
          onActivate={() => setActiveField("family-doctor")}
        >
          {activeField === "family-doctor" ? (
            <div className="mt-2 space-y-3">
              <div className="flex gap-2">
                <ConfirmChip
                  selected={state.hasFamilyDoctor === true}
                  onClick={() => update({ hasFamilyDoctor: true })}
                >
                  Yes
                </ConfirmChip>
                <ConfirmChip
                  selected={state.hasFamilyDoctor === false}
                  onClick={() =>
                    update({ hasFamilyDoctor: false, familyDoctor: null })
                  }
                >
                  No
                </ConfirmChip>
              </div>
              {state.hasFamilyDoctor ? (
                <>
                  <SearchField
                    placeholder="Search clinics"
                    value={clinicQuery}
                    onChange={(event) => setClinicQuery(event.target.value)}
                  />
                  <div className="max-h-40 space-y-2 overflow-y-auto">
                    {clinicResults.map((clinic) => (
                      <SelectorCard
                        key={clinic.id}
                        selected={state.familyDoctor?.id === clinic.id}
                        title={clinic.name}
                        description={clinic.address}
                        leading={
                          <RadioDot selected={state.familyDoctor?.id === clinic.id} />
                        }
                        onClick={() => update({ familyDoctor: clinic })}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          ) : null}
        </ConfirmRow>

        <ConfirmRow
          label="Pharmacy"
          value={formatPharmacySummary(state.pharmacy)}
          editing={editing}
          active={activeField === "pharmacy"}
          onActivate={() => setActiveField("pharmacy")}
        >
          {activeField === "pharmacy" ? (
            <div className="mt-2 space-y-3">
              <SearchField
                placeholder="Search pharmacies"
                value={pharmacyQuery}
                onChange={(event) => setPharmacyQuery(event.target.value)}
              />
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {pharmacyResults.map((pharmacy) => (
                  <SelectorCard
                    key={pharmacy.id}
                    selected={state.pharmacy?.id === pharmacy.id}
                    title={pharmacy.name}
                    description={`${pharmacy.address} · ${pharmacy.phone}`}
                    leading={
                      <RadioDot selected={state.pharmacy?.id === pharmacy.id} />
                    }
                    onClick={() => update({ pharmacy })}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </ConfirmRow>

        {editing ? (
          <div className="flex items-center gap-3 py-3">
            <GhostButton
              className="min-w-0 w-auto flex-1 basis-0"
              onClick={cancelEdits}
            >
              Cancel
            </GhostButton>
            <PrimaryButton
              className="h-10 min-w-0 w-auto flex-1 basis-0 text-[16px] leading-[22px]"
              onClick={stopEditing}
            >
              Confirm Edits
            </PrimaryButton>
          </div>
        ) : null}
      </div>
    </OnboardingShell>
  );
}
