"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, RefreshCw, ShoppingBag, ShoppingCart, Store } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { startShopifyInstall, startWooInstall, startYouCanInstall, useInitialDataSync } from "@/hooks/n8n"
import { toast } from "@/components/ui/use-toast"
import { useStoreConnectionsStatus, useSyncLogs, useStartInitialSync } from "@/hooks/stores"

function StatusBadge({ connected, error }: { connected: boolean; error?: string }) {
  if (error) {
    return <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300">Error</Badge>
  }
  if (connected) {
    return <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">Connected</Badge>
  }
  return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">Not Connected</Badge>
}

function Logs({ platform }: { platform: "shopify" | "woocommerce" | "youcan" }) {
  const { data: logs = [] } = useSyncLogs(platform, 10)
  if (!logs.length) return null
  return (
    <div className="rounded-lg border p-3">
      <p className="text-sm font-medium mb-2">Recent logs</p>
      <div className="space-y-1 max-h-40 overflow-auto">
        {logs.map((l) => (
          <div key={l.id} className="text-xs flex gap-2">
            <span className={l.level === "error" ? "text-red-600" : l.level === "warn" ? "text-yellow-600" : "text-muted-foreground"}>
              [{l.level.toUpperCase()}]
            </span>
            <span className="text-muted-foreground">{new Date(l.at).toLocaleString()}</span>
            <span>{l.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function StoreIntegrationPage() {
  const { mutate: initialSync, isPending } = useInitialDataSync()
  const { data: status } = useStoreConnectionsStatus()
  const { mutateAsync: startWooSync, isPending: wooBusy } = useStartInitialSync("woocommerce")
  const { mutateAsync: startShopSync, isPending: shopBusy } = useStartInitialSync("shopify")
  const { mutateAsync: startYouCanSync, isPending: youBusy } = useStartInitialSync("youcan")

  const wc = status?.items.find((i) => i.platform === "woocommerce")
  const sh = status?.items.find((i) => i.platform === "shopify")
  const yc = status?.items.find((i) => i.platform === "youcan")

  const handleSync = async (platform: "shopify" | "woocommerce" | "youcan") => {
    try {
      if (platform === "woocommerce") await startWooSync()
      if (platform === "shopify") await startShopSync()
      if (platform === "youcan") await startYouCanSync()
      toast({ title: "Sync started", description: `Initial ${platform} sync triggered.` })
    } catch (err: any) {
      toast({
        title: "Sync failed",
        description: typeof err?.message === "string" ? err.message : "Unexpected error",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Store Integration</h2>
        <p className="text-muted-foreground">Connect your e-commerce store to enable AI chatbot functionality.</p>
      </div>

      <Tabs defaultValue="woocommerce">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="woocommerce">WooCommerce</TabsTrigger>
          <TabsTrigger value="shopify">Shopify</TabsTrigger>
          <TabsTrigger value="youcan">YouCan</TabsTrigger>
        </TabsList>

        <TabsContent value="woocommerce" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <CardTitle>WooCommerce Integration</CardTitle>
                </div>
                <StatusBadge connected={!!wc?.connected} error={wc?.error} />
              </div>
              <CardDescription>
                {wc?.connected ? "Your WooCommerce store is connected and syncing data." : "Connect your WooCommerce store."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{wc?.storeName || "No store connected"}</p>
                      <p className="text-sm text-muted-foreground">
                        Last synced: {wc?.lastSyncedAt ? new Date(wc.lastSyncedAt).toLocaleString() : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => startWooInstall()}>
                      Install OAuth
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSync("woocommerce")}
                      disabled={isPending || wooBusy}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Now
                    </Button>
                  </div>
                </div>
              </div>

              <Logs platform="woocommerce" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Disconnect</Button>
              <Button>Configure Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="shopify" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  <CardTitle>Shopify Integration</CardTitle>
                </div>
                <StatusBadge connected={!!sh?.connected} error={sh?.error} />
              </div>
              <CardDescription>Connect your Shopify store to enable AI chatbot functionality.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center py-6">
                <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-medium">{sh?.connected ? sh.storeName : "Connect Shopify Store"}</h3>
                <p className="mt-2 text-center text-muted-foreground">
                  Link your Shopify store to enable product catalog access and order management for your chatbot.
                </p>
                <div className="flex gap-2 mt-6">
                  <Button onClick={() => startShopifyInstall()}>Connect Shopify</Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSync("shopify")}
                    disabled={isPending || shopBusy}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Now
                  </Button>
                </div>
              </div>
              <Logs platform="shopify" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="youcan" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  <CardTitle>YouCan Integration</CardTitle>
                </div>
                <StatusBadge connected={!!yc?.connected} error={yc?.error} />
              </div>
              <CardDescription>Connect your YouCan store to enable AI chatbot functionality.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center py-6">
                <Store className="h-16 w-16 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-medium">{yc?.connected ? yc.storeName : "Connect YouCan Store"}</h3>
                <p className="mt-2 text-center text-muted-foreground">
                  Link your YouCan store to enable product catalog access and order management for your chatbot.
                </p>
                <div className="flex gap-2 mt-6">
                  <Button onClick={() => startYouCanInstall()}>Connect YouCan</Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSync("youcan")}
                    disabled={isPending || youBusy}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Now
                  </Button>
                </div>
              </div>
              <Logs platform="youcan" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
