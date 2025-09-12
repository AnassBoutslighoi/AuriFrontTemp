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
export function startShopifyInstall(redirectAfter?: string) {
  const returnUrl = redirectAfter || `${APP_URL}/store-integration`;
  const url = `/api/n8n/shopify/install?return_url=${encodeURIComponent(returnUrl)}`;
  window.location.href = url;
}

export function startWooInstall(redirectAfter?: string) {
  const returnUrl = redirectAfter || `${APP_URL}/store-integration`;
  const url = `/api/n8n/woocommerce/install?return_url=${encodeURIComponent(returnUrl)}`;
  window.location.href = url;
}

export function startYouCanInstall(redirectAfter?: string) {
  const returnUrl = redirectAfter || `${APP_URL}/store-integration`;
  const url = `/api/n8n/youcan/install?return_url=${encodeURIComponent(returnUrl)}`;
  window.location.href = url;
}