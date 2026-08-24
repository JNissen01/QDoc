"use client";

import { useState } from "react";
import { ShieldCheck, Smartphone, Video } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/shell";
import { PrimaryButton } from "@/components/onboarding/primitives";
import { useStepNav } from "@/components/onboarding/use-step-nav";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    title: "See a local provider without leaving home",
    body: "Create a profile, join a virtual queue, and get a text when a Manitoba, Nunavut, or Northwestern Ontario provider is ready.",
    items: [
      { icon: Smartphone, label: "Create an account and patient profile" },
      { icon: ShieldCheck, label: "Join a queue — no waiting in the app" },
      { icon: Video, label: "Video visit with a treatment plan" },
    ],
  },
  {
    title: "Provincially aligned virtual care",
    body: "QDoc has connected patients with local doctors and nurse practitioners since 2022 — for free with a valid health card.",
    items: [
      { icon: ShieldCheck, label: "PHIA and HIPAA aligned privacy practices" },
      { icon: Video, label: "Prescriptions, labs, referrals, and sick notes" },
      { icon: Smartphone, label: "Rated 4.9/5 by patients in our community" },
    ],
  },
];

export function WelcomeStep() {
  const { goNext } = useStepNav("welcome");
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const last = index === SLIDES.length - 1;

  return (
    <OnboardingShell
      step="welcome"
      hideBack
      title={slide.title}
      subtitle={slide.body}
      footer={
        <div className="space-y-3">
          <PrimaryButton
            onClick={() => (last ? goNext() : setIndex((value) => value + 1))}
          >
            {last ? "Get started" : "Next"}
          </PrimaryButton>
          {!last ? (
            <button
              type="button"
              className="w-full text-center text-[16px] font-semibold text-action"
              onClick={() => goNext()}
            >
              Skip
            </button>
          ) : null}
        </div>
      }
    >
      <ul className="space-y-3">
        {slide.items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 rounded-[14px] border border-line bg-white px-4 py-3"
          >
            <span className="flex size-11 items-center justify-center rounded-[14px] border border-line bg-canvas text-action">
              <item.icon className="size-5" strokeWidth={1.8} />
            </span>
            <span className="text-[16px] leading-[22px] font-medium text-ink">
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex gap-2">
        {SLIDES.map((_, slideIndex) => (
          <button
            key={slideIndex}
            type="button"
            aria-label={`Slide ${slideIndex + 1}`}
            onClick={() => setIndex(slideIndex)}
            className={cn(
              "h-2 rounded-full transition-all",
              slideIndex === index ? "w-6 bg-action" : "w-2 bg-line",
            )}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {["PHIA", "HIPAA", "Manitoba", "Nunavut", "NW Ontario"].map((seal) => (
          <span
            key={seal}
            className="rounded-full border border-line bg-white px-3 py-1 text-[13px] leading-4 text-caption"
          >
            {seal}
          </span>
        ))}
      </div>
    </OnboardingShell>
  );
}
