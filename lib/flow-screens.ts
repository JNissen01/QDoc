import { STEP_IDS, hrefFor, type StepId } from "@/lib/onboarding-flow";

export type FlowScreen = {
  id: StepId | "dashboard";
  href: string;
  title: string;
  note?: string;
};

const TITLES: Record<StepId, { title: string; note?: string }> = {
  welcome: { title: "Welcome", note: "Begin registration" },
  "service-area": {
    title: "Service area",
    note: "Canadian resident in MB / ON / NU",
  },
  coverage: { title: "Coverage" },
  "issued-province": {
    title: "Issued province",
    note: "Provincial coverage",
  },
  "off-ramp": { title: "Off-ramp", note: "Outside the service area" },
  "account-intro": { title: "Account intro", note: "After triage" },
  account: { title: "Create account" },
  "confirm-email": { title: "Confirm email" },
  name: { title: "Name" },
  dob: { title: "Date of birth" },
  phone: { title: "Phone" },
  pronouns: { title: "Pronouns" },
  gender: { title: "Gender" },
  sex: { title: "Sex" },
  address: { title: "Address" },
  "scan-card": { title: "Scan health card", note: "Provincial coverage" },
  "health-card": { title: "Health card number", note: "Provincial coverage" },
  insurance: { title: "Private insurance", note: "Private coverage" },
  payment: { title: "Payment", note: "Uninsured" },
  checkpoint: { title: "Checkpoint" },
  pharmacy: { title: "Pharmacy", note: "Phase 2" },
  "family-doctor": { title: "Family doctor", note: "Phase 2" },
  biometrics: { title: "Biometrics", note: "Phase 2" },
  "medical-history": { title: "Medical history", note: "Phase 2" },
  medications: { title: "Medications", note: "Phase 2, gated" },
  allergies: { title: "Allergies", note: "Phase 2, gated" },
  conditions: { title: "Conditions", note: "Phase 2, gated" },
  success: { title: "Success", note: "Phase 2" },
};

export const FLOW_SCREENS: FlowScreen[] = [
  ...STEP_IDS.map((id) => ({
    id,
    href: hrefFor(id),
    title: TITLES[id].title,
    note: TITLES[id].note,
  })),
  {
    id: "dashboard",
    href: hrefFor("dashboard"),
    title: "Dashboard",
    note: "End of flow",
  },
];
