import Link from "next/link";
import {
  ArrowRightIcon,
  BuildingIcon,
  ChipIcon,
  CompassIcon,
  DragHandleIcon,
  GalleryIcon,
  WalletIcon,
} from "@/components/archive-icons";
import { getFolderProfile } from "@/lib/archive-config";
import type { FolderSummary } from "@/lib/document-types";

type ArchiveHomeCardProps = {
  folder: FolderSummary;
  index: number;
  isDragging?: boolean;
  isDropTarget?: boolean;
  onDragStart?: (folderId: string) => void;
  onDragEnd?: () => void;
  onDragOver?: (folderId: string) => void;
  onDrop?: (folderId: string) => void;
};

export function ArchiveHomeCard({
  folder,
  index,
  isDragging = false,
  isDropTarget = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: ArchiveHomeCardProps) {
  const profile = getFolderProfile(folder, index);

  return (
    <article
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        onDragOver?.(folder.id);
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDrop?.(folder.id);
      }}
      className={`group relative grid h-full min-h-[164px] overflow-hidden border bg-white transition md:grid-cols-[minmax(0,1fr)_220px] ${
        isDropTarget
          ? "border-slate-900 ring-1 ring-slate-900/15"
          : "border-[var(--line)] hover:border-slate-400"
      } ${isDragging ? "opacity-60" : ""}`}
    >
      <Link
        href={`/folders/${folder.id}`}
        aria-label={`Open ${folder.name}`}
        className="absolute inset-0 z-0"
      />

      <div className="pointer-events-none relative z-10 flex min-w-0 flex-col justify-center px-6 py-5 md:px-7">
        <div>
          <h2 className="text-[1.45rem] font-semibold tracking-[-0.035em] text-slate-900">
            {folder.name}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            {profile.description}
          </p>
        </div>
      </div>

      <div className="pointer-events-none relative z-10 grid h-full grid-rows-[1fr_1fr] border-t border-[var(--line)] md:border-l md:border-t-0">
        <div
          className={`flex items-center justify-between gap-4 border-b border-[var(--line)] px-5 py-3.5 ${profile.cardTheme.headerClassName}`}
        >
          <div
            className={`grid h-11 w-11 shrink-0 place-items-center ${profile.cardTheme.iconWrapClassName}`}
          >
            <div className={profile.cardTheme.iconClassName}>
              <FolderCabinetIcon icon={profile.icon} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`shrink-0 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] ${profile.cardTheme.badgeClassName}`}
            >
              {profile.repositoryId}
            </span>
            <button
              type="button"
              draggable
              aria-label={`Drag to reorder ${folder.name}`}
              title="Drag to reorder"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onDragStart={(event) => {
                event.stopPropagation();
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", folder.id);
                onDragStart?.(folder.id);
              }}
              onDragEnd={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onDragEnd?.();
              }}
              className="pointer-events-auto inline-flex h-8 w-8 cursor-grab items-center justify-center border border-slate-300 bg-white text-slate-500 transition hover:border-slate-400 hover:text-slate-900 active:cursor-grabbing"
            >
              <DragHandleIcon />
            </button>
          </div>
        </div>

        <div
          className={`flex items-end justify-between gap-4 px-5 py-2.5 ${profile.cardTheme.footerClassName}`}
        >
          <div className="pointer-events-none grid grid-cols-2 gap-x-5 gap-y-2">
            <Metric label="จำนวนไฟล์" value={folder.fileCount.toLocaleString()} />
            <Metric label="พื้นที่จัดเก็บ" value={folder.storageUsed} />
          </div>
          <span className="pointer-events-none shrink-0 text-slate-500 transition duration-150 group-hover:translate-x-0.5">
            <ArrowRightIcon />
          </span>
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] tracking-[0.08em] text-slate-500">{label}</p>
      <p className="mt-0.5 text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900">
        {value}
      </p>
    </div>
  );
}

function FolderCabinetIcon({
  icon,
}: {
  icon: ReturnType<typeof getFolderProfile>["icon"];
}) {
  if (icon === "compass") return <CompassIcon />;
  if (icon === "gallery") return <GalleryIcon />;
  if (icon === "wallet") return <WalletIcon />;
  if (icon === "chip") return <ChipIcon />;
  return <BuildingIcon />;
}
