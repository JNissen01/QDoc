"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/shell";
import {
  Field,
  GhostButton,
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
            "h-[70px] rounded-[14px] border border-line bg-white pr-12 pl-4 text-[16px] leading-[22px] text-ink shadow-none placeholder:text-fog focus-visible:border-2 focus-visible:border-action focus-visible:ring-0 aria-invalid:border-danger aria-invalid:bg-red-50 aria-invalid:ring-0 md:text-[16px]",
          )}
        />
        <button
          type="button"
          className="absolute top-1/2 right-4 -translate-y-1/2 text-caption"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? (
            <EyeOff className="size-5" strokeWidth={1.8} />
          ) : (
            <Eye className="size-5" strokeWidth={1.8} />
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

  const emailError =
    submitted && !isValidEmail(state.email)
      ? "Enter a valid email address"
      : undefined;

  function continueAccount() {
    setSubmitted(true);
    if (!isValidEmail(state.email)) {
      return;
    }
    goNext();
  }

  return (
    <OnboardingShell
      step="account-intro"
      title="Now that we know you’re eligible, lets set up your account!"
      subtitle="We’ll send a 5-digit code to your email to confirm it’s you. For this prototype, any code works."
      footer={
        <PrimaryButton onClick={continueAccount}>Create Account</PrimaryButton>
      }
    >
      <div className="space-y-4 text-left">
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="JaneDoe@email.com"
          value={state.email}
          error={emailError}
          onChange={(event) => update({ email: event.target.value })}
        />
      </div>
    </OnboardingShell>
  );
}

export function ContactStep() {
  const { state, update, goNext } = useStepNav("contact");
  const [submitted, setSubmitted] = useState(false);

  const phoneDigits = state.phone.replace(/\D/g, "");
  const phoneError =
    submitted && phoneDigits.length < 10
      ? "Enter a valid phone number"
      : undefined;

  function continueContact() {
    setSubmitted(true);
    if (phoneDigits.length < 10) {
      return;
    }
    goNext();
  }

  return (
    <OnboardingShell
      step="contact"
      title="Contact information"
      subtitle="We’ll use this number if we need to reach you about your care."
      footer={<PrimaryButton onClick={continueContact}>Next</PrimaryButton>}
    >
      <div className="space-y-4 text-left">
        <Field
          label="Phone"
          type="tel"
          autoComplete="tel"
          placeholder="(123) 456-7890"
          value={state.phone}
          error={phoneError}
          onChange={(event) =>
            update({ phone: formatPhone(event.target.value) })
          }
        />
      </div>
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
              "h-[70px] w-full rounded-[14px] border border-line bg-white text-center text-[24px] font-semibold text-ink placeholder:text-fog focus:border-2 focus:border-action focus:outline-none",
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

  const passwordError =
    submitted && state.password.length < 8
      ? "Use at least 8 characters"
      : undefined;
  const confirmError =
    submitted && confirm !== state.password
      ? "Passwords don’t match"
      : undefined;

  function continuePassword() {
    setSubmitted(true);
    if (state.password.length < 8 || confirm !== state.password) {
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
          <PrimaryButton onClick={continuePassword}>Next</PrimaryButton>
          <GhostButton type="button" onClick={() => {}}>
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
