import {
  CONDITION_DIAGNOSIS_YEARS_OPTIONS,
  CONDITION_STATUS_OPTIONS,
} from "@/lib/mocks";
import type {
  Allergy,
  Clinic,
  Condition,
  ConditionDiagnosisYears,
  ConditionStatus,
  HistoryCategory,
  MeasurementSystem,
  Medication,
  Pharmacy,
  Surgery,
} from "@/lib/onboarding-state";
import { formatBiometricsSummary } from "@/lib/biometrics-units";
import { HISTORY_OPTIONS } from "@/lib/history-options";

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

export function formatConditionSummary(condition: Condition) {
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

export function formatMedicationSummary(medication: Medication) {
  return [medication.name, medication.dosage, medication.frequency]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" · ");
}

export function formatAllergySummary(allergy: Allergy) {
  const severity = allergy.severity
    ? allergy.severity.charAt(0).toUpperCase() + allergy.severity.slice(1)
    : null;
  return [allergy.name, severity, allergy.reactions.join(", ")]
    .filter(Boolean)
    .join(" · ");
}

export function formatSurgerySummary(surgery: Surgery) {
  const lines = [surgery.name];
  if (surgery.year.trim()) lines.push(surgery.year.trim());
  if (surgery.complications.trim()) lines.push(surgery.complications.trim());
  if (surgery.implants.trim()) lines.push(surgery.implants.trim());
  return lines.join("\n");
}

export function formatFamilyDoctorSummary(
  hasFamilyDoctor: boolean | null,
  familyDoctor: Clinic | null,
) {
  if (hasFamilyDoctor === false) return "No";
  if (hasFamilyDoctor === true && familyDoctor) {
    return `Yes — ${familyDoctor.name}`;
  }
  if (hasFamilyDoctor === true) return "Yes";
  return "—";
}

export function formatPharmacySummary(pharmacy: Pharmacy | null) {
  if (!pharmacy) return "—";
  return `${pharmacy.name}\n${pharmacy.address}`;
}

export function formatHistoryCategoriesSummary(categories: HistoryCategory[]) {
  if (categories.includes("none")) return "None of these apply to me";
  if (categories.length === 0) return "—";
  return categories
    .map(
      (category) =>
        HISTORY_OPTIONS.find((option) => option.value === category)?.title ??
        category,
    )
    .join(", ");
}

export function formatBiometricsRow(
  height: string,
  weight: string,
  system: MeasurementSystem,
) {
  return formatBiometricsSummary(height, weight, system);
}

export function formatMedicationsList(medications: Medication[]) {
  if (medications.length === 0) return "—";
  return medications.map(formatMedicationSummary).join("\n");
}

export function formatAllergiesList(allergies: Allergy[]) {
  if (allergies.length === 0) return "—";
  return allergies.map(formatAllergySummary).join("\n");
}

export function formatConditionsList(conditions: Condition[]) {
  if (conditions.length === 0) return "—";
  return conditions
    .map((condition) => `${condition.name} — ${formatConditionSummary(condition)}`)
    .join("\n");
}

export function formatSurgeriesList(surgeries: Surgery[]) {
  if (surgeries.length === 0) return "—";
  return surgeries.map(formatSurgerySummary).join("\n\n");
}
