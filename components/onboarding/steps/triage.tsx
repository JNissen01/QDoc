"use client";

import { MapPin } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/shell";
import {
  Field,
  PrimaryButton,
  RadioDot,
  SelectorCard,
} from "@/components/onboarding/primitives";
import { useStepNav } from "@/components/onboarding/use-step-nav";
import type { CoverageType, Province } from "@/lib/onboarding-state";

export function ServiceAreaStep() {
  const { state, update, goNext } = useStepNav("service-area");

  return (
    <OnboardingShell
      step="service-area"
      title="Are you a Canadian resident living in one of the following locations?"
      subtitle="QDoc is only available to permanent residents of the following provinces and territories."
      footer={
        <PrimaryButton
          disabled={state.inServiceArea === null}
          onClick={() => goNext()}
        >
          Next
        </PrimaryButton>
      }
    >
      <div>
        <div className="flex min-h-[70px] items-center gap-3 rounded-[14px] bg-white px-4 py-3">
          <MapPin
            className="size-5 shrink-0 text-action"
            strokeWidth={1.8}
            aria-hidden
          />
          <span className="text-left text-[16px] leading-[22px] font-medium text-ink">
            Manitoba, Ontario, Nunavut
          </span>
        </div>
        <div className="mt-8 space-y-3">
          <SelectorCard
            selected={state.inServiceArea === true}
            title="Yes"
            leading={<RadioDot selected={state.inServiceArea === true} />}
            onClick={() => update({ inServiceArea: true })}
          />
          <SelectorCard
            selected={state.inServiceArea === false}
            title="No"
            leading={<RadioDot selected={state.inServiceArea === false} />}
            onClick={() => update({ inServiceArea: false })}
          />
        </div>
      </div>
    </OnboardingShell>
  );
}

export function CoverageStep() {
  const { state, update, goNext } = useStepNav("coverage");

  const options: {
    value: CoverageType;
    title: string;
    description: string;
  }[] = [
    {
      value: "provincial",
      title: "Provincial health card",
      description: "Free for most Canadian residents with a valid card",
    },
    {
      value: "private",
      title: "Private insurance",
      description: "Currently we only accept MSH private insurance",
    },
    {
      value: "uninsured",
      title: "Uninsured",
      description: "Payment information is required",
    },
  ];

  return (
    <OnboardingShell
      step="coverage"
      title="How will this visit be covered?"
      subtitle="Choose the option that matches your health coverage."
      footer={
        <PrimaryButton disabled={!state.coverage} onClick={() => goNext()}>
          Continue
        </PrimaryButton>
      }
    >
      <div className="space-y-3">
        {options.map((option) => (
          <SelectorCard
            key={option.value}
            selected={state.coverage === option.value}
            title={option.title}
            description={option.description}
            leading={
              <RadioDot selected={state.coverage === option.value} />
            }
            onClick={() => update({ coverage: option.value })}
          />
        ))}
      </div>
    </OnboardingShell>
  );
}

const PROVINCES: { value: Province; label: string }[] = [
  { value: "MB", label: "Manitoba" },
  { value: "ON", label: "Ontario" },
  { value: "NU", label: "Nunavut" },
];

export function IssuedProvinceStep() {
  const { state, update, goNext } = useStepNav("issued-province");

  return (
    <OnboardingShell
      step="issued-province"
      title="Where was your health card issued?"
      footer={
        <PrimaryButton
          disabled={!state.issuedProvince}
          onClick={() => goNext()}
        >
          Next
        </PrimaryButton>
      }
    >
      <div className="space-y-3">
        {PROVINCES.map((province) => (
          <SelectorCard
            key={province.value}
            selected={state.issuedProvince === province.value}
            title={province.label}
            leading={
              <RadioDot selected={state.issuedProvince === province.value} />
            }
            onClick={() => update({ issuedProvince: province.value })}
          />
        ))}
      </div>
    </OnboardingShell>
  );
}

export function OffRampStep() {
  const { state, update, goTo } = useStepNav("off-ramp");

  return (
    <OnboardingShell
      step="off-ramp"
      hideBack
      title="QDoc isn’t available for this visit yet"
      subtitle={
        <div className="space-y-[12px]">
          <p className="text-[16px] leading-[22px] font-normal text-body">
            We’re currently able to see patients who are physically in
            Manitoba, Northwestern Ontario, or Nunavut at the time of their
            visit.
          </p>
          <p className="text-[16px] leading-[22px] font-normal text-body">
            Join the waitlist and we’ll notify you when QDoc is available in
            your region.
          </p>
        </div>
      }
      footer={
        <PrimaryButton onClick={() => goTo("service-area")}>
          Go back
        </PrimaryButton>
      }
    >
      <div className="space-y-4 text-left">
        <Field
          label="Location"
          autoComplete="address-level2"
          placeholder="City, province or territory"
          value={state.waitlistLocation}
          onChange={(event) =>
            update({ waitlistLocation: event.target.value })
          }
        />
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="JaneDoe@email.com"
          value={state.waitlistEmail}
          onChange={(event) => update({ waitlistEmail: event.target.value })}
        />
        <div className="rounded-[14px] border border-line bg-white p-4 text-[16px] leading-[22px] text-body">
          If you chose this by mistake, go back and select a supported region.
          Emergency care should always go through 911 or your nearest emergency
          department.
        </div>
      </div>
    </OnboardingShell>
  );
}
