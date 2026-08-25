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
  "address",
  "dob",
  "sex",
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
  "pronouns",
  "gender",
  "pharmacy",
  "family-doctor",
  "biometrics",
  "medical-history",
  "medications",
  "allergies",
  "conditions",
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
const ACCOUNT_PHASE = 5;
const PUBLIC_INSURANCE_PHASE = 7;
const PRIVATE_INSURANCE_PHASE = 3;
const PAYMENT_PHASE = 2;
const PHASE2 = 8;

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
    case "address":
      return { current: 5, total: ACCOUNT_PHASE };
    case "scan-card":
      return { current: 0, total: PUBLIC_INSURANCE_PHASE, hidden: true };
    case "issued-province":
      return { current: 1, total: PUBLIC_INSURANCE_PHASE };
    case "registration-number":
      return { current: 2, total: PUBLIC_INSURANCE_PHASE };
    case "health-card":
      return { current: 3, total: PUBLIC_INSURANCE_PHASE };
    case "dob":
      // Public path (and /flow previews with unset coverage) uses the 7-step tracker.
      if (state?.coverage === "private" || state?.coverage === "uninsured") {
        return { current: 1, total: ACCOUNT_PHASE };
      }
      return { current: 4, total: PUBLIC_INSURANCE_PHASE };
    case "sex":
      if (state?.coverage === "private" || state?.coverage === "uninsured") {
        return { current: 1, total: ACCOUNT_PHASE };
      }
      return { current: 5, total: PUBLIC_INSURANCE_PHASE };
    case "confirm-info":
      return { current: 6, total: PUBLIC_INSURANCE_PHASE };
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
      return { current: 5, total: ACCOUNT_PHASE };
    case "pronouns":
      return { current: 1, total: PHASE2 };
    case "gender":
      return { current: 2, total: PHASE2 };
    case "pharmacy":
      return { current: 3, total: PHASE2 };
    case "family-doctor":
      return { current: 4, total: PHASE2 };
    case "biometrics":
      return { current: 5, total: PHASE2 };
    case "medical-history":
      return { current: 6, total: PHASE2 };
    case "medications":
    case "allergies":
    case "conditions":
      return { current: 7, total: PHASE2 };
    case "success":
      return { current: 8, total: PHASE2 };
  }
}

function hasCategory(state: OnboardingState, category: HistoryCategory) {
  return state.historyCategories.includes(category);
}

function clinicalFollowUps(state: OnboardingState): StepId[] {
  if (hasCategory(state, "none") || state.historyCategories.length === 0) {
    return ["success"];
  }
  const steps: StepId[] = [];
  if (hasCategory(state, "medications")) steps.push("medications");
  if (hasCategory(state, "allergies")) steps.push("allergies");
  if (hasCategory(state, "conditions") || hasCategory(state, "surgeries")) {
    steps.push("conditions");
  }
  steps.push("success");
  return steps;
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
      return "address";
    case "address":
      // Public insurance collects DOB + sex inside its own 7-step cluster.
      if (state.coverage === "provincial") return "scan-card";
      return "dob";
    case "dob":
      return "sex";
    case "sex":
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
      return "pronouns";
    case "pronouns":
      return "gender";
    case "gender":
      return "pharmacy";
    case "pharmacy":
      return "family-doctor";
    case "family-doctor":
      return "biometrics";
    case "biometrics":
      return "medical-history";
    case "medical-history":
      return clinicalFollowUps(state)[0] ?? "success";
    case "medications": {
      const steps = clinicalFollowUps(state);
      return steps[steps.indexOf("medications") + 1] ?? "success";
    }
    case "allergies": {
      const steps = clinicalFollowUps(state);
      return steps[steps.indexOf("allergies") + 1] ?? "success";
    }
    case "conditions":
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
    case "address":
      return "name";
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
    case "sex":
      return "dob";
    case "confirm-info":
      return "sex";
    case "insurance-provider":
      return "sex";
    case "insurance-policy":
      return "insurance-provider";
    case "insurance-member":
      return "insurance-policy";
    case "payment-intro":
      return "sex";
    case "payment":
      return "payment-intro";
    case "checkpoint":
      if (state.coverage === "provincial") return "confirm-info";
      if (state.coverage === "private") return "insurance-member";
      return "payment";
    case "pronouns":
      return "checkpoint";
    case "gender":
      return "pronouns";
    case "pharmacy":
      return "gender";
    case "family-doctor":
      return "pharmacy";
    case "biometrics":
      return "family-doctor";
    case "medical-history":
      return "biometrics";
    case "medications":
      return "medical-history";
    case "allergies":
      return hasCategory(state, "medications")
        ? "medications"
        : "medical-history";
    case "conditions":
      if (hasCategory(state, "allergies")) return "allergies";
      if (hasCategory(state, "medications")) return "medications";
      return "medical-history";
    case "success": {
      const steps = clinicalFollowUps(state);
      return steps[steps.length - 2] ?? "medical-history";
    }
  }
}

export function hrefFor(target: StepId | "dashboard") {
  if (target === "dashboard") return "/dashboard";
  return `/onboarding/${target}`;
}
