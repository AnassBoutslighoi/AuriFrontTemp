"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import type { TFunction } from "i18next"
import { useSearchParams, useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"

import { Plus, Search, ShoppingBag, ShoppingCart, Store as StoreIcon } from "lucide-react"

import { useStores, type StoreSummary, type StoreStatus, type Platform } from "@/hooks/stores"
import { useTenant } from "@/components/tenant-provider"
import { startShopifyInstallRobust, startWooInstall, startYouCanInstall } from "@/hooks/n8n"

const createAddStoreSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(2, t("stores.errors.nameTooShort", "Name is too short")),
    url: z
      .string()
      .min(3, t("stores.errors.urlRequired", "URL is required"))
      .regex(/^[a-zA-Z0-9.\-:/]+$/, t("stores.errors.invalidUrl", "Invalid URL")),
    platform: z.enum(["shopify", "woocommerce", "youcan"]),
  })

type AddStoreInput = z.infer<ReturnType<typeof createAddStoreSchema>>

export function StoresPage() {
  const { t } = useTranslation()
  const { tenantId } = useTenant()
  const [tab, setTab] = useState<"all" | "shopify" | "woocommerce" | "youcan">("all")
  const [status, setStatus] = useState<StoreStatus>("all")
  const { data: allStores = [] } = useStores()
  const { data: stores = [] } = useStores({ platform: tab === "all" ? "all" : (tab as Platform), status })
  const searchParams = useSearchParams()
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [connectedStoreName, setConnectedStoreName] = useState("")

  // Handle redirect from OAuth flow
  useEffect(() => {
    const status = searchParams.get("status")
    const store = searchParams.get("store")
    const tenantIdParam = searchParams.get("tenant_id")

    if (status === "connected" && store && tenantIdParam) {
      // Show success dialog and toast
      setConnectedStoreName(store)
      setShowSuccessDialog(true)
      
      toast({
        title: t("stores.connectionSuccess", "Store Connected Successfully!"),
        description: t("stores.connectionSuccessDescription", `${store} has been connected to your account.`),
        variant: "default",
      })

      // Clean up URL parameters
      const url = new URL(window.location.href)
      url.searchParams.delete("status")
      url.searchParams.delete("store")
      url.searchParams.delete("tenant_id")
      router.replace(url.pathname + url.search)
    } else if (status === "error") {
      // Show error message
      toast({
        title: t("stores.connectionError", "Connection Failed"),
        description: t("stores.connectionErrorDescription", "Failed to connect the store. Please try again."),
        variant: "destructive",
      })

      // Clean up URL parameters
      const url = new URL(window.location.href)
      url.searchParams.delete("status")
      url.searchParams.delete("store")
      url.searchParams.delete("tenant_id")
      router.replace(url.pathname + url.search)
    }
  }, [searchParams, router, t])

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return stores
    return stores.filter((s) => [s.name, s.url].some((f) => (f || "").toLowerCase().includes(q)))
  }, [stores, searchQuery])

  const counts = useMemo(() => {
    const by = (p: string) => allStores.filter((s) => s.platform === p).length
    return {
      all: allStores.length,
      shopify: by("shopify"),
      woocommerce: by("woocommerce"),
      youcan: by("youcan"),
    }
  }, [allStores])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("stores.title", "Stores")}</h2>
          <p className="text-muted-foreground">
            {t("stores.description", "Manage your connected e-commerce stores.")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AddStoreDialog
            open={isAddStoreOpen}
            onOpenChange={setIsAddStoreOpen}
            onConnected={() => {
              // UI feedback; actual redirect handled by OAuth flow
              toast({ title: t("stores.connecting", "Redirecting to store authorization...") })
            }}
            tenantId={tenantId}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("stores.searchPlaceholder", "Search stores...")}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-48">
          <Select value={status} onValueChange={(v) => setStatus(v as StoreStatus)}>
            <SelectTrigger>
              <SelectValue placeholder={t("stores.status.all", "All")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("stores.status.all", "All")}</SelectItem>
              <SelectItem value="active">{t("stores.status.active", "Active")}</SelectItem>
              <SelectItem value="inactive">{t("stores.status.inactive", "Inactive")}</SelectItem>
              <SelectItem value="connecting">{t("stores.status.connecting", "Connecting")}</SelectItem>
              <SelectItem value="syncing">{t("stores.status.syncing", "Syncing")}</SelectItem>
              <SelectItem value="error">{t("stores.status.error", "Error")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="all">
            {t("stores.tabs.all", "All Stores")} ({counts.all})
          </TabsTrigger>
          <TabsTrigger value="shopify">
            Shopify ({counts.shopify})
          </TabsTrigger>
          <TabsTrigger value="woocommerce">
            WooCommerce ({counts.woocommerce})
          </TabsTrigger>
          <TabsTrigger value="youcan">
            YouCan ({counts.youcan})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 pt-4">
          <StoreGrid items={filtered} onEmptyClick={() => setIsAddStoreOpen(true)} />
        </TabsContent>

        <TabsContent value="shopify" className="space-y-4 pt-4">
          <StoreGrid
            items={filtered.filter((s) => s.platform === "shopify")}
            onEmptyClick={() => setIsAddStoreOpen(true)}
          />
        </TabsContent>

        <TabsContent value="woocommerce" className="space-y-4 pt-4">
          <StoreGrid
            items={filtered.filter((s) => s.platform === "woocommerce")}
            onEmptyClick={() => setIsAddStoreOpen(true)}
          />
        </TabsContent>

        <TabsContent value="youcan" className="space-y-4 pt-4">
          <StoreGrid
            items={filtered.filter((s) => s.platform === "youcan")}
            onEmptyClick={() => setIsAddStoreOpen(true)}
          />
        </TabsContent>
      </Tabs>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              {t("stores.connectionSuccess", "Store Connected Successfully!")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("stores.connectionSuccessDetail", `Great! Your store "${connectedStoreName}" has been successfully connected to your account. You can now start using it with your chatbots.`)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              {t("common.gotIt", "Got it")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function StoreGrid({ items, onEmptyClick }: { items: StoreSummary[]; onEmptyClick: () => void }) {
  const { t } = useTranslation()
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((store) => (
        <StoreCard key={store.id} store={store} />
      ))}
      {items.length === 0 && (
        <Card
          role="button"
          tabIndex={0}
          onClick={onEmptyClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              onEmptyClick()
            }
          }}
          className="flex flex-col items-center justify-center border-dashed p-6 cursor-pointer hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary"
          title={t("stores.addStore", "Add Store")}
        >
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-1 text-lg font-medium">{t("stores.noStoresTitle", "No Stores")}</h3>
          <p className="mb-4 text-center text-sm text-muted-foreground">
            {t("stores.noStoresDescription", "Connect your first store to get started")}
          </p>
        </Card>
      )}
    </div>
  )
}

