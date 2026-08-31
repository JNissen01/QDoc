"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getPrevStep, getProgress, hrefFor, type StepId } from "@/lib/onboarding-flow";
import { useOnboarding } from "@/components/onboarding/provider";
import { PhoneFrame } from "@/components/onboarding/phone-frame";
import { GhostButton, PrimaryButton } from "@/components/onboarding/primitives";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export { PhoneFrame };

/** Phase 2 clinical intake — Exit is shown on these steps by default. */
const MEDICAL_PROFILE_STEPS = new Set<StepId>([
  "biometrics",
  "pronouns",
  "medical-history",
  "medications",
  "family-doctor",
  "pharmacy",
  "success",
]);

export function ProgressTracker({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div
      className="flex gap-[6px]"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`Step ${current} of ${total}`}
    >
      {Array.from({ length: total }, (_, index) => {
        const filled = index < current;
        return (
          <span
            key={index}
            className={cn(
              "h-[5px] min-w-0 flex-1 rounded-full",
              filled ? "bg-progress" : "bg-progress-idle",
            )}
          />
        );
      })}
    </div>
  );
}

export function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 self-start text-[16px] leading-[22px] font-medium text-action"
    >
      <ChevronLeft className="size-5 text-action" strokeWidth={1.8} />
      Back
    </button>
  );
}

export function OnboardingShell({
  step,
  title,
  subtitle,
  footer,
  children,
  hideBack,
  showExit,
}: {
  step: StepId;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  children: ReactNode;
  hideBack?: boolean;
  /** Opt in/out of the Exit control. Defaults on for medical-profile steps. */
  showExit?: boolean;
}) {
  const router = useRouter();
  const { state } = useOnboarding();
  const progress = getProgress(step, state);
  const prev = getPrevStep(step, state);
  const [exitOpen, setExitOpen] = useState(false);

  const exitEnabled = showExit ?? MEDICAL_PROFILE_STEPS.has(step);
  const showBack = !hideBack && Boolean(prev);
  const showNavRow = showBack || exitEnabled;

  return (
    <PhoneFrame>
      <div className="flex min-h-0 flex-1 flex-col">
        {!progress.hidden ? (
          <ProgressTracker current={progress.current} total={progress.total} />
        ) : null}

        {showNavRow ? (
          <div className="mt-4 flex items-center justify-between gap-3">
            {showBack && prev ? (
              <BackLink onClick={() => router.push(hrefFor(prev))} />
            ) : (
              <span aria-hidden className="min-w-0" />
            )}
            {exitEnabled ? (
              <button
                type="button"
                onClick={() => setExitOpen(true)}
                className="shrink-0 text-[16px] leading-[22px] font-medium text-action"
              >
                Exit
              </button>
            ) : null}
          </div>
        ) : null}

        {(title || subtitle) && (
          <header className="mt-6 space-y-2 text-left">
            {title ? (
              <h1 className="text-[28px] leading-9 font-semibold tracking-normal text-ink">
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <p className="text-[16px] leading-[22px] font-normal text-body">
                {subtitle}
              </p>
            ) : null}
          </header>
        )}

        <div className="mt-6 flex-1 pb-4 text-left">{children}</div>
      </div>
      {footer ? (
        <div className="sticky bottom-0 shrink-0 bg-canvas pt-3 pb-1">
          {footer}
        </div>
      ) : null}

      <Dialog open={exitOpen} onOpenChange={setExitOpen}>
        <DialogContent
          showCloseButton={false}
          className="gap-5 rounded-[20px] border border-line bg-white p-6 text-ink ring-0 sm:max-w-sm"
        >
          <DialogHeader className="gap-2 text-center">
            <DialogTitle className="text-center font-sans text-[20px] leading-[26px] font-semibold tracking-normal text-ink">
              Your progress has been saved
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="mx-0 mb-0 flex flex-col gap-2 rounded-none border-0 bg-transparent p-0 sm:flex-col sm:justify-stretch">
            <PrimaryButton
              onClick={() => {
                setExitOpen(false);
                router.push(hrefFor("dashboard"));
              }}
            >
              Confirm exit
            </PrimaryButton>
            <GhostButton onClick={() => setExitOpen(false)}>Back</GhostButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PhoneFrame>
  );
}
