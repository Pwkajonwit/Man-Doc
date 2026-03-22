export type FolderAccent = "default" | "active" | "muted";
export type FolderIconKey = "building" | "compass" | "gallery" | "wallet" | "chip";
export type FolderColorKey =
  | "slate"
  | "emerald"
  | "sky"
  | "amber"
  | "rose"
  | "violet";

export type UploadedBy = {
  name: string;
  initials: string;
  color: string;
};

export type FolderSummary = {
  id: string;
  name: string;
  fileCount: number;
  storageUsed: string;
  accent: FolderAccent;
  description?: string;
  repositoryId?: string;
  icon?: FolderIconKey;
  color?: FolderColorKey;
};

export type DocumentFile = {
  id: string;
  name: string;
  folderId: string;
  folderName: string;
  uploadedAt: string;
  size: string;
  sizeBytes: number;
  mimeType: string;
  previewUrl?: string;
  downloadUrl?: string;
  documentLink?: string;
  uploadedBy: UploadedBy;
};

export type DashboardData = {
  folders: FolderSummary[];
  recentFiles: DocumentFile[];
  files: DocumentFile[];
};

export type DashboardSource = "mock" | "gas";

export type DashboardLoadState = {
  data: DashboardData;
  gasConfigured: boolean;
  source: DashboardSource;
  errorMessage?: string;
};

export type DocumentActionResult = {
  mode: "mock" | "gas";
  message: string;
  folder?: FolderSummary;
  file?: DocumentFile;
};
