import type { CandidateStatus, OfferFit, Track } from "../types";

export function trackLabel(track?: OfferFit | Track[] | null): string {
  if (!track) return "Not selected";
  if (Array.isArray(track)) {
    if (track.length === 2) return "Blip + Chromonno";
    return track.map(trackLabel).join(", ");
  }
  if (track === "blip") return "Blip";
  if (track === "chromonno") return "Chromonno";
  if (track === "both") return "Blip + Chromonno";
  return "Unclear";
}

export function statusLabel(status?: CandidateStatus | string) {
  if (!status) return "Unknown";
  return status
    .split("_")
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(" ");
}

export function percent(value: number, target: number) {
  if (!target) return 0;
  return Math.min(100, Math.round((value / target) * 100));
}

export function currency(value?: number) {
  if (value === undefined || Number.isNaN(value)) return "Not set";
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value);
}

export function toDateInputValue(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
