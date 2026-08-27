"use client";

import { Check, Search, type LucideIcon } from "lucide-react";
import {
  Children,
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { InfoIcon } from "@/components/brand/info-icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PrimaryButton({
  className,
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-14 w-full items-center justify-center gap-2 rounded-[51px] bg-action text-[20px] leading-[26px] font-semibold text-white transition-colors active:bg-ink disabled:bg-fog disabled:text-white",
        className,
      )}
      {...props}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function TonalButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-14 w-full items-center justify-center gap-2 rounded-[51px] bg-tint text-[20px] leading-[26px] font-semibold text-action",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      className={cn(
        "w-full py-3 text-center text-[18px] leading-6 font-semibold text-action",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/** Centered secondary link under a primary CTA (matches Checkpoint skip). */
export function SkipStepLink({
  className,
  children = "Skip this step",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children?: ReactNode }) {
  return (
    <GhostButton className={className} {...props}>
      {children}
    </GhostButton>
  );
}

function withDisabled(children: ReactNode, disabled?: boolean) {
  if (disabled === undefined) return children;
  return Children.map(children, (child) => {
    if (!isValidElement<{ disabled?: boolean }>(child)) return child;
    return cloneElement(child, { disabled });
  });
}

/** Primary CTA + optional skip link with Checkpoint spacing. */
export function StepFooter({
  children,
  onSkip,
  skipLabel = "Skip this step",
  hideSkip = false,
  disabled,
}: {
  children: ReactNode;
  onSkip?: () => void;
  skipLabel?: string;
  hideSkip?: boolean;
  disabled?: boolean;
}) {
  const cta = withDisabled(children, disabled);

  if (!onSkip || hideSkip) return cta;

  return (
    <div className="space-y-2">
      {cta}
      <SkipStepLink onClick={onSkip}>{skipLabel}</SkipStepLink>
    </div>
  );
}

export function SearchField({
  className,
  inputClassName,
  ...props
}: ComponentProps<"input"> & { inputClassName?: string }) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-caption" />
      <Input
        className={cn(
          "h-[70px] rounded-[14px] border border-line bg-white pr-4 pl-11 text-[16px] leading-[22px] text-ink shadow-none placeholder:text-fog focus-visible:border-2 focus-visible:border-action focus-visible:ring-0 md:text-[16px]",
          inputClassName,
        )}
        {...props}
      />
    </div>
  );
}

export function Field({
  label,
  error,
  className,
  inputClassName,
  ...props
}: ComponentProps<"input"> & {
  label?: string;
  error?: string;
  inputClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label ? (
        <Label className="text-[13px] leading-4 font-normal text-ink">
          {label}
        </Label>
      ) : null}
      <Input
        aria-invalid={Boolean(error)}
        className={cn(
          "h-[70px] rounded-[14px] border border-line bg-white px-4 text-[16px] leading-[22px] text-ink shadow-none placeholder:text-fog focus-visible:border-2 focus-visible:border-action focus-visible:ring-0 aria-invalid:border-danger aria-invalid:bg-red-50 aria-invalid:ring-0 md:text-[16px]",
          inputClassName,
        )}
        {...props}
      />
      {error ? (
        <p className="text-[14px] leading-[18px] text-danger">{error}</p>
      ) : null}
    </div>
  );
}

export function SelectorCard({
  selected,
  title,
  description,
  onClick,
  leading,
  trailing,
  variant = "radio",
}: {
  selected?: boolean;
  title: string;
  description?: string;
  onClick: () => void;
  leading?: ReactNode;
  trailing?: ReactNode;
  variant?: "radio" | "choice";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-[70px] w-full items-center gap-3 rounded-[14px] bg-white px-4 py-3 text-left transition-colors",
        selected ? "selector-card-selected" : "border border-line",
      )}
    >
      {leading}
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-[16px] leading-[22px]",
            selected
              ? "font-medium text-action"
              : "font-normal text-ink",
          )}
        >
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block text-[14px] leading-[18px] font-normal text-body">
            {description}
          </span>
        ) : null}
      </span>
      {trailing}
    </button>
  );
}

