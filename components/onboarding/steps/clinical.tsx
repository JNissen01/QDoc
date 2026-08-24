"use client";

import { useMemo, useState } from "react";
import { OnboardingShell } from "@/components/onboarding/shell";
import {
  Field,
  PrimaryButton,
  RadioDot,
  SearchField,
  SelectorCard,
} from "@/components/onboarding/primitives";
import { useStepNav } from "@/components/onboarding/use-step-nav";
import { filterByQuery, MOCK_CLINICS, MOCK_PHARMACIES } from "@/lib/mocks";
import type { BloodType } from "@/lib/onboarding-state";

export function PharmacyStep() {
  const { state, update, goNext } = useStepNav("pharmacy");
  const [query, setQuery] = useState("");
  const results = useMemo(
    () => filterByQuery(MOCK_PHARMACIES, query),
    [query],
  );

  return (
    <OnboardingShell
      step="pharmacy"
      title="Preferred pharmacy"
      subtitle="We’ll send prescriptions here when your provider writes one."
      footer={
        <PrimaryButton disabled={!state.pharmacy} onClick={() => goNext()}>
          Continue
        </PrimaryButton>
      }
    >
      <SearchField
        className="mb-4"
        placeholder="Search by name or city"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="space-y-3">
        {results.length === 0 ? (
          <p className="rounded-[14px] border border-line bg-white px-4 py-6 text-[14px] text-caption">
            No pharmacies match that search.
          </p>
        ) : (
          results.map((pharmacy) => (
            <SelectorCard
              key={pharmacy.id}
              selected={state.pharmacy?.id === pharmacy.id}
              title={pharmacy.name}
              description={`${pharmacy.address} · ${pharmacy.phone}`}
              leading={
                <RadioDot selected={state.pharmacy?.id === pharmacy.id} />
              }
              onClick={() => update({ pharmacy })}
            />
          ))
        )}
      </div>
    </OnboardingShell>
  );
}

export function FamilyDoctorStep() {
  const { state, update, goNext } = useStepNav("family-doctor");
  const [query, setQuery] = useState("");
  const results = useMemo(() => filterByQuery(MOCK_CLINICS, query), [query]);
  const canContinue =
    state.hasFamilyDoctor === false ||
    (state.hasFamilyDoctor === true && state.familyDoctor);

  return (
    <OnboardingShell
      step="family-doctor"
      title="Do you have a family doctor?"
      subtitle="Optional. If you have one, we can keep their clinic on file for referrals."
      footer={
        <PrimaryButton disabled={!canContinue} onClick={() => goNext()}>
          Continue
        </PrimaryButton>
      }
    >
      <div className="space-y-3">
        <SelectorCard
          selected={state.hasFamilyDoctor === true}
          title="Yes, I have a family doctor"
          leading={<RadioDot selected={state.hasFamilyDoctor === true} />}
          onClick={() => update({ hasFamilyDoctor: true })}
        />
        <SelectorCard
          selected={state.hasFamilyDoctor === false}
          title="No, not right now"
          leading={<RadioDot selected={state.hasFamilyDoctor === false} />}
          onClick={() =>
            update({ hasFamilyDoctor: false, familyDoctor: null })
          }
        />
      </div>
      {state.hasFamilyDoctor ? (
        <div className="mt-6">
          <SearchField
            className="mb-4"
            placeholder="Search clinics"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="space-y-3">
            {results.map((clinic) => (
              <SelectorCard
                key={clinic.id}
                selected={state.familyDoctor?.id === clinic.id}
                title={clinic.name}
                description={clinic.address}
                leading={
                  <RadioDot selected={state.familyDoctor?.id === clinic.id} />
                }
                onClick={() => update({ familyDoctor: clinic })}
              />
            ))}
          </div>
        </div>
      ) : null}
    </OnboardingShell>
  );
}

const BLOOD_TYPES: BloodType[] = [
  "unknown",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export function BiometricsStep() {
  const { state, update, goNext } = useStepNav("biometrics");

  return (
    <OnboardingShell
      step="biometrics"
      title="A few basics about your body"
      subtitle="Height, weight, and blood type help your provider dose and document accurately. You can skip any field you don’t know."
      footer={<PrimaryButton onClick={() => goNext()}>Continue</PrimaryButton>}
    >
      <div className="space-y-4 text-left">
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Height (cm)"
            inputMode="decimal"
            placeholder="e.g. 168"
            value={state.height}
            onChange={(event) => update({ height: event.target.value })}
          />
          <Field
            label="Weight (kg)"
            inputMode="decimal"
            placeholder="e.g. 72"
            value={state.weight}
            onChange={(event) => update({ weight: event.target.value })}
          />
        </div>
        <div>
          <p className="mb-2 text-[13px] leading-4 text-ink">Blood type</p>
          <div className="flex flex-wrap gap-2">
            {BLOOD_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => update({ bloodType: type })}
                className={
                  state.bloodType === type
                    ? "rounded-full bg-action px-3.5 py-2 text-[14px] font-medium text-white"
                    : "rounded-full border border-line bg-white px-3.5 py-2 text-[14px] font-medium text-ink"
                }
              >
                {type === "unknown" ? "Don’t know" : type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}
