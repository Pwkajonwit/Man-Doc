"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type ArchiveShellProps = {
  active: "documents" | "shared" | "archive" | "recent";
  children: React.ReactNode;
};

export function ArchiveShell({ children }: ArchiveShellProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isSettingsPage = pathname === "/settings";

  return (
    <div className="min-h-screen bg-[var(--background)] text-slate-900">
      <header className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          {isHomePage ? (
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="text-xl font-semibold tracking-[-0.03em]">
                คลังเอกสาร
              </Link>
              <Link
                href="/settings"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                ตั้งค่า GAS
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-900"
              >
                <span aria-hidden="true">←</span>
                <span>กลับหน้าคลังเอกสาร</span>
              </Link>
              {!isSettingsPage ? (
                <Link
                  href="/settings"
                  className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                >
                  ตั้งค่า GAS
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </header>

      <div className="page-enter">{children}</div>
    </div>
  );
}
