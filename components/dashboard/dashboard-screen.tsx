"use client";

import {
  CalendarDays,
  Clock,
  FilePlus2,
  Folder,
  Inbox,
  Menu,
  Plus,
  User,
} from "lucide-react";
import { PhoneFrame } from "@/components/onboarding/shell";
import { PrimaryButton } from "@/components/onboarding/primitives";
import { useOnboarding } from "@/components/onboarding/provider";
import { MOCK_UPCOMING_VISIT } from "@/lib/mocks";
import {
  displayFirstName,
  initialsFromName,
} from "@/lib/onboarding-state";

const ACTIONS = [
  { label: "Past Visits", icon: FilePlus2 },
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
          <div className="flex size-24 items-center justify-center rounded-full bg-action text-[28px] font-semibold text-white">
            {initials}
          </div>
          <h1 className="mt-4 text-[28px] leading-9 font-semibold text-ink">
            Welcome back, {firstName}
          </h1>
        </div>
      </div>

      <section className="mt-8 text-left">
        <h2 className="text-[20px] font-semibold text-ink">Upcoming Visits</h2>
        <div className="mt-3 overflow-hidden rounded-[14px] border border-line bg-white">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-tint text-action">
              <User className="size-5" strokeWidth={1.8} />
            </span>
            <p className="text-[16px] leading-[22px] font-semibold text-ink">
              {MOCK_UPCOMING_VISIT.clinician}
            </p>
          </div>
          <div className="h-px bg-line" />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3.5 text-[14px] leading-[18px] font-medium text-ink">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-4 text-action" strokeWidth={1.8} />
              {MOCK_UPCOMING_VISIT.dateLabel}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="size-4 text-action" strokeWidth={1.8} />
              {MOCK_UPCOMING_VISIT.timeLabel}
            </span>
          </div>
        </div>
        <PrimaryButton className="mt-3" onClick={() => undefined}>
          Join Call
        </PrimaryButton>
      </section>

      <section className="mt-8 text-left">
        <h2 className="text-[20px] font-semibold text-ink">Quick Actions</h2>
        <PrimaryButton className="mt-3 bg-ink" onClick={() => undefined}>
          <CalendarDays className="size-5" />
          Book a Visit
        </PrimaryButton>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              className="flex min-h-[70px] items-center gap-3 rounded-[14px] border border-line bg-white px-4 text-left text-[16px] font-medium text-ink"
            >
              <action.icon
                className="size-5 shrink-0 text-ink"
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
