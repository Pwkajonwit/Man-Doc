import {
  DragHandleIcon,
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
  draggable?: boolean;
  dragging?: boolean;
  dropTarget?: boolean;
  onSelect: () => void;
  onPrint: () => void;
  onDelete: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragOver?: () => void;
  onDrop?: () => void;
};

export function FolderFileRow({
  file,
  index,
  active,
  deleting = false,
  draggable = false,
  dragging = false,
  dropTarget = false,
  onSelect,
  onPrint,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: FolderFileRowProps) {
  const meta = buildFileMeta(file, index);

  return (
    <div
      onDragOver={(event) => {
        if (!draggable) {
          return;
        }

        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        onDragOver?.();
      }}
      onDrop={(event) => {
        if (!draggable) {
          return;
        }

        event.preventDefault();
        onDrop?.();
      }}
      className={`grid grid-cols-[minmax(0,1.4fr)_132px_104px_136px] items-center rounded-xl border px-4 py-3 transition ${
        dropTarget
          ? "border-slate-900 bg-[#dbe5ea] ring-1 ring-slate-900/15"
          : active
            ? "border-transparent bg-[#dbe5ea]"
            : "border-transparent bg-white"
      } ${dragging ? "opacity-60" : ""}`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex min-w-0 items-center gap-4 text-left"
      >
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
      <div className="flex items-center gap-2 justify-self-start text-slate-500">
        <ActionButton variant="muted" size="icon" onClick={onPrint} aria-label="พิมพ์ไฟล์">
          <PrintIcon />
        </ActionButton>
        {draggable ? (
          <button
            type="button"
            draggable
            aria-label={`Drag to reorder ${file.name}`}
            title="Drag to reorder"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onDragStart={(event) => {
              event.stopPropagation();
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", file.id);
              onDragStart?.();
            }}
            onDragEnd={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onDragEnd?.();
            }}
            className="inline-flex h-10 w-10 shrink-0 cursor-grab items-center justify-center border border-[var(--line)] bg-[var(--surface-muted)] text-slate-800 transition hover:bg-[#e8edf2] active:cursor-grabbing"
          >
            <DragHandleIcon />
          </button>
        ) : null}
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
