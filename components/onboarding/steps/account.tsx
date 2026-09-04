"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Eye } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/shell";
import {
  Field,
  GhostButton,
  inputValueCenteredClass,
  inputValueClass,
  PrimaryButton,
} from "@/components/onboarding/primitives";
import { useStepNav } from "@/components/onboarding/use-step-nav";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function PasswordField({
  label,
  value,
  error,
  placeholder,
  autoComplete,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-[16px] leading-[1rem] font-medium text-ink">{label}</Label>
      <div className="relative">
        <Input
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            "h-[70px] rounded-[14px] border border-line bg-white pr-12 pl-4 shadow-none focus-visible:border-2 focus-visible:border-action focus-visible:ring-0 aria-invalid:border-danger aria-invalid:bg-red-50 aria-invalid:ring-0",
            inputValueClass,
          )}
        />
        <button
          type="button"
          className="absolute top-1/2 right-4 -translate-y-1/2 text-caption"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? (
            <Eye className="size-5" strokeWidth={1.8} />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="16"
              viewBox="0 0 19 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M9.16667 2.95833C12.325 2.95833 15.1417 4.73333 16.5167 7.54167C16.025 8.55833 15.3333 9.43333 14.5083 10.1417L15.6833 11.3167C16.8417 10.2917 17.7583 9.00833 18.3333 7.54167C16.8917 3.88333 13.3333 1.29167 9.16667 1.29167C8.10833 1.29167 7.09167 1.45833 6.13333 1.76667L7.50833 3.14167C8.05 3.03333 8.6 2.95833 9.16667 2.95833ZM8.275 3.90833L10 5.63333C10.475 5.84167 10.8583 6.225 11.0667 6.7L12.7917 8.425C12.8583 8.14167 12.9083 7.84167 12.9083 7.53333C12.9167 5.46667 11.2333 3.79167 9.16667 3.79167C8.85833 3.79167 8.56667 3.83333 8.275 3.90833ZM0.841667 1.18333L3.075 3.41667C1.71667 4.48333 0.641667 5.9 0 7.54167C1.44167 11.2 5 13.7917 9.16667 13.7917C10.4333 13.7917 11.65 13.55 12.7667 13.1083L15.6167 15.9583L16.7917 14.7833L2.01667 0L0.841667 1.18333ZM7.09167 7.43333L9.26667 9.60833C9.23333 9.61667 9.2 9.625 9.16667 9.625C8.01667 9.625 7.08333 8.69167 7.08333 7.54167C7.08333 7.5 7.09167 7.475 7.09167 7.43333ZM4.25833 4.6L5.71667 6.05833C5.525 6.51667 5.41667 7.01667 5.41667 7.54167C5.41667 9.60833 7.1 11.2917 9.16667 11.2917C9.69167 11.2917 10.1917 11.1833 10.6417 10.9917L11.4583 11.8083C10.725 12.0083 9.95833 12.125 9.16667 12.125C6.00833 12.125 3.19167 10.35 1.81667 7.54167C2.4 6.35 3.25 5.36667 4.25833 4.6Z"
                fill="#9D9BC0"
              />
            </svg>
          )}
        </button>
      </div>
      {error ? (
        <p className="text-[14px] leading-[18px] text-danger">{error}</p>
      ) : null}
    </div>
  );
}

export function AccountIntroStep() {
  const { state, update, goNext } = useStepNav("account-intro");
  const [submitted, setSubmitted] = useState(false);
  const emailValid = isValidEmail(state.email);

  const emailError =
    submitted && !emailValid ? "Enter a valid email address" : undefined;

  function continueAccount() {
    setSubmitted(true);
    if (!emailValid) {
      return;
    }
    goNext();
  }

  return (
    <OnboardingShell
      step="account-intro"
      title="Now that we know you’re eligible, lets set up your account!"
      subtitle="We’ll send a 5-digit code to your email to confirm it’s you."
      footer={
        <PrimaryButton disabled={!emailValid} onClick={continueAccount}>
          Create Account
        </PrimaryButton>
      }
    >
      <Field
        aria-label="Email"
        type="email"
        autoComplete="email"
        placeholder="JaneDoe@email.com"
        inputClassName="text-center"
        value={state.email}
        error={emailError}
        onChange={(event) => update({ email: event.target.value })}
      />
    </OnboardingShell>
  );
}

