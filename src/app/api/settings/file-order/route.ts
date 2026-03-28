import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { DASHBOARD_CACHE_TAG, hasGasConfig, postToGas } from "@/lib/gas";
import { getDocumentOrderSettingKey } from "@/lib/document-order";

type FileOrderPayload = {
  folderId?: string;
  orderedFileIds?: string[];
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as FileOrderPayload;
    const folderId = String(payload.folderId || "").trim();
    const orderedFileIds = Array.isArray(payload.orderedFileIds)
      ? payload.orderedFileIds
          .map((fileId) => String(fileId || "").trim())
          .filter((fileId, index, values) => fileId && values.indexOf(fileId) === index)
      : [];

    if (!folderId) {
      return NextResponse.json(
        { message: "กรุณาระบุรหัสหมวดเอกสาร" },
        { status: 400 },
      );
    }

    if (orderedFileIds.length === 0) {
      return NextResponse.json(
        { message: "กรุณาระบุลำดับไฟล์ที่ต้องการบันทึก" },
        { status: 400 },
      );
    }

    if (await hasGasConfig()) {
      const result = await postToGas({
        action: "set-setting",
        key: getDocumentOrderSettingKey(folderId),
        value: JSON.stringify(orderedFileIds),
      });

      revalidateTag(DASHBOARD_CACHE_TAG, "max");
      return NextResponse.json(result);
    }

    return NextResponse.json({
      mode: "mock",
      message: "บันทึกลำดับไฟล์ในโหมดตัวอย่างแล้ว",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์";

    return NextResponse.json({ message }, { status: 500 });
  }
}
