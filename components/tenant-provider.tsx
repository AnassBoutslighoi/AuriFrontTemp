"use client";

import React, { createContext, useContext, useMemo, useEffect } from "react";
import { useValidateJwt } from "@/hooks/n8n";

export type TenantBranding = {
  logoUrl?: string;
  primaryColor?: string; // hex (#RRGGBB) or css color
};

export type TenantContextType = {
  tenantId?: string;
  tenantName?: string;
  branding?: TenantBranding;
  isLoading: boolean;
  error?: string;
};

const TenantContext = createContext<TenantContextType>({
  isLoading: true,
});

function hexToHslTuple(hex: string): [number, number, number] | null {
  let c = hex.trim();
  if (c.startsWith("#")) c = c.slice(1);
  if (c.length === 3) {
    c = c
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  if (c.length !== 6) return null;
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = h / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useValidateJwt();

  const value = useMemo<TenantContextType>(() => {
    return {
      tenantId: data?.tenant_id,
      tenantName: data?.tenant_name,
      branding: data?.branding,
      isLoading,
      error: error ? (error as any)?.message || "Failed to validate session" : undefined,
    };
  }, [data, isLoading, error]);

  // Apply tenant primary color to CSS vars expected by shadcn/tailwind (HSL components)
  useEffect(() => {
    if (typeof document === "undefined") return;
    const color = value.branding?.primaryColor;
    if (!color) return;

    // Try parse hex -> HSL components, otherwise set a fallback CSS color string
    const hsl = color.startsWith("#") ? hexToHslTuple(color) : null;

    if (hsl) {
      const [h, s, l] = hsl;
      document.documentElement.style.setProperty("--primary", `${h} ${s}% ${l}%`);
      document.documentElement.style.setProperty("--ring", `${h} ${s}% ${l}%`);
    } else {
      // If not hex, set a fallback var that can be used by custom styles if needed
      document.documentElement.style.setProperty("--tenant-primary", color);
    }
  }, [value.branding?.primaryColor]);

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  return useContext(TenantContext);
}