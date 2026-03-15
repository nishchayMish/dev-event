const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

if (!rawBaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_BASE_URL");
}

export const BASE_URL = rawBaseUrl.replace(/\/$/, "");