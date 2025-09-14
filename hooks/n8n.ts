"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { APP_URL } from "@/lib/config";

// Types
export interface ValidateJwtResponse {
  tenant_id: string;
  tenant_name?: string;
  branding?: {
    logoUrl?: string;
    primaryColor?: string;
  };
  email?: string;
  user_id?: string;
}

// Generic fetcher against our Next.js proxy which injects Clerk JWT server-side
async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// Queries
export function useValidateJwt() {
  return useQuery({
    queryKey: ["validate-jwt"],
    queryFn: () =>
      fetchJSON<ValidateJwtResponse>("/api/n8n/validate-jwt"),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useInitialDataSync() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { platform: "shopify" | "woocommerce" | "youcan"; storeId?: string }) => {
      return fetchJSON<{ status: "ok" | "started" | "queued" }>(
        "/api/n8n/data-sync/initial",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sync-status"] });
    },
  });
}

// OAuth helpers (navigate away to start OAuth)
export type ShopifyInstallOptions = {
  redirectAfter?: string
  shopDomain?: string
  tenantId?: string
  storeName?: string
  extra?: Record<string, string | number | boolean | null | undefined>
}

function buildQuery(params: Record<string, any>) {
  const usp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue
    usp.append(k, String(v))
  }
  return usp.toString()
}

export function startShopifyInstall(opts?: string | ShopifyInstallOptions) {
  const redirectAfter = typeof opts === "string" ? opts : opts?.redirectAfter
  const returnUrl = redirectAfter || `${APP_URL}/stores`
  const params =
    typeof opts === "string"
      ? {}
      : {
          // Legacy GET query parameters expected by the workflow
          shop: opts?.shopDomain,
          shop_domain: opts?.shopDomain, // include both for compatibility
          tenant_id: opts?.tenantId,
          store_name: opts?.storeName,
          ...(opts?.extra || {}),
        }
  const q = buildQuery({ return_url: returnUrl, ...params })
  const url = `/api/n8n/shopify/install${q ? `?${q}` : ""}`
  window.location.href = url
}

export function startWooInstall(redirectAfter?: string) {
  const returnUrl = redirectAfter || `${APP_URL}/stores`
  const url = `/api/n8n/woocommerce/install?return_url=${encodeURIComponent(returnUrl)}`
  window.location.href = url
}

export function startYouCanInstall(redirectAfter?: string) {
  const returnUrl = redirectAfter || `${APP_URL}/stores`
  const url = `/api/n8n/youcan/install?return_url=${encodeURIComponent(returnUrl)}`
  window.location.href = url
}

// Robust Shopify OAuth starter: try JSON endpoints that return auth_url via GET; fallback to simple redirect
export async function startShopifyInstallRobust(opts?: string | ShopifyInstallOptions) {
  const redirectAfter = typeof opts === "string" ? opts : opts?.redirectAfter;
  const returnUrl = redirectAfter || `${APP_URL}/stores`;

  const params =
    typeof opts === "string"
      ? {}
      : {
          shop: opts?.shopDomain,
          shop_domain: opts?.shopDomain,
          tenant_id: opts?.tenantId,
          store_name: opts?.storeName,
          ...(opts?.extra || {}),
        };

  const q = new URLSearchParams({ return_url: returnUrl });
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") q.append(k, String(v));
  }

  const candidates = [
    `/api/n8n/shopify/install-url?${q.toString()}`,
    `/api/n8n/shopify/install?${q.toString()}`, // may return JSON before redirect
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, { method: "GET", headers: { accept: "application/json" } });
      const ct = res.headers.get("content-type") || "";
      if (res.ok && ct.includes("application/json")) {
        const data: any = await res.json();
        const auth = data?.auth_url || data?.url || data?.location || data?.redirect_url;
        if (auth && typeof auth === "string") {
          window.location.href = auth;
          return;
        }
      }
    } catch {
      // ignore and fallback
    }
  }

  // Final fallback: let the proxy handle HTTP redirect flow
  startShopifyInstall(opts as any);
}
