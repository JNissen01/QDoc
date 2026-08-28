"use client";

import Link from "next/link";
import { DashboardScreen } from "@/components/dashboard/dashboard-screen";
import { FlowPreviewProvider } from "@/components/flow/flow-preview-context";
import { OnboardingProvider } from "@/components/onboarding/provider";
import { StepView } from "@/components/onboarding/step-view";
import {
  getFlowSections,
  type FlowScreen,
} from "@/lib/flow-screens";
import type { StepId } from "@/lib/onboarding-flow";

const PHONE_WIDTH = 430;
const PHONE_HEIGHT = 780;
const SCALE = 0.56;

function ScreenPreview({
  screen,
  index,
}: {
  screen: FlowScreen;
  index: number;
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className="min-w-0">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium tracking-wide text-caption uppercase">
            {number}
          </p>
          <h3 className="truncate text-[16px] leading-[22px] font-semibold text-ink">
            {screen.title}
          </h3>
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
  const sections = getFlowSections();
  const startIndexBySection = sections.reduce<number[]>((acc, group, i) => {
    const prev = i === 0 ? 0 : acc[i - 1] + sections[i - 1].screens.length;
    acc.push(prev);
    return acc;
  }, []);

  return (
    <div className="min-h-dvh bg-canvas px-5 py-8 md:px-8">
      <header className="mx-auto mb-10 max-w-[1400px]">
        <p className="text-[13px] font-medium tracking-wide text-action uppercase">
          Prototype map
        </p>
        <h1 className="mt-1 text-[28px] leading-9 font-semibold text-ink">
          Onboarding by section
        </h1>
        <p className="mt-2 max-w-2xl text-[16px] leading-[22px] text-body">
          Screens grouped by flow section. Frames render the same live
          components as the clickable prototype—click any frame to open that
          route.
        </p>
        <Link
          href="/onboarding/welcome"
          className="mt-4 inline-flex text-[16px] font-semibold text-action"
        >
          Start the prototype
        </Link>
      </header>

      <OnboardingProvider persist={false}>
        <FlowPreviewProvider>
          <div className="mx-auto flex max-w-[1400px] flex-col gap-14">
            {sections.map((group, sectionIndex) => (
              <section
                key={group.section.id}
                aria-labelledby={`flow-section-${group.section.id}`}
              >
                <div className="mb-6 border-b border-line pb-4">
                  <h2
                    id={`flow-section-${group.section.id}`}
                    className="text-[22px] leading-7 font-semibold text-ink"
                  >
                    {group.section.title}
                  </h2>
                  {group.section.description ? (
                    <p className="mt-1 text-[15px] leading-5 text-body">
                      {group.section.description}
                    </p>
                  ) : null}
                </div>
                <div className="grid grid-cols-1 justify-items-center gap-x-6 gap-y-10 sm:grid-cols-2 sm:justify-items-start xl:grid-cols-3 2xl:grid-cols-4">
                  {group.screens.map((screen, localIndex) => (
                    <ScreenPreview
                      key={screen.id}
                      screen={screen}
                      index={startIndexBySection[sectionIndex] + localIndex}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </FlowPreviewProvider>
      </OnboardingProvider>
    </div>
  );
}
