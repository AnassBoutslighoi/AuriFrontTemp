"use client";

import React, { useEffect, useState } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { arSA, enUS } from "@clerk/localizations";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider, i18n } from "@/i18n/config";
import { TenantProvider } from "@/components/tenant-provider";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [clerkLoc, setClerkLoc] = useState(enUS);

  useEffect(() => {
    const apply = (lng?: string) => {
      const lang = lng || i18n.language || process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "ar";
      const isRTL = lang.startsWith("ar");
      if (typeof document !== "undefined") {
        document.documentElement.lang = lang;
        document.documentElement.dir = isRTL ? "rtl" : "ltr";
      }
      setClerkLoc(isRTL ? arSA : enUS);
    };
    apply();
    i18n.on("languageChanged", apply);
    return () => {
      i18n.off("languageChanged", apply);
    };
  }, []);

  return (
    <ClerkProvider
      localization={clerkLoc}
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in"}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/sign-up"}
    >
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <TenantProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </TenantProvider>
        </QueryClientProvider>
      </I18nProvider>
    </ClerkProvider>
  );
}