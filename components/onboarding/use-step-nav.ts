"use client";

import { useRouter } from "next/navigation";
import { getNextStep, hrefFor, type StepId } from "@/lib/onboarding-flow";
import { useOnboarding } from "@/components/onboarding/provider";
import type { OnboardingState } from "@/lib/onboarding-state";

export function useStepNav(step: StepId) {
  const router = useRouter();
  const { state, update, ready, reset } = useOnboarding();

  function goNext(patch?: Partial<OnboardingState>) {
    const nextState = patch ? { ...state, ...patch } : state;
    if (patch) update(patch);
    router.push(hrefFor(getNextStep(step, nextState)));
  }

  function goTo(target: StepId | "dashboard") {
    router.push(hrefFor(target));
  }

  return { state, update, ready, reset, goNext, goTo, router };
}
