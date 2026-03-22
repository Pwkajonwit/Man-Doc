"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArchiveShell } from "@/components/archive-shell";
import { EditCabinetForm } from "@/components/edit-cabinet-form";
import { PlusIcon } from "@/components/archive-icons";
import { FolderFileRow } from "@/components/folder-file-row";
import { FolderPreviewPanel } from "@/components/folder-preview-panel";
import { FolderUploadForm } from "@/components/folder-upload-form";
import { ActionButton } from "@/components/ui/action-button";
import { buildFileMeta, getFolderProfile } from "@/lib/archive-config";
import type { DocumentFile, FolderSummary } from "@/lib/document-types";
import { formatReadableDate } from "@/lib/document-utils";

type FolderWorkspaceProps = {
  folder: FolderSummary;
  files: DocumentFile[];
  gasConfigured: boolean;
  searchQuery?: string;
  initialSelectedFileId?: string;
};

export function FolderWorkspace({
  folder,
  files: initialFiles,
  gasConfigured,
  searchQuery = "",
  initialSelectedFileId = "",
}: FolderWorkspaceProps) {
  const router = useRouter();
  const [folderState, setFolderState] = useState(folder);
  const [files, setFiles] = useState(initialFiles);
  const [selectedFileId, setSelectedFileId] = useState(
    initialSelectedFileId || initialFiles[0]?.id || "",
  );
  const [showUpload, setShowUpload] = useState(false);
  const [showFolderEditor, setShowFolderEditor] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [isDeletingFolder, setIsDeletingFolder] = useState(false);

  const folderProfile = getFolderProfile(folderState);
  const query = String(searchQuery).trim().toLowerCase();
  const visibleFiles = query
    ? files.filter((file, index) => {
        const meta = buildFileMeta(file, index);

        return [file.name, file.folderName, file.mimeType, file.uploadedBy.name, meta.summaryLine]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
    : files;
  const activeFile =
    visibleFiles.find((file) => file.id === selectedFileId) ?? visibleFiles[0] ?? null;
  const activeMeta = activeFile ? buildFileMeta(activeFile) : null;

  const printableSummary = useMemo(() => {
    if (!activeFile || !activeMeta) {
      return null;
    }

    return {
      title: activeFile.name,
      id: activeMeta.recordId,
      author: activeMeta.author,
      date: formatReadableDate(activeFile.uploadedAt),
      size: activeFile.size,
      status: activeMeta.status,
      keywords: activeMeta.keywords.join(", "),
      folder: activeFile.folderName,
      revision: activeMeta.revision,
    };
  }, [activeFile, activeMeta]);

  function openPrintWindow(summary: NonNullable<typeof printableSummary>) {
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${summary.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #0f172a; }
            h1 { margin-bottom: 8px; }
            p { margin: 6px 0; }
            .meta { margin-top: 24px; padding-top: 16px; border-top: 1px solid #cbd5e1; }
          </style>
        </head>
        <body>
          <h1>${summary.title}</h1>
          <p>รหัสเอกสาร: ${summary.id}</p>
          <p>หมวดเอกสาร: ${summary.folder}</p>
          <p>สถานะ: ${summary.status}</p>
          <div class="meta">
            <p>ผู้จัดทำ: ${summary.author}</p>
            <p>รุ่นเอกสาร: ${summary.revision}</p>
            <p>อัปโหลดเมื่อ: ${summary.date}</p>
            <p>ขนาดไฟล์: ${summary.size}</p>
            <p>คำสำคัญ: ${summary.keywords}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  function openImagePrintWindow(file: DocumentFile) {
    if (!file.previewUrl) return;

    const printWindow = window.open("", "_blank", "width=1000,height=800");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${file.name}</title>
          <style>
            body { margin: 0; padding: 24px; display: grid; place-items: center; background: #ffffff; }
            img { max-width: 100%; max-height: calc(100vh - 48px); object-fit: contain; }
          </style>
        </head>
        <body>
          <img src="${file.previewUrl}" alt="${file.name}" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  function openPdfPrintWindow(file: DocumentFile) {
    const printableUrl = getPrintableDocumentUrl(file);
    if (!printableUrl) return;

    const printWindow = window.open(printableUrl, "_blank");
    if (!printWindow) return;

    [1200, 2500, 4000].forEach((delay) => {
      window.setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();
        } catch {
          // The document may still be loading or the browser may block scripted printing.
        }
      }, delay);
    });
  }

  function supportsBrowserPreviewPrint(file: DocumentFile) {
    return (
      file.mimeType === "application/pdf" ||
      file.mimeType === "application/msword" ||
      file.mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimeType === "application/vnd.ms-excel" ||
      file.mimeType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  }

  function getPrintableDocumentUrl(file: DocumentFile) {
    if (file.documentLink) {
      return file.documentLink;
    }

    if (!file.previewUrl) {
      return "";
    }

    return file.previewUrl.replace(/\/preview(?:\?.*)?$/, "/view");
  }

  function handlePrint() {
    if (activeFile?.mimeType.startsWith("image/") && activeFile.previewUrl) {
      openImagePrintWindow(activeFile);
      return;
    }
    if (activeFile?.previewUrl && supportsBrowserPreviewPrint(activeFile)) {
      openPdfPrintWindow(activeFile);
      return;
    }
    if (!printableSummary) return;
    openPrintWindow(printableSummary);
  }

  function handlePrintFile(file: DocumentFile, index: number) {
    const meta = buildFileMeta(file, index);

    if (file.mimeType.startsWith("image/") && file.previewUrl) {
      openImagePrintWindow(file);
      return;
    }
    if (file.previewUrl && supportsBrowserPreviewPrint(file)) {
      openPdfPrintWindow(file);
      return;
    }

    openPrintWindow({
      title: file.name,
      id: meta.recordId,
      author: meta.author,
      date: formatReadableDate(file.uploadedAt),
      size: file.size,
      status: meta.status,
      keywords: meta.keywords.join(", "),
      folder: file.folderName,
      revision: meta.revision,
    });
  }

  function handleDownload() {
    if (activeFile?.downloadUrl) {
      const anchor = document.createElement("a");
      anchor.href = activeFile.downloadUrl;
      anchor.download = activeFile.name;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.click();
      return;
    }

    if (!printableSummary) return;

    const content = [
      `ชื่อเอกสาร: ${printableSummary.title}`,
      `รหัสเอกสาร: ${printableSummary.id}`,
      `หมวดเอกสาร: ${printableSummary.folder}`,
      `สถานะ: ${printableSummary.status}`,
      `ผู้จัดทำ: ${printableSummary.author}`,
      `รุ่นเอกสาร: ${printableSummary.revision}`,
      `อัปโหลดเมื่อ: ${printableSummary.date}`,
      `ขนาดไฟล์: ${printableSummary.size}`,
      `คำสำคัญ: ${printableSummary.keywords}`,
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `${printableSummary.title}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function handleDeleteFile(file: DocumentFile) {
    const confirmed = window.confirm(`ต้องการลบ "${file.name}" และย้ายไปถังขยะหรือไม่?`);

    if (!confirmed) {
      return;
    }

    const formData = new FormData();
    formData.append("action", "delete-file");
    formData.append("fileId", file.id);

    setDeletingFileId(file.id);

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        return;
      }

      setFiles((current) => {
        const updated = current.filter((item) => item.id !== file.id);

        if (selectedFileId === file.id) {
          setSelectedFileId(updated[0]?.id ?? "");
        }

        return updated;
      });
    } finally {
      setDeletingFileId(null);
    }
  }

  async function handleDeleteFolder() {
    const confirmed = window.confirm(
      `ต้องการลบหมวด "${folderState.name}" และย้ายไปถังขยะหรือไม่?`,
    );

    if (!confirmed) {
      return;
    }

    const formData = new FormData();
    formData.append("action", "delete-folder");
    formData.append("folderId", folderState.id);

    setIsDeletingFolder(true);

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        return;
      }

      router.push("/");
      router.refresh();
    } finally {
      setIsDeletingFolder(false);
    }
  }

  function handleFolderUpdated(updatedFolder: FolderSummary) {
    setFolderState(updatedFolder);
    setFiles((current) =>
      current.map((file) =>
        file.folderId === updatedFolder.id
          ? {
              ...file,
              folderName: updatedFolder.name,
            }
          : file,
      ),
    );
    setShowFolderEditor(false);
    router.refresh();
  }

  return (
    <ArchiveShell active="documents">
      <div className="mx-auto grid max-w-7xl gap-0 xl:grid-cols-[1fr_26rem]">
        <section className="border-r border-[var(--line)] bg-white">
          <div className="border-b border-[var(--line)] px-4 py-6 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <Link href="/" className="font-medium text-slate-700">
                    เอกสาร
                  </Link>
                  <span>/</span>
                  <span>{folderState.name}</span>
                </div>
                <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                  {folderState.name}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                  {folderProfile.detailDescription}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ActionButton
                  variant="muted"
                  size="icon"
                  icon={<PlusIcon />}
                  onClick={() => setShowUpload((value) => !value)}
                  aria-label="เปิดหรือปิดแผงอัปโหลด"
                />
              </div>
            </div>
          </div>

          {showUpload ? (
            <FolderUploadForm
              folderId={folderState.id}
              folderName={folderState.name}
              gasConfigured={gasConfigured}
              onUploaded={(file) => {
                setFiles((current) => [
                  {
                    ...file,
                    folderName: folderState.name,
                  },
                  ...current,
                ]);
                setSelectedFileId(file.id);
              }}
              onClose={() => setShowUpload(false)}
            />
          ) : null}

          <div className="grid grid-cols-[minmax(0,1.4fr)_132px_104px_136px] border-b border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-slate-500 sm:px-6">
            <div>ชื่อเอกสาร</div>
            <div>วันที่แก้ไข</div>
            <div>ขนาดไฟล์</div>
            <div>การทำงาน</div>
          </div>

          <div className="px-3 py-3 sm:px-4">
            {visibleFiles.length === 0 ? (
              <div className="border border-dashed border-slate-300 px-8 py-12 text-center text-slate-500">
                {query ? "ไม่พบเอกสารที่ตรงกับคำค้นหา" : "ยังไม่มีไฟล์ในหมวดนี้"}
              </div>
            ) : (
              <div className="space-y-2">
                {visibleFiles.map((file, index) => (
                  <FolderFileRow
                    key={file.id}
                    file={file}
                    index={index}
                    active={file.id === activeFile?.id}
                    deleting={deletingFileId === file.id}
                    onSelect={() => setSelectedFileId(file.id)}
                    onPrint={() => {
                      setSelectedFileId(file.id);
                      handlePrintFile(file, index);
                    }}
                    onDelete={() => void handleDeleteFile(file)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="border-l border-[var(--line)] bg-[#f7f9fb]">
          <FolderPreviewPanel
            folder={folderState}
            activeFile={activeFile}
            activeMeta={activeMeta}
            repositoryId={folderProfile.repositoryId}
            deletingFolder={isDeletingFolder}
            editingFolder={showFolderEditor}
            editForm={
              <EditCabinetForm
                folder={folderState}
                onUpdated={handleFolderUpdated}
                onClose={() => setShowFolderEditor(false)}
              />
            }
            onPrint={handlePrint}
            onDownload={handleDownload}
            onDeleteFolder={() => void handleDeleteFolder()}
            onToggleEditFolder={() => setShowFolderEditor((value) => !value)}
          />
        </aside>
      </div>
    </ArchiveShell>
  );
}
