"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import {
  ConfirmChip,
  ConfirmRow,
  ReviewSectionCard,
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
  AllergyEntryCard,
  ConditionEntryCard,
  MedicationEntryCard,
  SurgeryEntryCard,
} from "@/components/onboarding/steps/health-profile";
import {
  formatHeightDisplay,
  formatWeightDisplay,
  parseHeightToCm,
  parseWeightToKg,
} from "@/lib/biometrics-units";
import {
  filterByQuery,
  MOCK_CLINICS,
  MOCK_PHARMACIES,
} from "@/lib/mocks";
import {
  formatAllergiesList,
  formatBiometricsRow,
  formatConditionsList,
  formatFamilyDoctorSummary,
  formatMedicationsList,
  formatPharmacySummary,
  formatSurgeriesList,
} from "@/lib/medical-profile-display";
import type {
  HistoryCategory,
  MeasurementSystem,
  OnboardingState,
} from "@/lib/onboarding-state";
import { cn } from "@/lib/utils";

const PRONOUNS = ["She/her", "He/him", "They/them", "Prefer not to say"];

type ConfirmField =
  | "biometrics"
  | "pronouns"
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
  | "medications"
  | "allergies"
  | "conditions"
  | "surgeries"
  | "hasFamilyDoctor"
  | "familyDoctor"
  | "pharmacy"
>;

