"use client";

import {
  CalendarDays,
  FileText,
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
  { label: "Past Visits", icon: FileText },
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
      <div className="flex items-center justify-end">
        <button
          type="button"
          aria-label="Menu"
          className="text-ink"
        >
          <Menu className="size-6" strokeWidth={2} />
        </button>
      </div>

      <div className="mt-4">
        <div className="flex size-24 items-center justify-center rounded-full bg-tint text-[28px] font-semibold text-action">
          {initials}
        </div>
        <h1 className="mt-4 text-left text-[28px] leading-9 font-semibold text-ink">
          Welcome back, {firstName}
        </h1>
      </div>

      <section className="mt-8">
        <h2 className="text-[20px] font-semibold text-ink">Upcoming Visits</h2>
        <div className="mt-3 rounded-[14px] bg-white px-4 py-8 text-left text-[16px] text-caption">
          No upcoming visits
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-[20px] font-semibold text-ink">Quick Actions</h2>
        <PrimaryButton className="mt-3" onClick={() => undefined}>
          <CalendarDays className="size-5" />
          Book a Visit
        </PrimaryButton>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              className="flex min-h-[108px] flex-col items-center justify-center gap-2 rounded-[14px] border border-line bg-white text-[16px] font-medium text-ink"
            >
              <action.icon className="size-6 text-ink" strokeWidth={1.8} />
              {action.label}
            </button>
          ))}
        </div>
      </section>
    </PhoneFrame>
  );
}
