import type {
  DashboardData,
  DocumentActionResult,
  DocumentFile,
  FolderColorKey,
  FolderIconKey,
  FolderSummary,
} from "@/lib/document-types";
import { createUploadedBy, formatBytes } from "@/lib/document-utils";

const gasWebAppUrl = process.env.GAS_WEB_APP_URL;
export const DASHBOARD_CACHE_TAG = "dashboard-data";

export function hasGasConfig() {
  return Boolean(gasWebAppUrl);
}

export async function fetchDashboardFromGas() {
  if (!gasWebAppUrl) {
    return null;
  }

  const response = await fetch(`${gasWebAppUrl}?action=dashboard`, {
    next: {
      revalidate: 15,
      tags: [DASHBOARD_CACHE_TAG],
    },
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`ดึงข้อมูลแดชบอร์ดจาก GAS ไม่สำเร็จ (${response.status})`);
  }

  const payload = await response.json();
  return normalizeDashboardPayload(payload);
}

type GasPostPayload =
  | {
      action: "create-folder";
      folderName: string;
      repositoryId?: string;
      folderDescription?: string;
      folderIcon?: FolderIconKey;
      folderColor?: FolderColorKey;
    }
  | {
      action: "update-folder";
      folderId: string;
      folderName: string;
      repositoryId?: string;
      folderDescription?: string;
      folderIcon?: FolderIconKey;
      folderColor?: FolderColorKey;
    }
  | {
      action: "delete-folder";
      folderId: string;
    }
  | {
      action: "delete-file";
      fileId: string;
    }
  | {
      action: "upload-file";
      folderId: string;
      folderName: string;
      uploadedBy: string;
      file: {
        name: string;
        type: string;
        size: number;
        base64: string;
      };
    };

export async function postToGas(payload: GasPostPayload) {
  if (!gasWebAppUrl) {
    throw new Error("ยังไม่ได้ตั้งค่า GAS_WEB_APP_URL");
  }

  const response = await fetch(gasWebAppUrl, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`ส่งคำขอไปยัง GAS ไม่สำเร็จ (${response.status})`);
  }

  return normalizeActionPayload(await response.json());
}

function normalizeDashboardPayload(raw: unknown): DashboardData | null {
  const source = unwrapPayload(raw);

  if (!source || typeof source !== "object") {
    return null;
  }

  const folders = Array.isArray(source.folders)
    ? source.folders.map(normalizeFolder).filter(isDefined)
    : [];
  const files = Array.isArray(source.files)
    ? source.files.map(normalizeFile).filter(isDefined)
    : [];
  const recentFiles = Array.isArray(source.recentFiles)
    ? source.recentFiles.map(normalizeFile).filter(isDefined)
    : files.slice(0, 3);

  return {
    folders,
    recentFiles,
    files,
  };
}

function normalizeActionPayload(raw: unknown): DocumentActionResult {
  const source = unwrapPayload(raw);

  return {
    mode: source?.mode === "gas" ? "gas" : "mock",
    message:
      typeof source?.message === "string"
        ? source.message
        : "ดำเนินการสำเร็จ",
    folder: normalizeFolder(source?.folder),
    file: normalizeFile(source?.file),
  };
}

function normalizeFolder(raw: unknown): FolderSummary | undefined {
  if (!raw || typeof raw !== "object") {
    return undefined;
  }

  const candidate = raw as Record<string, unknown>;
  const id = pickString(candidate.id, crypto.randomUUID());
  const name = pickString(candidate.name, "หมวดเอกสารใหม่");
  const fileCount = Number(candidate.fileCount);
  const storageUsed = pickString(candidate.storageUsed, "0 MB");
  const accent = candidate.accent;
  const repositoryId = pickOptionalString(candidate.repositoryId);
  const description = pickOptionalString(candidate.description);
  const icon = candidate.icon;
  const color = candidate.color;

  return {
    id,
    name,
    fileCount: Number.isFinite(fileCount) ? fileCount : 0,
    storageUsed,
    description,
    repositoryId,
    icon:
      icon === "building" ||
      icon === "compass" ||
      icon === "gallery" ||
      icon === "wallet" ||
      icon === "chip"
        ? icon
        : undefined,
    color:
      color === "slate" ||
      color === "emerald" ||
      color === "sky" ||
      color === "amber" ||
      color === "rose" ||
      color === "violet"
        ? color
        : undefined,
    accent:
      accent === "active" || accent === "muted" || accent === "default"
        ? accent
        : "default",
  };
}

