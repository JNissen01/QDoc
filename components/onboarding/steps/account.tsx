"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { OnboardingShell } from "@/components/onboarding/shell";
import { Field, PrimaryButton } from "@/components/onboarding/primitives";
import { useStepNav } from "@/components/onboarding/use-step-nav";
import { cn } from "@/lib/utils";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function AccountStep() {
  const { state, update, goNext } = useStepNav("account");
  const [confirm, setConfirm] = useState(state.password);
  const [submitted, setSubmitted] = useState(false);

  const emailError =
    submitted && !isValidEmail(state.email)
      ? "Enter a valid email address"
      : undefined;
  const passwordError =
    submitted && state.password.length < 8
      ? "Use at least 8 characters"
      : undefined;
  const confirmError =
    submitted && confirm !== state.password
      ? "Passwords don’t match"
      : undefined;

  function continueAccount() {
    setSubmitted(true);
    if (
      !isValidEmail(state.email) ||
      state.password.length < 8 ||
      confirm !== state.password
    ) {
      return;
    }
    goNext();
  }

  return (
    <OnboardingShell
      step="account"
      title="Create your account"
      subtitle="We’ll send a 5-digit code to confirm it’s you. For this prototype, any code works."
      footer={<PrimaryButton onClick={continueAccount}>Continue</PrimaryButton>}
    >
      <div className="space-y-4 text-left">
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          value={state.email}
          error={emailError}
          onChange={(event) => update({ email: event.target.value })}
        />
        <Field
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={state.password}
          error={passwordError}
          onChange={(event) => update({ password: event.target.value })}
        />
        <Field
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={confirm}
          error={confirmError}
          onChange={(event) => setConfirm(event.target.value)}
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
      subtitle={`Enter the code sent to ${state.email || "your email address"} to secure your account.`}
      footer={
        <PrimaryButton disabled={!complete} onClick={verify}>
          Verify
        </PrimaryButton>
      }
    >
      <div className="flex justify-center gap-2">
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
              "size-14 rounded-[14px] border border-line bg-white text-center text-[24px] font-semibold text-ink placeholder:text-fog focus:border-action focus:outline-none",
              error && "border-danger",
            )}
          />
        ))}
      </div>
      {error ? (
        <p className="mt-3 text-center text-[14px] text-danger">{error}</p>
      ) : (
        <p className="mt-4 text-center text-[14px] text-caption">
          Demo tip: any 5-digit code works, including 12345.
        </p>
      )}
    </OnboardingShell>
  );
}
