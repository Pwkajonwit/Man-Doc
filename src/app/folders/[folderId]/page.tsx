import { notFound } from "next/navigation";
import { FolderWorkspace } from "@/components/folder-workspace";
import { getDashboardData, hasGasConfig } from "@/lib/dashboard-data";
import { getFilesForFolder } from "@/lib/archive-config";

type SearchQueryParams = {
  q?: string;
  fileId?: string;
};

type FolderPageProps = {
  params: Promise<{
    folderId: string;
  }>;
  searchParams?: Promise<SearchQueryParams> | SearchQueryParams;
};

export default async function FolderPage({ params, searchParams }: FolderPageProps) {
  const { folderId } = await params;
  const queryParams = await Promise.resolve(searchParams ?? {});
  const data = await getDashboardData();
  const folder = data.folders.find((item) => item.id === folderId);

  if (!folder) {
    notFound();
  }

  const files = getFilesForFolder(data.files, folderId);

  return (
    <FolderWorkspace
      folder={folder}
      files={files}
      gasConfigured={hasGasConfig()}
      searchQuery={typeof queryParams.q === "string" ? queryParams.q : ""}
      initialSelectedFileId={
        typeof queryParams.fileId === "string" ? queryParams.fileId : ""
      }
    />
  );
}
