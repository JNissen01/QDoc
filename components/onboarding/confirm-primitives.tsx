"use client";

import type { ReactNode } from "react";
import { Pencil } from "lucide-react";
import { GhostButton, PrimaryButton } from "@/components/onboarding/primitives";
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

export function ReviewSectionCard({
  label,
  value,
  editing,
  onStartEdit,
  onCancel,
  onConfirm,
  children,
}: {
  label: string;
  value: string;
  editing: boolean;
  onStartEdit: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[14px] border bg-white px-4 py-4",
        editing ? "border-action" : "border-line",
      )}
    >
      {editing ? (
        <>
          <p className="text-[13px] leading-4 font-medium text-action">
            {label}
          </p>
          <div className="mt-4">{children}</div>
          <div className="mt-4 flex items-center gap-3">
            <GhostButton
              className="min-w-0 w-auto flex-1 basis-0"
              onClick={onCancel}
            >
              Cancel
            </GhostButton>
            <PrimaryButton
              className="h-10 min-w-0 w-auto flex-1 basis-0 text-[16px] leading-[22px]"
              onClick={onConfirm}
            >
              Confirm Edits
            </PrimaryButton>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] leading-4 text-caption">{label}</p>
            <p className="mt-1 whitespace-pre-line text-[16px] leading-[22px] font-medium text-ink">
              {value}
            </p>
          </div>
          <button
            type="button"
            onClick={onStartEdit}
            aria-label={`Edit ${label}`}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-action"
          >
            <Pencil className="size-4" strokeWidth={1.8} />
          </button>
        </div>
      )}
    </div>
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
