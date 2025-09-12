"use client";

import { SignUp } from "@clerk/nextjs";
import { i18n } from "@/i18n/config";

/**
 * Clerk localization + direction for Sign Up
 * - RTL when app language is Arabic, LTR otherwise.
 */
export default function SignUpPage() {
  const isRTL =
    typeof document !== "undefined"
      ? document.documentElement.dir === "rtl"
      : (i18n.language || "ar").startsWith("ar");

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4">
      <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "w-full flex items-center justify-center" : "clerk-ltr w-full flex items-center justify-center"}>
        <SignUp
          appearance={{ elements: { card: "shadow-lg border" } }}
          redirectUrl="/"
        />
      </div>
    </div>
  );
}