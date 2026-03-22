"use client";

import { SearchIcon } from "@/components/archive-icons";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ArchiveSearchInputProps = {
  className?: string;
};

export function ArchiveSearchInput({
  className = "",
}: ArchiveSearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(currentQuery);

  useEffect(() => {
    setValue(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    const normalizedValue = value.trim();
    const normalizedCurrent = currentQuery.trim();

    if (normalizedValue === normalizedCurrent) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (normalizedValue) {
        params.set("q", normalizedValue);
      } else {
        params.delete("q");
      }

      const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(nextUrl, { scroll: false });
    }, 220);

    return () => window.clearTimeout(timeoutId);
  }, [currentQuery, pathname, router, searchParams, value]);

  return (
    <div
      className={`flex h-10 min-w-[280px] items-center gap-2 border border-[var(--line)] bg-white px-3 text-slate-500 ${className}`.trim()}
    >
      <SearchIcon />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="ค้นหาเอกสาร..."
        className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        aria-label="ค้นหาเอกสาร"
      />
      {value ? (
        <button
          type="button"
          onClick={() => setValue("")}
          className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
          aria-label="ล้างคำค้น"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M3 3L9 9M9 3L3 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
