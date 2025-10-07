const RAW_N8N_BASE =
  process.env.N8N_BASE_URL ||
  process.env.NEXT_PUBLIC_N8N_BASE_URL ||
  "https://n8n.weblion.pro/webhook";

export const N8N_BASE = RAW_N8N_BASE.replace(/\/+$/, "");

export const APP_URL = (
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");