function normalizeFile(raw: unknown): DocumentFile | undefined {
  if (!raw || typeof raw !== "object") {
    return undefined;
  }

  const candidate = raw as Record<string, unknown>;
  const uploaderName =
    typeof candidate.uploadedBy === "object" && candidate.uploadedBy
      ? pickString(
          (candidate.uploadedBy as Record<string, unknown>).name,
          "ระบบงาน MAN",
        )
      : "ระบบงาน MAN";
  const uploaderFallback = createUploadedBy(uploaderName);

  return {
    id: pickString(candidate.id, crypto.randomUUID()),
    name: pickString(candidate.name, "ไฟล์ไม่มีชื่อ"),
    folderId: pickString(candidate.folderId, "general"),
    folderName: pickString(candidate.folderName, "ทั่วไป"),
    uploadedAt: pickString(candidate.uploadedAt, new Date().toISOString()),
    size: pickString(candidate.size, "0 MB"),
    sizeBytes: Number(candidate.sizeBytes) || 0,
    mimeType: pickString(candidate.mimeType, "application/octet-stream"),
    previewUrl: pickOptionalString(candidate.previewUrl),
    downloadUrl: pickOptionalString(candidate.downloadUrl),
    documentLink: pickOptionalString(candidate.documentLink),
    uploadedBy:
      typeof candidate.uploadedBy === "object" && candidate.uploadedBy
        ? {
            name: uploaderName,
            initials: pickString(
              (candidate.uploadedBy as Record<string, unknown>).initials,
              uploaderFallback.initials,
            ),
            color: pickString(
              (candidate.uploadedBy as Record<string, unknown>).color,
              uploaderFallback.color,
            ),
          }
        : uploaderFallback,
  };
}

function unwrapPayload(raw: unknown) {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const candidate = raw as Record<string, unknown>;
  const inner =
    candidate.data && typeof candidate.data === "object" ? candidate.data : raw;

  return inner as Record<string, unknown>;
}

function pickString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function pickOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function createMockFolder(
  name: string,
  options?: {
    description?: string;
    repositoryId?: string;
    icon?: FolderIconKey;
    color?: FolderColorKey;
  },
): FolderSummary {
  return {
    id: crypto.randomUUID(),
    name,
    fileCount: 0,
    storageUsed: "0 MB",
    accent: "default",
    description: options?.description,
    repositoryId:
      options?.repositoryId || `ARCH-${String(Math.floor(Math.random() * 900) + 100)}`,
    icon: options?.icon,
    color: options?.color,
  };
}

export function updateMockFolder(
  folder: FolderSummary,
  updates: {
    name: string;
    repositoryId?: string;
    description?: string;
    icon?: FolderIconKey;
    color?: FolderColorKey;
  },
): FolderSummary {
  return {
    ...folder,
    name: updates.name,
    repositoryId: updates.repositoryId || folder.repositoryId,
    description: updates.description,
    icon: updates.icon ?? folder.icon,
    color: updates.color ?? folder.color,
  };
}

export function createMockFile(params: {
  fileName: string;
  fileType: string;
  fileSize: number;
  folderId: string;
  folderName: string;
  uploadedBy: string;
  documentLink?: string;
  base64?: string;
}): DocumentFile {
  const fileId = crypto.randomUUID();
  const previewUrl =
    isPreviewableMimeType(params.fileType) && params.base64
      ? `data:${params.fileType};base64,${params.base64}`
      : undefined;
  const downloadUrl = previewUrl;

  return {
    id: fileId,
    name: params.fileName,
    folderId: params.folderId,
    folderName: params.folderName,
    uploadedAt: new Date().toISOString(),
    size: formatBytes(params.fileSize),
    sizeBytes: params.fileSize,
    mimeType: params.fileType || "application/octet-stream",
    previewUrl,
    downloadUrl,
    documentLink:
      params.documentLink || `https://drive.google.com/file/d/${fileId}/view`,
    uploadedBy: createUploadedBy(params.uploadedBy),
  };
}

function isPreviewableMimeType(fileType: string) {
  return fileType.startsWith("image/") || fileType === "application/pdf";
}
