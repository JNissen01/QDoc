import type { HistoryCategory, OnboardingState } from "@/lib/onboarding-state";

export const STEP_IDS = [
  "welcome",
  "service-area",
  "coverage",
  "issued-province",
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
  "health-card",
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

const PHASE1 = 5;
const PHASE2 = 6;

export function getProgress(step: StepId): ProgressMeta {
  switch (step) {
    case "welcome":
    case "off-ramp":
    case "account-intro":
      return { current: 0, total: PHASE1, hidden: true };
    case "service-area":
    case "coverage":
    case "issued-province":
      return { current: 1, total: PHASE1 };
    case "contact":
      return { current: 1, total: PHASE1 };
    case "confirm-email":
      return { current: 2, total: PHASE1 };
    case "password":
      return { current: 3, total: PHASE1 };
    case "name":
      return { current: 4, total: PHASE1 };
    case "address":
      return { current: 5, total: PHASE1 };
    case "dob":
    case "pronouns":
    case "gender":
    case "sex":
      return { current: 1, total: PHASE1 };
    case "scan-card":
    case "health-card":
    case "insurance":
    case "payment":
      return { current: 4, total: PHASE1 };
    case "checkpoint":
      return { current: 5, total: PHASE1 };
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
      return state.coverage === "provincial"
        ? "issued-province"
        : "account-intro";
    case "issued-province":
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
      return "dob";
    case "dob":
      return "pronouns";
    case "pronouns":
      return "gender";
    case "gender":
      return "sex";
    case "sex":
      if (state.coverage === "provincial") return "scan-card";
      if (state.coverage === "private") return "insurance";
      return "payment";
    case "scan-card":
      return "health-card";
    case "health-card":
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
    case "issued-province":
      return "coverage";
    case "account-intro":
      return state.coverage === "provincial" ? "issued-province" : "coverage";
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
    case "dob":
      return "address";
    case "pronouns":
      return "dob";
    case "gender":
      return "pronouns";
    case "sex":
      return "gender";
    case "scan-card":
    case "insurance":
    case "payment":
      return "sex";
    case "health-card":
      return "scan-card";
    case "checkpoint":
      if (state.coverage === "provincial") return "health-card";
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
