"use client";

import {
  CalendarDays,
  ClipboardPlus,
  Folder,
  Inbox,
  Menu,
  Plus,
} from "lucide-react";
import { PhoneFrame } from "@/components/onboarding/shell";
import { PrimaryButton } from "@/components/onboarding/primitives";
import { useOnboarding } from "@/components/onboarding/provider";
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
  const { state } = useOnboarding();
  const initials = initialsFromName(state.firstName, state.lastName);
  const firstName = displayFirstName(state.firstName);

  return (
    <PhoneFrame>
      <div className="relative">
        <button
          type="button"
          aria-label="Menu"
          className="absolute top-0 right-0 text-ink"
        >
          <Menu className="size-6" strokeWidth={2} />
        </button>

        <div className="flex flex-col items-center pt-1 text-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-tint text-[28px] font-semibold text-white">
            {initials}
          </div>
          <h1 className="mt-4 text-[28px] leading-9 font-semibold text-ink">
            Welcome back, {firstName}
          </h1>
        </div>
      </div>

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
          className="mt-3 rounded-[14px]"
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
              className="flex min-h-[108px] flex-col items-start justify-between rounded-[14px] border border-line bg-white px-4 py-4 text-left text-[16px] font-medium text-ink"
            >
              <action.icon
                className="size-6 shrink-0 text-ink"
                strokeWidth={1.8}
              />
              {action.label}
            </button>
          ))}
        </div>
      </section>
    </PhoneFrame>
  );
}
