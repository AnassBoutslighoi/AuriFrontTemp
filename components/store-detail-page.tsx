"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useTranslation } from "react-i18next"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, RefreshCw, ShoppingBag, ShoppingCart, Store as StoreIcon, Plus, MessageSquare } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { useStore } from "@/hooks/stores"
import { useStoreChatbots } from "@/hooks/chatbots"

export function StoreDetailPage({ storeId }: { storeId: string }) {
  const { t } = useTranslation()
  const [isAddChatbotOpen, setIsAddChatbotOpen] = useState(false)

  const { data: store } = useStore(storeId)
  const { data: chatbots = [] } = useStoreChatbots(storeId)

  const name = store?.name || t("stores.unknown", { defaultValue: "Unknown Store" })
  const url = store?.url || "—"
  const platform = store?.platform || "unknown"
  const products = typeof store?.products === "number" ? store?.products : 0
  const lastSync = store?.lastSync || "—"
  const status = store?.status || "pending"

  function getPlatformIcon(p: string) {
    switch (p) {
      case "shopify":
        return <ShoppingBag className="h-5 w-5" />
      case "woocommerce":
        return <ShoppingCart className="h-5 w-5" />
      case "youcan":
        return <StoreIcon className="h-5 w-5" />
      default:
        return <StoreIcon className="h-5 w-5" />
    }
  }

  const headerBadge =
    status === "connected" ? (
      <Badge variant="secondary" className="bg-green-500 text-white border-transparent">
        {t("stores.connected", { defaultValue: "Connected" })}
      </Badge>
    ) : status === "error" ? (
      <Badge variant="destructive">{t("common.error", { defaultValue: "Error" })}</Badge>
    ) : (
      <Badge variant="outline">{t("common.pending", { defaultValue: "Pending" })}</Badge>
    )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            {getPlatformIcon(platform)}
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{name}</h2>
            <p className="text-muted-foreground">
              {url} • {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("stores.syncNow", { defaultValue: "Sync Store" })}
          </Button>
          <Dialog open={isAddChatbotOpen} onOpenChange={setIsAddChatbotOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("chatbots.add", { defaultValue: "Add Chatbot" })}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("chatbots.createTitle", { defaultValue: "Create New Chatbot" })}</DialogTitle>
                <DialogDescription>
                  {t("chatbots.createForStore", { defaultValue: "Create a new chatbot for {{name}}.", name })}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="bot-name">{t("chatbots.name", { defaultValue: "Chatbot Name" })}</Label>
                  <Input id="bot-name" placeholder="Product Assistant" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bot-purpose">{t("chatbots.primaryPurpose", { defaultValue: "Primary Purpose" })}</Label>
                  <Select defaultValue="product-assistant">
                    <SelectTrigger id="bot-purpose">
                      <SelectValue placeholder={t("chatbots.selectPurpose", { defaultValue: "Select purpose" })} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product-assistant">{t("chatbots.purpose.productAssistant", { defaultValue: "Product Assistant" })}</SelectItem>
                      <SelectItem value="customer-support">{t("chatbots.purpose.customerSupport", { defaultValue: "Customer Support" })}</SelectItem>
                      <SelectItem value="order-tracking">{t("chatbots.purpose.orderTracking", { defaultValue: "Order Tracking" })}</SelectItem>
                      <SelectItem value="general-purpose">{t("chatbots.purpose.generalPurpose", { defaultValue: "General Purpose" })}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddChatbotOpen(false)}>
                  {t("common.cancel", { defaultValue: "Cancel" })}
                </Button>
                <Button onClick={() => setIsAddChatbotOpen(false)}>{t("chatbots.create", { defaultValue: "Create Chatbot" })}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">{t("stores.overview", { defaultValue: "Overview" })}</TabsTrigger>
          <TabsTrigger value="chatbots">{t("app.chatbots", { defaultValue: "Chatbots" })}</TabsTrigger>
          <TabsTrigger value="catalog">{t("stores.catalog", { defaultValue: "Catalog" })}</TabsTrigger>
          <TabsTrigger value="settings">{t("stores.settings", { defaultValue: "Settings" })}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{t("stores.metrics.products", { defaultValue: "Products" })}</CardTitle>
                  {headerBadge}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products}</div>
                <p className="text-xs text-muted-foreground">
                  {t("stores.lastSynced", { defaultValue: "Last synced" })}: {lastSync}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t("stores.metrics.platform", { defaultValue: "Platform" })}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{platform}</div>
                <p className="text-xs text-muted-foreground">{t("stores.url", { defaultValue: "URL" })}: {url}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t("stores.metrics.sync", { defaultValue: "Sync Status" })}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{t("stores.catalog", { defaultValue: "Catalog" })}</p>
                  <p className="text-sm font-medium">—</p>
                </div>
                <Progress value={products ? 100 : 0} />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>{t("stores.syncedProducts", { defaultValue: "Products synced", count: products })}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t("stores.metrics.chatbots", { defaultValue: "Chatbots" })}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatbots.length}</div>
                <p className="text-xs text-muted-foreground">
                  {chatbots.length > 0 ? t("stores.allActive", { defaultValue: "All active" }) : t("stores.none", { defaultValue: "None" })}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chatbots" className="space-y-4 pt-4">
          {chatbots.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {chatbots.map((bot) => (
                <Card key={bot.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <CardTitle>{bot.name}</CardTitle>
                      </div>
                      <Badge
                        variant="outline"
                        className={(bot.status || "active") === "active" ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300" : undefined}
                      >
                        {String(bot.status || "active").replace(/^\w/, (c) => c.toUpperCase())}
                      </Badge>
                    </div>
                    <CardDescription>{t("chatbots.connectedTo", { defaultValue: "Connected to {{name}}", name })}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t("chatbots.metrics.messagesToday", { defaultValue: "Messages today:" })}</span>
                        <span className="font-medium">{bot.messagesPerDay ?? 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t("chatbots.metrics.avgResponse", { defaultValue: "Avg. response time:" })}</span>
                        <span className="font-medium">{bot.responseTime || "—"}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2">
                    <Button variant="outline" className="flex-1">
                      {t("chatbots.test", { defaultValue: "Test" })}
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href={`/chatbots/${bot.id}`}>{t("chatbots.configure", { defaultValue: "Configure" })}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              <Card className="flex flex-col items-center justify-center border-dashed p-6">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-1 text-lg font-medium">{t("chatbots.addNew", { defaultValue: "Add New Chatbot" })}</h3>
                <p className="mb-4 text-center text-sm text-muted-foreground">{t("chatbots.addNewDesc", { defaultValue: "Create another chatbot for this store" })}</p>
                <Button onClick={() => setIsAddChatbotOpen(true)}>{t("chatbots.create", { defaultValue: "Create Chatbot" })}</Button>
              </Card>
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center p-10">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-medium">{t("chatbots.noneTitle", { defaultValue: "No Chatbots Yet" })}</h3>
              <p className="mb-6 text-center text-muted-foreground">
                {t("chatbots.noneDesc", { defaultValue: "Create your first chatbot for this store to start engaging with customers." })}
              </p>
              <Button onClick={() => setIsAddChatbotOpen(true)}>{t("chatbots.createFirst", { defaultValue: "Create Your First Chatbot" })}</Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="catalog" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("stores.catalog", { defaultValue: "Catalog" })}</CardTitle>
              <CardDescription>{t("stores.catalogDesc", { defaultValue: "Browse and manage your store's product catalog." })}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-6 text-sm text-muted-foreground">
                {t("stores.catalogComingSoon", { defaultValue: "Catalog view will appear here once implemented." })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("stores.settings", { defaultValue: "Store Settings" })}</CardTitle>
              <CardDescription>{t("stores.settingsDesc", { defaultValue: "Configure your store settings and connection details." })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">{t("stores.storeName", { defaultValue: "Store Name" })}</Label>
                <Input id="store-name" defaultValue={name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-url">{t("stores.storeUrl", { defaultValue: "Store URL" })}</Label>
                <Input id="store-url" defaultValue={url} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sync-frequency">{t("stores.syncFrequency", { defaultValue: "Sync Frequency" })}</Label>
                <Select defaultValue="hourly">
                  <SelectTrigger id="sync-frequency">
                    <SelectValue placeholder={t("stores.selectFrequency", { defaultValue: "Select frequency" })} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15min">{t("stores.freq.15", { defaultValue: "Every 15 minutes" })}</SelectItem>
                    <SelectItem value="hourly">{t("stores.freq.hourly", { defaultValue: "Hourly" })}</SelectItem>
                    <SelectItem value="daily">{t("stores.freq.daily", { defaultValue: "Daily" })}</SelectItem>
                    <SelectItem value="manual">{t("stores.freq.manual", { defaultValue: "Manual only" })}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="text-destructive">
                {t("stores.disconnect", { defaultValue: "Disconnect Store" })}
              </Button>
              <Button>{t("common.save", { defaultValue: "Save Changes" })}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
