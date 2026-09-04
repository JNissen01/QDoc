"use client";

import { OnboardingShell } from "@/components/onboarding/shell";
import { PrimaryButton } from "@/components/onboarding/primitives";
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

export function SuccessStep() {
  const { state, goTo } = useStepNav("success");

  const bodyMetricsLabel =
    state.height.trim() || state.weight.trim()
      ? "Body metrics saved"
      : "You can add body metrics anytime";

  return (
    <OnboardingShell
      step="success"
      showExit={false}
      title="You’re all set"
      subtitle="Your QDoc profile is ready. Book a visit when you need care for a non-emergent issue."
      footer={
        <PrimaryButton onClick={() => goTo("dashboard")}>
          Complete
        </PrimaryButton>
      }
    >
      <ul className="space-y-3">
        {[
          bodyMetricsLabel,
          state.pharmacy
            ? `Pharmacy set · ${state.pharmacy.name}`
            : "You can add a pharmacy anytime",
          state.historyCategories.includes("none")
            ? "No additional history noted"
            : "Clinical background saved",
        ].map((item) => (
          <li
            key={item}
            className="flex min-h-[70px] items-center justify-between gap-3 rounded-[14px] bg-white px-4 py-3 shadow-[0_2px_8px_rgba(30,27,75,0.04)]"
          >
            <span className="text-[16px] font-medium text-ink">{item}</span>
            <CheckpointCheckIcon className="size-6 shrink-0" />
          </li>
        ))}
      </ul>
    </OnboardingShell>
  );
}
