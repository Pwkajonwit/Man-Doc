import type { DashboardData } from "@/lib/document-types";
import { createUploadedBy } from "@/lib/document-utils";

const mockImagePreview =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
      <rect width="900" height="1200" fill="#eef3f6"/>
      <rect x="78" y="84" width="744" height="1032" rx="28" fill="#ffffff" stroke="#d8e0e7"/>
      <rect x="146" y="152" width="608" height="366" rx="22" fill="#d9e7ef"/>
      <circle cx="244" cy="248" r="56" fill="#7da1b7"/>
      <path d="M184 464L324 324L440 436L548 350L716 518H184Z" fill="#557387"/>
      <rect x="146" y="580" width="520" height="30" rx="15" fill="#e8eef3"/>
      <rect x="146" y="640" width="594" height="24" rx="12" fill="#edf2f6"/>
      <rect x="146" y="688" width="566" height="24" rx="12" fill="#edf2f6"/>
      <rect x="146" y="736" width="448" height="24" rx="12" fill="#edf2f6"/>
      <rect x="146" y="836" width="608" height="180" rx="18" fill="#f5f8fa"/>
    </svg>
  `);

export const mockDashboardData: DashboardData = {
  folders: [
    {
      id: "health-report",
      name: "รายงานสุขภาพ",
      fileCount: 80,
      storageUsed: "168 MB",
      accent: "default",
    },
    {
      id: "medical-information",
      name: "ข้อมูลทางการแพทย์",
      fileCount: 3,
      storageUsed: "56 MB",
      accent: "active",
    },
    {
      id: "prescriptions",
      name: "ใบสั่งยา",
      fileCount: 20,
      storageUsed: "11 MB",
      accent: "default",
    },
    {
      id: "archived",
      name: "เอกสารย้อนหลัง",
      fileCount: 99,
      storageUsed: "267 MB",
      accent: "muted",
    },
  ],
  recentFiles: [
    {
      id: "recent-health-data",
      name: "ข้อมูลสุขภาพ",
      folderId: "health-report",
      folderName: "รายงานสุขภาพ",
      uploadedAt: "2026-03-11T09:00:00.000Z",
      size: "56 MB",
      sizeBytes: 56 * 1024 * 1024,
      mimeType: "application/pdf",
      uploadedBy: createUploadedBy("เจ้าหน้าที่ระบบ"),
    },
    {
      id: "recent-medical-report",
      name: "ภาพสแกน MRI",
      folderId: "medical-information",
      folderName: "ข้อมูลทางการแพทย์",
      uploadedAt: "2026-03-11T09:00:00.000Z",
      size: "3.8 MB",
      sizeBytes: Math.round(3.8 * 1024 * 1024),
      mimeType: "image/png",
      previewUrl: mockImagePreview,
      downloadUrl: mockImagePreview,
      uploadedBy: createUploadedBy("ฝ่ายเอกสาร"),
    },
    {
      id: "recent-prescriptions",
      name: "ใบสั่งยา",
      folderId: "prescriptions",
      folderName: "ใบสั่งยา",
      uploadedAt: "2026-03-11T09:00:00.000Z",
      size: "56 MB",
      sizeBytes: 56 * 1024 * 1024,
      mimeType: "application/pdf",
      uploadedBy: createUploadedBy("ผู้ดูแลคลัง"),
    },
  ],
  files: [
    {
      id: "file-health-data",
      name: "ข้อมูลสุขภาพ",
      folderId: "health-report",
      folderName: "รายงานสุขภาพ",
      uploadedAt: "2026-03-11T09:00:00.000Z",
      size: "56 MB",
      sizeBytes: 56 * 1024 * 1024,
      mimeType: "application/pdf",
      uploadedBy: createUploadedBy("เจ้าหน้าที่ระบบ"),
    },
    {
      id: "file-medical-reports",
      name: "ภาพสแกน MRI",
      folderId: "medical-information",
      folderName: "ข้อมูลทางการแพทย์",
      uploadedAt: "2026-03-11T09:00:00.000Z",
      size: "3.8 MB",
      sizeBytes: Math.round(3.8 * 1024 * 1024),
      mimeType: "image/png",
      previewUrl: mockImagePreview,
      downloadUrl: mockImagePreview,
      uploadedBy: createUploadedBy("ฝ่ายเอกสาร"),
    },
    {
      id: "file-health-data-repeat-1",
      name: "ข้อมูลสุขภาพ",
      folderId: "health-report",
      folderName: "รายงานสุขภาพ",
      uploadedAt: "2026-03-11T09:00:00.000Z",
      size: "56 MB",
      sizeBytes: 56 * 1024 * 1024,
      mimeType: "application/pdf",
      uploadedBy: createUploadedBy("ผู้ดูแลคลัง"),
    },
    {
      id: "file-health-data-repeat-2",
      name: "ข้อมูลสุขภาพ",
      folderId: "health-report",
      folderName: "รายงานสุขภาพ",
      uploadedAt: "2026-03-11T09:00:00.000Z",
      size: "56 MB",
      sizeBytes: 56 * 1024 * 1024,
      mimeType: "application/pdf",
      uploadedBy: createUploadedBy("หัวหน้าหน่วยงาน"),
    },
  ],
};
