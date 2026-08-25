"use client";

import { OnboardingShell } from "@/components/onboarding/shell";
import { PrimaryButton } from "@/components/onboarding/primitives";
import { useStepNav } from "@/components/onboarding/use-step-nav";
import { LockIcon } from "@/components/brand/lock-icon";
import { QDocLogo } from "@/components/brand/qdoc-logo";
import { ShieldPlusIcon } from "@/components/brand/shield-plus-icon";
import { VerifiedCheckIcon } from "@/components/brand/verified-check-icon";

const TRUST_ITEMS = [
  {
    icon: ShieldPlusIcon,
    label: "Protected under the Privacy Act of Canada",
    iconClassName: "size-6 text-action",
  },
  {
    icon: LockIcon,
    label: "AES-256 encrypted health data",
    iconClassName: "h-[21px] w-4 text-action",
  },
  {
    icon: VerifiedCheckIcon,
    label: "Verified with provincial health databases",
    iconClassName: "size-6 text-action",
  },
];

export function WelcomeStep() {
  const { goNext, goTo } = useStepNav("welcome");

  return (
    <OnboardingShell
      step="welcome"
      hideBack
      footer={
        <div className="space-y-4">
          <PrimaryButton onClick={() => goNext()}>
            Begin Registration
          </PrimaryButton>
          <p className="text-center text-[16px] leading-[22px] text-body">
            Already Registered?{" "}
            <button
              type="button"
              className="font-semibold text-action"
              onClick={() => goTo("dashboard")}
            >
              Sign In
            </button>
          </p>
        </div>
      }
    >
      <div className="flex h-full w-full flex-col items-stretch justify-center">
        <div className="flex justify-center">
          <QDocLogo />
        </div>
        <h1 className="mt-8 text-left text-[28px] leading-9 font-semibold text-ink">
          Welcome to QDoc!
        </h1>
        <p className="mt-3 max-w-[340px] text-left text-[16px] leading-[22px] font-normal text-body">
          Set up your secure digital health record in a few easy steps. Access
          virtual care, prescriptions, and medical records anytime.
        </p>
        <ul className="mt-8 w-full space-y-3">
          {TRUST_ITEMS.map((item) => (
            <li
              key={item.label}
              className="flex min-h-[70px] items-center gap-3 rounded-[14px] bg-white px-4 py-3"
            >
              <span className="flex size-6 shrink-0 items-center justify-center">
                <item.icon className={item.iconClassName} />
              </span>
              <span className="text-left text-[16px] leading-[22px] font-medium text-ink">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </OnboardingShell>
  );
}
