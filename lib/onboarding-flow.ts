import type { HistoryCategory, OnboardingState } from "@/lib/onboarding-state";

export const STEP_IDS = [
  "welcome",
  "service-area",
  "coverage",
  "off-ramp",
  "account-intro",
  "contact",
  "confirm-email",
  "password",
  "name",
  "sex",
  "address",
  "dob",
  "scan-card",
  "issued-province",
  "registration-number",
  "health-card",
  "confirm-info",
  "insurance-provider",
  "insurance-policy",
  "insurance-member",
  "payment-intro",
  "payment",
  "checkpoint",
  "biometrics",
  "pronouns",
  "medical-history",
  "medications",
  "family-doctor",
  "pharmacy",
  "success",
] as const;

export type StepId = (typeof STEP_IDS)[number];

export function isStepId(value: string): value is StepId {
  return (STEP_IDS as readonly string[]).includes(value);
}

export type ProgressMeta = {
  current: number;
  total: number;
  hidden?: boolean;
};

const TRIAGE_PHASE = 2;
const ACCOUNT_PHASE = 6;
const PUBLIC_INSURANCE_PHASE = 6;
const PRIVATE_INSURANCE_PHASE = 3;
const PAYMENT_PHASE = 2;
const PHASE2 = 7;

export function getProgress(
  step: StepId,
  state?: Pick<OnboardingState, "coverage">,
): ProgressMeta {
  switch (step) {
    case "welcome":
    case "off-ramp":
    case "account-intro":
      return { current: 0, total: ACCOUNT_PHASE, hidden: true };
    case "service-area":
      return { current: 1, total: TRIAGE_PHASE };
    case "coverage":
      return { current: 2, total: TRIAGE_PHASE };
    case "contact":
      return { current: 1, total: ACCOUNT_PHASE };
    case "confirm-email":
      return { current: 2, total: ACCOUNT_PHASE };
    case "password":
      return { current: 3, total: ACCOUNT_PHASE };
    case "name":
      return { current: 4, total: ACCOUNT_PHASE };
    case "sex":
      return { current: 5, total: ACCOUNT_PHASE };
    case "address":
      return { current: 6, total: ACCOUNT_PHASE };
    case "scan-card":
      return { current: 0, total: PUBLIC_INSURANCE_PHASE, hidden: true };
    case "issued-province":
      return { current: 1, total: PUBLIC_INSURANCE_PHASE };
    case "registration-number":
      return { current: 2, total: PUBLIC_INSURANCE_PHASE };
    case "health-card":
      return { current: 3, total: PUBLIC_INSURANCE_PHASE };
    case "dob":
      // Public path uses the insurance tracker; private/uninsured keeps a light account-style bar.
      if (state?.coverage === "private" || state?.coverage === "uninsured") {
        return { current: 1, total: ACCOUNT_PHASE };
      }
      return { current: 4, total: PUBLIC_INSURANCE_PHASE };
    case "confirm-info":
      return { current: 5, total: PUBLIC_INSURANCE_PHASE };
    case "insurance-provider":
      return { current: 1, total: PRIVATE_INSURANCE_PHASE };
    case "insurance-policy":
      return { current: 2, total: PRIVATE_INSURANCE_PHASE };
    case "insurance-member":
      return { current: 3, total: PRIVATE_INSURANCE_PHASE };
    case "payment-intro":
      return { current: 1, total: PAYMENT_PHASE };
    case "payment":
      return { current: 2, total: PAYMENT_PHASE };
    case "checkpoint":
      return { current: 0, total: ACCOUNT_PHASE, hidden: true };
    case "pronouns":
      return { current: 2, total: PHASE2 };
    case "medical-history":
      return { current: 3, total: PHASE2 };
    case "medications":
      return { current: 4, total: PHASE2 };
    case "family-doctor":
      return { current: 5, total: PHASE2 };
    case "pharmacy":
      return { current: 6, total: PHASE2 };
    case "biometrics":
      return { current: 1, total: PHASE2 };
    case "success":
      return { current: 7, total: PHASE2 };
  }
}

function hasCategory(state: OnboardingState, category: HistoryCategory) {
  return state.historyCategories.includes(category);
}

export function getNextStep(
  current: StepId,
  state: OnboardingState,
): StepId | "dashboard" {
  switch (current) {
    case "welcome":
      return "service-area";
    case "service-area":
      return state.inServiceArea ? "coverage" : "off-ramp";
    case "off-ramp":
      return "service-area";
    case "coverage":
      return "account-intro";
    case "account-intro":
      return "contact";
    case "contact":
      return "confirm-email";
    case "confirm-email":
      return "password";
    case "password":
      return "name";
    case "name":
      return "sex";
    case "sex":
      return "address";
    case "address":
      // Public insurance collects DOB inside its own cluster; sex is already captured in account.
      if (state.coverage === "provincial") return "scan-card";
      return "dob";
    case "dob":
      if (state.coverage === "provincial") return "confirm-info";
      if (state.coverage === "private") return "insurance-provider";
      return "payment-intro";
    case "scan-card":
      return "issued-province";
    case "issued-province":
      return "registration-number";
    case "registration-number":
      return "health-card";
    case "health-card":
      return "dob";
    case "confirm-info":
    case "payment":
      return "checkpoint";
    case "payment-intro":
      return "payment";
    case "insurance-provider":
      return "insurance-policy";
    case "insurance-policy":
      return "insurance-member";
    case "insurance-member":
      return "checkpoint";
    case "checkpoint":
      return "biometrics";
    case "biometrics":
      return "pronouns";
    case "pronouns":
      return "medical-history";
    case "medical-history":
      return hasCategory(state, "medications")
        ? "medications"
        : "family-doctor";
    case "medications":
      return "family-doctor";
    case "family-doctor":
      return "pharmacy";
    case "pharmacy":
      return "success";
    case "success":
      return "dashboard";
  }
}

export function getPrevStep(
  current: StepId,
  state: OnboardingState,
): StepId | null {
  switch (current) {
    case "welcome":
      return null;
    case "service-area":
      return "welcome";
    case "off-ramp":
    case "coverage":
      return "service-area";
    case "account-intro":
      return "coverage";
    case "contact":
      return "account-intro";
    case "confirm-email":
      return "contact";
    case "password":
      return "confirm-email";
    case "name":
      return "password";
    case "sex":
      return "name";
    case "address":
      return "sex";
    case "scan-card":
      return "address";
    case "issued-province":
      return "scan-card";
    case "registration-number":
      return "issued-province";
    case "health-card":
      return "registration-number";
    case "dob":
      if (state.coverage === "provincial") return "health-card";
      return "address";
    case "confirm-info":
      return "dob";
    case "insurance-provider":
      return "dob";
    case "insurance-policy":
      return "insurance-provider";
    case "insurance-member":
      return "insurance-policy";
    case "payment-intro":
      return "dob";
    case "payment":
      return "payment-intro";
    case "checkpoint":
      if (state.coverage === "provincial") return "confirm-info";
      if (state.coverage === "private") return "insurance-member";
      return "payment";
    case "biometrics":
      return "checkpoint";
    case "pronouns":
      return "biometrics";
    case "medical-history":
      return "pronouns";
    case "medications":
      return "medical-history";
    case "family-doctor":
      return hasCategory(state, "medications")
        ? "medications"
        : "medical-history";
    case "pharmacy":
      return "family-doctor";
    case "success":
      return "pharmacy";
  }
}

export function hrefFor(target: StepId | "dashboard") {
  if (target === "dashboard") return "/dashboard";
  return `/onboarding/${target}`;
}
