import { ArchiveShell } from "@/components/archive-shell";
import { SkeletonBlock } from "@/components/ui/skeleton-block";

export function FolderWorkspaceSkeleton() {
  return (
    <ArchiveShell active="documents">
      <div className="mx-auto grid max-w-7xl gap-0 xl:grid-cols-[1fr_26rem]">
        <section className="border-r border-[var(--line)] bg-white">
          <div className="border-b border-[var(--line)] px-4 py-6 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <SkeletonBlock className="h-4 w-32" />
                <SkeletonBlock className="mt-4 h-10 w-56" />
                <SkeletonBlock className="mt-3 h-4 w-full max-w-2xl" />
                <SkeletonBlock className="mt-2 h-4 w-96 max-w-full" />
              </div>
              <SkeletonBlock className="h-10 w-10 shrink-0" />
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1.4fr)_132px_104px_136px] border-b border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3 sm:px-6">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-3 w-16" />
            <SkeletonBlock className="h-3 w-16" />
          </div>

          <div className="space-y-2 px-3 py-3 sm:px-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[minmax(0,1.4fr)_132px_104px_136px] items-center gap-4 border border-transparent bg-white px-4 py-4"
              >
                <div className="flex items-center gap-4">
                  <SkeletonBlock className="h-12 w-12 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <SkeletonBlock className="h-5 w-52 max-w-full" />
                    <SkeletonBlock className="mt-2 h-4 w-36 max-w-full" />
                  </div>
                </div>
                <SkeletonBlock className="h-5 w-24" />
                <SkeletonBlock className="h-5 w-16" />
                <div className="flex gap-2">
                  <SkeletonBlock className="h-10 w-10" />
                  <SkeletonBlock className="h-10 w-10" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="border-l border-[var(--line)] bg-[#f7f9fb]">
          <div className="border-b border-[var(--line)] bg-white px-5 py-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <SkeletonBlock className="h-7 w-24" />
                <SkeletonBlock className="mt-2 h-3 w-28" />
              </div>
              <div className="flex gap-2">
                <SkeletonBlock className="h-9 w-20" />
                <SkeletonBlock className="h-9 w-24" />
              </div>
            </div>
          </div>

          <div className="px-5 py-5">
            <div className="border border-[var(--line)] bg-white p-5">
              <div className="mx-auto min-h-[420px] max-w-[360px] border border-[#edf1f4] bg-[#fffefc] px-6 py-8">
                <SkeletonBlock className="h-8 w-40" />
                <SkeletonBlock className="mt-5 h-[320px] w-full" />
                <SkeletonBlock className="mt-5 h-5 w-40" />
                <SkeletonBlock className="mt-3 h-4 w-48" />
              </div>
            </div>

            <div className="mt-4 border border-[var(--line)] bg-[#dbe5ea] p-5">
              <div className="flex items-center gap-2">
                <SkeletonBlock className="h-5 w-5" />
                <SkeletonBlock className="h-6 w-28" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index}>
                    <SkeletonBlock className="h-3 w-16" />
                    <SkeletonBlock className="mt-2 h-5 w-24" />
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <SkeletonBlock className="h-3 w-16" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <SkeletonBlock className="h-7 w-20" />
                  <SkeletonBlock className="h-7 w-24" />
                  <SkeletonBlock className="h-7 w-16" />
                </div>
              </div>
            </div>

            <SkeletonBlock className="mt-4 h-10 w-full" />
          </div>
        </aside>
      </div>
    </ArchiveShell>
  );
}