export function RadioDot({ selected }: { selected: boolean }) {
  if (selected) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        className="size-[17px] shrink-0"
        aria-hidden
      >
        <path
          d="M8.33333 0C3.73333 0 0 3.73333 0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0ZM8.33333 15C4.65 15 1.66667 12.0167 1.66667 8.33333C1.66667 4.65 4.65 1.66667 8.33333 1.66667C12.0167 1.66667 15 4.65 15 8.33333C15 12.0167 12.0167 15 8.33333 15Z"
          fill="#4258C7"
        />
        <path
          d="M8.33333 12.5C10.6345 12.5 12.5 10.6345 12.5 8.33333C12.5 6.03215 10.6345 4.16667 8.33333 4.16667C6.03215 4.16667 4.16667 6.03215 4.16667 8.33333C4.16667 10.6345 6.03215 12.5 8.33333 12.5Z"
          fill="#4258C7"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      className="size-[17px] shrink-0"
      aria-hidden
    >
      <path
        d="M8.33333 0C3.73333 0 0 3.73333 0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0ZM8.33333 15C4.65 15 1.66667 12.0167 1.66667 8.33333C1.66667 4.65 4.65 1.66667 8.33333 1.66667C12.0167 1.66667 15 4.65 15 8.33333C15 12.0167 12.0167 15 8.33333 15Z"
        fill="#9D9BC0"
      />
    </svg>
  );
}

export function CheckBox({ selected }: { selected: boolean }) {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-[5px] border",
        selected ? "border-action bg-action text-white" : "border-line bg-white",
      )}
    >
      {selected ? <Check className="size-3.5" strokeWidth={3} /> : null}
    </span>
  );
}

export function IconWell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-line bg-white text-action",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function FeatureItem({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-line bg-white px-4 py-3">
      <IconWell className="border-0">
        <Icon className="size-5" strokeWidth={1.8} />
      </IconWell>
      <span className="min-w-0">
        <span className="block text-[16px] leading-[22px] font-semibold text-ink">
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block text-[14px] leading-[18px] font-normal text-body">
            {description}
          </span>
        ) : null}
      </span>
    </div>
  );
}

export function Chip({
  selected,
  children,
  onClick,
  variant = "solid",
}: {
  selected?: boolean;
  children: ReactNode;
  onClick: () => void;
  variant?: "solid" | "soft";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[43px] border px-3.5 py-2 text-[14px] leading-[18px] transition-colors",
        selected && variant === "solid" && "border-action bg-action font-medium text-white",
        selected && variant === "soft" && "border-action bg-tint font-medium text-ink",
        !selected && "border-line bg-white font-normal text-ink",
      )}
    >
      {children}
    </button>
  );
}

export function InfoNote({
  children,
  className,
  align = "start",
  tone = "tertiary",
}: {
  children: ReactNode;
  className?: string;
  align?: "start" | "end";
  tone?: "action" | "tertiary";
}) {
  return (
    <p
      className={cn(
        "flex gap-2 text-[14px] leading-[18px] items-center",
        tone === "action" ? "text-action" : "text-caption",
        align === "end" ? "justify-end" : "justify-start",
        className,
      )}
    >
      <InfoIcon className="size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export function LockNote({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center justify-start gap-2 text-[14px] leading-[18px] text-caption">
      <svg
        viewBox="0 0 24 24"
        className="size-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
      <span>{children}</span>
    </p>
  );
}

export function HighlightBanner({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-[14px] border border-line bg-white px-4 py-3 text-[14px] leading-[18px] text-body">
      <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-action text-[11px] font-semibold text-action">
        i
      </span>
      <p>{children}</p>
    </div>
  );
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T | null;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "h-[70px] rounded-[14px] border text-[16px]",
              selected
                ? "border-action bg-action font-medium text-white"
                : "border-line bg-tint font-normal text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
