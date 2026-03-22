import type { DashboardData } from "@/lib/document-types";
import { fetchDashboardFromGas, hasGasConfig } from "@/lib/gas";
import { mockDashboardData } from "@/lib/mock-documents";

export async function getDashboardData(): Promise<DashboardData> {
  if (!hasGasConfig()) {
    return mockDashboardData;
  }

  try {
    const gasData = await fetchDashboardFromGas();
    return gasData ?? mockDashboardData;
  } catch {
    return mockDashboardData;
  }
}

export { hasGasConfig };
