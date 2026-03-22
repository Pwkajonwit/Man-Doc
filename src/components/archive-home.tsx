"use client";

import { Suspense, useEffect, useState } from "react";
import { PlusIcon } from "@/components/archive-icons";
import { ArchiveDocumentResult } from "@/components/archive-document-result";
import { ArchiveHomeCard } from "@/components/archive-home-card";
import { ArchiveSearchInput } from "@/components/archive-search-input";
import { ArchiveShell } from "@/components/archive-shell";
import { CreateCabinetForm } from "@/components/create-cabinet-form";
import { DataSourceBanner } from "@/components/data-source-banner";
import { ActionButton } from "@/components/ui/action-button";
import { buildFileMeta, getFolderProfile } from "@/lib/archive-config";
import type {
  DashboardData,
  DashboardSource,
  FolderSummary,
} from "@/lib/document-types";

type ArchiveHomeProps = {
  initialData: DashboardData;
  gasConfigured: boolean;
  dataSource: DashboardSource;
  dataErrorMessage?: string;
  searchQuery?: string;
};

const FOLDER_ORDER_STORAGE_KEY = "archive-folder-order";

export function ArchiveHome({
  initialData,
  gasConfigured,
  dataSource,
  dataErrorMessage,
  searchQuery = "",
}: ArchiveHomeProps) {
  const [folders, setFolders] = useState(initialData.folders);
  const [showCreator, setShowCreator] = useState(false);
  const [draggedFolderId, setDraggedFolderId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [hasRestoredOrder, setHasRestoredOrder] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setFolders(orderFoldersBySavedOrder(initialData.folders));
      setHasRestoredOrder(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [initialData.folders]);

  useEffect(() => {
    if (!hasRestoredOrder) {
      return;
    }

    window.localStorage.setItem(
      FOLDER_ORDER_STORAGE_KEY,
      JSON.stringify(folders.map((folder) => folder.id)),
    );
  }, [folders, hasRestoredOrder]);

  const query = String(searchQuery).trim().toLowerCase();
  const matchedDocuments = query
    ? initialData.files.filter((file, fileIndex) => {
        const meta = buildFileMeta(file, fileIndex);

        return [
          file.name,
          file.folderName,
          file.mimeType,
          file.uploadedBy.name,
          meta.summaryLine,
          meta.keywords.join(" "),
          meta.recordId,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
    : [];
  const folderEntries = folders.map((folder, index) => ({
    folder,
    index,
    profile: getFolderProfile(folder, index),
  }));
  const filteredEntries = query
    ? folderEntries.filter(({ folder, profile }) => {
        const folderText = [
          folder.name,
          profile.repositoryId,
          profile.description,
          profile.detailDescription,
        ]
          .join(" ")
          .toLowerCase();

        const documentText = initialData.files
          .filter((file) => file.folderId === folder.id)
          .map((file, fileIndex) => {
            const meta = buildFileMeta(file, fileIndex);

            return [
              file.name,
              file.folderName,
              file.mimeType,
              file.uploadedBy.name,
              meta.summaryLine,
              meta.keywords.join(" "),
            ].join(" ");
          })
          .join(" ")
          .toLowerCase();

        return folderText.includes(query) || documentText.includes(query);
      })
    : folderEntries;

  function moveFolderBefore(sourceFolderId: string, targetFolderId: string) {
    setFolders((current) => {
      if (sourceFolderId === targetFolderId) {
        return current;
      }

      const sourceIndex = current.findIndex((folder) => folder.id === sourceFolderId);
      const targetIndex = current.findIndex((folder) => folder.id === targetFolderId);

      if (sourceIndex === -1 || targetIndex === -1) {
        return current;
      }

      const next = [...current];
      const [movedFolder] = next.splice(sourceIndex, 1);
      const adjustedTargetIndex = next.findIndex((folder) => folder.id === targetFolderId);

      next.splice(adjustedTargetIndex, 0, movedFolder);

      return next;
    });
  }

  return (
    <ArchiveShell active="documents">
      <DataSourceBanner
        gasConfigured={gasConfigured}
        source={dataSource}
        errorMessage={dataErrorMessage}
      />

      <section className="border-b border-[var(--line)] bg-[#edf1f4]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="w-full max-w-3xl">
              <p className="mb-3 text-sm font-medium text-slate-700">
                ค้นหาเอกสารที่ต้องการจากชื่อไฟล์ ชื่อหมวด หรือคำสำคัญ
              </p>
              <Suspense
                fallback={
                  <div className="flex h-10 items-center border border-[var(--line)] bg-white px-3 text-sm text-slate-400">
                    ค้นหาเอกสาร...
                  </div>
                }
              >
                <ArchiveSearchInput className="w-full max-w-2xl" />
              </Suspense>
            </div>

            <div className="flex flex-col items-start gap-2 xl:items-end">
              <ActionButton
                variant="secondary"
                size="md"
                icon={<PlusIcon />}
                onClick={() => setShowCreator((value) => !value)}
              >
                เพิ่มหมวด
              </ActionButton>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                {gasConfigured ? "เชื่อมต่อ GAS แล้ว" : "โหมดตัวอย่าง"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {showCreator ? (
          <CreateCabinetForm
            folders={folders}
            onCreated={(folder) =>
              setFolders((current) => [folder as FolderSummary, ...current])
            }
            onClose={() => setShowCreator(false)}
          />
        ) : null}

        {query ? (
          matchedDocuments.length > 0 ? (
            <div className="space-y-3">
              {matchedDocuments.map((file, index) => (
                <ArchiveDocumentResult
                  key={file.id}
                  file={file}
                  index={index}
                  searchQuery={searchQuery}
                />
              ))}
            </div>
          ) : null
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredEntries.map(({ folder, index }) => (
              <ArchiveHomeCard
                key={folder.id}
                folder={folder}
                index={index}
                isDragging={draggedFolderId === folder.id}
                isDropTarget={dropTargetId === folder.id && draggedFolderId !== folder.id}
                onDragStart={(folderId) => {
                  setDraggedFolderId(folderId);
                  setDropTargetId(folderId);
                }}
                onDragEnd={() => {
                  setDraggedFolderId(null);
                  setDropTargetId(null);
                }}
                onDragOver={(folderId) => {
                  if (draggedFolderId && draggedFolderId !== folderId) {
                    setDropTargetId(folderId);
                  }
                }}
                onDrop={(folderId) => {
                  if (draggedFolderId) {
                    moveFolderBefore(draggedFolderId, folderId);
                  }

                  setDraggedFolderId(null);
                  setDropTargetId(null);
                }}
              />
            ))}
          </div>
        )}

        {(query ? matchedDocuments.length === 0 : filteredEntries.length === 0) ? (
          <div className="border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-slate-500">
            ไม่พบเอกสารที่ตรงกับคำค้นหา
          </div>
        ) : null}
      </section>
    </ArchiveShell>
  );
}

function orderFoldersBySavedOrder(folders: FolderSummary[]): FolderSummary[] {
  if (typeof window === "undefined") {
    return folders;
  }

  const savedOrder = window.localStorage.getItem(FOLDER_ORDER_STORAGE_KEY);

  if (!savedOrder) {
    return folders;
  }

  try {
    const orderedIds = JSON.parse(savedOrder) as string[];
    const orderMap = new Map(orderedIds.map((id, index) => [id, index]));

    return [...folders].sort((left, right) => {
      const leftIndex = orderMap.get(left.id) ?? Number.MAX_SAFE_INTEGER;
      const rightIndex = orderMap.get(right.id) ?? Number.MAX_SAFE_INTEGER;

      return leftIndex - rightIndex;
    });
  } catch {
    window.localStorage.removeItem(FOLDER_ORDER_STORAGE_KEY);
    return folders;
  }
}
