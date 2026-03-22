import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DASHBOARD_CACHE_TAG } from "@/lib/gas";
import {
  GAS_URL_COOKIE_NAME,
  sanitizeGasWebAppUrl,
} from "@/lib/gas-config";

type GasUrlPayload = {
  url?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as GasUrlPayload;
  const sanitizedUrl = sanitizeGasWebAppUrl(payload.url);

  if (!sanitizedUrl) {
    return NextResponse.json(
      { message: "กรุณาวาง URL ของ GAS Web App ที่ถูกต้อง" },
      { status: 400 },
    );
  }

  let syncMessage = "";

  try {
    const gasResponse = await fetch(sanitizedUrl, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        action: "set-setting",
        key: "gasWebAppUrl",
        value: sanitizedUrl,
      }),
    });

    if (!gasResponse.ok) {
      throw new Error(`GAS responded with ${gasResponse.status}`);
    }

    const gasPayload = (await gasResponse.json()) as {
      ok?: boolean;
      message?: string;
    };

    if (gasPayload.ok === false) {
      throw new Error(gasPayload.message || "GAS did not save the setting");
    }
  } catch (error) {
    syncMessage =
      error instanceof Error
        ? ` แต่บันทึกลงชีต Setting ไม่สำเร็จ: ${error.message}`
        : " แต่บันทึกลงชีต Setting ไม่สำเร็จ";
  }

  const cookieStore = await cookies();
  cookieStore.set(GAS_URL_COOKIE_NAME, sanitizedUrl, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  revalidateTag(DASHBOARD_CACHE_TAG, "max");

  return NextResponse.json({
    message: `บันทึก URL ของ GAS แล้ว${syncMessage}`,
    url: sanitizedUrl,
  });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(GAS_URL_COOKIE_NAME);

  revalidateTag(DASHBOARD_CACHE_TAG, "max");

  return NextResponse.json({
    message: "ล้าง URL ของ GAS แล้ว",
  });
}
