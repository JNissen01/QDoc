"use client";

import {
  ArrowRight,
  CalendarDays,
  ClipboardPlus,
  Folder,
  Inbox,
  Plus,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/onboarding/shell";
import {
  PrimaryButton,
  TonalButton,
} from "@/components/onboarding/primitives";
import { useOnboarding } from "@/components/onboarding/provider";
import { useFlowPreview } from "@/components/flow/flow-preview-context";
import { hrefFor } from "@/lib/onboarding-flow";
import {
  displayFirstName,
  initialsFromName,
} from "@/lib/onboarding-state";

const ACTIONS = [
  { label: "Past Visits", icon: ClipboardPlus },
  { label: "Documents", icon: Folder },
  { label: "Inbox", icon: Inbox },
  { label: "Add Dependant", icon: Plus },
];

export function DashboardScreen() {
  const router = useRouter();
  const preview = useFlowPreview();
  const { state, reset } = useOnboarding();
  const initials = initialsFromName(state.firstName, state.lastName);
  const firstName = displayFirstName(state.firstName);

  function restartPrototype() {
    reset();
    router.push("/onboarding/welcome");
  }

  return (
    <PhoneFrame>
      <div className="relative">
        <div className="group absolute top-0 right-0 z-20">
          <button
            type="button"
            aria-label="Settings"
            aria-describedby="dashboard-settings-note"
            className="text-ink"
          >
            <Settings className="size-6" strokeWidth={2} />
          </button>
          <p
            id="dashboard-settings-note"
            role="tooltip"
            className="pointer-events-none absolute top-full right-0 z-30 mt-2 w-[220px] rounded-[12px] border border-line bg-white px-3 py-2 text-left text-[13px] leading-4 font-normal text-body opacity-0 shadow-[0_8px_24px_rgba(30,27,75,0.12)] transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          >
            Within this screen would be system, app and profile settings.
          </p>
        </div>

        <div className="flex flex-col items-center pt-1 text-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-tint text-[28px] font-semibold text-white">
            {initials}
          </div>
          <h1 className="mt-4 text-[28px] leading-9 font-semibold text-ink">
            Welcome back, {firstName}
          </h1>
        </div>
      </div>

      <TonalButton
        className="mt-6 h-14 rounded-[14px] text-[16px] leading-[22px] font-semibold"
        onClick={() => router.push(hrefFor("biometrics"))}
      >
        Complete medical profile
        <ArrowRight className="size-5" strokeWidth={2} />
      </TonalButton>

      <section className="mt-8 text-left">
        <h2 className="text-[20px] font-semibold text-ink">Upcoming Visits</h2>
        <div className="mt-3 flex min-h-[88px] items-center justify-center rounded-[14px] bg-white px-4">
          <p className="text-[16px] leading-[22px] font-normal text-caption">
            No upcoming visits
          </p>
        </div>
      </section>

      <section className="mt-8 text-left">
        <h2 className="text-[20px] font-semibold text-ink">Quick Actions</h2>
        <PrimaryButton
          className="mt-3 h-16 rounded-[14px]"
          onClick={() => undefined}
        >
          <CalendarDays className="size-5 text-white" strokeWidth={1.8} />
          Book a Visit
        </PrimaryButton>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              className="flex h-[78px] flex-col items-start gap-1 rounded-[14px] border border-line bg-white px-4 py-4 text-left text-[16px] leading-[18px] font-medium text-ink"
            >
              <action.icon
                className="size-6 shrink-0 text-action"
                strokeWidth={1.8}
              />
              {action.label}
            </button>
          ))}
        </div>
      </section>

      {!preview ? (
        <div className="mt-auto flex justify-end pt-8">
          <button
            type="button"
            onClick={restartPrototype}
            className="text-[13px] leading-4 font-medium text-caption hover:text-action"
          >
            Restart prototype
          </button>
        </div>
      ) : null}
    </PhoneFrame>
  );
}
