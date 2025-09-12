"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { i18n } from "@/i18n/config";
import "@/app/globals.css";
import { ChatTestInterface } from "@/components/chat-test-interface";

export default function WidgetIframe() {
  const searchParams = useSearchParams();
  const locale = (searchParams.get("locale") || "ar").toLowerCase();
  const tenantId = searchParams.get("tenant_id") || "";

  useEffect(() => {
    // Set language and direction for bilingual support
    i18n.changeLanguage(locale);
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale.startsWith("ar") ? "rtl" : "ltr";
    }
  }, [locale]);

  // Minimal styles to make the widget standalone
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-2">
        <ChatTestInterface
          greeting={
            locale.startsWith("ar")
              ? "مرحبًا! كيف يمكنني مساعدتك اليوم؟"
              : "Hello! How can I help you today?"
          }
          model="gpt-4o"
        />
        {/* Tenant id is passed through to n8n in the chat hook via TenantProvider when in the app.
           For the public widget iframe, backend should accept tenant_id from the payload already.
           We keep it here to ensure it's captured in the URL for observability if needed. */}
        <input type="hidden" value={tenantId} readOnly aria-hidden />
      </div>
    </div>
  );
}