const MAIN_SECTIONS = new Set<ConfirmField>([
  "biometrics",
  "pronouns",
  "family-doctor",
  "pharmacy",
]);

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
  const [editingSection, setEditingSection] = useState<ConfirmField | null>(null);
  const [activeField, setActiveField] = useState<ConfirmField | null>(null);
  const mainEditing =
    editingSection !== null && MAIN_SECTIONS.has(editingSection);
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

  function startSectionEdit(section: ConfirmField) {
    setDraft({
      measurementSystem: state.measurementSystem,
      height: state.height,
      weight: state.weight,
      pronouns: state.pronouns,
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
    if (section === "biometrics") {
      setHeightDraft(formatHeightDisplay(state.height, system));
      setWeightDraft(formatWeightDisplay(state.weight, system));
    }
    setEditingSection(section);
    if (MAIN_SECTIONS.has(section)) {
      setActiveField(section);
    } else {
      setActiveField(null);
    }
  }

  function stopSectionEdit() {
    setEditingSection(null);
    setActiveField(null);
    setDraft(null);
    setClinicQuery("");
    setPharmacyQuery("");
  }

  function cancelSectionEdit() {
    if (draft) {
      update(draft);
      setHeightDraft(formatHeightDisplay(draft.height, draft.measurementSystem));
      setWeightDraft(formatWeightDisplay(draft.weight, draft.measurementSystem));
    }
    stopSectionEdit();
  }

  const showMedications = shouldShowCategory("medications", state, exitMode);
  const showAllergies = shouldShowCategory("allergies", state, exitMode);
  const showConditions = shouldShowCategory("conditions", state, exitMode);
  const showSurgeries = shouldShowCategory("surgeries", state, exitMode);

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
          disabled={editingSection !== null}
          onClick={() => (exitMode ? goTo("dashboard") : goNext())}
        >
          {exitMode ? "Exit" : "Confirm"}
        </PrimaryButton>
      }
    >
      <div className="space-y-3">
      <div
        className={cn(
          "relative overflow-hidden rounded-[14px] border bg-white px-4",
          mainEditing ? "border-action" : "border-line",
        )}
      >
        {!mainEditing ? (
          <button
            type="button"
            onClick={() => startSectionEdit("biometrics")}
            aria-label="Edit information"
            className="absolute top-3 right-3 z-10 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-action"
          >
            <Pencil className="size-4" strokeWidth={1.8} />
          </button>
        ) : null}

        <ConfirmRow
          label="Height / weight"
          value={formatBiometricsRow(state.height, state.weight, system)}
          editing={mainEditing}
          active={activeField === "biometrics"}
          reserveAction={!mainEditing}
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
          editing={mainEditing}
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

        <ConfirmRow
          label="Family doctor"
          value={formatFamilyDoctorSummary(
            state.hasFamilyDoctor,
            state.familyDoctor,
          )}
          editing={mainEditing}
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
          editing={mainEditing}
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

        {mainEditing ? (
          <div className="flex items-center gap-3 py-3">
            <GhostButton
              className="min-w-0 w-auto flex-1 basis-0"
              onClick={cancelSectionEdit}
            >
              Cancel
            </GhostButton>
            <PrimaryButton
              className="h-10 min-w-0 w-auto flex-1 basis-0 text-[16px] leading-[22px]"
              onClick={stopSectionEdit}
            >
              Confirm Edits
            </PrimaryButton>
          </div>
        ) : null}
      </div>

      {showMedications ? (
        <ReviewSectionCard
          label="Medications"
          value={formatMedicationsList(state.medications)}
          editing={editingSection === "medications"}
          onStartEdit={() => startSectionEdit("medications")}
          onCancel={cancelSectionEdit}
          onConfirm={stopSectionEdit}
        >
          <div className="space-y-4">
            {state.medications.map((medication) => (
              <MedicationEntryCard
                key={medication.id}
                reviewMode
                draft={medication}
                isEditing
                onChange={(next) =>
                  update({
                    medications: state.medications.map((item) =>
                      item.id === medication.id ? next : item,
                    ),
                  })
                }
                onDismiss={() => {}}
                onSave={() => {}}
              />
            ))}
          </div>
        </ReviewSectionCard>
      ) : null}

      {showAllergies ? (
        <ReviewSectionCard
          label="Allergies"
          value={formatAllergiesList(state.allergies)}
          editing={editingSection === "allergies"}
          onStartEdit={() => startSectionEdit("allergies")}
          onCancel={cancelSectionEdit}
          onConfirm={stopSectionEdit}
        >
          <div className="space-y-4">
            {state.allergies.map((allergy) => (
              <AllergyEntryCard
                key={allergy.id}
                reviewMode
                draft={allergy}
                isEditing
                onChange={(next) =>
                  update({
                    allergies: state.allergies.map((item) =>
                      item.id === allergy.id ? next : item,
                    ),
                  })
                }
                onDismiss={() => {}}
                onSave={() => {}}
              />
            ))}
          </div>
        </ReviewSectionCard>
      ) : null}

      {showConditions ? (
        <ReviewSectionCard
          label="Ongoing conditions"
          value={formatConditionsList(state.conditions)}
          editing={editingSection === "conditions"}
          onStartEdit={() => startSectionEdit("conditions")}
          onCancel={cancelSectionEdit}
          onConfirm={stopSectionEdit}
        >
          <div className="space-y-4">
            {state.conditions.map((condition) => (
              <ConditionEntryCard
                key={condition.id}
                reviewMode
                draft={condition}
                isEditing
                onChange={(next) =>
                  update({
                    conditions: state.conditions.map((item) =>
                      item.id === condition.id ? next : item,
                    ),
                  })
                }
                onDismiss={() => {}}
                onSave={() => {}}
              />
            ))}
          </div>
        </ReviewSectionCard>
      ) : null}

      {showSurgeries ? (
        <ReviewSectionCard
          label="Past surgeries"
          value={formatSurgeriesList(state.surgeries)}
          editing={editingSection === "surgeries"}
          onStartEdit={() => startSectionEdit("surgeries")}
          onCancel={cancelSectionEdit}
          onConfirm={stopSectionEdit}
        >
          <div className="space-y-4">
            {state.surgeries.map((surgery) => (
              <SurgeryEntryCard
                key={surgery.id}
                reviewMode
                draft={surgery}
                isEditing
                onChange={(next) =>
                  update({
                    surgeries: state.surgeries.map((item) =>
                      item.id === surgery.id ? next : item,
                    ),
                  })
                }
                onDismiss={() => {}}
                onSave={() => {}}
              />
            ))}
          </div>
        </ReviewSectionCard>
      ) : null}
      </div>
    </OnboardingShell>
  );
}
