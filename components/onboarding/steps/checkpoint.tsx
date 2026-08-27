"use client";

import { OnboardingShell } from "@/components/onboarding/shell";
import { PrimaryButton, StepFooter } from "@/components/onboarding/primitives";
import { useStepNav } from "@/components/onboarding/use-step-nav";

function CheckpointCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM9.29 16.29L5.7 12.7C5.31 12.31 5.31 11.68 5.7 11.29C6.09 10.9 6.72 10.9 7.11 11.29L10 14.17L16.88 7.29C17.27 6.9 17.9 6.9 18.29 7.29C18.68 7.68 18.68 8.31 18.29 8.7L10.7 16.29C10.32 16.68 9.68 16.68 9.29 16.29Z"
        fill="#405FFB"
      />
    </svg>
  );
}

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
      showExit={false}
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
          "Address on file for visits",
        ].map((item) => (
          <li
            key={item}
            className="flex min-h-[70px] items-center gap-3 rounded-[14px] border border-line bg-white px-4 py-3"
          >
            <CheckpointCheckIcon className="size-5 shrink-0" />
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
