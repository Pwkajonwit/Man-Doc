import type { DocumentFile } from "@/lib/document-types";

const FILE_ORDER_STORAGE_PREFIX = "archive-file-order:";
const FILE_ORDER_SETTING_PREFIX = "document-order:";

export function getDocumentOrderStorageKey(folderId: string) {
  return `${FILE_ORDER_STORAGE_PREFIX}${folderId}`;
}

export function getDocumentOrderSettingKey(folderId: string) {
  return `${FILE_ORDER_SETTING_PREFIX}${folderId}`;
}

export function parseDocumentOrder(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0,
    );
  } catch {
    return [];
  }
}

export function orderFilesByDocumentOrder(
  files: DocumentFile[],
  orderedIds: string[],
): DocumentFile[] {
  if (orderedIds.length === 0) {
    return files;
  }

  const orderMap = new Map(orderedIds.map((id, index) => [id, index]));
  const fallbackIndexMap = new Map(files.map((file, index) => [file.id, index]));

  return [...files].sort((left, right) => {
    const leftIndex = orderMap.get(left.id);
    const rightIndex = orderMap.get(right.id);

    if (leftIndex !== undefined && rightIndex !== undefined) {
      return leftIndex - rightIndex;
    }

    if (leftIndex !== undefined) {
      return -1;
    }

    if (rightIndex !== undefined) {
      return 1;
    }

    return (fallbackIndexMap.get(left.id) ?? 0) - (fallbackIndexMap.get(right.id) ?? 0);
  });
}

export function serializeDocumentOrder(files: DocumentFile[]) {
  return JSON.stringify(files.map((file) => file.id));
}
