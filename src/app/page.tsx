import { ArchiveHome } from "@/components/archive-home";
import { getDashboardData, hasGasConfig } from "@/lib/dashboard-data";

type SearchQueryParams = {
  q?: string;
};

type HomePageProps = {
  searchParams?: Promise<SearchQueryParams> | SearchQueryParams;
};

export default async function Home({ searchParams }: HomePageProps) {
  const data = await getDashboardData();
  const params = await Promise.resolve(searchParams ?? {});
  const query = typeof params.q === "string" ? params.q : "";

  return (
    <ArchiveHome
      initialData={data}
      gasConfigured={hasGasConfig()}
      searchQuery={query}
    />
  );
}
