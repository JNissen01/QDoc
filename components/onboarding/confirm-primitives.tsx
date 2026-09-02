"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function confirmControlClass() {
  return "mt-1 w-full bg-transparent text-[16px] leading-[22px] font-medium text-ink outline-none";
}

export function ConfirmChip({
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

export function ConfirmRow({
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
          ? "-mx-2 my-2 rounded-[12px] bg-white px-3 py-3"
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
          <p className="mt-1 whitespace-pre-line text-[16px] leading-[22px] font-medium text-ink">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}
