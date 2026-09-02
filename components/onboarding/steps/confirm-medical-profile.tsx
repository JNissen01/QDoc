"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
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
  Allergy,
  Condition,
  HistoryCategory,
  Medication,
  OnboardingState,
  Surgery,
} from "@/lib/onboarding-state";
import { cn } from "@/lib/utils";

type ConfirmField =
  | "biometrics"
  | "pronouns"
  | "medications"
  | "allergies"
  | "conditions"
  | "surgeries"
  | "family-doctor"
  | "pharmacy";

type HistoryField = "medications" | "allergies" | "conditions" | "surgeries";

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

type HistorySlice = {
  medications: Medication[];
  allergies: Allergy[];
  conditions: Condition[];
  surgeries: Surgery[];
};

const PERSONAL_SECTIONS = new Set<ConfirmField>(["biometrics", "pronouns"]);
const CARE_TEAM_SECTIONS = new Set<ConfirmField>([
  "family-doctor",
  "pharmacy",
]);

function cloneHistorySlice(state: HistorySlice): HistorySlice {
  return {
    medications: state.medications.map((item) => ({ ...item })),
    allergies: state.allergies.map((item) => ({
      ...item,
      reactions: [...item.reactions],
    })),
    conditions: state.conditions.map((item) => ({ ...item })),
    surgeries: state.surgeries.map((item) => ({ ...item })),
  };
}

function sliceForCategory(
  category: HistoryField,
  state: HistorySlice,
): Partial<HistorySlice> {
  switch (category) {
    case "medications":
      return { medications: state.medications };
    case "allergies":
      return { allergies: state.allergies };
    case "conditions":
      return { conditions: state.conditions };
    case "surgeries":
      return { surgeries: state.surgeries };
  }
}

