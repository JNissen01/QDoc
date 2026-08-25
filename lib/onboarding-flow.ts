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
  "pronouns",
  "gender",
  "sex",
  "scan-card",
  "issued-province",
  "registration-number",
  "health-card",
  "confirm-info",
  "insurance",
  "payment",
  "checkpoint",
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

const ACCOUNT_PHASE = 5;
const PUBLIC_INSURANCE_PHASE = 7;
const PHASE2 = 6;

export function getProgress(
  step: StepId,
  state?: Pick<OnboardingState, "coverage">,
): ProgressMeta {
  const provincial = state?.coverage === "provincial";

  switch (step) {
    case "welcome":
    case "off-ramp":
    case "account-intro":
      return { current: 0, total: ACCOUNT_PHASE, hidden: true };
    case "service-area":
    case "coverage":
      return { current: 1, total: ACCOUNT_PHASE };
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
      if (provincial) {
        return { current: 4, total: PUBLIC_INSURANCE_PHASE };
      }
      return { current: 1, total: ACCOUNT_PHASE };
    case "pronouns":
    case "gender":
      return { current: 1, total: ACCOUNT_PHASE };
    case "sex":
      if (provincial) {
        return { current: 5, total: PUBLIC_INSURANCE_PHASE };
      }
      return { current: 1, total: ACCOUNT_PHASE };
    case "confirm-info":
      return { current: 6, total: PUBLIC_INSURANCE_PHASE };
    case "insurance":
    case "payment":
      return { current: 4, total: ACCOUNT_PHASE };
    case "checkpoint":
      return { current: 5, total: ACCOUNT_PHASE };
    case "pharmacy":
      return { current: 1, total: PHASE2 };
    case "family-doctor":
      return { current: 2, total: PHASE2 };
    case "biometrics":
      return { current: 3, total: PHASE2 };
    case "medical-history":
      return { current: 4, total: PHASE2 };
    case "medications":
    case "allergies":
    case "conditions":
      return { current: 5, total: PHASE2 };
    case "success":
      return { current: 6, total: PHASE2 };
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
      if (state.coverage === "provincial") return "sex";
      return "pronouns";
    case "pronouns":
      return "gender";
    case "gender":
      return "sex";
    case "sex":
      if (state.coverage === "provincial") return "confirm-info";
      if (state.coverage === "private") return "insurance";
      return "payment";
    case "scan-card":
      return "issued-province";
    case "issued-province":
      return "registration-number";
    case "registration-number":
      return "health-card";
    case "health-card":
      return "dob";
    case "confirm-info":
    case "insurance":
    case "payment":
      return "checkpoint";
    case "checkpoint":
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
    case "pronouns":
      return "dob";
    case "gender":
      return "pronouns";
    case "sex":
      if (state.coverage === "provincial") return "dob";
      return "gender";
    case "confirm-info":
      return "sex";
    case "insurance":
    case "payment":
      return "sex";
    case "checkpoint":
      if (state.coverage === "provincial") return "confirm-info";
      if (state.coverage === "private") return "insurance";
      return "payment";
    case "pharmacy":
      return "checkpoint";
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
