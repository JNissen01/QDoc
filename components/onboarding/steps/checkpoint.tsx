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

function IncompleteRingIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="9" stroke="#E5B83D" strokeWidth="2" />
    </svg>
  );
}

const COMPLETED_ITEMS = [
  "Account secured",
  "Profile established",
  "Insurance validated",
] as const;

export function CheckpointStep() {
  const { goNext, goTo } = useStepNav("checkpoint");

  return (
    <OnboardingShell
      step="checkpoint"
      hideBack
      showExit={false}
      title="Your account has been created successfully!"
      subtitle="This step is not required right now, but there may be more information needed before your first visit"
      footer={
        <StepFooter onSkip={() => goTo("dashboard")} skipLabel="Go to Dashboard">
          <PrimaryButton onClick={() => goNext()}>
            Complete Medical Profile
          </PrimaryButton>
        </StepFooter>
      }
    >
      <ul className="space-y-3">
        {COMPLETED_ITEMS.map((item) => (
          <li
            key={item}
            className="flex min-h-[70px] items-center justify-between gap-3 rounded-[14px] bg-white px-4 py-3 shadow-[0_2px_8px_rgba(30,27,75,0.04)]"
          >
            <span className="text-[16px] font-medium text-ink">{item}</span>
            <CheckpointCheckIcon className="size-6 shrink-0" />
          </li>
        ))}
      </ul>

      <p className="mt-6 mb-3 text-[16px] font-semibold leading-[22px] text-ink">
        Incomplete
      </p>

      <ul className="space-y-3">
        <li className="flex min-h-[70px] items-center justify-between gap-3 rounded-[14px] bg-white px-4 py-3 shadow-[0_2px_8px_rgba(30,27,75,0.04)]">
          <span className="text-[16px] font-medium text-caption">
            Medical profile
          </span>
          <IncompleteRingIcon className="size-6 shrink-0" />
        </li>
      </ul>
    </OnboardingShell>
  );
}
