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

  return (
    <div className="min-h-screen bg-[var(--background)] text-slate-900">
      <header className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          {isHomePage ? (
            <div className="flex items-center justify-center">
              <Link href="/" className="text-xl font-semibold tracking-[-0.03em]">
                คลังเอกสาร
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-start">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-900"
              >
                <span aria-hidden="true">←</span>
                <span>กลับหน้า คลังเอกสาร</span>
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className="page-enter">{children}</div>
    </div>
  );
}
