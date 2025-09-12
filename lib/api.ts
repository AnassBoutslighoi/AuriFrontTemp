import ky from "ky";

export const api = ky.create({ prefixUrl: "" });

// Convenience helpers for internal API routes
export async function getJSON<T>(url: string): Promise<T> {
  return api.get(url).json<T>();
}
export async function postJSON<T>(url: string, json?: unknown): Promise<T> {
  return api.post(url, { json }).json<T>();
}