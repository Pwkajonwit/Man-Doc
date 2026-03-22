import { ArchiveShell } from "@/components/archive-shell";
import { SkeletonBlock } from "@/components/ui/skeleton-block";

export function ArchiveHomeSkeleton() {
  return (
    <ArchiveShell active="documents">
      <section className="border-b border-[var(--line)] bg-[#edf1f4]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <SkeletonBlock className="h-3 w-28" />
            <SkeletonBlock className="mt-3 h-12 w-72" />
            <SkeletonBlock className="mt-4 h-4 w-full max-w-2xl" />
            <SkeletonBlock className="mt-2 h-4 w-80 max-w-full" />
          </div>

          <div className="flex flex-col items-start gap-2 xl:items-end">
            <SkeletonBlock className="h-10 w-32" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="grid min-h-[164px] overflow-hidden border border-[var(--line)] bg-white md:grid-cols-[minmax(0,1fr)_220px]"
            >
              <div className="flex justify-center px-6 py-5 md:px-7">
                <div className="w-full max-w-2xl">
                  <SkeletonBlock className="h-8 w-40" />
                  <SkeletonBlock className="mt-4 h-4 w-full" />
                  <SkeletonBlock className="mt-2 h-4 w-4/5" />
                </div>
              </div>
              <div className="grid grid-rows-[1fr_1fr] border-t border-[var(--line)] md:border-l md:border-t-0">
                <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-5 py-3.5">
                  <SkeletonBlock className="h-11 w-11" />
                  <SkeletonBlock className="h-7 w-24" />
                </div>
                <div className="flex items-end justify-between gap-4 bg-[var(--surface-muted)] px-5 py-2.5">
                  <div className="grid grid-cols-2 gap-x-5">
                    <div>
                      <SkeletonBlock className="h-3 w-16" />
                      <SkeletonBlock className="mt-2 h-5 w-14" />
                    </div>
                    <div>
                      <SkeletonBlock className="h-3 w-20" />
                      <SkeletonBlock className="mt-2 h-5 w-16" />
                    </div>
                  </div>
                  <SkeletonBlock className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ArchiveShell>
  );
}
