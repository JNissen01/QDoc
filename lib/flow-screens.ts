import { STEP_IDS, hrefFor, type StepId } from "@/lib/onboarding-flow";

export const FLOW_SECTIONS = [
  "welcome-triage",
  "account",
  "public-insurance",
  "private-insurance",
  "no-insurance",
  "medical-profile",
  "dashboard",
] as const;

export type FlowSectionId = (typeof FLOW_SECTIONS)[number];

export type FlowSection = {
  id: FlowSectionId;
  title: string;
  description?: string;
};

export const FLOW_SECTION_META: Record<FlowSectionId, FlowSection> = {
  "welcome-triage": {
    id: "welcome-triage",
    title: "Welcome / triage",
    description: "Entry, service area, coverage choice, and off-ramp",
  },
  account: {
    id: "account",
    title: "Account information",
    description: "Account creation and personal details",
  },
  "public-insurance": {
    id: "public-insurance",
    title: "Public insurance",
    description: "Provincial coverage and health card",
  },
  "private-insurance": {
    id: "private-insurance",
    title: "Private insurance",
    description: "Private coverage details",
  },
  "no-insurance": {
    id: "no-insurance",
    title: "No insurance",
    description: "Uninsured payment path",
  },
  "medical-profile": {
    id: "medical-profile",
    title: "Medical profile",
    description: "Phase 2 clinical intake through success",
  },
  dashboard: {
    id: "dashboard",
    title: "Dashboard",
    description: "End of the onboarding journey",
  },
};

export type FlowScreen = {
  id: StepId | "dashboard";
  href: string;
  title: string;
  note?: string;
  section: FlowSectionId;
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
  "account-intro": { title: "Account intro", note: "Create Account CTA" },
  contact: {
    title: "Contact information",
    note: "Email + phone · 1/5",
  },
  "confirm-email": { title: "Confirm your email", note: "5-digit code · 2/5" },
  password: {
    title: "Create a password",
    note: "Username + password · 3/5",
  },
  name: { title: "Legal name", note: "4/5" },
  address: { title: "Address", note: "5/5 · end of account phase" },
  dob: { title: "Date of birth", note: "After address" },
  pronouns: { title: "Pronouns", note: "After address" },
  gender: { title: "Gender", note: "After address" },
  sex: { title: "Sex", note: "Before coverage details" },
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

/** Thematic section for the prototype map (not strictly linear journey order). */
const SECTION_BY_STEP: Record<StepId | "dashboard", FlowSectionId> = {
  welcome: "welcome-triage",
  "service-area": "welcome-triage",
  coverage: "welcome-triage",
  "off-ramp": "welcome-triage",
  "issued-province": "public-insurance",
  "account-intro": "account",
  contact: "account",
  "confirm-email": "account",
  password: "account",
  name: "account",
  address: "account",
  dob: "account",
  pronouns: "account",
  gender: "account",
  sex: "account",
  "scan-card": "public-insurance",
  "health-card": "public-insurance",
  insurance: "private-insurance",
  payment: "no-insurance",
  checkpoint: "medical-profile",
  pharmacy: "medical-profile",
  "family-doctor": "medical-profile",
  biometrics: "medical-profile",
  "medical-history": "medical-profile",
  medications: "medical-profile",
  allergies: "medical-profile",
  conditions: "medical-profile",
  success: "medical-profile",
  dashboard: "dashboard",
};

/** Preferred order of screens within each section. */
const SECTION_ORDER: Record<FlowSectionId, Array<StepId | "dashboard">> = {
  "welcome-triage": ["welcome", "service-area", "coverage", "off-ramp"],
  account: [
    "account-intro",
    "contact",
    "confirm-email",
    "password",
    "name",
    "address",
    "dob",
    "pronouns",
    "gender",
    "sex",
  ],
  "public-insurance": ["issued-province", "scan-card", "health-card"],
  "private-insurance": ["insurance"],
  "no-insurance": ["payment"],
  "medical-profile": [
    "checkpoint",
    "pharmacy",
    "family-doctor",
    "biometrics",
    "medical-history",
    "medications",
    "allergies",
    "conditions",
    "success",
  ],
  dashboard: ["dashboard"],
};

function screenFor(id: StepId | "dashboard"): FlowScreen {
  if (id === "dashboard") {
    return {
      id: "dashboard",
      href: hrefFor("dashboard"),
      title: "Dashboard",
      note: "End of flow",
      section: "dashboard",
    };
  }
  return {
    id,
    href: hrefFor(id),
    title: TITLES[id].title,
    note: TITLES[id].note,
    section: SECTION_BY_STEP[id],
  };
}

export const FLOW_SCREENS: FlowScreen[] = [
  ...STEP_IDS.map((id) => screenFor(id)),
  screenFor("dashboard"),
];

export type FlowSectionGroup = {
  section: FlowSection;
  screens: FlowScreen[];
};

export function getFlowSections(): FlowSectionGroup[] {
  const byId = new Map(FLOW_SCREENS.map((screen) => [screen.id, screen]));

  return FLOW_SECTIONS.map((sectionId) => {
    const screens = SECTION_ORDER[sectionId]
      .map((id) => byId.get(id))
      .filter((screen): screen is FlowScreen => Boolean(screen));

    return {
      section: FLOW_SECTION_META[sectionId],
      screens,
    };
  }).filter((group) => group.screens.length > 0);
}
