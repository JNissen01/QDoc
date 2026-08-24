"use client";

import { CheckCircle2 } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/shell";
import { GhostButton, PrimaryButton } from "@/components/onboarding/primitives";
import { useStepNav } from "@/components/onboarding/use-step-nav";

export function SuccessStep() {
  const { state, goTo } = useStepNav("success");

  const coverageLabel =
    state.coverage === "provincial"
      ? "Health card connected"
      : state.coverage === "private"
        ? "Private insurance on file"
        : "Payment method on file";

  return (
    <OnboardingShell
      step="success"
      title="You’re all set"
      subtitle="Your QDoc profile is ready. Book a visit when you need care for a non-emergent issue."
      footer={
        <div className="space-y-2">
          <PrimaryButton onClick={() => goTo("dashboard")}>
            Book a Consultation
          </PrimaryButton>
          <GhostButton onClick={() => goTo("dashboard")}>
            Explore Dashboard
          </GhostButton>
        </div>
      }
    >
      <ul className="space-y-3">
        {[
          coverageLabel,
          state.pharmacy
            ? `Pharmacy set · ${state.pharmacy.name}`
            : "You can add a pharmacy anytime",
          state.historyCategories.includes("none")
            ? "No additional history noted"
            : "Clinical background saved",
        ].map((item) => (
          <li
            key={item}
            className="flex min-h-[70px] items-center gap-3 rounded-[14px] border border-line bg-white px-4 py-3"
          >
            <CheckCircle2 className="size-5 shrink-0 text-action" />
            <span className="text-[16px] font-medium text-ink">{item}</span>
          </li>
        ))}
      </ul>
    </OnboardingShell>
  );
}
