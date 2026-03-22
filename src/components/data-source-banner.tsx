import Link from "next/link";
import type { DashboardSource } from "@/lib/document-types";

type DataSourceBannerProps = {
  gasConfigured: boolean;
  source: DashboardSource;
  errorMessage?: string;
};

export function DataSourceBanner({
  gasConfigured,
  source,
  errorMessage,
}: DataSourceBannerProps) {
  if (source === "gas") {
    return null;
  }

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span>
          {gasConfigured
            ? `กำลังใช้ข้อมูลตัวอย่าง เพราะเรียก GAS ไม่สำเร็จ${errorMessage ? `: ${errorMessage}` : ""}`
            : "กำลังใช้ข้อมูลตัวอย่าง เพราะยังไม่ได้ตั้งค่า URL ของ GAS"}
        </span>
        <Link
          href="/settings"
          className="text-sm font-semibold text-amber-900 underline underline-offset-4"
        >
          ไปหน้าตั้งค่า
        </Link>
      </div>
    </div>
  );
}
