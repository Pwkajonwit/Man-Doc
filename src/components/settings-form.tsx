"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ActionButton } from "@/components/ui/action-button";

type SettingsFormProps = {
  initialUrl: string;
};

export function SettingsForm({ initialUrl }: SettingsFormProps) {
  const router = useRouter();
  const [url, setUrl] = useState(initialUrl);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function saveUrl(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const response = await fetch("/api/settings/gas-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setFeedback(payload.message ?? "บันทึก URL ไม่สำเร็จ");
      return;
    }

    setFeedback(payload.message ?? "บันทึก URL ของ GAS แล้ว");
    startTransition(() => {
      router.push("/");
      router.refresh();
    });
  }

  async function clearUrl() {
    setFeedback(null);

    const response = await fetch("/api/settings/gas-url", {
      method: "DELETE",
    });
    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setFeedback(payload.message ?? "ล้าง URL ไม่สำเร็จ");
      return;
    }

    setUrl("");
    setFeedback(payload.message ?? "ล้าง URL ของ GAS แล้ว");
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={(event) => {
        void saveUrl(event);
      }}
      className="border border-[var(--line)] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)]"
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          GAS Web App URL
        </p>
        <h1 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
          ตั้งค่าการเชื่อมต่อ Google Apps Script
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          วาง URL แบบ <code className="rounded bg-slate-100 px-1.5 py-0.5">/exec</code>{" "}
          แล้วระบบจะบันทึกไว้ในเบราว์เซอร์นี้เพื่อใช้ดึงข้อมูลจริงแทน mock
        </p>
      </div>

      <label className="mt-6 block">
        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          URL
        </span>
        <input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://script.google.com/macros/s/.../exec"
          className="h-12 w-full border border-slate-300 bg-white px-4 text-sm outline-none focus:border-slate-700"
        />
      </label>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <ActionButton type="submit" loading={isPending}>
          บันทึก URL
        </ActionButton>
        <ActionButton
          type="button"
          variant="muted"
          onClick={() => {
            void clearUrl();
          }}
        >
          ล้างค่า
        </ActionButton>
      </div>

      <div className="mt-3 text-sm text-slate-500">
        {feedback ?? "ถ้าตั้งค่าแล้ว หน้า Home และหน้า Folder จะอ่าน URL นี้ทันที"}
      </div>
    </form>
  );
}
