"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTenant } from "@/components/tenant-provider";
import { APP_URL } from "@/lib/config";
import { toast } from "@/components/ui/use-toast";
import { Copy, Globe2, Languages } from "lucide-react";

export function EmbedCodePage() {
  const { tenantId } = useTenant();
  const [locale, setLocale] = useState<string>(
    (typeof document !== "undefined" ? document.documentElement.lang : "") || "ar"
  );

  const iframeCode = useMemo(() => {
    const url = `${APP_URL}/widget/iframe?tenant_id=${encodeURIComponent(
      tenantId || ""
    )}&locale=${encodeURIComponent(locale)}`;
    return `<iframe
  src="${url}"
  style="border:none;position:fixed;bottom:20px;right:20px;width:360px;height:560px;z-index:99999;"
  allow="clipboard-write; microphone; autoplay"
  loading="lazy"
></iframe>`;
  }, [tenantId, locale]);

  const scriptCode = useMemo(() => {
    return `(function(){
  var tenantId = ${JSON.stringify(tenantId || "")};
  var locale = ${JSON.stringify(locale)};
  var origin = ${JSON.stringify(APP_URL)};
  if(!tenantId){ console.warn("[Aurify Chatbot] Missing tenant_id"); return; }

  function createIframe() {
    var iframe = document.createElement("iframe");
    iframe.src = origin + "/widget/iframe?tenant_id=" + encodeURIComponent(tenantId) + "&locale=" + encodeURIComponent(locale);
    iframe.style.border = "none";
    iframe.style.position = "fixed";
    iframe.style.bottom = "20px";
    iframe.style.right = "20px";
    iframe.style.width = "360px";
    iframe.style.height = "560px";
    iframe.style.zIndex = "99999";
    iframe.loading = "lazy";
    document.body.appendChild(iframe);
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    createIframe();
  } else {
    window.addEventListener("DOMContentLoaded", createIframe);
  }
})();`;
  }, [tenantId, locale]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied", description: "Embed code copied to clipboard" });
    } catch (e: any) {
      toast({ title: "Copy failed", description: e?.message || "Unexpected error", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chatbot Embedding</h2>
          <p className="text-muted-foreground">
            Generate bilingual embed code for your store. The widget auto-switches RTL/LTR based on the active locale.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Embed Settings</CardTitle>
          <CardDescription>Configure tenant and locale to generate the proper snippet.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tenantId">Tenant ID</Label>
              <Input id="tenantId" value={tenantId || ""} readOnly />
              {!tenantId && (
                <p className="text-xs text-muted-foreground">
                  Tenant ID not available yet. Sign in and ensure JWT validation succeeds.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="locale">Locale</Label>
              <div className="flex gap-2">
                <Input id="locale" value={locale} onChange={(e) => setLocale(e.target.value)} />
                <Button type="button" variant="outline" onClick={() => setLocale("ar")}>
                  <Languages className="h-4 w-4 mr-1" />
                  AR
                </Button>
                <Button type="button" variant="outline" onClick={() => setLocale("en")}>
                  <Globe2 className="h-4 w-4 mr-1" />
                  EN
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Use "ar" for Arabic (RTL) or "en" for English (LTR).
              </p>
            </div>
          </div>

          <Tabs defaultValue="script" className="mt-2">
            <TabsList className="grid w-full grid-cols-2 md:w-[320px]">
              <TabsTrigger value="script">Script Snippet</TabsTrigger>
              <TabsTrigger value="iframe">Iframe Snippet</TabsTrigger>
            </TabsList>
            <TabsContent value="script" className="space-y-2 pt-4">
              <Textarea className="font-mono text-xs min-h-[180px]" value={`<script>\n${scriptCode}\n</script>`} readOnly />
              <div className="flex justify-end">
                <Button variant="secondary" onClick={() => copy(`<script>\n${scriptCode}\n</script>`)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Script
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="iframe" className="space-y-2 pt-4">
              <Textarea className="font-mono text-xs min-h-[160px]" value={iframeCode} readOnly />
              <div className="flex justify-end">
                <Button variant="secondary" onClick={() => copy(iframeCode)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Iframe
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}