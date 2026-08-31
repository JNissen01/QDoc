"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useFlowPreview } from "@/components/flow/flow-preview-context";

export const PHONE_SCREEN_WIDTH = 430;
export const PHONE_SCREEN_HEIGHT = 852;
export const PHONE_BEZEL = 12;
export const PHONE_DEVICE_WIDTH = PHONE_SCREEN_WIDTH + PHONE_BEZEL * 2;
export const PHONE_DEVICE_HEIGHT = PHONE_SCREEN_HEIGHT + PHONE_BEZEL * 2;

function CellularIcon() {
  return (
    <svg
      width="17"
      height="12"
      viewBox="0 0 17 12"
      fill="currentColor"
      aria-hidden
    >
      <rect x="0" y="8" width="3" height="4" rx="0.6" />
      <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.6" />
      <rect x="9" y="3" width="3" height="9" rx="0.6" />
      <rect x="13.5" y="0" width="3" height="12" rx="0.6" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M1.2 4.4c3.7-3.6 9.9-3.6 13.6 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M3.5 6.9c2.4-2.3 6.6-2.3 9 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M5.9 9.3c1.1-1 3.1-1 4.2 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11.1" r="1" fill="currentColor" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg
      width="27"
      height="13"
      viewBox="0 0 27 13"
      fill="none"
      aria-hidden
    >
      <rect
        x="0.6"
        y="0.6"
        width="23"
        height="11.8"
        rx="2.4"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.4"
      />
      <rect x="2.2" y="2.2" width="20" height="8.6" rx="1.4" fill="currentColor" />
      <path
        d="M24.8 4.4v4.2c1.2-.5 1.2-3.7 0-4.2Z"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  );
}

function StatusBar() {
  return (
    <div className="relative z-20 grid h-[54px] shrink-0 grid-cols-[1fr_auto_1fr] items-end px-7 pb-[7px] text-ink">
      <p className="pb-[1px] text-[15px] leading-none font-semibold tracking-[0.02em] tabular-nums">
        9:41
      </p>
      <div
        className="mb-[1px] flex h-[35px] w-[118px] items-center justify-center rounded-full bg-[#0b0a12] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
        aria-hidden
      >
        <span className="mr-[18px] size-[9px] rounded-full bg-[#1c1b29] ring-1 ring-black/40" />
        <span className="size-[11px] rounded-full bg-[#151422] ring-1 ring-black/50" />
      </div>
      <div className="flex items-center justify-end gap-[6px] pb-[2px]">
        <CellularIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
}

function DeviceChrome({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("relative", className)}
      style={{ width: PHONE_DEVICE_WIDTH, height: PHONE_DEVICE_HEIGHT }}
    >
      <div
        className="pointer-events-none absolute top-[148px] -left-[3px] h-[32px] w-[3px] rounded-l-full bg-[#3a3858]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-[196px] -left-[3px] h-[62px] w-[3px] rounded-l-full bg-[#3a3858]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-[168px] -right-[3px] h-[78px] w-[3px] rounded-r-full bg-[#3a3858]"
        aria-hidden
      />

      <div
        className="box-border rounded-[54px] p-[12px] shadow-[0_24px_80px_rgba(30,27,75,0.28),inset_0_1px_0_rgba(255,255,255,0.14)]"
        style={{
          width: PHONE_DEVICE_WIDTH,
          height: PHONE_DEVICE_HEIGHT,
          background: "linear-gradient(180deg, #2f2c4d 0%, #14121f 100%)",
        }}
      >
        <div
          className="relative flex flex-col overflow-hidden rounded-[42px] bg-canvas"
          style={{ width: PHONE_SCREEN_WIDTH, height: PHONE_SCREEN_HEIGHT }}
        >
          <StatusBar />
          <div className="scrollbar-none flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-3 pb-2">
            {children}
          </div>
          <div className="flex h-[22px] shrink-0 items-start justify-center">
            <span
              className="mt-[2px] h-[5px] w-[134px] rounded-full bg-ink/80"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  const preview = useFlowPreview();

  if (preview) {
    return <DeviceChrome>{children}</DeviceChrome>;
  }

  const scale: CSSProperties = {
    ["--phone-scale" as string]: `min(1, (100dvw - 2rem) / ${PHONE_DEVICE_WIDTH}px)`,
    width: `calc(${PHONE_DEVICE_WIDTH}px * var(--phone-scale))`,
    height: `calc(${PHONE_DEVICE_HEIGHT}px * var(--phone-scale))`,
  };

  return (
    <div className="flex min-h-dvh items-center justify-center overflow-x-hidden overflow-y-auto bg-[#d5def4] px-4 py-4">
      <div style={scale}>
        <div
          className="origin-top-left"
          style={{
            width: PHONE_DEVICE_WIDTH,
            height: PHONE_DEVICE_HEIGHT,
            transform: "scale(var(--phone-scale))",
          }}
        >
          <DeviceChrome>{children}</DeviceChrome>
        </div>
      </div>
    </div>
  );
}
