"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getPrevStep, getProgress, hrefFor, type StepId } from "@/lib/onboarding-flow";
import { useOnboarding } from "@/components/onboarding/provider";

export function ProgressTracker({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex gap-1.5" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }, (_, index) => {
        const filled = index < current;
        return (
          <span
            key={index}
            className={cn(
              "h-[5px] flex-1 rounded-full",
              filled ? "bg-action" : "bg-line",
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
      className="inline-flex items-center gap-1 self-start text-[16px] font-medium text-action"
    >
      <ChevronLeft className="size-5" strokeWidth={2} />
      Back
    </button>
  );
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-canvas">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-5 pb-7 pt-5">
        {children}
      </div>
    </div>
  );
}

export function OnboardingShell({
  step,
  title,
  subtitle,
  footer,
  children,
  hideBack,
}: {
  step: StepId;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  children: ReactNode;
  hideBack?: boolean;
}) {
  const router = useRouter();
  const { state } = useOnboarding();
  const progress = getProgress(step);
  const prev = getPrevStep(step, state);

  return (
    <PhoneFrame>
      <div className="flex min-h-0 flex-1 flex-col">
        {!progress.hidden ? (
          <ProgressTracker current={progress.current} total={progress.total} />
        ) : null}

        {!hideBack && prev ? (
          <div className="mt-4">
            <BackLink onClick={() => router.push(hrefFor(prev))} />
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
              <p className="text-[16px] leading-[22px] font-medium text-body">
                {subtitle}
              </p>
            ) : null}
          </header>
        )}

        <div className="mt-6 flex-1 pb-4 text-left">{children}</div>
      </div>
      {footer ? (
        <div className="sticky bottom-0 shrink-0 bg-canvas pt-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {footer}
        </div>
      ) : null}
    </PhoneFrame>
  );
}
