export const N8N_BASE =
  (process.env.NEXT_PUBLIC_N8N_BASE_URL || "").replace(/\/$/, "");

export const APP_URL =
  (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  );