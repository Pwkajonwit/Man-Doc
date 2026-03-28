import { notFound } from "next/navigation";
import { FolderWorkspace } from "@/components/folder-workspace";
import { getDashboardState } from "@/lib/dashboard-data";
import { getFilesForFolder } from "@/lib/archive-config";
import {
  getDocumentOrderSettingKey,
  orderFilesByDocumentOrder,
  parseDocumentOrder,
} from "@/lib/document-order";
import { fetchSettingFromGas } from "@/lib/gas";

export const dynamic = "force-dynamic";

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
  const dashboard = await getDashboardState();
  const folder = dashboard.data.folders.find((item) => item.id === folderId);

  if (!folder) {
    notFound();
  }

  let files = getFilesForFolder(dashboard.data.files, folderId);

  if (dashboard.gasConfigured && dashboard.source === "gas") {
    try {
      const savedOrder = await fetchSettingFromGas(getDocumentOrderSettingKey(folderId));
      files = orderFilesByDocumentOrder(files, parseDocumentOrder(savedOrder));
    } catch {
      // Fall back to the default uploadedAt ordering when the setting cannot be read.
    }
  }

  return (
    <FolderWorkspace
      folder={folder}
      files={files}
      gasConfigured={dashboard.gasConfigured}
      dataSource={dashboard.source}
      dataErrorMessage={dashboard.errorMessage}
      searchQuery={typeof queryParams.q === "string" ? queryParams.q : ""}
      initialSelectedFileId={
        typeof queryParams.fileId === "string" ? queryParams.fileId : ""
      }
    />
  );
}
