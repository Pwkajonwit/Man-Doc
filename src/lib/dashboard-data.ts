import type { DashboardData, DashboardLoadState } from "@/lib/document-types";
import { fetchDashboardFromGas, hasGasConfig } from "@/lib/gas";
import { mockDashboardData } from "@/lib/mock-documents";

export async function getDashboardState(): Promise<DashboardLoadState> {
  if (!(await hasGasConfig())) {
    return {
      data: mockDashboardData,
      gasConfigured: false,
      source: "mock",
      errorMessage:
        "ยังไม่ได้ตั้งค่า GAS_WEB_APP_URL และยังไม่ได้บันทึก URL ผ่านหน้าตั้งค่า",
    };
  }

  try {
    const gasData = await fetchDashboardFromGas();

    if (gasData) {
      return {
        data: gasData,
        gasConfigured: true,
        source: "gas",
      };
    }

    return {
      data: mockDashboardData,
      gasConfigured: true,
      source: "mock",
      errorMessage: "GAS ตอบกลับมา แต่รูปแบบข้อมูลไม่ถูกต้อง",
    };
  } catch (error) {
    return {
      data: mockDashboardData,
      gasConfigured: true,
      source: "mock",
      errorMessage:
        error instanceof Error ? error.message : "ไม่สามารถดึงข้อมูลจาก GAS ได้",
    };
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  const state = await getDashboardState();
  return state.data;
}

export { hasGasConfig };
