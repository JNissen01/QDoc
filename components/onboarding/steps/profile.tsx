"use client";

import { MapPin } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/shell";
import {
  Chip,
  Field,
  PrimaryButton,
} from "@/components/onboarding/primitives";
import { useStepNav } from "@/components/onboarding/use-step-nav";
import { MOCK_LOCATION } from "@/lib/mocks";
import type { Province } from "@/lib/onboarding-state";
import { cn } from "@/lib/utils";

const PRONOUNS = ["She/her", "He/him", "They/them", "Prefer not to say"];
const GENDERS = ["Woman", "Man", "Non-binary", "Prefer not to say"];
const SEXES = ["Female", "Male", "Intersex", "Prefer not to say"];

export function ProfileStep() {
  const { state, update, goNext } = useStepNav("profile");
  const valid =
    state.firstName.trim() &&
    state.lastName.trim() &&
    state.dob &&
    state.pronouns &&
    state.gender &&
    state.sex;

  return (
    <OnboardingShell
      step="profile"
      title="Tell us about you"
      subtitle="This helps your provider address you correctly and keep your record accurate."
      footer={
        <PrimaryButton disabled={!valid} onClick={() => goNext()}>
          Continue
        </PrimaryButton>
      }
    >
      <div className="space-y-4 text-left">
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="First name"
            placeholder="Sarah"
            value={state.firstName}
            onChange={(event) => update({ firstName: event.target.value })}
          />
          <Field
            label="Last name"
            placeholder="Nguyen"
            value={state.lastName}
            onChange={(event) => update({ lastName: event.target.value })}
          />
        </div>
        <Field
          label="Date of birth"
          type="date"
          value={state.dob}
          onChange={(event) => update({ dob: event.target.value })}
        />
        <Field
          label="Phone"
          type="tel"
          placeholder="204-555-0100"
          value={state.phone}
          onChange={(event) => update({ phone: event.target.value })}
        />
        <div>
          <p className="mb-2 text-[13px] leading-4 text-ink">Pronouns</p>
          <div className="flex flex-wrap gap-2">
            {PRONOUNS.map((option) => (
              <Chip
                key={option}
                selected={state.pronouns === option}
                onClick={() => update({ pronouns: option })}
              >
                {option}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-[13px] leading-4 text-ink">Gender</p>
          <div className="flex flex-wrap gap-2">
            {GENDERS.map((option) => (
              <Chip
                key={option}
                selected={state.gender === option}
                onClick={() => update({ gender: option })}
              >
                {option}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-[13px] leading-4 text-ink">Sex assigned at birth</p>
          <div className="flex flex-wrap gap-2">
            {SEXES.map((option) => (
              <Chip
                key={option}
                selected={state.sex === option}
                onClick={() => update({ sex: option })}
              >
                {option}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}

export function AddressStep() {
  const { state, update, goNext } = useStepNav("address");
  const valid =
    state.address.trim() &&
    state.postalCode.trim() &&
    state.city.trim() &&
    state.province;

  return (
    <OnboardingShell
      step="address"
      title="What is your address?"
      subtitle="At this time QDoc is only available to those physically located in Manitoba, Northwestern Ontario or Nunavut at the time of their visit."
      footer={
        <PrimaryButton disabled={!valid} onClick={() => goNext()}>
          Continue
        </PrimaryButton>
      }
    >
      <button
        type="button"
        className="mb-5 inline-flex items-center gap-2 text-[16px] font-semibold text-action"
        onClick={() => update(MOCK_LOCATION)}
      >
        <MapPin className="size-4" />
        Use My Current Location
      </button>
      <div className="space-y-4 text-left">
        <Field
          label="Address"
          placeholder="Search here"
          value={state.address}
          onChange={(event) => update({ address: event.target.value })}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Postal code"
            placeholder="e.g. A1B 2C3"
            value={state.postalCode}
            onChange={(event) =>
              update({ postalCode: event.target.value.toUpperCase() })
            }
          />
          <Field
            label="City"
            placeholder="e.g. Winnipeg"
            value={state.city}
            onChange={(event) => update({ city: event.target.value })}
          />
        </div>
        <div>
          <p className="mb-2 text-[13px] leading-4 text-ink">Province</p>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["MB", "MB"],
                ["ON", "ON"],
                ["NU", "NU"],
              ] as [Province, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => update({ province: value })}
                className={cn(
                  "h-12 rounded-[14px] border bg-white text-[16px] font-medium",
                  state.province === value
                    ? "border-action text-action"
                    : "border-line text-ink",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}
