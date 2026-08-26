"use client";

import { useEffect, useMemo, useState, type ComponentProps } from "react";
import { OnboardingShell } from "@/components/onboarding/shell";
import {
  PrimaryButton,
  RadioDot,
  SearchField,
  SelectorCard,
} from "@/components/onboarding/primitives";
import { useStepNav } from "@/components/onboarding/use-step-nav";
import { filterByQuery, MOCK_CLINICS, MOCK_PHARMACIES } from "@/lib/mocks";
import type { BloodType, MeasurementSystem } from "@/lib/onboarding-state";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CM_PER_FT = 30.48;
const LBS_PER_KG = 2.2046226218;

function roundTo(value: number, places: number) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function formatHeightDisplay(cm: string, system: MeasurementSystem) {
  if (!cm.trim()) return "";
  const n = Number(cm);
  if (!Number.isFinite(n)) return "";
  return system === "metric"
    ? String(roundTo(n, 1))
    : String(roundTo(n / CM_PER_FT, 2));
}

function formatWeightDisplay(kg: string, system: MeasurementSystem) {
  if (!kg.trim()) return "";
  const n = Number(kg);
  if (!Number.isFinite(n)) return "";
  return system === "metric"
    ? String(roundTo(n, 1))
    : String(roundTo(n * LBS_PER_KG, 1));
}

/** Returns metric string, "" for empty, or null if input is not yet a number. */
function parseHeightToCm(display: string, system: MeasurementSystem) {
  if (!display.trim()) return "";
  const n = Number(display);
  if (!Number.isFinite(n)) return null;
  return String(
    system === "metric" ? roundTo(n, 2) : roundTo(n * CM_PER_FT, 2),
  );
}

function parseWeightToKg(display: string, system: MeasurementSystem) {
  if (!display.trim()) return "";
  const n = Number(display);
  if (!Number.isFinite(n)) return null;
  return String(
    system === "metric" ? roundTo(n, 2) : roundTo(n / LBS_PER_KG, 2),
  );
}

function UnitField({
  label,
  suffix,
  className,
  inputClassName,
  ...props
}: ComponentProps<"input"> & {
  label: string;
  suffix: string;
  inputClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label className="text-[13px] leading-4 font-normal text-ink">
        {label}
      </Label>
      <div className="relative">
        <Input
          className={cn(
            "h-[70px] rounded-[14px] border border-line bg-white py-0 pr-12 pl-4 text-[16px] leading-[22px] text-ink shadow-none placeholder:text-fog focus-visible:border-2 focus-visible:border-action focus-visible:ring-0 md:text-[16px]",
            inputClassName,
          )}
          {...props}
        />
        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[16px] leading-[22px] text-caption">
          {suffix}
        </span>
      </div>
    </div>
  );
}

function MeasurementSystemToggle({
  value,
  onChange,
}: {
  value: MeasurementSystem;
  onChange: (value: MeasurementSystem) => void;
}) {
  const options: { value: MeasurementSystem; label: string }[] = [
    { value: "metric", label: "Metric (cm, kg)" },
    { value: "imperial", label: "Imperial (ft, lbs)" },
  ];

  return (
    <div>
      <p className="mb-2 text-[13px] leading-4 text-ink">Measurement System</p>
      <div
        className="flex h-12 shrink-0 items-center self-stretch rounded-xl border border-line bg-white p-1"
        role="group"
        aria-label="Measurement System"
      >
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex h-full flex-1 items-center justify-center rounded-lg px-2 text-center text-[14px] leading-[18px] font-medium transition-colors",
                selected ? "bg-secondary text-ink" : "bg-transparent text-ink",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

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
        className="mb-3"
        placeholder="Search by name or city"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <p className="mb-2 text-[13px] leading-4 font-normal text-ink">
        Pharmacies near you
      </p>
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
            className="mb-3"
            placeholder="Search clinics"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <p className="mb-2 text-[13px] leading-4 font-normal text-ink">
            Clinics near you
          </p>
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
  const { state, update, goNext, ready } = useStepNav("biometrics");
  const system = state.measurementSystem;
  const [heightDraft, setHeightDraft] = useState("");
  const [weightDraft, setWeightDraft] = useState("");

  // Hydrate drafts from stored metric values once localStorage is ready, and
  // again whenever the measurement system toggles (so units convert in place).
  useEffect(() => {
    if (!ready) return;
    setHeightDraft(formatHeightDisplay(state.height, system));
    setWeightDraft(formatWeightDisplay(state.weight, system));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- avoid clobbering in-progress typing
  }, [ready, system]);

  const heightSuffix = system === "metric" ? "cm" : "ft";
  const weightSuffix = system === "metric" ? "kg" : "lbs";

  return (
    <OnboardingShell
      step="biometrics"
      title="A few basics about your body"
      subtitle="Height, weight, and blood type help your provider dose and document accurately. You can skip any field you don’t know."
      footer={<PrimaryButton onClick={() => goNext()}>Continue</PrimaryButton>}
    >
      <div className="space-y-4 text-left">
        <MeasurementSystemToggle
          value={system}
          onChange={(measurementSystem) => update({ measurementSystem })}
        />
        <div className="grid grid-cols-2 gap-3">
          <UnitField
            label="Height"
            suffix={heightSuffix}
            inputMode="decimal"
            placeholder={system === "metric" ? "e.g. 168" : "e.g. 5.7"}
            value={heightDraft}
            onChange={(event) => {
              const next = event.target.value;
              setHeightDraft(next);
              const metric = parseHeightToCm(next, system);
              if (metric !== null) update({ height: metric });
            }}
          />
          <UnitField
            label="Weight"
            suffix={weightSuffix}
            inputMode="decimal"
            placeholder={system === "metric" ? "e.g. 72" : "e.g. 150"}
            value={weightDraft}
            onChange={(event) => {
              const next = event.target.value;
              setWeightDraft(next);
              const metric = parseWeightToKg(next, system);
              if (metric !== null) update({ weight: metric });
            }}
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
                    ? "rounded-[0.625rem] bg-action px-3.5 py-2 text-[14px] font-medium text-white"
                    : "rounded-[0.625rem] border border-line bg-white px-3.5 py-2 text-[14px] font-medium text-ink"
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
