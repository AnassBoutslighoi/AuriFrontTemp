"use client";

import { useQuery } from "@tanstack/react-query";

// Local helper mirroring hooks/stores.ts behavior
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

export type ChatbotSummary = {
  id: string;
  name: string;
  storeId: string;
  storeName?: string;
  storePlatform?: "shopify" | "woocommerce" | "youcan" | string;
  model?: string;
  status?: "active" | "inactive" | "error";
  messagesPerDay?: number;
  responseTime?: string; // e.g. "1.2s"
};

// All chatbots for current tenant
export function useChatbots() {
  return useQuery({
    queryKey: ["chatbots"],
    queryFn: () => fetchJSONOr<ChatbotSummary[]>("/api/n8n/chatbots/list", []),
    refetchInterval: 15_000,
  });
}

// Chatbots scoped to a store
export function useStoreChatbots(storeId?: string) {
  return useQuery({
    queryKey: ["store-chatbots", storeId],
    queryFn: () =>
      fetchJSONOr<ChatbotSummary[]>(
        storeId ? `/api/n8n/chatbots/by-store/${encodeURIComponent(storeId)}` : "",
        []
      ),
    enabled: !!storeId,
    refetchInterval: 15_000,
  });
}