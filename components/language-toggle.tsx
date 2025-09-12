"use client";

import { Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { i18n, setLocale } from "@/i18n/config";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
  const [lng, setLng] = useState<string>(i18n.language || "ar");

  useEffect(() => {
    const handler = () => setLng(i18n.language);
    i18n.on("languageChanged", handler);
    return () => {
      i18n.off("languageChanged", handler);
    };
  }, []);

  const change = (lang: string) => {
    // Centralized locale change: updates i18next, <html lang/dir>, and localStorage.
    setLocale(lang);
  };

  const label = lng?.toUpperCase() === "AR" ? "AR" : "EN";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title={`Language: ${label}`}>
          <Globe className="h-4 w-4" />
          <span className="sr-only">Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => change("ar")}>
          العربية (AR)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => change("en")}>
          English (EN)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}