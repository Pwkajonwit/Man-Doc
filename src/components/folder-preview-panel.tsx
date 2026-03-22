import type { ReactNode } from "react";
import Image from "next/image";
import {
  DownloadIcon,
  InfoIcon,
  PencilIcon,
  PrintIcon,
  TrashIcon,
} from "@/components/archive-icons";
import { ActionButton } from "@/components/ui/action-button";
import type { DocumentFile, FolderSummary } from "@/lib/document-types";

type FileMeta = {
  recordId: string;
  summaryLine: string;
  status: string;
  keywords: string[];
  author: string;
  revision: string;
};

type FolderPreviewPanelProps = {
  folder: FolderSummary;
  activeFile: DocumentFile | null;
  activeMeta: FileMeta | null;
  repositoryId: string;
  deletingFolder: boolean;
  editingFolder: boolean;
  editForm?: ReactNode;
  onPrint: () => void;
  onDownload: () => void;
  onDeleteFolder: () => void;
  onToggleEditFolder: () => void;
};

export function FolderPreviewPanel({
  folder,
  activeFile,
  activeMeta,
  repositoryId,
  deletingFolder,
  editingFolder,
  editForm,
  onPrint,
  onDownload,
  onDeleteFolder,
  onToggleEditFolder,
}: FolderPreviewPanelProps) {
  const showsEmbeddedPreview =
    Boolean(activeFile?.previewUrl) &&
    isEmbeddedPreviewMimeType(activeFile?.mimeType || "");

  return (
    <>
      <div className="border-b border-[var(--line)] bg-white px-5 py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-slate-900">
              พรีวิว
            </h2>
            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-500">
              ID: {activeMeta?.recordId ?? repositoryId}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ActionButton variant="muted" size="sm" icon={<PrintIcon />} onClick={onPrint}>
              พิมพ์
            </ActionButton>
            <ActionButton
              variant="secondary"
              size="sm"
              icon={<DownloadIcon />}
              onClick={onDownload}
            >
              ดาวน์โหลด
            </ActionButton>
          </div>
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="border border-[var(--line)] bg-white p-5">
          <div className="mx-auto min-h-[420px] max-w-[360px] border border-[#edf1f4] bg-[#fffefc] px-6 py-8">
            {activeFile?.mimeType.startsWith("image/") && activeFile.previewUrl ? (
              <div className="space-y-4">
                <div className="h-8 w-40 bg-[#eef2f5]" />
                <div className="overflow-hidden border border-[#edf1f4] bg-[#f8fafc]">
                  <Image
                    src={activeFile.previewUrl}
                    alt={activeFile.name}
                    width={1200}
                    height={1600}
                    unoptimized
                    className="block h-auto w-full object-contain"
                  />
                </div>
                <div className="border-t border-[#edf1f4] pt-4">
                  <p className="text-base font-semibold text-slate-900">{activeFile.name}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    แสดงตัวอย่างรูปภาพจากแหล่งข้อมูลต้นทาง
                  </p>
                </div>
              </div>
            ) : showsEmbeddedPreview && activeFile?.previewUrl ? (
              <div className="space-y-4">
                <div className="h-8 w-40 bg-[#eef2f5]" />
                <div className="overflow-hidden border border-[#edf1f4] bg-[#f8fafc]">
                  <iframe
                    src={activeFile.previewUrl}
                    title={activeFile.name}
                    className="h-[420px] w-full bg-white"
                  />
                </div>
                <div className="border-t border-[#edf1f4] pt-4">
                  <p className="text-base font-semibold text-slate-900">{activeFile.name}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {activeFile.mimeType === "application/pdf"
                      ? "แสดงตัวอย่าง PDF จากแหล่งข้อมูลต้นทาง"
                      : "แสดงตัวอย่างเอกสารจากแหล่งข้อมูลต้นทาง"}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div className="h-8 w-40 bg-[#eef2f5]" />
                  <div className="h-8 w-8 bg-[#eef2f5]" />
                </div>
                <div className="mt-6 space-y-3">
                  <div className="h-3 w-full bg-[#eef2f5]" />
                  <div className="h-3 w-[88%] bg-[#eef2f5]" />
                  <div className="h-3 w-[76%] bg-[#eef2f5]" />
                </div>
                <div className="mt-8 border-t border-[#edf1f4] pt-6">
                  <p className="text-base font-semibold text-slate-900">
                    {activeFile?.name ?? "ยังไม่ได้เลือกไฟล์"}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {activeMeta?.summaryLine ??
                      "เลือกไฟล์เพื่อดูพรีวิวและสรุปเอกสาร"}
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="h-20 bg-[#f5f7f9]" />
                  <div className="h-20 bg-[#f5f7f9]" />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 border border-[var(--line)] bg-[#dbe5ea] p-5">
          <div className="flex items-center gap-2 text-slate-900">
            <InfoIcon />
            <h3 className="text-base font-semibold tracking-[-0.03em]">สรุปเอกสาร</h3>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <SummaryItem label="ผู้จัดทำ" value={activeMeta?.author ?? "-"} />
            <SummaryItem label="สถานะ" value={activeMeta?.status ?? "-"} />
            <SummaryItem label="รุ่นเอกสาร" value={activeMeta?.revision ?? "-"} />
            <SummaryItem label="พื้นที่" value={folder.storageUsed} />
          </div>
          <div className="mt-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">คำสำคัญ</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(activeMeta?.keywords ?? []).map((keyword) => (
                <span
                  key={keyword}
                  className="border border-white/70 bg-white px-2 py-1 text-xs text-slate-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <ActionButton
            variant="muted"
            size="sm"
            icon={<PencilIcon />}
            onClick={onToggleEditFolder}
            className="w-full justify-center border-slate-300 bg-white"
          >
            {editingFolder ? "ปิดการแก้ไขหมวด" : `แก้ไขหมวด ${folder.name}`}
          </ActionButton>

          {editingFolder ? editForm : null}

          <ActionButton
            variant="muted"
            size="sm"
            loading={deletingFolder}
            icon={!deletingFolder ? <TrashIcon /> : undefined}
            onClick={onDeleteFolder}
            className="w-full justify-center border-slate-300 bg-white text-red-700 hover:bg-red-50"
          >
            {deletingFolder ? "กำลังลบหมวด..." : `ลบหมวด ${folder.name}`}
          </ActionButton>
        </div>
      </div>
    </>
  );
}

function isEmbeddedPreviewMimeType(mimeType: string) {
  return (
    mimeType === "application/pdf" ||
    mimeType === "application/msword" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/vnd.ms-excel" ||
    mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
