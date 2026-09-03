import type { HistoryCategory } from "@/lib/onboarding-state";

export const HISTORY_OPTIONS: {
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
    description: "Diagnoses you're currently managing",
  },
  {
    value: "surgeries",
    title: "Past surgeries",
    description: "Any prior procedures or operations",
  },
  { value: "none", title: "None of these apply to me" },
];
