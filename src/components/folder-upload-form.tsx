"use client";

import { useId, useState } from "react";
import { ActionButton } from "@/components/ui/action-button";
import type { DocumentActionResult, DocumentFile } from "@/lib/document-types";

type FolderUploadFormProps = {
  folderId: string;
  folderName: string;
  gasConfigured: boolean;
  onUploaded: (file: DocumentFile) => void;
  onClose: () => void;
};

export function FolderUploadForm({
  folderId,
  folderName,
  gasConfigured,
  onUploaded,
  onClose,
}: FolderUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedBy, setUploadedBy] = useState("ระบบงาน MAN");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputId = useId();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (!selectedFile) {
      setFeedback("กรุณาเลือกไฟล์ก่อนอัปโหลด");
      return;
    }

    const formData = new FormData();
    formData.append("action", "upload-file");
    formData.append("folderId", folderId);
    formData.append("folderName", folderName);
    formData.append("uploadedBy", uploadedBy.trim() || "ระบบ");
    formData.append("file", selectedFile);

    setIsUploading(true);

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as DocumentActionResult;

      if (!response.ok || !result.file) {
        setFeedback(result.message || "อัปโหลดไฟล์ไม่สำเร็จ");
        return;
      }

      onUploaded(result.file);
      setSelectedFile(null);
      setFeedback(result.message);
      onClose();
    } catch {
      setFeedback("อัปโหลดไฟล์ไม่สำเร็จ");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-b border-[var(--line)] bg-[#f7f9fb] px-4 py-4 sm:px-6"
    >
      <div className="grid gap-4 border border-[var(--line)] bg-white p-4 lg:grid-cols-2">
        <label>
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            หมวดเอกสาร
          </span>
          <input
            value={folderName}
            readOnly
            className="h-10 w-full border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600 outline-none"
          />
        </label>
        <label>
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            อัปโหลดโดย
          </span>
          <input
            value={uploadedBy}
            onChange={(event) => setUploadedBy(event.target.value)}
            placeholder="ชื่อผู้รับผิดชอบ"
            className="h-10 w-full border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
          />
        </label>

        <div className="lg:col-span-2">
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            เลือกไฟล์
          </span>
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="min-w-0 flex-1 border border-dashed border-slate-300 bg-white">
              <input
                id={fileInputId}
                type="file"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                className="hidden"
              />
              <div className="flex h-11 items-center gap-3 px-3">
                <label
                  htmlFor={fileInputId}
                  className="inline-flex h-8 shrink-0 cursor-pointer items-center justify-center border border-slate-300 bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  เลือกไฟล์
                </label>
                <span className="min-w-0 truncate text-sm text-slate-500">
                  {selectedFile ? selectedFile.name : "ยังไม่ได้เลือกไฟล์"}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <ActionButton type="submit" loading={isUploading}>
                {isUploading ? "กำลังอัปโหลด..." : "อัปโหลดไฟล์"}
              </ActionButton>
              <ActionButton type="button" variant="muted" onClick={onClose}>
                ปิด
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 text-sm text-slate-500">
        {feedback ?? (gasConfigured ? "บันทึกไปยัง GAS แล้ว" : "อัปโหลดในโหมดตัวอย่าง")}
      </div>
    </form>
  );
}
