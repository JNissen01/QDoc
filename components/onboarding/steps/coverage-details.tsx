"use client";

import { useState } from "react";
import {
  Camera,
  CheckCircle2,
  Clock,
  CreditCard,
  HeartPulse,
  Lock,
  Pencil,
  ScanLine,
  Stethoscope,
} from "lucide-react";
import { OnboardingShell, PhoneFrame } from "@/components/onboarding/shell";
import {
  Field,
  GhostButton,
  HighlightBanner,
  IconWell,
  LockNote,
  PrimaryButton,
  RadioDot,
  SelectorCard,
} from "@/components/onboarding/primitives";
import { useStepNav } from "@/components/onboarding/use-step-nav";
import {
  delay,
  MOCK_HEALTH_CARD,
  MOCK_PAYMENT_CARD,
} from "@/lib/mocks";
import type { Province } from "@/lib/onboarding-state";

const PROVINCE_LABELS: Record<Province, string> = {
  MB: "Manitoba",
  ON: "Ontario",
  NU: "Nunavut",
};

export function ScanCardStep() {
  const { goNext, update } = useStepNav("scan-card");
  const [scanning, setScanning] = useState(false);

  async function scan() {
    setScanning(true);
    await delay(1400);
    update({
      registrationNumber: MOCK_HEALTH_CARD.registrationNumber,
      healthCardNumber: MOCK_HEALTH_CARD.number,
      healthCardExpiry: MOCK_HEALTH_CARD.expiry,
    });
    setScanning(false);
    goNext({
      registrationNumber: MOCK_HEALTH_CARD.registrationNumber,
      healthCardNumber: MOCK_HEALTH_CARD.number,
      healthCardExpiry: MOCK_HEALTH_CARD.expiry,
    });
  }

  if (scanning) {
    return (
      <PhoneFrame>
        <div className="flex flex-1 flex-col justify-center text-left">
          <div className="relative flex size-56 items-center justify-center rounded-[28px] border-2 border-dashed border-action bg-white">
            <ScanLine className="size-16 text-action" />
          </div>
          <p className="mt-6 text-[20px] font-semibold text-ink">
            Scanning your card
          </p>
          <p className="mt-2 text-[16px] text-body">
            Extracting your health card number securely…
          </p>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <OnboardingShell
      step="scan-card"
      title="Scan your health card in seconds"
      subtitle="Or enter your information manually."
      footer={
        <div>
          <PrimaryButton onClick={scan}>
            <Camera className="size-5" />
            Use Camera
          </PrimaryButton>
          <GhostButton onClick={() => goNext()}>Enter Manually</GhostButton>
        </div>
      }
    >
      <ol className="relative space-y-6">
        <span className="absolute top-6 bottom-6 left-[22px] w-px bg-action" />
        {[
          {
            icon: Camera,
            title: "Scan your card",
            body: "Use your camera to scan the front of your health card",
          },
          {
            icon: Lock,
            title: "We extract securely",
            body: "OCR technology securely extracts only key information",
          },
          {
            icon: CheckCircle2,
            title: "You review and confirm",
            body: "Review your information carefully before continuing",
          },
        ].map((item) => (
          <li key={item.title} className="relative flex items-start gap-3">
            <IconWell className="z-10">
              <item.icon className="size-5" strokeWidth={1.8} />
            </IconWell>
            <div className="pt-0.5">
              <p className="text-[16px] leading-[22px] font-semibold text-ink">
                {item.title}
              </p>
              <p className="mt-1 text-[14px] leading-[18px] text-body">
                {item.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-8">
        <HighlightBanner>
          OCR Feature is 100% secure and all extracted data is encrypted
        </HighlightBanner>
      </div>
    </OnboardingShell>
  );
}

function formatRegistration(value: string) {
  return value.replace(/\D/g, "").slice(0, 6);
}

export function RegistrationNumberStep() {
  const { state, update, goNext } = useStepNav("registration-number");
  const valid = state.registrationNumber.replace(/\D/g, "").length === 6;

  return (
    <OnboardingShell
      step="registration-number"
      title="What is your registration number?"
      subtitle="The Six digit number on your health card."
      footer={
        <PrimaryButton disabled={!valid} onClick={() => goNext()}>
          Next
        </PrimaryButton>
      }
    >
      <Field
        inputClassName="text-center tracking-[0.08em]"
        inputMode="numeric"
        placeholder="123456"
        value={state.registrationNumber}
        onChange={(event) =>
          update({
            registrationNumber: formatRegistration(event.target.value),
          })
        }
      />
    </OnboardingShell>
  );
}

function formatHealthCard(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
}

export function HealthCardStep() {
  const { state, update, goNext } = useStepNav("health-card");
  const valid = state.healthCardNumber.replace(/\D/g, "").length >= 9;

  return (
    <OnboardingShell
      step="health-card"
      title="What is your health card number?"
      subtitle="The nine digit number on your health card."
      footer={
        <PrimaryButton disabled={!valid} onClick={() => goNext()}>
          Next
        </PrimaryButton>
      }
    >
      <Field
        inputClassName="text-center tracking-[0.08em]"
        placeholder="1213-456-789"
        value={state.healthCardNumber}
        onChange={(event) =>
          update({ healthCardNumber: formatHealthCard(event.target.value) })
        }
      />
      <div className="mt-3">
        <LockNote>Your information is encrypted and secure</LockNote>
      </div>
    </OnboardingShell>
  );
}

function formatDobDisplay(value: string) {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (iso) return `${iso[3]}-${iso[2]}-${iso[1]}`;
  const digits = value.replace(/\D/g, "");
  if (digits.length === 8) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
  }
  return value || "—";
}

function ConfirmRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line py-4 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[13px] leading-4 text-caption">{label}</p>
        <p className="mt-1 text-[16px] leading-[22px] font-medium text-ink">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-action"
        aria-label={`Edit ${label}`}
      >
        <Pencil className="size-4" strokeWidth={1.8} />
      </button>
    </div>
  );
}

export function ConfirmInfoStep() {
  const { state, goNext, goTo } = useStepNav("confirm-info");
  const provinceLabel = state.issuedProvince
    ? PROVINCE_LABELS[state.issuedProvince]
    : "—";

  return (
    <OnboardingShell
      step="confirm-info"
      title="Confirm your information"
      subtitle="Ensure the information entered is correct."
      footer={
        <PrimaryButton onClick={() => goNext()}>Confirm</PrimaryButton>
      }
    >
      <div className="rounded-[14px] border border-line bg-white px-4">
        <ConfirmRow
          label="Issuing Province"
          value={provinceLabel}
          onEdit={() => goTo("issued-province")}
        />
        <ConfirmRow
          label="Registration No."
          value={state.registrationNumber || "—"}
          onEdit={() => goTo("registration-number")}
        />
        <ConfirmRow
          label="Health No."
          value={state.healthCardNumber || "—"}
          onEdit={() => goTo("health-card")}
        />
        <div className="flex items-start justify-between gap-3 py-4">
          <div className="min-w-0 space-y-3">
            <div>
              <p className="text-[13px] leading-4 text-caption">Birthday</p>
              <p className="mt-1 text-[16px] leading-[22px] font-medium text-ink">
                {formatDobDisplay(state.dob)}
              </p>
            </div>
            <div>
              <p className="text-[13px] leading-4 text-caption">Sex</p>
              <p className="mt-1 text-[16px] leading-[22px] font-medium text-ink">
                {state.sex || "—"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => goTo("dob")}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-action"
            aria-label="Edit birthday and sex"
          >
            <Pencil className="size-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </OnboardingShell>
  );
}

export function InsuranceProviderStep() {
  const { state, update, goNext } = useStepNav("insurance-provider");
  const selected = state.insuranceProvider === "MSH";

  return (
    <OnboardingShell
      step="insurance-provider"
      title="Who is your insurance provider?"
      subtitle="Currently we only accept MSH private insurance"
      footer={
        <PrimaryButton disabled={!selected} onClick={() => goNext()}>
          Next
        </PrimaryButton>
      }
    >
      <SelectorCard
        selected={selected}
        title="MSH"
        leading={<RadioDot selected={selected} />}
        onClick={() => update({ insuranceProvider: "MSH" })}
      />
    </OnboardingShell>
  );
}

export function InsurancePolicyStep() {
  const { state, update, goNext } = useStepNav("insurance-policy");
  const valid = state.policyNumber.trim().length > 0;

  return (
    <OnboardingShell
      step="insurance-policy"
      title="What is your insurance policy/group number?"
      footer={
        <PrimaryButton disabled={!valid} onClick={() => goNext()}>
          Next
        </PrimaryButton>
      }
    >
      <Field
        placeholder="12345-A"
        value={state.policyNumber}
        inputClassName="text-center"
        onChange={(event) => update({ policyNumber: event.target.value })}
      />
      <div className="mt-3">
        <LockNote>Your information is encrypted and secure</LockNote>
      </div>
    </OnboardingShell>
  );
}

export function InsuranceMemberStep() {
  const { state, update, goNext } = useStepNav("insurance-member");
  const valid = state.memberId.trim().length > 0;

  return (
    <OnboardingShell
      step="insurance-member"
      title="What is your member ID?"
      footer={
        <PrimaryButton disabled={!valid} onClick={() => goNext()}>
          Continue
        </PrimaryButton>
      }
    >
      <Field
        placeholder="E4992104"
        value={state.memberId}
        inputClassName="text-center"
        onChange={(event) => update({ memberId: event.target.value })}
      />
      <div className="mt-3">
        <LockNote>Your information is encrypted and secure</LockNote>
      </div>
    </OnboardingShell>
  );
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function PaymentIntroStep() {
  const { goNext } = useStepNav("payment-intro");

  return (
    <OnboardingShell
      step="payment-intro"
      title="No insurance? No problem."
      subtitle="Enter your payment information to cover visit costs. You will only be charged after you have successfully completed a visit."
      footer={
        <PrimaryButton onClick={() => goNext()}>Continue</PrimaryButton>
      }
    >
      <ol className="relative space-y-6">
        <span className="absolute top-[2.0625rem] bottom-[2.0625rem] left-[2.0625rem] w-px bg-action" />
        {[
          {
            icon: Stethoscope,
            title: "$90 per Visit",
            body: "With a doctor",
          },
          {
            icon: HeartPulse,
            title: "$50 per Visit",
            body: "With a nurse practitioner",
          },
          {
            icon: Clock,
            title: "$70 late cancellation fee",
            body: "For missing or cancelling appointments with less than 24h notice",
          },
        ].map((item) => (
          <li key={item.title} className="relative flex items-start gap-3">
            <IconWell className="z-10 size-[4.125rem] rounded-[0.75rem]">
              <item.icon className="size-6" strokeWidth={1.8} />
            </IconWell>
            <div className="pt-0.5">
              <p className="text-[16px] leading-[22px] font-semibold text-ink">
                {item.title}
              </p>
              <p className="mt-1 text-[14px] leading-[18px] text-body">
                {item.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </OnboardingShell>
  );
}

export function PaymentStep() {
  const { state, update, goNext } = useStepNav("payment");
  const [scanning, setScanning] = useState(false);
  const valid =
    state.cardholderName.trim() &&
    state.cardNumber.replace(/\s/g, "").length >= 16 &&
    state.cardExpiry.length >= 4 &&
    state.cardCvv.length >= 3;

  async function scanCard() {
    setScanning(true);
    await delay(1000);
    update(MOCK_PAYMENT_CARD);
    setScanning(false);
  }

  return (
    <OnboardingShell
      step="payment"
      title="Payment Details"
      subtitle="Enter your card information below"
      footer={
        <PrimaryButton disabled={!valid} onClick={() => goNext()}>
          Continue
        </PrimaryButton>
      }
    >
      <button
        type="button"
        className="mb-5 inline-flex items-center gap-2 text-[16px] font-semibold text-action disabled:text-caption"
        disabled={scanning}
        onClick={scanCard}
      >
        <CreditCard className="size-4" />
        {scanning ? "Scanning card…" : "Scan Card"}
      </button>
      <div className="space-y-4">
        <Field
          label="Cardholder Name"
          placeholder="Jane Doe"
          value={state.cardholderName}
          onChange={(event) => update({ cardholderName: event.target.value })}
        />
        <Field
          label="Card Number"
          placeholder="4242 4242 4242 4242"
          inputMode="numeric"
          value={state.cardNumber}
          onChange={(event) =>
            update({ cardNumber: formatCardNumber(event.target.value) })
          }
        />
        <div className="grid grid-cols-3 gap-3">
          <Field
            className="col-span-2"
            label="Expiration Date"
            placeholder="MM / YY"
            value={state.cardExpiry}
            onChange={(event) =>
              update({
                cardExpiry: event.target.value.replace(/[^\d/]/g, "").slice(0, 5),
              })
            }
          />
          <Field
            label="CVV"
            placeholder="•••"
            inputMode="numeric"
            value={state.cardCvv}
            onChange={(event) =>
              update({ cardCvv: event.target.value.replace(/\D/g, "").slice(0, 4) })
            }
          />
        </div>
      </div>
    </OnboardingShell>
  );
}
