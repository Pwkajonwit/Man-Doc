import type { FolderColorKey, FolderIconKey } from "@/lib/document-types";

export const FOLDER_ICON_OPTIONS: Array<{
  value: FolderIconKey;
  label: string;
}> = [
  { value: "building", label: "อาคาร" },
  { value: "compass", label: "วงเวียน/กฎหมาย" },
  { value: "gallery", label: "รูปภาพ" },
  { value: "wallet", label: "กระเป๋า/การเงิน" },
  { value: "chip", label: "ชิป/เทคนิค" },
];

export const FOLDER_COLOR_OPTIONS: Array<{
  value: FolderColorKey;
  label: string;
}> = [
  { value: "emerald", label: "เขียว" },
  { value: "sky", label: "ฟ้า" },
  { value: "amber", label: "เหลืองอำพัน" },
  { value: "rose", label: "ชมพูแดง" },
  { value: "violet", label: "ม่วง" },
  { value: "slate", label: "เทา" },
];
