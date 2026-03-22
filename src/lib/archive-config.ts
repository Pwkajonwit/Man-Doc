import type {
  DocumentFile,
  FolderColorKey,
  FolderIconKey,
  FolderSummary,
} from "@/lib/document-types";

type FolderProfile = {
  repositoryId: string;
  description: string;
  detailDescription: string;
  variant: "identity" | "legal" | "media" | "finance" | "technical" | "general";
  icon: FolderIconKey;
  color: FolderColorKey;
  cardTheme: {
    headerClassName: string;
    iconWrapClassName: string;
    iconClassName: string;
    badgeClassName: string;
    footerClassName: string;
  };
};

const folderProfiles: Record<string, FolderProfile> = {
  "health-report": {
    repositoryId: "ARCH-001",
    description:
      "รายงานสุขภาพ ประวัติการติดตามผล และสรุปทางการแพทย์ที่ตรวจสอบแล้ว",
    detailDescription:
      "เข้าถึงและจัดการเอกสารด้านสุขภาพ ไฟล์กำกับดูแล และชุดรายงานที่เกี่ยวข้อง",
    variant: "identity",
    icon: "building",
    color: "emerald",
    cardTheme: buildCardTheme("emerald"),
  },
  "medical-information": {
    repositoryId: "ARCH-042",
    description:
      "ไฟล์อ้างอิงทางการแพทย์ ใบสั่งยา และข้อมูลผู้ป่วยที่จัดเก็บเป็นระบบ",
    detailDescription:
      "เรียกดูเอกสารข้อมูลทางการแพทย์ พร้อมพรีวิวและสั่งพิมพ์ได้จากหน้าเดียว",
    variant: "legal",
    icon: "compass",
    color: "sky",
    cardTheme: buildCardTheme("sky"),
  },
  prescriptions: {
    repositoryId: "ARCH-089",
    description:
      "บันทึกใบสั่งยา เอกสารแนบจากร้านยา และเอกสารอ้างอิงการรักษา",
    detailDescription:
      "ตรวจสอบใบสั่งยาและไฟล์ประกอบในมุมมองคลังเอกสารที่ควบคุมได้",
    variant: "media",
    icon: "gallery",
    color: "amber",
    cardTheme: buildCardTheme("amber"),
  },
  archived: {
    repositoryId: "ARCH-115",
    description:
      "เอกสารย้อนหลัง หลักฐานการดำเนินงาน และข้อมูลเก่าที่ต้องเก็บรักษา",
    detailDescription:
      "ดูแลเอกสารเก็บถาวร พร้อมติดตามการเข้าถึงและพิมพ์สรุปเอกสารได้",
    variant: "finance",
    icon: "wallet",
    color: "rose",
    cardTheme: buildCardTheme("rose"),
  },
};

export function getFolderProfile(folder: FolderSummary, index = 0): FolderProfile {
  const fallbackVariants: FolderProfile["variant"][] = [
    "identity",
    "legal",
    "media",
    "finance",
    "technical",
    "general",
  ];
  const fallbackVariant = fallbackVariants[index % fallbackVariants.length];
  const fallbackIcon = resolveFallbackIcon(fallbackVariant);
  const fallbackColor = resolveFallbackColor(fallbackVariant);
  const defaultProfile = folderProfiles[folder.id];

  if (defaultProfile) {
    return {
      ...defaultProfile,
      repositoryId: folder.repositoryId || defaultProfile.repositoryId,
      description: folder.description || defaultProfile.description,
      detailDescription: folder.description || defaultProfile.detailDescription,
      icon: folder.icon || defaultProfile.icon,
      color: folder.color || defaultProfile.color,
      cardTheme: buildCardTheme(folder.color || defaultProfile.color),
    };
  }

  return (
    {
      repositoryId:
        folder.repositoryId || `ARCH-${String(index + 1).padStart(3, "0")}`,
      description:
        folder.description ||
        "ชุดเอกสารที่จัดเก็บอย่างเป็นระบบ พร้อมเรียกใช้และตรวจสอบได้ง่าย",
      detailDescription:
        folder.description ||
        "เข้าถึงและจัดการคลังเอกสารที่เลือก พร้อมพรีวิวและพิมพ์เอกสารได้",
      variant: fallbackVariant,
      icon: folder.icon || fallbackIcon,
      color: folder.color || fallbackColor,
      cardTheme: buildCardTheme(folder.color || fallbackColor),
    }
  );
}

