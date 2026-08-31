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
    note: "Canadian resident in MB / ON / NU · 1/2",
  },
  coverage: { title: "Coverage", note: "2/2" },
  "off-ramp": {
    title: "Off-ramp",
    note: "Waitlist for uncovered areas · confirms, then returns to welcome",
  },
  "account-intro": {
    title: "Account intro",
    note: "Email · Create Account CTA",
  },
  "confirm-email": { title: "Confirm your email", note: "5-digit code · 1/6" },
  contact: {
    title: "Contact information",
    note: "Phone · 2/6",
  },
  password: {
    title: "Create a password",
    note: "Password · 3/6",
  },
  name: { title: "Legal name", note: "4/6" },
  sex: {
    title: "Sex assigned at birth",
    note: "5/6 · account phase",
  },
  address: { title: "Address", note: "6/6 · end of account phase" },
  dob: {
    title: "Date of birth",
    note: "Public path 4/6 · also private/uninsured",
  },
  "scan-card": {
    title: "Scan intro",
    note: "No progress bar · start of public path",
  },
  "issued-province": {
    title: "Issuing province",
    note: "1 of 6",
  },
  "registration-number": {
    title: "Registration number",
    note: "2 of 6",
  },
  "health-card": {
    title: "Health card number",
    note: "3 of 6",
  },
  "confirm-info": {
    title: "Confirm information",
    note: "5 of 6",
  },
  "insurance-provider": {
    title: "Insurance provider",
    note: "1 of 3 · MSH",
  },
  "insurance-policy": {
    title: "Policy / group number",
    note: "2 of 3",
  },
  "insurance-member": {
    title: "Member ID",
    note: "3 of 3",
  },
  "payment-intro": {
    title: "No insurance? No problem.",
    note: "Uninsured · 1 of 2",
  },
  payment: { title: "Payment", note: "Uninsured · 2 of 2" },
  checkpoint: { title: "Checkpoint" },
  biometrics: { title: "Biometrics", note: "Phase 2 · 1/7" },
  pronouns: { title: "Pronouns", note: "Phase 2 · 2/7" },
  "medical-history": { title: "Medical history", note: "Phase 2 · 3/7" },
  medications: { title: "Medications", note: "Phase 2 · 4/7, gated" },
  allergies: { title: "Allergies", note: "Phase 2 · 4/7, gated" },
  conditions: { title: "Ongoing conditions", note: "Phase 2 · 4/7, gated" },
  surgeries: { title: "Past surgeries", note: "Phase 2 · 4/7, gated" },
  "family-doctor": { title: "Family doctor", note: "Phase 2 · 5/7" },
  pharmacy: { title: "Pharmacy", note: "Phase 2 · 6/7" },
  success: { title: "Success", note: "Phase 2 · 7/7" },
};

/** Thematic section for the prototype map (not strictly linear journey order). */
const SECTION_BY_STEP: Record<StepId | "dashboard", FlowSectionId> = {
  welcome: "welcome-triage",
  "service-area": "welcome-triage",
  coverage: "welcome-triage",
  "off-ramp": "welcome-triage",
  "account-intro": "account",
  "confirm-email": "account",
  contact: "account",
  password: "account",
  name: "account",
  sex: "account",
  address: "account",
  "scan-card": "public-insurance",
  "issued-province": "public-insurance",
  "registration-number": "public-insurance",
  "health-card": "public-insurance",
  dob: "public-insurance",
  "confirm-info": "public-insurance",
  "insurance-provider": "private-insurance",
  "insurance-policy": "private-insurance",
  "insurance-member": "private-insurance",
  "payment-intro": "no-insurance",
  payment: "no-insurance",
  checkpoint: "medical-profile",
  pronouns: "medical-profile",
  pharmacy: "medical-profile",
  "family-doctor": "medical-profile",
  biometrics: "medical-profile",
  "medical-history": "medical-profile",
  medications: "medical-profile",
  allergies: "medical-profile",
  conditions: "medical-profile",
  surgeries: "medical-profile",
  success: "medical-profile",
  dashboard: "dashboard",
};

/** Preferred order of screens within each section. */
const SECTION_ORDER: Record<FlowSectionId, Array<StepId | "dashboard">> = {
  "welcome-triage": ["welcome", "service-area", "coverage", "off-ramp"],
  account: [
    "account-intro",
    "confirm-email",
    "contact",
    "password",
    "name",
    "sex",
    "address",
  ],
  "public-insurance": [
    "scan-card",
    "issued-province",
    "registration-number",
    "health-card",
    "dob",
    "confirm-info",
  ],
  "private-insurance": [
    "insurance-provider",
    "insurance-policy",
    "insurance-member",
  ],
  "no-insurance": ["payment-intro", "payment"],
  "medical-profile": [
    "checkpoint",
    "biometrics",
    "pronouns",
    "medical-history",
    "medications",
    "allergies",
    "conditions",
    "surgeries",
    "family-doctor",
    "pharmacy",
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
