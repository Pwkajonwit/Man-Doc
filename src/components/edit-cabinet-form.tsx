"use client";

import { useEffect, useState } from "react";
import { ActionButton } from "@/components/ui/action-button";
import type {
  DocumentActionResult,
  FolderColorKey,
  FolderIconKey,
  FolderSummary,
} from "@/lib/document-types";
import {
  FOLDER_COLOR_OPTIONS,
  FOLDER_ICON_OPTIONS,
} from "@/lib/folder-form-options";

type EditCabinetFormProps = {
  folder: FolderSummary;
  onUpdated: (folder: FolderSummary) => void;
  onClose: () => void;
};

export function EditCabinetForm({
  folder,
  onUpdated,
  onClose,
}: EditCabinetFormProps) {
  const [drawerName, setDrawerName] = useState(folder.name);
  const [repositoryId, setRepositoryId] = useState(folder.repositoryId || "");
  const [description, setDescription] = useState(folder.description || "");
  const [icon, setIcon] = useState<FolderIconKey>(folder.icon || "building");
  const [color, setColor] = useState<FolderColorKey>(folder.color || "emerald");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDrawerName(folder.name);
    setRepositoryId(folder.repositoryId || "");
    setDescription(folder.description || "");
    setIcon(folder.icon || "building");
    setColor(folder.color || "emerald");
    setFeedback(null);
  }, [folder]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const name = drawerName.trim();
    if (!name) {
      setFeedback("กรุณากรอกชื่อหมวดเอกสาร");
      return;
    }

    const formData = new FormData();
    formData.append("action", "update-folder");
    formData.append("folderId", folder.id);
    formData.append("folderName", name);
    formData.append("repositoryId", repositoryId.trim());
    formData.append("folderDescription", description.trim());
    formData.append("folderIcon", icon);
    formData.append("folderColor", color);

    setIsSaving(true);

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as DocumentActionResult;

      if (!response.ok || !result.folder) {
        setFeedback(result.message || "ไม่สามารถบันทึกการแก้ไขหมวดได้");
        return;
      }

      onUpdated(result.folder);
      setFeedback(result.message);
      onClose();
    } catch {
      setFeedback("ไม่สามารถบันทึกการแก้ไขหมวดได้");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 border border-[var(--line)] bg-white p-4"
    >
      <div className="grid gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            แก้ไขหมวดเอกสาร
          </p>
          <p className="mt-1 text-sm text-slate-600">
            ปรับชื่อ รหัส รายละเอียด สี และไอคอนของหมวดนี้
          </p>
        </div>
        <label>
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            ชื่อหมวดเอกสาร
          </span>
          <input
            value={drawerName}
            onChange={(event) => setDrawerName(event.target.value)}
            placeholder="เช่น เอกสารบริษัท"
            className="h-10 w-full border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
          />
        </label>
        <label>
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Repository ID
          </span>
          <input
            value={repositoryId}
            onChange={(event) => setRepositoryId(event.target.value)}
            placeholder="ARCH-001"
            className="h-10 w-full border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
          />
        </label>
        <label>
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            รายละเอียด
          </span>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="คำอธิบายสั้นของหมวดเอกสาร"
            className="h-10 w-full border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              ไอคอน
            </span>
            <select
              value={icon}
              onChange={(event) => setIcon(event.target.value as FolderIconKey)}
              className="h-10 w-full border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
            >
              {FOLDER_ICON_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              สี
            </span>
            <select
              value={color}
              onChange={(event) => setColor(event.target.value as FolderColorKey)}
              className="h-10 w-full border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
            >
              {FOLDER_COLOR_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <ActionButton type="submit" loading={isSaving}>
          {isSaving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
        </ActionButton>
        <ActionButton type="button" variant="muted" onClick={onClose}>
          ยกเลิก
        </ActionButton>
        {feedback ? <p className="text-sm text-slate-500">{feedback}</p> : null}
      </div>
    </form>
  );
}
