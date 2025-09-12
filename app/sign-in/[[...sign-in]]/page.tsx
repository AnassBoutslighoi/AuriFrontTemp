"use client";

import { SignIn } from "@clerk/nextjs";
import { i18n } from "@/i18n/config";

/**
 * Clerk localization + direction
 * - If current app language is Arabic, render Clerk in RTL.
 * - Otherwise render in LTR (and add `clerk-ltr` helper class).
 */
export default function SignInPage() {
  const isRTL =
    typeof document !== "undefined"
      ? document.documentElement.dir === "rtl"
      : (i18n.language || "ar").startsWith("ar");

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4">
      <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "w-full flex items-center justify-center" : "clerk-ltr w-full flex items-center justify-center"}>
        <SignIn
          appearance={{ elements: { card: "shadow-lg border" } }}
          redirectUrl="/"
        />
      </div>
    </div>
  );
}