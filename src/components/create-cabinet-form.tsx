"use client";

import { useState } from "react";
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

type CreateCabinetFormProps = {
  folders: FolderSummary[];
  onCreated: (folder: FolderSummary) => void;
  onClose: () => void;
};

export function CreateCabinetForm({
  folders,
  onCreated,
  onClose,
}: CreateCabinetFormProps) {
  const [drawerName, setDrawerName] = useState("");
  const [repositoryId, setRepositoryId] = useState(() =>
    createNextRepositoryId(folders),
  );
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<FolderIconKey>("building");
  const [color, setColor] = useState<FolderColorKey>("emerald");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const name = drawerName.trim();
    if (!name) {
      setFeedback("กรุณากรอกชื่อหมวดเอกสาร");
      return;
    }

    const formData = new FormData();
    formData.append("action", "create-folder");
    formData.append("folderName", name);
    formData.append("repositoryId", repositoryId.trim());
    formData.append("folderDescription", description.trim());
    formData.append("folderIcon", icon);
    formData.append("folderColor", color);

    setIsCreating(true);

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as DocumentActionResult;

      if (!response.ok || !result.folder) {
        setFeedback(result.message || "ไม่สามารถสร้างหมวดเอกสารได้");
        return;
      }

      onCreated(result.folder);
      setDrawerName("");
      setRepositoryId("");
      setDescription("");
      setIcon("building");
      setColor("emerald");
      setFeedback(result.message);
      onClose();
    } catch {
      setFeedback("ไม่สามารถสร้างหมวดเอกสารได้");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-5 grid gap-4 border border-[var(--line)] bg-white p-4"
    >
      <div className="grid gap-4 lg:grid-cols-2">
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
      <div className="flex items-center gap-3">
        <ActionButton type="submit" loading={isCreating}>
          {isCreating ? "กำลังสร้าง..." : "สร้างหมวดเอกสาร"}
        </ActionButton>
        <ActionButton type="button" variant="muted" onClick={onClose}>
          ยกเลิก
        </ActionButton>
        {feedback ? <p className="text-sm text-slate-500">{feedback}</p> : null}
      </div>
    </form>
  );
}

function createNextRepositoryId(folders: FolderSummary[]) {
  const maxNumber = folders.reduce((result, folder) => {
    const match = String(folder.repositoryId || "").match(/ARCH-(\d+)/i);

    if (!match) {
      return result;
    }

    return Math.max(result, Number(match[1]) || 0);
  }, 0);

  return `ARCH-${String(maxNumber + 1).padStart(3, "0")}`;
}
