"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useTenant } from "@/components/tenant-provider";

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
    
    const data = (await res.json()) as T;
    return data;
  } catch (error) {
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
 * Sync job status and progress tracking
 */
export type SyncJobStatus = {
  sync_id: string;
  store_id: string;
  platform: Platform;
  status: "running" | "completed" | "failed" | "queued";
  progress?: number;
  started_at?: string;
  completed_at?: string;
  error?: string;
};

/**
 * POST /api/n8n/data-sync/initial
 * Triggers initial data sync for a specific store
 */
export function useStartStoreSync() {
  return useMutation({
    mutationFn: async ({ storeId, platform, priority = "normal" }: {
      storeId: string;
      platform: Platform;
      priority?: "high" | "normal" | "low";
    }) => {
      const res = await fetch("/api/n8n/data-sync/initial", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ 
          store_id: storeId,
          platform,
          priority 
        }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Sync failed with ${res.status}`);
      }
      return (await res.json()) as { 
        status: "ok" | "started" | "queued";
        sync_id?: string;
        message?: string;
      };
    },
  });
}

/**
 * Get sync job status and progress
 */
export function useSyncJobStatus(syncId?: string) {
  return useQuery({
    queryKey: ["sync-job-status", syncId],
    queryFn: () =>
      fetchJSONOr<SyncJobStatus | null>(
        syncId ? `/api/n8n/sync/status/${encodeURIComponent(syncId)}` : "",
        null
      ),
    enabled: !!syncId,
    refetchInterval: 2000, // Poll every 2 seconds while sync is running
    refetchIntervalInBackground: false,
  });
}

/**
 * Get latest sync job for a store
 */
export function useLatestStoreSyncJob(storeId?: string) {
  return useQuery({
    queryKey: ["latest-sync-job", storeId],
    queryFn: () =>
      fetchJSONOr<SyncJobStatus | null>(
        storeId ? `/api/n8n/sync/latest/${encodeURIComponent(storeId)}` : "",
        null
      ),
    enabled: !!storeId,
    refetchInterval: 5000, // Check for updates every 5 seconds
  });
}

/**
 * Stores listing (dynamic data; falls back to [])
 * Proxy endpoint should return an array of store summaries for current tenant.
 */
export type StoreStatus =
  | "active"
  | "inactive"
  | "error"
  | "connecting"
  | "syncing"
  | "all";

export type StoreSummary = {
  id: string;
  name: string;
  url: string;
  platform: Platform;
  status?: StoreStatus;
  products?: number;
  lastSync?: string;
  chatbots?: number;
};

type N8nStore = {
  _id?: string;
  id?: string;
  tenant_id: string;
  platform: Platform;
  store_name?: string;
  store_url: string;
  status: string;
  last_sync?: string;
  created_at?: string;
  updated_at?: string;
  sync_settings?: any;
  sync_freshness?: { last_sync_ago?: number; is_stale?: boolean } | null;
};

type N8nStoresListResponse = {
  success: boolean;
  data?: {
    stores: N8nStore[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_count: number;
      per_page: number;
      has_next_page: boolean;
      has_prev_page: boolean;
      offset: number;
    };
    filters_applied?: { platform?: string; status?: string };
    summary?: any;
  };
};

// Type for the new API response format
type NewApiStoreData = {
  store_id: string;
  namespace: string;
  status: string;
  settings: {
    store_name: string;
    store_url: string;
    sync_frequency?: string;
  };
  platform: {
    name: string;
    url: string;
  };
  products: {
    count: number;
    last_synced: string | null;
    pending: number;
  };
  sync_status: {
    catalog: string;
    products_synced: boolean;
  };
  chatbots: {
    count: number;
    status: string;
  };
  created_at: string;
  updated_at: string;
};

function mapNewApiStoreToSummary(data: NewApiStoreData): StoreSummary {
  const knownStatuses = new Set([
    "active",
    "inactive", 
    "error",
    "connecting",
    "syncing",
  ]);
  const status = knownStatuses.has(String(data.status))
    ? (data.status as StoreStatus)
    : undefined;

  // Extract platform name and validate it
  const platformName = data.platform?.name?.toLowerCase();
  const validPlatforms = ['shopify', 'woocommerce', 'youcan'];
  const platform = (platformName && validPlatforms.includes(platformName)) 
    ? platformName as Platform 
    : 'shopify';

  const mapped: StoreSummary = {
    id: data.store_id || data.namespace || "",
    name: data.settings?.store_name || data.platform?.url || "Unknown Store",
    url: data.settings?.store_url || data.platform?.url || "",
    platform,
    status,
    products: data.products?.count || 0,
    lastSync: data.products?.last_synced || undefined,
    chatbots: data.chatbots?.count || 0,
  };
  
  return mapped;
}

function mapN8nStoreToSummary(s: N8nStore): StoreSummary {
  const knownStatuses = new Set([
    "active",
    "inactive",
    "error",
    "connecting", 
    "syncing",
  ]);
  const status = knownStatuses.has(String(s.status))
    ? (s.status as StoreStatus)
    : undefined;
  
  const mapped = {
    id: (s.id as string) || (s._id as string) || "",
    name: s.store_name || s.store_url || "",
    url: s.store_url || "",
    platform: (typeof s.platform === 'string' && ['shopify', 'woocommerce', 'youcan'].includes(s.platform)) 
      ? s.platform as Platform 
      : 'shopify', // Default to shopify if platform is invalid
    status,
    lastSync: s.last_sync || undefined,
  };
  
  return mapped;
}

/**
 * Stores listing via n8n workflow
 * GET /api/n8n/stores/list?tenant_id=...&platform=shopify|woocommerce|youcan|all&status=active|inactive|error|connecting|syncing|all&limit=...&offset=...
 */
export function useStores(opts?: {
  platform?: Platform | "all";
  status?: StoreStatus;
  limit?: number;
  offset?: number;
  tenantId?: string;
}) {
  const { tenantId: ctxTenantId } = useTenant();
  const envTenantId = process.env.NEXT_PUBLIC_TENANT_ID;
  const urlTenantId =
    typeof window !== "undefined"
      ? new URL(window.location.href).searchParams.get("tenant_id") || undefined
      : undefined;
  
  // Simplified tenant resolution with logging
  const tenantId = opts?.tenantId ?? ctxTenantId ?? urlTenantId ?? envTenantId;
  console.log('Tenant resolution:', { 
    opts: opts?.tenantId, 
    ctx: ctxTenantId, 
    url: urlTenantId, 
    env: envTenantId, 
    final: tenantId 
  });
  
  const platform = opts?.platform ?? "all";
  const status = opts?.status ?? "all";
  const limit = Number.isFinite(opts?.limit) ? (opts!.limit as number) : 50;
  const offset = Number.isFinite(opts?.offset) ? (opts!.offset as number) : 0;

  return useQuery({
    queryKey: ["stores", tenantId, platform, status, limit, offset],
    // Always enabled; backend can derive tenant from JWT if tenant_id is omitted
    enabled: true,
    queryFn: async () => {
      try {
        const usp = new URLSearchParams();
        if (tenantId) usp.set("tenant_id", tenantId);
        if (platform) usp.set("platform", platform);
        if (status) usp.set("status", status);
        usp.set("limit", String(limit));
        usp.set("offset", String(offset));

        const url = `/api/n8n/stores/list?${usp.toString()}`;
        console.log('Making stores API request to:', url);

        const response = await fetch(url);
        console.log('Response status:', response.status, response.ok);
        
        if (!response.ok) {
          const text = await response.text();
          console.error('HTTP Error response:', text);
          throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const res = await response.json() as N8nStoresListResponse;
        console.log('Stores API raw response:', res);
        
        // Handle the case where success is false
        if (!res.success) {
          console.warn('API returned success: false', res);
          // Check if there's any error information in the response
          return []; // Return empty array instead of undefined
        }
        
        const list = res?.data ?? [];
        
        // Handle both array format and pagination object format
        const stores = Array.isArray(list) ? list : (list as any).stores ?? [];
        const mapped = stores.map(mapN8nStoreToSummary);
        
        return mapped;
      } catch (error) {
        throw error; // Re-throw to let react-query handle it
      }
    },
    refetchInterval: 15_000,
    retry: (failureCount, error) => {
      console.log('Query retry attempt:', failureCount, error);
      return failureCount < 3;
    },
  });
}

// Single store detail for a given id
export function useStore(id?: string) {
  return useQuery({
    queryKey: ["store", id],
    queryFn: async () => {
      if (!id) return null;
      
      const rawData = await fetchJSONOr<any>(
        `/api/n8n/stores/${encodeURIComponent(id)}`,
        null
      );
      
      if (!rawData) return null;
      
      // Check if it's already in StoreSummary format
      if (rawData.id && rawData.name && rawData.url && rawData.platform) {
        return rawData as StoreSummary;
      }
      
      // Check if it's the new API format directly (without success wrapper)
      if (rawData.store_id && rawData.settings && rawData.platform) {
        return mapNewApiStoreToSummary(rawData as NewApiStoreData);
      }
      
      // Check if it's in N8nStore format and needs mapping
      if (rawData._id || rawData.id || rawData.store_name || rawData.store_url) {
        return mapN8nStoreToSummary(rawData as N8nStore);
      }
      
      // Check if it's wrapped in a response object (new API format)
      if (rawData.success && rawData.data && typeof rawData.data === 'object') {
        return mapNewApiStoreToSummary(rawData.data);
      }
      
      // Check if it's the old wrapped format
      if (rawData.data && typeof rawData.data === 'object' && !rawData.success) {
        return mapN8nStoreToSummary(rawData.data as N8nStore);
      }
      
      return null;
    },
    enabled: !!id,
    refetchInterval: 15_000,
  });
}
