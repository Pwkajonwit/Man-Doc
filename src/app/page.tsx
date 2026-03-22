import { ArchiveHome } from "@/components/archive-home";
import { getDashboardState } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type SearchQueryParams = {
  q?: string;
};

type HomePageProps = {
  searchParams?: Promise<SearchQueryParams> | SearchQueryParams;
};

export default async function Home({ searchParams }: HomePageProps) {
  const dashboard = await getDashboardState();
  const params = await Promise.resolve(searchParams ?? {});
  const query = typeof params.q === "string" ? params.q : "";

  return (
    <ArchiveHome
      initialData={dashboard.data}
      gasConfigured={dashboard.gasConfigured}
      dataSource={dashboard.source}
      dataErrorMessage={dashboard.errorMessage}
      searchQuery={query}
    />
  );
}
