"use client";

import { useState } from "react";
import {
  Camera,
  CheckCircle2,
  CreditCard,
  Lock,
  ScanLine,
} from "lucide-react";
import { OnboardingShell, PhoneFrame } from "@/components/onboarding/shell";
import {
  Field,
  GhostButton,
  HighlightBanner,
  LockNote,
  PrimaryButton,
} from "@/components/onboarding/primitives";
import { useStepNav } from "@/components/onboarding/use-step-nav";
import {
  delay,
  MOCK_HEALTH_CARD,
  MOCK_PAYMENT_CARD,
} from "@/lib/mocks";

export function ScanCardStep() {
  const { goNext, update } = useStepNav("scan-card");
  const [scanning, setScanning] = useState(false);

  async function scan() {
    setScanning(true);
    await delay(1400);
    update({
      healthCardNumber: MOCK_HEALTH_CARD.number,
      healthCardExpiry: MOCK_HEALTH_CARD.expiry,
    });
    setScanning(false);
    goNext({
      healthCardNumber: MOCK_HEALTH_CARD.number,
      healthCardExpiry: MOCK_HEALTH_CARD.expiry,
    });
  }

  if (scanning) {
    return (
      <PhoneFrame>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
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
      subtitle="Or enter your information manually"
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
      <HighlightBanner>
        OCR Feature is 100% secure and all extracted data is encrypted.
      </HighlightBanner>
      <ol className="relative mt-8 space-y-6 pl-2">
        <span className="absolute top-6 bottom-6 left-[22px] w-px bg-line" />
        {[
          {
            icon: ScanLine,
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
          <li key={item.title} className="relative flex gap-3">
            <span className="z-10 flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-line bg-white text-action">
              <item.icon className="size-5" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-[16px] font-medium text-ink">{item.title}</p>
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
      subtitle="Currently we only accept MSH private insurance"
      footer={
        <PrimaryButton disabled={!valid} onClick={() => goNext()}>
          Continue
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
      <Field
        className="mt-4"
        label="Expiry date"
        placeholder="MM / YY"
        value={state.healthCardExpiry}
        onChange={(event) =>
          update({
            healthCardExpiry: event.target.value
              .replace(/[^\d/]/g, "")
              .slice(0, 5),
          })
        }
      />
      <div className="mt-4">
        <LockNote>Your information is encrypted and secure</LockNote>
      </div>
    </OnboardingShell>
  );
}

export function InsuranceStep() {
  const { state, update, goNext } = useStepNav("insurance");
  const valid =
    state.insuranceProvider.trim() &&
    state.policyNumber.trim() &&
    state.memberId.trim();

  return (
    <OnboardingShell
      step="insurance"
      align="left"
      title="Insurance details"
      subtitle="Currently we only accept MSH private insurance."
      footer={
        <PrimaryButton disabled={!valid} onClick={() => goNext()}>
          Continue
        </PrimaryButton>
      }
    >
      <div className="space-y-4">
        <Field
          label="Provider"
          value={state.insuranceProvider}
          onChange={(event) =>
            update({ insuranceProvider: event.target.value })
          }
        />
        <Field
          label="Policy / Group number"
          placeholder="GRP-00000"
          value={state.policyNumber}
          onChange={(event) => update({ policyNumber: event.target.value })}
        />
        <Field
          label="Member ID"
          placeholder="MSH123456"
          value={state.memberId}
          onChange={(event) => update({ memberId: event.target.value })}
        />
        <LockNote>Processed through a secure coverage check</LockNote>
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
      align="left"
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
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="NIHB ID (optional)"
            placeholder="If applicable"
            value={state.nihbId}
            onChange={(event) => update({ nihbId: event.target.value })}
          />
          <Field
            label="IFHP ID (optional)"
            placeholder="If applicable"
            value={state.ifhpId}
            onChange={(event) => update({ ifhpId: event.target.value })}
          />
        </div>
      </div>
    </OnboardingShell>
  );
}
