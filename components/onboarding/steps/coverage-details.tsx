"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Camera,
  Clock,
  CreditCard,
  HeartPulse,
  Pencil,
  ScanLine,
  Stethoscope,
} from "lucide-react";
import { ScanCardLockIcon } from "@/components/brand/scan-card-lock-icon";
import { VerifiedCheckIcon } from "@/components/brand/verified-check-icon";
import { useFlowPreview } from "@/components/flow/flow-preview-context";
import { OnboardingShell, PhoneFrame } from "@/components/onboarding/shell";
import {
  Field,
  GhostButton,
  IconWell,
  InfoNote,
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
import { cn } from "@/lib/utils";

const PROVINCE_LABELS: Record<Province, string> = {
  MB: "Manitoba",
  ON: "Ontario",
  NU: "Nunavut",
};

const SEX_CHIPS: { value: string; chip: string }[] = [
  { value: "Female", chip: "F" },
  { value: "Male", chip: "M" },
  { value: "Intersex", chip: "I" },
  { value: "Prefer not to say", chip: "Prefer not to say" },
];

type ConfirmField =
  | "province"
  | "registration"
  | "health"
  | "dob"
  | "sex";

export function ScanCardStep() {
  const { goNext, goTo } = useStepNav("scan-card");

  return (
    <OnboardingShell
      step="scan-card"
      title="Scan your health card in seconds"
      subtitle="Or enter your information manually."
      footer={
        <div>
          <PrimaryButton onClick={() => goTo("scanning-card")}>
            <Camera className="size-5" />
            Use Camera
          </PrimaryButton>
          <GhostButton className="text-[1rem] leading-6" onClick={() => goNext()}>
            Enter Manually
          </GhostButton>
        </div>
      }
    >
      <ol className="relative space-y-16">
        {[
          {
            icon: ScanLine,
            title: "Scan your card",
            body: "Use your camera to scan the front of your health card",
          },
          {
            icon: ScanCardLockIcon,
            title: "We extract securely",
            body: "OCR technology securely extracts only key information",
            iconClassName: "size-[34px]",
          },
          {
            icon: VerifiedCheckIcon,
            title: "You review and confirm",
            body: "Review your information carefully before continuing",
            iconClassName: "size-[34px]",
          },
        ].map((item, index, items) => (
          <li
            key={item.title}
            className="relative flex w-full items-center justify-start gap-5 self-stretch"
          >
            <span className="relative shrink-0">
              <IconWell className="relative z-10 size-16 rounded-[0.75rem] border-2 border-line">
                <item.icon
                  className={item.iconClassName ?? "size-8"}
                  {...(!("iconClassName" in item) ? { strokeWidth: 1.8 } : {})}
                />
              </IconWell>
              {index < items.length - 1 ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-8 left-1/2 z-0 w-px -translate-x-1/2 bg-action"
                  style={{ height: "calc(2rem + 64px + 2rem)" }}
                />
              ) : null}
            </span>
            <div className="min-w-0 flex-1">
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
      <div className="mt-9">
        <InfoNote>
          OCR Feature is 100% secure and all extracted data is encrypted
        </InfoNote>
      </div>
    </OnboardingShell>
  );
}

export function ScanningCardStep() {
  const { update, goNext } = useStepNav("scanning-card");
  const preview = useFlowPreview();

  useEffect(() => {
    if (preview) return;

    let cancelled = false;
    const patch = {
      healthCardScanned: true,
      issuedProvince: MOCK_HEALTH_CARD.issuedProvince,
      registrationNumber: MOCK_HEALTH_CARD.registrationNumber,
      healthCardNumber: MOCK_HEALTH_CARD.number,
      healthCardExpiry: MOCK_HEALTH_CARD.expiry,
      dob: MOCK_HEALTH_CARD.dob,
    } as const;

    void delay(1400).then(() => {
      if (cancelled) return;
      update(patch);
      goNext(patch);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run the fake scan once when this screen mounts
  }, [preview]);

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative flex size-56 items-center justify-center rounded-[28px] border-2 border-dashed border-action bg-white">
          <ScanLine className="size-16 animate-pulse text-action" />
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

function formatDobInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
}

function displayDobInput(value: string) {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (iso) return `${iso[3]}-${iso[2]}-${iso[1]}`;
  return formatDobInput(value);
}

function confirmControlClass() {
  return "mt-1 w-full bg-transparent text-[16px] leading-[22px] font-medium text-ink outline-none";
}

function ConfirmChip({
  selected,
  children,
  onClick,
  className,
}: {
  selected: boolean;
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "h-8 rounded-[10px] text-[14px] leading-[18px]",
        selected
          ? "province-chip-selected font-medium"
          : "border border-line bg-white font-normal text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}

function ConfirmRow({
  label,
  value,
  editing,
  active,
  reserveAction = false,
  onActivate,
  children,
}: {
  label: string;
  value: string;
  editing: boolean;
  active: boolean;
  reserveAction?: boolean;
  onActivate?: () => void;
  children?: ReactNode;
}) {
  const showEditor = Boolean(editing && children);

  return (
    <div
      className={cn(
        reserveAction && "pr-12",
        editing && active
          ? "-mx-2 my-2 rounded-[12px] border-2 border-action bg-white px-3 py-3"
          : editing
            ? "-mx-4 px-4 py-4"
            : "-mx-4 border-b border-line px-4 py-4 last:border-b-0",
      )}
      onClick={() => {
        if (editing) onActivate?.();
      }}
    >
      <div className="min-w-0">
        <p
          className={cn(
            "text-[13px] leading-4",
            editing && active ? "font-medium text-action" : "text-caption",
          )}
        >
          {label}
        </p>
        {showEditor ? (
          children
        ) : (
          <p className="mt-1 text-[16px] leading-[22px] font-medium text-ink">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

export function ConfirmInfoStep() {
  const { state, update, goNext } = useStepNav("confirm-info");
  const [editing, setEditing] = useState(false);
  const [activeField, setActiveField] = useState<ConfirmField | null>(null);
  const [draft, setDraft] = useState<{
    issuedProvince: Province | null;
    registrationNumber: string;
    healthCardNumber: string;
    dob: string;
    sex: string;
  } | null>(null);
  const provinceLabel = state.issuedProvince
    ? PROVINCE_LABELS[state.issuedProvince]
    : "—";

  function startEditing() {
    setDraft({
      issuedProvince: state.issuedProvince,
      registrationNumber: state.registrationNumber,
      healthCardNumber: state.healthCardNumber,
      dob: state.dob,
      sex: state.sex,
    });
    setEditing(true);
    setActiveField("province");
  }

  function stopEditing() {
    setEditing(false);
    setActiveField(null);
    setDraft(null);
  }

  function cancelEdits() {
    if (draft) update(draft);
    stopEditing();
  }

  return (
    <OnboardingShell
      step="confirm-info"
      title="Confirm your information"
      subtitle="Ensure the information entered is correct."
      footer={
        <PrimaryButton disabled={editing} onClick={() => goNext()}>
          Confirm
        </PrimaryButton>
      }
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[14px] border bg-white px-4",
          editing ? "border-action" : "border-line",
        )}
      >
        {editing ? null : (
          <button
            type="button"
            onClick={startEditing}
            aria-label="Edit information"
            className="absolute top-3 right-3 z-10 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-action"
          >
            <Pencil className="size-4" strokeWidth={1.8} />
          </button>
        )}
        <ConfirmRow
          label="Issuing Province"
          value={provinceLabel}
          editing={editing}
          active={activeField === "province"}
          reserveAction={!editing}
          onActivate={() => setActiveField("province")}
        >
          {activeField === "province" ? (
            <div
              className="mt-2 grid grid-cols-3 gap-2"
              role="group"
              aria-label="Issuing Province"
            >
              {(Object.keys(PROVINCE_LABELS) as Province[]).map((code) => (
                <ConfirmChip
                  key={code}
                  selected={state.issuedProvince === code}
                  onClick={() => update({ issuedProvince: code })}
                >
                  {code}
                </ConfirmChip>
              ))}
            </div>
          ) : null}
        </ConfirmRow>
        <ConfirmRow
          label="Registration No."
          value={state.registrationNumber || "—"}
          editing={editing}
          active={activeField === "registration"}
          onActivate={() => setActiveField("registration")}
        >
          <input
            aria-label="Registration No."
            inputMode="numeric"
            placeholder="123456"
            className={confirmControlClass()}
            value={state.registrationNumber}
            onFocus={() => setActiveField("registration")}
            onChange={(event) =>
              update({
                registrationNumber: formatRegistration(event.target.value),
              })
            }
          />
        </ConfirmRow>
        <ConfirmRow
          label="Health No."
          value={state.healthCardNumber || "—"}
          editing={editing}
          active={activeField === "health"}
          onActivate={() => setActiveField("health")}
        >
          <input
            aria-label="Health No."
            placeholder="1213-456-789"
            className={confirmControlClass()}
            value={state.healthCardNumber}
            onFocus={() => setActiveField("health")}
            onChange={(event) =>
              update({ healthCardNumber: formatHealthCard(event.target.value) })
            }
          />
        </ConfirmRow>
        <ConfirmRow
          label="Birthday"
          value={formatDobDisplay(state.dob)}
          editing={editing}
          active={activeField === "dob"}
          onActivate={() => setActiveField("dob")}
        >
          <input
            aria-label="Birthday"
            inputMode="numeric"
            placeholder="DD-MM-YYYY"
            className={confirmControlClass()}
            value={displayDobInput(state.dob)}
            onFocus={() => setActiveField("dob")}
            onChange={(event) =>
              update({ dob: formatDobInput(event.target.value) })
            }
          />
        </ConfirmRow>
        <ConfirmRow
          label="Sex"
          value={state.sex || "—"}
          editing={editing}
          active={activeField === "sex"}
          onActivate={() => setActiveField("sex")}
        >
          {activeField === "sex" ? (
            <div className="mt-2 grid grid-cols-3 gap-2" role="group" aria-label="Sex">
              {SEX_CHIPS.map((option) => (
                <ConfirmChip
                  key={option.value}
                  selected={state.sex === option.value}
                  className={
                    option.value === "Prefer not to say" ? "col-span-3" : undefined
                  }
                  onClick={() => update({ sex: option.value })}
                >
                  {option.chip}
                </ConfirmChip>
              ))}
            </div>
          ) : null}
        </ConfirmRow>
        {editing ? (
          <div className="flex items-center gap-3 py-3">
            <GhostButton
              className="min-w-0 w-auto flex-1 basis-0"
              onClick={cancelEdits}
            >
              Cancel
            </GhostButton>
            <PrimaryButton
              className="h-10 min-w-0 w-auto flex-1 basis-0 text-[16px] leading-[22px]"
              onClick={stopEditing}
            >
              Confirm Edits
            </PrimaryButton>
          </div>
        ) : null}
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
      <ol className="relative space-y-[62px]">
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
        ].map((item, index, items) => (
          <li
            key={item.title}
            className="relative flex w-full items-center justify-start gap-5 self-stretch"
          >
            <span className="relative shrink-0">
              <IconWell className="relative z-10 size-[4.125rem] rounded-[0.75rem] border-2 border-line">
                <item.icon className="size-[2.125rem]" strokeWidth={1.8} />
              </IconWell>
              {index < items.length - 1 ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-[2.0625rem] left-1/2 z-0 w-px -translate-x-1/2 bg-action"
                  style={{
                    height: "calc(2.0625rem + 62px + 2.0625rem)",
                  }}
                />
              ) : null}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
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
