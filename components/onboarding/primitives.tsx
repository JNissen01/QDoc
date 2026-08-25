"use client";

import { Check, Search, type LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PrimaryButton({
  className,
  children,
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
        "flex min-h-[70px] w-full items-center gap-3 rounded-[14px] border bg-white px-4 py-3 text-left transition-colors",
        selected ? "border-action bg-tint" : "border-line",
      )}
    >
      {leading}
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-[16px] leading-[22px] font-medium",
            selected && variant === "radio" ? "text-action" : "text-ink",
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
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full bg-white",
        selected ? "border-action" : "border border-line",
      )}
      style={
        selected
          ? { borderWidth: 2, borderStyle: "solid" }
          : undefined
      }
      aria-hidden
    />
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
        "rounded-[43px] border px-3.5 py-2 text-[14px] leading-[18px] font-medium transition-colors",
        selected && variant === "solid" && "border-action bg-action text-white",
        selected && variant === "soft" && "border-action bg-tint text-ink",
        !selected && "border-line bg-white text-ink",
      )}
    >
      {children}
    </button>
  );
}

export function InfoNote({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-2 text-[14px] leading-[18px] text-action">
      <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-action text-[10px] font-semibold">
        i
      </span>
      <span>{children}</span>
    </p>
  );
}

export function LockNote({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[14px] leading-[18px] text-caption">
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
      {children}
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
              "h-[70px] rounded-[14px] border text-[16px] font-medium",
              selected
                ? "border-action bg-action text-white"
                : "border-line bg-tint text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
