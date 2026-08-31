"use client";

import { MapPin } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/shell";
import {
  Field,
  LockNote,
  PrimaryButton,
  RadioDot,
  SelectorCard,
  StepFooter,
} from "@/components/onboarding/primitives";
import { useStepNav } from "@/components/onboarding/use-step-nav";
import { MOCK_LOCATION } from "@/lib/mocks";
import type { Province } from "@/lib/onboarding-state";
import type { StepId } from "@/lib/onboarding-flow";
import { cn } from "@/lib/utils";

const PRONOUNS = ["She/her", "He/him", "They/them", "Prefer not to say"];
const SEXES = ["Male", "Female", "Intersex", "Prefer not to say"];

export function NameStep() {
  const { state, update, goNext } = useStepNav("name");
  const valid = state.firstName.trim() && state.lastName.trim();

  return (
    <OnboardingShell
      step="name"
      title="What is your legal name?"
      subtitle="First and last name required."
      footer={
        <PrimaryButton disabled={!valid} onClick={() => goNext()}>
          Next
        </PrimaryButton>
      }
    >
      <div className="space-y-4">
        <Field
          label="First name"
          placeholder="e.g. Jane"
          value={state.firstName}
          onChange={(event) => update({ firstName: event.target.value })}
        />
        <Field
          label="Last name"
          placeholder="e.g. Doe"
          value={state.lastName}
          onChange={(event) => update({ lastName: event.target.value })}
        />
      </div>
    </OnboardingShell>
  );
}

function formatDob(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
}

function displayDob(value: string) {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (iso) return `${iso[3]}-${iso[2]}-${iso[1]}`;
  return formatDob(value);
}

export function DobStep() {
  const { state, update, goNext } = useStepNav("dob");
  const value = displayDob(state.dob);
  const valid = /^\d{2}-\d{2}-\d{4}$/.test(value);
  const provincial = state.coverage === "provincial";

  return (
    <OnboardingShell
      step="dob"
      title="What is your date of birth?"
      subtitle={
        provincial
          ? undefined
          : "Your provider uses this to confirm your identity."
      }
      footer={
        <PrimaryButton disabled={!valid} onClick={() => goNext()}>
          {provincial ? "Next" : "Continue"}
        </PrimaryButton>
      }
    >
      <Field
        inputMode="numeric"
        placeholder="DD-MM-YYYY"
        inputClassName="text-center"
        value={value}
        onChange={(event) => update({ dob: formatDob(event.target.value) })}
      />
      {provincial ? (
        <div className="mt-3">
          <LockNote>Your information is encrypted and secure</LockNote>
        </div>
      ) : null}
    </OnboardingShell>
  );
}

function RadioQuestion({
  step,
  title,
  subtitle,
  options,
  value,
  field,
  customLabel,
  customPlaceholder,
  ctaLabel = "Continue",
  allowSkip = false,
}: {
  step: StepId;
  title: string;
  subtitle: string;
  options: string[];
  value: string;
  field: "pronouns" | "sex";
  customLabel?: string;
  customPlaceholder?: string;
  ctaLabel?: string;
  allowSkip?: boolean;
}) {
  const { update, goNext } = useStepNav(step);
  const listed = options.includes(value);
  const customValue = listed ? "" : value;

  return (
    <OnboardingShell
      step={step}
      title={title}
      subtitle={subtitle || undefined}
      footer={
        <StepFooter onSkip={allowSkip ? () => goNext() : undefined}>
          <PrimaryButton disabled={!value.trim()} onClick={() => goNext()}>
            {ctaLabel}
          </PrimaryButton>
        </StepFooter>
      }
    >
      <div className="space-y-3">
        {options.map((option) => (
          <SelectorCard
            key={option}
            selected={value === option}
            title={option}
            leading={<RadioDot selected={value === option} />}
            onClick={() => update({ [field]: option })}
          />
        ))}
        {customLabel && customPlaceholder ? (
          <Field
            label={customLabel}
            placeholder={customPlaceholder}
            value={customValue}
            onChange={(event) => update({ [field]: event.target.value })}
          />
        ) : null}
      </div>
    </OnboardingShell>
  );
}

export function PronounsStep() {
  const { state } = useStepNav("pronouns");
  return (
    <RadioQuestion
      step="pronouns"
      title="What are your pronouns?"
      subtitle="We’ll use these when we talk with you."
      options={PRONOUNS}
      value={state.pronouns}
      field="pronouns"
      customLabel="Something else"
      customPlaceholder="Enter your pronouns"
      allowSkip
    />
  );
}

export function SexStep() {
  const { state } = useStepNav("sex");
  return (
    <RadioQuestion
      step="sex"
      title="What sex were you assigned at birth?"
      subtitle="This helps your provider with clinical decisions."
      options={SEXES}
      value={state.sex}
      field="sex"
    />
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
          <p className="mb-2 text-[16px] leading-[1rem] font-medium text-ink">
            Province
          </p>
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
                aria-pressed={state.province === value}
                onClick={() => update({ province: value })}
                className={cn(
                  "h-[70px] rounded-[14px] text-[16px]",
                  state.province === value
                    ? "province-chip-selected font-medium"
                    : "border border-line bg-white font-normal text-ink",
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
