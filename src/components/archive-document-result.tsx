import Link from "next/link";
import {
  ArrowRightIcon,
  ImageFileIcon,
  PdfIcon,
  ZipIcon,
} from "@/components/archive-icons";
import { buildFileMeta } from "@/lib/archive-config";
import type { DocumentFile } from "@/lib/document-types";
import { formatReadableDate } from "@/lib/document-utils";

type ArchiveDocumentResultProps = {
  file: DocumentFile;
  index: number;
  searchQuery: string;
};

export function ArchiveDocumentResult({
  file,
  index,
  searchQuery,
}: ArchiveDocumentResultProps) {
  const meta = buildFileMeta(file, index);
  const params = new URLSearchParams();

  if (searchQuery.trim()) {
    params.set("q", searchQuery.trim());
  }
  params.set("fileId", file.id);

  return (
    <Link
      href={`/folders/${file.folderId}?${params.toString()}`}
      className="flex items-center justify-between gap-4 border border-[var(--line)] bg-white px-4 py-4 transition hover:border-slate-400"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-md bg-[var(--surface-muted)] text-slate-700">
          <FileGlyph mimeType={file.mimeType} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
          <p className="mt-1 truncate text-xs text-slate-500">{meta.summaryLine}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span>หมวด: {file.folderName}</span>
            <span>วันที่: {formatReadableDate(file.uploadedAt)}</span>
            <span>ขนาด: {file.size}</span>
          </div>
        </div>
      </div>
      <span className="shrink-0 text-slate-500">
        <ArrowRightIcon />
      </span>
    </Link>
  );
}

function FileGlyph({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith("image/")) return <ImageFileIcon />;
  return mimeType === "application/zip" ? <ZipIcon /> : <PdfIcon />;
}
