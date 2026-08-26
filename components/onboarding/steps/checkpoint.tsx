"use client";

import { CheckCircle2 } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/shell";
import { PrimaryButton, StepFooter } from "@/components/onboarding/primitives";
import { useStepNav } from "@/components/onboarding/use-step-nav";

export function CheckpointStep() {
  const { state, goNext, goTo } = useStepNav("checkpoint");

  const coverageLabel =
    state.coverage === "provincial"
      ? "Health card connected"
      : state.coverage === "private"
        ? "MSH insurance added"
        : "Payment method saved";

  return (
    <OnboardingShell
      step="checkpoint"
      title="You’re verified and ready for care"
      subtitle="You can book a visit now, or take a few more minutes to add your clinical background."
      footer={
        <StepFooter onSkip={() => goTo("dashboard")} skipLabel="Skip to dashboard">
          <PrimaryButton onClick={() => goNext()}>
            Continue to medical profile
          </PrimaryButton>
        </StepFooter>
      }
    >
      <ul className="space-y-3">
        {[
          coverageLabel,
          "Account secured with email confirmation",
          "Address on file for this visit",
        ].map((item) => (
          <li
            key={item}
            className="flex min-h-[70px] items-center gap-3 rounded-[14px] border border-line bg-white px-4 py-3"
          >
            <CheckCircle2 className="size-5 text-action" />
            <span className="text-[16px] font-medium text-ink">{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[14px] leading-[18px] text-caption">
        Phase 2 is optional. You can add pharmacy, history, and medications
        later from your profile.
      </p>
    </OnboardingShell>
  );
}
