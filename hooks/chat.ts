"use client";

import { useMutation } from "@tanstack/react-query";
import { useTenant } from "@/components/tenant-provider";

const CHAT_PATH = "/api/n8n/fe4ced88-7675-4a72-ab9d-60eb4344e235";

export type ChatPayload = {
  message: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tenant_id?: string;
};

function extractReply(data: any): string {
  if (!data) return "No response";
  if (typeof data === "string") return data;
  if (typeof data.reply === "string") return data.reply;
  if (typeof data.message === "string") return data.message;
  if (Array.isArray(data.messages) && data.messages.length) {
    const last = data.messages[data.messages.length - 1];
    if (typeof last === "string") return last;
    if (last?.content) return String(last.content);
  }
  try {
    return JSON.stringify(data);
  } catch {
    return "Unsupported response format";
  }
}

export function useChat() {
  const { tenantId } = useTenant();

  return useMutation({
    mutationFn: async (payload: ChatPayload) => {
      const res = await fetch(CHAT_PATH, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tenant_id: payload.tenant_id ?? tenantId,
          ...payload,
        }),
      });

      const contentType = res.headers.get("content-type") || "";

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || `Chat request failed with ${res.status}`);
      }

      if (contentType.includes("application/json")) {
        const json = await res.json();
        return { raw: json, reply: extractReply(json) };
      }

      const text = await res.text();
      return { raw: text, reply: text || "No response" };
    },
  });
}