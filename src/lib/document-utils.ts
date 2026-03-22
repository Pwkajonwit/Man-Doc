import type { UploadedBy } from "@/lib/document-types";

const palette = ["#2a6bf4", "#0f766e", "#7c3aed", "#c2410c", "#be185d"];

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 MB";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  const megabytes = bytes / (1024 * 1024);
  return `${megabytes < 10 ? megabytes.toFixed(1) : megabytes.toFixed(0)} MB`;
}

export function formatReadableDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("th-TH-u-ca-gregory", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function createUploadedBy(name: string): UploadedBy {
  const normalized = name.trim() || "ระบบงาน MAN";
  let hash = 0;

  for (const char of normalized) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }

  return {
    name: normalized,
    initials: deriveInitials(normalized),
    color: palette[Math.abs(hash) % palette.length],
  };
}

export function deriveInitials(name: string) {
  const parts = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "");

  return parts.join("") || "MW";
}

export function mergeStorageLabel(current: string, incomingBytes: number) {
  const currentValue = Number.parseFloat(current);
  const currentInMb = Number.isFinite(currentValue) ? currentValue : 0;
  const incomingInMb = incomingBytes / (1024 * 1024);

  return `${(currentInMb + incomingInMb).toFixed(currentInMb + incomingInMb < 10 ? 1 : 0)} MB`;
}