function ReviewGroup({
  title,
  actionLabel,
  onAction,
  actionAriaLabel,
  children,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  actionAriaLabel?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[16px] leading-[22px] font-semibold text-ink">
          {title}
        </h2>
        {onAction && actionLabel ? (
          <button
            type="button"
            onClick={onAction}
            aria-label={actionAriaLabel ?? actionLabel}
            className="text-[16px] leading-[22px] font-medium text-action"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

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

export function ConfirmMedicalProfileStep() {
  const [exitMode, setExitMode] = useState(false);
  const { state, update, goNext, goTo, router, ready } = useStepNav(
    "confirm-medical-profile",
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setExitMode(params.get("exit") === "1");
  }, []);
  const [editingSection, setEditingSection] = useState<ConfirmField | null>(
    null,
  );
  const [activeField, setActiveField] = useState<ConfirmField | null>(null);
  const [historyBroken, setHistoryBroken] = useState(false);
  const [openHistoryCategory, setOpenHistoryCategory] =
    useState<HistoryField | null>(null);
  const [historyCategoryDraft, setHistoryCategoryDraft] =
    useState<HistorySlice | null>(null);
  const personalEditing =
    editingSection !== null && PERSONAL_SECTIONS.has(editingSection);
  const careTeamEditing =
    editingSection !== null && CARE_TEAM_SECTIONS.has(editingSection);
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

  const currentHistorySlice = useMemo(
    () => ({
      medications: state.medications,
      allergies: state.allergies,
      conditions: state.conditions,
      surgeries: state.surgeries,
    }),
    [state.medications, state.allergies, state.conditions, state.surgeries],
  );

  const isHistoryDirty = useMemo(() => {
    if (!openHistoryCategory || !historyCategoryDraft) return false;
    const live = sliceForCategory(openHistoryCategory, currentHistorySlice);
    const snap = sliceForCategory(openHistoryCategory, historyCategoryDraft);
    return JSON.stringify(live) !== JSON.stringify(snap);
  }, [openHistoryCategory, historyCategoryDraft, currentHistorySlice]);

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
    if (PERSONAL_SECTIONS.has(section) || CARE_TEAM_SECTIONS.has(section)) {
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

  function breakApartHistory() {
    setHistoryBroken(true);
    setOpenHistoryCategory(null);
    setHistoryCategoryDraft(null);
  }

  function doneHistoryBroken() {
    if (openHistoryCategory && isHistoryDirty) return;
    setOpenHistoryCategory(null);
    setHistoryCategoryDraft(null);
    setHistoryBroken(false);
  }

  function openHistorySection(category: HistoryField) {
    if (openHistoryCategory === category) return;
    if (openHistoryCategory && isHistoryDirty) return;
    setOpenHistoryCategory(category);
    setHistoryCategoryDraft(cloneHistorySlice(currentHistorySlice));
  }

  function cancelHistoryCategory() {
    if (historyCategoryDraft && openHistoryCategory) {
      update(sliceForCategory(openHistoryCategory, historyCategoryDraft));
    }
    setOpenHistoryCategory(null);
    setHistoryCategoryDraft(null);
  }

  function confirmHistoryCategory() {
    setOpenHistoryCategory(null);
    setHistoryCategoryDraft(null);
  }

  const showMedications = shouldShowCategory("medications", state, exitMode);
  const showAllergies = shouldShowCategory("allergies", state, exitMode);
  const showConditions = shouldShowCategory("conditions", state, exitMode);
  const showSurgeries = shouldShowCategory("surgeries", state, exitMode);
  const hasHistory =
    showMedications || showAllergies || showConditions || showSurgeries;

  const heightSuffix = system === "metric" ? "cm" : "ft";
  const weightSuffix = system === "metric" ? "kg" : "lbs";
  const footerLocked =
    personalEditing || careTeamEditing || openHistoryCategory !== null;

  const historyCategories: {
    id: HistoryField;
    label: string;
    show: boolean;
    value: string;
  }[] = [
    {
      id: "medications",
      label: "Medications",
      show: showMedications,
      value: formatMedicationsList(state.medications),
    },
    {
      id: "allergies",
      label: "Allergies",
      show: showAllergies,
      value: formatAllergiesList(state.allergies),
    },
    {
      id: "conditions",
      label: "Ongoing conditions",
      show: showConditions,
      value: formatConditionsList(state.conditions),
    },
    {
      id: "surgeries",
      label: "Past surgeries",
      show: showSurgeries,
      value: formatSurgeriesList(state.surgeries),
    },
  ];

  function renderHistoryEditors(category: HistoryField) {
    switch (category) {
      case "medications":
        return (
          <div>
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
        );
      case "allergies":
        return (
          <div>
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
        );
      case "conditions":
        return (
          <div>
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
        );
      case "surgeries":
        return (
          <div>
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
        );
    }
  }
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
          disabled={footerLocked}
          onClick={() => (exitMode ? goTo("dashboard") : goNext())}
        >
          {exitMode ? "Exit" : "Confirm"}
        </PrimaryButton>
      }
    >
      <div className="space-y-6">
      <ReviewGroup
        title="Personal"
        actionLabel={personalEditing ? undefined : "Edit"}
        onAction={
          personalEditing ? undefined : () => startSectionEdit("biometrics")
        }
        actionAriaLabel="Edit personal information"
      >
      <div
        className={cn(
          "overflow-hidden rounded-[14px] border bg-white px-4",
          personalEditing ? "border-action" : "border-line",
        )}
      >
        <ConfirmRow
          label="Body metrics"
          value={[
            state.height.trim()
              ? `Height · ${formatHeightDisplay(state.height, system)} ${heightSuffix}`
              : null,
            state.weight.trim()
              ? `Weight · ${formatWeightDisplay(state.weight, system)} ${weightSuffix}`
              : null,
          ]
            .filter(Boolean)
            .join("\n\n") || "—"}
          editing={personalEditing}
          active={activeField === "biometrics"}
          onActivate={() => setActiveField("biometrics")}
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[13px] text-caption">Height ({heightSuffix})</p>
              <input
                aria-label={`Height (${heightSuffix})`}
                inputMode="decimal"
                className={confirmControlClass()}
                value={heightDraft}
                onFocus={() => setActiveField("biometrics")}
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
                aria-label={`Weight (${weightSuffix})`}
                inputMode="decimal"
                className={confirmControlClass()}
                value={weightDraft}
                onFocus={() => setActiveField("biometrics")}
                onChange={(event) => {
                  const next = event.target.value;
                  setWeightDraft(next);
                  const metric = parseWeightToKg(next, system);
                  if (metric !== null) update({ weight: metric });
                }}
              />
            </div>
          </div>
        </ConfirmRow>

        <ConfirmRow
          label="Pronouns"
          value={state.pronouns || "—"}
          editing={personalEditing}
          active={activeField === "pronouns"}
          onActivate={() => setActiveField("pronouns")}
        >
          <input
            aria-label="Pronouns"
            className={confirmControlClass()}
            value={state.pronouns}
            placeholder="e.g. They/them"
            onFocus={() => setActiveField("pronouns")}
            onChange={(event) => update({ pronouns: event.target.value })}
          />
        </ConfirmRow>

        {personalEditing ? (
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
      </ReviewGroup>

      <ReviewGroup
        title="Care team"
        actionLabel={careTeamEditing ? undefined : "Edit"}
        onAction={
          careTeamEditing ? undefined : () => startSectionEdit("family-doctor")
        }
        actionAriaLabel="Edit care team"
      >
      <div
        className={cn(
          "overflow-hidden rounded-[14px] border bg-white px-4",
          careTeamEditing ? "border-action" : "border-line",
        )}
      >
        <ConfirmRow
          label="Family doctor"
          value={formatFamilyDoctorSummary(
            state.hasFamilyDoctor,
            state.familyDoctor,
          )}
          editing={careTeamEditing}
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
          editing={careTeamEditing}
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

        {careTeamEditing ? (
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
      </ReviewGroup>

      {hasHistory ? (
        <ReviewGroup
          title="Medical history"
          actionLabel={
            historyBroken
              ? openHistoryCategory
                ? undefined
                : "Done"
              : "Edit"
          }
          onAction={
            historyBroken
              ? openHistoryCategory
                ? undefined
                : doneHistoryBroken
              : breakApartHistory
          }
          actionAriaLabel={
            historyBroken ? "Done editing medical history" : "Edit medical history"
          }
        >
          {!historyBroken ? (
            <div className="overflow-hidden rounded-[14px] border border-line bg-white px-4">
              {historyCategories
                .filter((category) => category.show)
                .map((category) => (
                  <ConfirmRow
                    key={category.id}
                    label={category.label}
                    value={category.value}
                    editing={false}
                    active={false}
                  />
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {historyCategories
                .filter((category) => category.show)
                .map((category) => {
                  const isOpen = openHistoryCategory === category.id;
                  return (
                    <ReviewSectionCard
                      key={category.id}
                      label={category.label}
                      value={category.value}
                      editing={isOpen}
                      onStartEdit={() => openHistorySection(category.id)}
                      onCancel={cancelHistoryCategory}
                      onConfirm={confirmHistoryCategory}
                    >
                      {renderHistoryEditors(category.id)}
                    </ReviewSectionCard>
                  );
                })}
            </div>
          )}
        </ReviewGroup>
      ) : null}
      </div>
    </OnboardingShell>
  );
}
