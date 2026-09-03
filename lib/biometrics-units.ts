import type { MeasurementSystem } from "@/lib/onboarding-state";

const CM_PER_FT = 30.48;
const LBS_PER_KG = 2.2046226218;

function roundTo(value: number, places: number) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

export function formatHeightDisplay(cm: string, system: MeasurementSystem) {
  if (!cm.trim()) return "";
  const n = Number(cm);
  if (!Number.isFinite(n)) return "";
  return system === "metric"
    ? String(roundTo(n, 1))
    : String(roundTo(n / CM_PER_FT, 2));
}

export function formatWeightDisplay(kg: string, system: MeasurementSystem) {
  if (!kg.trim()) return "";
  const n = Number(kg);
  if (!Number.isFinite(n)) return "";
  return system === "metric"
    ? String(roundTo(n, 1))
    : String(roundTo(n * LBS_PER_KG, 1));
}

/** Returns metric string, "" for empty, or null if input is not yet a number. */
export function parseHeightToCm(display: string, system: MeasurementSystem) {
  if (!display.trim()) return "";
  const n = Number(display);
  if (!Number.isFinite(n)) return null;
  return String(
    system === "metric" ? roundTo(n, 2) : roundTo(n * CM_PER_FT, 2),
  );
}

export function parseWeightToKg(display: string, system: MeasurementSystem) {
  if (!display.trim()) return "";
  const n = Number(display);
  if (!Number.isFinite(n)) return null;
  return String(
    system === "metric" ? roundTo(n, 2) : roundTo(n / LBS_PER_KG, 2),
  );
}

export function formatBiometricsSummary(
  height: string,
  weight: string,
  system: MeasurementSystem,
) {
  const parts: string[] = [];
  const heightDisplay = formatHeightDisplay(height, system);
  const weightDisplay = formatWeightDisplay(weight, system);
  if (heightDisplay) {
    parts.push(
      system === "metric" ? `${heightDisplay} cm` : `${heightDisplay} ft`,
    );
  }
  if (weightDisplay) {
    parts.push(
      system === "metric" ? `${weightDisplay} kg` : `${weightDisplay} lbs`,
    );
  }
  return parts.length > 0 ? parts.join(" · ") : "—";
}
