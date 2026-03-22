import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/dashboard-data";
import {
  createMockFile,
  createMockFolder,
  DASHBOARD_CACHE_TAG,
  hasGasConfig,
  postToGas,
  updateMockFolder,
} from "@/lib/gas";
import type { FolderColorKey, FolderIconKey } from "@/lib/document-types";

export async function GET() {
  const data = await getDashboardData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const action = getValue(formData.get("action"));
    const gasConfigured = await hasGasConfig();

    if (action === "create-folder") {
      const folderName = getValue(formData.get("folderName")).trim();
      const repositoryId = getValue(formData.get("repositoryId")).trim();
      const folderDescription = getValue(formData.get("folderDescription")).trim();
      const folderIcon = normalizeFolderIcon(getValue(formData.get("folderIcon")).trim());
      const folderColor = normalizeFolderColor(getValue(formData.get("folderColor")).trim());

      if (!folderName) {
        return NextResponse.json(
          { message: "กรุณากรอกชื่อหมวดเอกสาร" },
          { status: 400 },
        );
      }

      if (gasConfigured) {
        const result = await postToGas({
          action: "create-folder",
          folderName,
          repositoryId,
          folderDescription,
          folderIcon,
          folderColor,
        });

        revalidateTag(DASHBOARD_CACHE_TAG, "max");
        return NextResponse.json(result);
      }

      revalidateTag(DASHBOARD_CACHE_TAG, "max");
      return NextResponse.json({
        mode: "mock",
        message: "สร้างหมวดเอกสารสำเร็จในโหมดตัวอย่าง",
        folder: createMockFolder(folderName, {
          description: folderDescription,
          repositoryId,
          icon: folderIcon,
          color: folderColor,
        }),
      });
    }

    if (action === "update-folder") {
      const folderId = getValue(formData.get("folderId")).trim();
      const folderName = getValue(formData.get("folderName")).trim();
      const repositoryId = getValue(formData.get("repositoryId")).trim();
      const folderDescription = getValue(formData.get("folderDescription")).trim();
      const folderIcon = normalizeFolderIcon(getValue(formData.get("folderIcon")).trim());
      const folderColor = normalizeFolderColor(getValue(formData.get("folderColor")).trim());

      if (!folderId) {
        return NextResponse.json(
          { message: "ไม่พบรหัสหมวดเอกสาร" },
          { status: 400 },
        );
      }

      if (!folderName) {
        return NextResponse.json(
          { message: "กรุณากรอกชื่อหมวดเอกสาร" },
          { status: 400 },
        );
      }

      if (gasConfigured) {
        const result = await postToGas({
          action: "update-folder",
          folderId,
          folderName,
          repositoryId,
          folderDescription,
          folderIcon,
          folderColor,
        });

        revalidateTag(DASHBOARD_CACHE_TAG, "max");
        return NextResponse.json(result);
      }

      const data = await getDashboardData();
      const currentFolder = data.folders.find((folder) => folder.id === folderId);

      if (!currentFolder) {
        return NextResponse.json(
          { message: "ไม่พบหมวดเอกสารที่ต้องการแก้ไข" },
          { status: 404 },
        );
      }

      revalidateTag(DASHBOARD_CACHE_TAG, "max");
      return NextResponse.json({
        mode: "mock",
        message: "บันทึกการแก้ไขหมวดเอกสารสำเร็จในโหมดตัวอย่าง",
        folder: updateMockFolder(currentFolder, {
          name: folderName,
          repositoryId,
          description: folderDescription,
          icon: folderIcon,
          color: folderColor,
        }),
      });
    }

    if (action === "upload-file") {
      const upload = formData.get("file");
      const folderId = getValue(formData.get("folderId")).trim();
      const folderName = getValue(formData.get("folderName")).trim();
      const uploadedBy = getValue(formData.get("uploadedBy")).trim() || "ระบบงาน MAN";

      if (!(upload instanceof File)) {
        return NextResponse.json({ message: "กรุณาเลือกไฟล์" }, { status: 400 });
      }

      if (!folderId || !folderName) {
        return NextResponse.json(
          { message: "กรุณาเลือกหมวดเอกสารปลายทาง" },
          { status: 400 },
        );
      }

      if (gasConfigured) {
        const base64 = Buffer.from(await upload.arrayBuffer()).toString("base64");
        const result = await postToGas({
          action: "upload-file",
          folderId,
          folderName,
          uploadedBy,
          file: {
            name: upload.name,
            type: upload.type || "application/octet-stream",
            size: upload.size,
            base64,
          },
        });

        revalidateTag(DASHBOARD_CACHE_TAG, "max");
        return NextResponse.json(result);
      }

      const base64 =
        upload.type.startsWith("image/") || upload.type === "application/pdf"
          ? Buffer.from(await upload.arrayBuffer()).toString("base64")
          : undefined;

      revalidateTag(DASHBOARD_CACHE_TAG, "max");
      return NextResponse.json({
        mode: "mock",
        message: "อัปโหลดไฟล์สำเร็จในโหมดตัวอย่าง",
        file: createMockFile({
          fileName: upload.name,
          fileType: upload.type,
          fileSize: upload.size,
          folderId,
          folderName,
          uploadedBy,
          base64,
        }),
      });
    }

    if (action === "delete-file") {
      const fileId = getValue(formData.get("fileId")).trim();

      if (!fileId) {
        return NextResponse.json({ message: "ไม่พบรหัสไฟล์" }, { status: 400 });
      }

      if (gasConfigured) {
        const result = await postToGas({
          action: "delete-file",
          fileId,
        });

        revalidateTag(DASHBOARD_CACHE_TAG, "max");
        return NextResponse.json(result);
      }

      revalidateTag(DASHBOARD_CACHE_TAG, "max");
      return NextResponse.json({
        mode: "mock",
        message: "ลบไฟล์สำเร็จในโหมดตัวอย่าง",
      });
    }

    if (action === "delete-folder") {
      const folderId = getValue(formData.get("folderId")).trim();

      if (!folderId) {
        return NextResponse.json(
          { message: "ไม่พบรหัสหมวดเอกสาร" },
          { status: 400 },
        );
      }

      if (gasConfigured) {
        const result = await postToGas({
          action: "delete-folder",
          folderId,
        });

        revalidateTag(DASHBOARD_CACHE_TAG, "max");
        return NextResponse.json(result);
      }

      revalidateTag(DASHBOARD_CACHE_TAG, "max");
      return NextResponse.json({
        mode: "mock",
        message: "ลบหมวดเอกสารสำเร็จในโหมดตัวอย่าง",
      });
    }

    return NextResponse.json(
      { message: "ไม่รองรับคำสั่งนี้" },
      { status: 400 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์";

    return NextResponse.json({ message }, { status: 500 });
  }
}

function getValue(entry: FormDataEntryValue | null) {
  return typeof entry === "string" ? entry : "";
}

function normalizeFolderIcon(value: string): FolderIconKey | undefined {
  return value === "building" ||
    value === "compass" ||
    value === "gallery" ||
    value === "wallet" ||
    value === "chip"
    ? value
    : undefined;
}

function normalizeFolderColor(value: string): FolderColorKey | undefined {
  return value === "slate" ||
    value === "emerald" ||
    value === "sky" ||
    value === "amber" ||
    value === "rose" ||
    value === "violet"
    ? value
    : undefined;
}