export function ContactStep() {
  const { state, update, goNext } = useStepNav("contact");
  const [submitted, setSubmitted] = useState(false);

  const phoneDigits = state.phone.replace(/\D/g, "");
  const phoneValid = phoneDigits.length >= 10;
  const phoneError =
    submitted && !phoneValid ? "Enter a valid phone number" : undefined;

  function continueContact() {
    setSubmitted(true);
    if (!phoneValid) {
      return;
    }
    goNext();
  }

  return (
    <OnboardingShell
      step="contact"
      title="Contact information"
      subtitle="Enter your phone number below. We’ll use this number if we need to reach you about your care."
      footer={
        <PrimaryButton disabled={!phoneValid} onClick={continueContact}>
          Next
        </PrimaryButton>
      }
    >
      <Field
        aria-label="Phone"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        placeholder="(123) 456-7890"
        inputClassName="text-center"
        value={state.phone}
        error={phoneError}
        onChange={(event) =>
          update({ phone: formatPhone(event.target.value) })
        }
      />
    </OnboardingShell>
  );
}

export function ConfirmEmailStep() {
  const { state, update, goNext } = useStepNav("confirm-email");
  const [digits, setDigits] = useState(["", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const code = digits.join("");
  const complete = code.length === 5 && digits.every((digit) => digit !== "");

  const boxes = useMemo(() => [0, 1, 2, 3, 4], []);

  function setDigit(index: number, value: string) {
    const nextChar = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = nextChar;
    setDigits(next);
    setError("");
    if (nextChar && index < 4) {
      inputs.current[index + 1]?.focus();
    }
  }

  function onKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  function verify() {
    if (!complete) {
      setError("Enter the 5-digit code from your email");
      return;
    }
    update({ emailVerified: true });
    goNext({ emailVerified: true });
  }

  return (
    <OnboardingShell
      step="confirm-email"
      title="Confirm your email"
      subtitle={
        state.email
          ? `Enter the code sent to ${state.email} to secure your account.`
          : "Enter the code sent to your email address to secure your account."
      }
      footer={
        <PrimaryButton disabled={!complete} onClick={verify}>
          Verify
        </PrimaryButton>
      }
    >
      <div className="grid grid-cols-5 gap-2">
        {boxes.map((index) => (
          <input
            key={index}
            ref={(node) => {
              inputs.current[index] = node;
            }}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digits[index]}
            placeholder="0"
            onChange={(event) => setDigit(index, event.target.value)}
            onKeyDown={(event) => onKeyDown(index, event)}
            className={cn(
              "h-[70px] w-full rounded-[14px] border border-line bg-white focus:border-2 focus:border-action focus:outline-none",
              inputValueCenteredClass,
              error && "border-danger",
            )}
          />
        ))}
      </div>
      {error ? (
        <p className="mt-3 text-[14px] text-danger">{error}</p>
      ) : null}
    </OnboardingShell>
  );
}

export function PasswordStep() {
  const { state, update, goNext } = useStepNav("password");
  const [confirm, setConfirm] = useState(state.password);
  const [submitted, setSubmitted] = useState(false);

  const passwordOk = state.password.length >= 8;
  const confirmOk = confirm.length > 0 && confirm === state.password;
  const canContinue = passwordOk && confirmOk;

  const passwordError =
    submitted && !passwordOk ? "Use at least 8 characters" : undefined;
  const confirmError =
    submitted && !confirmOk ? "Passwords don’t match" : undefined;

  function continuePassword() {
    setSubmitted(true);
    if (!canContinue) {
      return;
    }
    goNext();
  }

  return (
    <OnboardingShell
      step="password"
      title="Create a password"
      subtitle="Choose a strong password to keep your account secure."
      footer={
        <div className="space-y-1">
          <PrimaryButton disabled={!canContinue} onClick={continuePassword}>
            Next
          </PrimaryButton>
          <GhostButton type="button" disabled className="text-caption">
            Use Face ID
          </GhostButton>
        </div>
      }
    >
      <div className="space-y-4 text-left">
        <PasswordField
          label="Password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={state.password}
          error={passwordError}
          onChange={(value) => update({ password: value })}
        />
        <PasswordField
          label="Confirm Password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={confirm}
          error={confirmError}
          onChange={setConfirm}
        />
      </div>
    </OnboardingShell>
  );
}
