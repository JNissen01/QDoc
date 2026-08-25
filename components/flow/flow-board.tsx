"use client";

import Link from "next/link";
import { DashboardScreen } from "@/components/dashboard/dashboard-screen";
import { FlowPreviewProvider } from "@/components/flow/flow-preview-context";
import { StepView } from "@/components/onboarding/step-view";
import { FLOW_SCREENS, type FlowScreen } from "@/lib/flow-screens";
import type { StepId } from "@/lib/onboarding-flow";

const PHONE_WIDTH = 430;
const PHONE_HEIGHT = 780;
const SCALE = 0.56;

function ScreenPreview({ screen, index }: { screen: FlowScreen; index: number }) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className="min-w-0">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium tracking-wide text-caption uppercase">
            {number}
          </p>
          <h2 className="truncate text-[16px] leading-[22px] font-semibold text-ink">
            {screen.title}
          </h2>
          {screen.note ? (
            <p className="text-[13px] leading-4 text-body">{screen.note}</p>
          ) : null}
        </div>
      </div>
      <div
        className="relative overflow-hidden rounded-[20px] border border-line bg-canvas shadow-[0_8px_24px_rgba(30,27,75,0.08)]"
        style={{
          width: PHONE_WIDTH * SCALE,
          height: PHONE_HEIGHT * SCALE,
        }}
      >
        <div
          className="origin-top-left"
          style={{
            width: PHONE_WIDTH,
            height: PHONE_HEIGHT,
            transform: `scale(${SCALE})`,
            pointerEvents: "none",
          }}
        >
          {screen.id === "dashboard" ? (
            <DashboardScreen />
          ) : (
            <StepView step={screen.id as StepId} />
          )}
        </div>
        <Link
          href={screen.href}
          className="absolute inset-0 z-10 rounded-[20px] outline-none ring-action focus-visible:ring-2"
          aria-label={`Open ${screen.title}`}
        />
      </div>
    </article>
  );
}

export function FlowBoard() {
  return (
    <div className="min-h-dvh bg-canvas px-5 py-8 md:px-8">
      <header className="mx-auto mb-8 max-w-[1400px]">
        <p className="text-[13px] font-medium tracking-wide text-action uppercase">
          Prototype map
        </p>
        <h1 className="mt-1 text-[28px] leading-9 font-semibold text-ink">
          All screens
        </h1>
        <p className="mt-2 max-w-2xl text-[16px] leading-[22px] text-body">
          Every onboarding step and the dashboard, in journey order. Frames are
          a preview — click one to open that screen in the prototype.
        </p>
        <Link
          href="/onboarding/welcome"
          className="mt-4 inline-flex text-[16px] font-semibold text-action"
        >
          Start the prototype
        </Link>
      </header>

      <FlowPreviewProvider>
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 justify-items-center gap-x-6 gap-y-10 sm:grid-cols-2 sm:justify-items-start xl:grid-cols-3 2xl:grid-cols-4">
          {FLOW_SCREENS.map((screen, index) => (
            <ScreenPreview key={screen.id} screen={screen} index={index} />
          ))}
        </div>
      </FlowPreviewProvider>
    </div>
  );
}
