"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * Small fetch helper that tolerates 404 by returning a default value.
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

/**
 * Overview cards at the top of Dashboard.
 */
export type AnalyticsOverview = {
  messagesToday: number;
  activeBots: number;
  // Legacy fields kept for backward compatibility; not used in MVP cards
  planUsagePct: number;
  customLlmRequests: number;

  // MVP-focused metrics
  conversationsToday?: number;
  avgResponseTimeSec?: number;
  resolutionRatePct?: number;
};

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ["analytics-overview"],
    queryFn: () =>
      fetchJSONOr<AnalyticsOverview>("/api/n8n/analytics/overview", {
        messagesToday: 0,
        activeBots: 0,
        planUsagePct: 0,
        customLlmRequests: 0,
        conversationsToday: 0,
        avgResponseTimeSec: 0,
        resolutionRatePct: undefined,
      }),
    staleTime: 30_000,
    retry: 1,
  });
}

/**
 * Time-series: daily messages and conversations
 */
export type DailyPoint = {
  date: string; // ISO or yyyy-mm-dd
  messages: number;
  conversations: number;
};

export function useDailyUsage() {
  const fallback: DailyPoint[] = [
    { date: "2025-05-01", messages: 120, conversations: 30 },
    { date: "2025-05-02", messages: 145, conversations: 34 },
    { date: "2025-05-03", messages: 162, conversations: 37 },
    { date: "2025-05-04", messages: 188, conversations: 41 },
    { date: "2025-05-05", messages: 199, conversations: 45 },
    { date: "2025-05-06", messages: 181, conversations: 39 },
    { date: "2025-05-07", messages: 205, conversations: 46 },
  ];
  return useQuery({
    queryKey: ["analytics-daily-usage"],
    queryFn: () => fetchJSONOr<DailyPoint[]>("/api/n8n/analytics/daily-usage", fallback),
    staleTime: 60_000,
  });
}

/**
 * Top queries histogram
 */
export type QueryItem = {
  query: string;
  count: number;
};

export function useTopQueries(limit = 10) {
  const fallback: QueryItem[] = [
    { query: "Product availability", count: 120 },
    { query: "Shipping information", count: 98 },
    { query: "Return policy", count: 74 },
    { query: "Order status", count: 58 },
  ];
  return useQuery({
    queryKey: ["analytics-top-queries", limit],
    queryFn: () =>
      fetchJSONOr<QueryItem[]>(
        `/api/n8n/analytics/top-queries?limit=${encodeURIComponent(String(limit))}`,
        fallback
      ),
    staleTime: 60_000,
  });
}

/**
 * Satisfaction pie
 */
export type SatisfactionItem = {
  name: string; // Very Satisfied, Satisfied, etc.
  value: number; // percentage 0-100
};

export function useSatisfaction() {
  const fallback: SatisfactionItem[] = [
    { name: "Very Satisfied", value: 45 },
    { name: "Satisfied", value: 30 },
    { name: "Neutral", value: 15 },
    { name: "Unsatisfied", value: 7 },
    { name: "Very Unsatisfied", value: 3 },
  ];
  return useQuery({
    queryKey: ["analytics-satisfaction"],
    queryFn: () => fetchJSONOr<SatisfactionItem[]>("/api/n8n/analytics/satisfaction", fallback),
    staleTime: 60_000,
  });
}

/**
 * LLM performance series
 */
export type LlmPerfItem = {
  date: string;
  latency: number; // seconds
  tokens: number; // average tokens per response
};

export function useLlmPerformance() {
  const fallback: LlmPerfItem[] = [
    { date: "2025-05-01", latency: 1.2, tokens: 320 },
    { date: "2025-05-02", latency: 1.3, tokens: 290 },
    { date: "2025-05-03", latency: 1.1, tokens: 350 },
    { date: "2025-05-04", latency: 1.4, tokens: 380 },
    { date: "2025-05-05", latency: 1.2, tokens: 410 },
  ];
  return useQuery({
    queryKey: ["analytics-llm-performance"],
    queryFn: () => fetchJSONOr<LlmPerfItem[]>("/api/n8n/analytics/llm-performance", fallback),
    staleTime: 60_000,
  });
}

/**
 * Model usage distribution
 */
export type ModelUsageItem = {
  name: string; // model name
  value: number; // percentage 0-100
};

export function useModelUsage() {
  const fallback: ModelUsageItem[] = [
    { name: "GPT-4o", value: 65 },
    { name: "GPT-3.5 Turbo", value: 25 },
    { name: "Claude 3", value: 10 },
  ];
  return useQuery({
    queryKey: ["analytics-model-usage"],
    queryFn: () => fetchJSONOr<ModelUsageItem[]>("/api/n8n/analytics/model-usage", fallback),
    staleTime: 60_000,
  });
}

/**
 * Sync status payload should come from your n8n workflow.
 * Fallback returns a safe default if the endpoint is not available yet.
 */
export type SyncStatus = {
  catalogPct?: number;
  categoriesPct?: number;
  ordersPct?: number;
  lastSyncedAt?: string;
  state?: "idle" | "running" | "error";
  error?: string;
};

export function useSyncStatus() {
  return useQuery({
    queryKey: ["sync-status"],
    queryFn: () =>
      fetchJSONOr<SyncStatus>("/api/n8n/sync/status", {
        catalogPct: 0,
        categoriesPct: 0,
        ordersPct: 0,
        state: "idle",
      }),
    refetchInterval: 5_000,
  });
}