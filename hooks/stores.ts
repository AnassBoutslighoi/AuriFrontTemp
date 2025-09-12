"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

/**
 * Fetch with graceful fallback on 404 or network errors.
 */
async function fetchJSONOr<T>(url: string, orValue: T, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      if (res.status === 404) return orValue;
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed with ${res.status}`);
    }
    return (await res.json()) as T;
  } catch {
    return orValue;
  }
}

export type Platform = "shopify" | "woocommerce" | "youcan";

export type StoreConnection = {
  platform: Platform;
  connected: boolean;
  storeName?: string;
  lastSyncedAt?: string; // ISO
  error?: string;
};

export type StoreConnectionsStatus = {
  items: StoreConnection[];
};

/**
 * GET /api/n8n/connections/status
 * Backend should aggregate connection status from each platform.
 * If not available yet, hook returns safe defaults.
 */
export function useStoreConnectionsStatus() {
  return useQuery({
    queryKey: ["store-connections-status"],
    queryFn: () =>
      fetchJSONOr<StoreConnectionsStatus>("/api/n8n/connections/status", {
        items: [
          { platform: "woocommerce", connected: false },
          { platform: "shopify", connected: false },
          { platform: "youcan", connected: false },
        ],
      }),
    refetchInterval: 10_000, // poll every 10s
  });
}

/**
 * GET /api/n8n/sync/logs?platform=...
 * Returns recent sync logs/errors for a platform.
 */
export type SyncLog = {
  id: string;
  level: "info" | "warn" | "error";
  message: string;
  at: string; // ISO
};

export function useSyncLogs(platform: Platform, limit = 20) {
  return useQuery({
    queryKey: ["sync-logs", platform, limit],
    queryFn: () =>
      fetchJSONOr<SyncLog[]>(
        `/api/n8n/sync/logs?platform=${encodeURIComponent(platform)}&limit=${limit}`,
        [],
      ),
    refetchInterval: 10_000,
  });
}

/**
 * POST /api/n8n/data-sync/initial
 * Already exists as useInitialDataSync in hooks/n8n, duplicated here for cohesion if needed.
 */
export function useStartInitialSync(platform: Platform) {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/n8n/data-sync/initial", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Sync failed with ${res.status}`);
      }
      return (await res.json()) as { status: "ok" | "started" | "queued" };
    },
  });
}