function resolveFallbackIcon(variant: FolderProfile["variant"]): FolderIconKey {
  if (variant === "legal") return "compass";
  if (variant === "media") return "gallery";
  if (variant === "finance") return "wallet";
  if (variant === "technical") return "chip";
  return "building";
}

function resolveFallbackColor(variant: FolderProfile["variant"]): FolderColorKey {
  if (variant === "legal") return "sky";
  if (variant === "media") return "amber";
  if (variant === "finance") return "rose";
  if (variant === "technical") return "violet";
  return "emerald";
}

function buildCardTheme(color: FolderColorKey) {
  if (color === "sky") {
    return {
      headerClassName: "bg-sky-50",
      iconWrapClassName: "bg-white",
      iconClassName: "text-sky-700",
      badgeClassName: "bg-white text-sky-700 border border-sky-100",
      footerClassName: "bg-sky-50/60",
    };
  }

  if (color === "amber") {
    return {
      headerClassName: "bg-amber-50",
      iconWrapClassName: "bg-white",
      iconClassName: "text-amber-700",
      badgeClassName: "bg-white text-amber-700 border border-amber-100",
      footerClassName: "bg-amber-50/70",
    };
  }

  if (color === "rose") {
    return {
      headerClassName: "bg-rose-50",
      iconWrapClassName: "bg-white",
      iconClassName: "text-rose-700",
      badgeClassName: "bg-white text-rose-700 border border-rose-100",
      footerClassName: "bg-rose-50/70",
    };
  }

  if (color === "violet") {
    return {
      headerClassName: "bg-violet-50",
      iconWrapClassName: "bg-white",
      iconClassName: "text-violet-700",
      badgeClassName: "bg-white text-violet-700 border border-violet-100",
      footerClassName: "bg-violet-50/70",
    };
  }

  if (color === "slate") {
    return {
      headerClassName: "bg-slate-100",
      iconWrapClassName: "bg-white",
      iconClassName: "text-slate-700",
      badgeClassName: "bg-white text-slate-700 border border-slate-200",
      footerClassName: "bg-slate-50",
    };
  }

  return {
    headerClassName: "bg-slate-50",
    iconWrapClassName: "bg-emerald-50",
    iconClassName: "text-emerald-700",
    badgeClassName: "bg-white text-emerald-700 border border-emerald-100",
    footerClassName: "bg-slate-50",
  };
}

export function getFilesForFolder(
  files: DocumentFile[],
  folderId: string,
): DocumentFile[] {
  return files
    .filter((file) => file.folderId === folderId)
    .sort(
      (left, right) =>
        new Date(right.uploadedAt).getTime() - new Date(left.uploadedAt).getTime(),
    );
}

export function buildFileMeta(file: DocumentFile, index = 0) {
  const tagsByFolder: Record<string, string[]> = {
    "health-report": ["#สุขภาพ", "#ตรวจสอบแล้ว", "#รายงาน"],
    "medical-information": ["#การแพทย์", "#อ้างอิง", "#ปลอดภัย"],
    prescriptions: ["#ใบสั่งยา", "#ร้านยา", "#จัดเก็บ"],
    archived: ["#เก็บรักษา", "#ย้อนหลัง", "#คลังเอกสาร"],
  };

  const statusByMime: Record<string, string> = {
    "application/pdf": "ตรวจสอบแล้ว",
    "application/zip": "แฟ้มจัดเก็บ",
    "image/png": "สื่อภาพ",
    "image/jpeg": "สื่อภาพ",
  };

  const sectionByMime: Record<string, string> = {
    "application/pdf": "เอกสาร PDF",
    "application/zip": "แฟ้มบีบอัด",
    "image/png": "ไฟล์ภาพ",
    "image/jpeg": "ไฟล์ภาพ",
  };

  return {
    recordId: `ARCH-${file.id.slice(0, 6).toUpperCase()}`,
    summaryLine: `${sectionByMime[file.mimeType] ?? "ไฟล์เอกสาร"} • ${file.folderName}`,
    status: statusByMime[file.mimeType] ?? "จัดทำดัชนีแล้ว",
    keywords: tagsByFolder[file.folderId] ?? ["#เอกสาร", "#จัดการแล้ว", "#คลังข้อมูล"],
    author: file.uploadedBy.name,
    revision: `R${String(index + 1).padStart(2, "0")}`,
  };
}
