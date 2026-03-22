import {
  EyeIcon,
  ImageFileIcon,
  PdfIcon,
  PrintIcon,
  TrashIcon,
  ZipIcon,
} from "@/components/archive-icons";
import { ActionButton } from "@/components/ui/action-button";
import { buildFileMeta } from "@/lib/archive-config";
import type { DocumentFile } from "@/lib/document-types";
import { formatReadableDate } from "@/lib/document-utils";

type FolderFileRowProps = {
  file: DocumentFile;
  index: number;
  active: boolean;
  deleting?: boolean;
  onSelect: () => void;
  onPrint: () => void;
  onDelete: () => void;
};

export function FolderFileRow({
  file,
  index,
  active,
  deleting = false,
  onSelect,
  onPrint,
  onDelete,
}: FolderFileRowProps) {
  const meta = buildFileMeta(file, index);

  return (
    <div
      className={`grid grid-cols-[minmax(0,1.4fr)_132px_104px_136px] items-center rounded-xl px-4 py-3 ${
        active ? "bg-[#dbe5ea]" : "bg-white"
      }`}
    >
      <button type="button" onClick={onSelect} className="flex min-w-0 items-center gap-4 text-left">
        <div className="grid h-11 w-11 place-items-center rounded-md bg-white">
          <FileGlyph mimeType={file.mimeType} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
          <p className="truncate text-xs text-slate-500">{meta.summaryLine}</p>
        </div>
      </button>
      <div className="text-sm text-slate-600">{formatReadableDate(file.uploadedAt)}</div>
      <div className="text-sm text-slate-600">{file.size}</div>
      <div className="flex items-center gap-2 text-slate-500">
        <ActionButton variant="muted" size="icon" onClick={onSelect} aria-label="ดูตัวอย่างไฟล์">
          <EyeIcon />
        </ActionButton>
        <ActionButton variant="muted" size="icon" onClick={onPrint} aria-label="พิมพ์ไฟล์">
          <PrintIcon />
        </ActionButton>
        <ActionButton
          variant="muted"
          size="icon"
          loading={deleting}
          onClick={onDelete}
          aria-label="ลบไฟล์"
        >
          {!deleting ? <TrashIcon /> : null}
        </ActionButton>
      </div>
    </div>
  );
}

function FileGlyph({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith("image/")) return <ImageFileIcon />;
  return mimeType === "application/zip" ? <ZipIcon /> : <PdfIcon />;
}
