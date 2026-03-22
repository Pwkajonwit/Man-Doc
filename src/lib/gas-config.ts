import "server-only";

import { cookies } from "next/headers";

export const GAS_URL_COOKIE_NAME = "gas-web-app-url";

export async function getConfiguredGasWebAppUrl() {
  const cookieStore = await cookies();
  const cookieValue = sanitizeGasWebAppUrl(cookieStore.get(GAS_URL_COOKIE_NAME)?.value);
  const envValue = sanitizeGasWebAppUrl(process.env.GAS_WEB_APP_URL);

  return cookieValue || envValue || "";
}

export async function hasConfiguredGasWebAppUrl() {
  return Boolean(await getConfiguredGasWebAppUrl());
}

export function sanitizeGasWebAppUrl(value: string | undefined) {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  try {
    const url = new URL(trimmed);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return "";
    }

    return url.toString();
  } catch {
    return "";
  }
}