function StoreCard({ store }: { store: StoreSummary }) {
  const { t } = useTranslation()
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {store.platform === "shopify" && <ShoppingBag className="h-5 w-5 text-primary" />}
            {store.platform === "woocommerce" && <ShoppingCart className="h-5 w-5 text-primary" />}
            {store.platform === "youcan" && <StoreIcon className="h-5 w-5 text-primary" />}
            <CardTitle>{store.name}</CardTitle>
          </div>
          <Badge
            variant={store.status === "active" ? "secondary" : store.status === "error" ? "destructive" : "outline"}
            className={
              store.status === "active"
                ? "bg-green-500 text-white border-transparent"
                : store.status === "connecting" || store.status === "syncing"
                ? "bg-blue-500 text-white border-transparent"
                : undefined
            }
          >
            {store.status
              ? t(`stores.status.${store.status}`, store.status)
              : t("stores.status.inactive", "Inactive")}
          </Badge>
        </div>
        <CardDescription>{store.url}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("stores.platformLabel", "Platform:")}</span>
            <span className="font-medium capitalize">{store.platform}</span>
          </div>
          {typeof store.products === "number" && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("stores.productsLabel", "Products:")}</span>
              <span className="font-medium">{store.products}</span>
            </div>
          )}
          {store.lastSync && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("stores.lastSyncLabel", "Last Sync:")}</span>
              <span className="font-medium">{store.lastSync}</span>
            </div>
          )}
          {typeof store.chatbots === "number" && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("stores.chatbotsLabel", "Chatbots:")}</span>
              <span className="font-medium">{store.chatbots}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/stores/${store.id}`}>{t("stores.manageStore", "Manage Store")}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function AddStoreDialog({
  open,
  onOpenChange,
  onConnected,
  tenantId,
}: {
  open: boolean
  onOpenChange: (next: boolean) => void
  onConnected: () => void
  tenantId?: string
}) {
  const { t } = useTranslation()
  const form = useForm<AddStoreInput>({
    resolver: zodResolver(createAddStoreSchema(t)),
    defaultValues: {
      name: "",
      url: "",
      platform: "shopify",
    },
  })

  function normalizeDomain(raw: string) {
    try {
      const prefixed = raw.startsWith("http") ? raw : `https://${raw}`
      const u = new URL(prefixed)
      // shopify accepts custom domains; if provided, pass full host
      return u.host
    } catch {
      return raw.trim()
    }
  }

  async function onSubmit(values: AddStoreInput) {
    try {
      if (values.platform === "shopify") {
        const shopDomain = normalizeDomain(values.url)
        onOpenChange(false)
        onConnected()
        startShopifyInstallRobust({
          shopDomain,
          tenantId,
          storeName: values.name,
        })
        return
      }
      if (values.platform === "woocommerce") {
        onOpenChange(false)
        onConnected()
        startWooInstall()
        return
      }
      if (values.platform === "youcan") {
        onOpenChange(false)
        onConnected()
        startYouCanInstall()
        return
      }
    } catch (err: any) {
      toast({
        title: t("stores.connectErrorTitle", "Connection failed"),
        description: typeof err?.message === "string" ? err.message : t("stores.connectError", "Unexpected error"),
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t("stores.addStore", "Add Store")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("stores.addNewStore", "Add New Store")}</DialogTitle>
          <DialogDescription>
            {t("stores.connectDescription", "Connect a new e-commerce store to your account.")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("stores.storeName", "Store Name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("stores.storeNamePlaceholder", "My Awesome Store")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("stores.storeUrl", "Store URL / Domain")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "stores.storeUrlPlaceholder",
                        "mystore.com or mystore.myshopify.com"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("stores.platform", "Platform")}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("stores.selectPlatform", "Select platform")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="shopify">Shopify</SelectItem>
                      <SelectItem value="woocommerce">WooCommerce</SelectItem>
                      <SelectItem value="youcan">YouCan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t("common.cancel", "Cancel")}
              </Button>
              <Button type="submit">{t("stores.connectStore", "Connect Store")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
