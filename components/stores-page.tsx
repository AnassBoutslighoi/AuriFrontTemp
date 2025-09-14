"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"

import { Plus, Search, ShoppingBag, ShoppingCart, Store as StoreIcon } from "lucide-react"

import { useStores, type StoreSummary } from "@/hooks/stores"
import { useTenant } from "@/components/tenant-provider"
import { startShopifyInstallRobust, startWooInstall, startYouCanInstall } from "@/hooks/n8n"

const AddStoreSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  url: z
    .string()
    .min(3, "URL is required")
    .regex(/^[a-zA-Z0-9.\-:/]+$/, "Invalid URL"),
  platform: z.enum(["shopify", "woocommerce", "youcan"]),
})

type AddStoreInput = z.infer<typeof AddStoreSchema>

export function StoresPage() {
  const { t } = useTranslation()
  const { data: stores = [] } = useStores()
  const { tenantId } = useTenant()

  const [searchQuery, setSearchQuery] = useState("")
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return stores
    return stores.filter((s) => [s.name, s.url].some((f) => (f || "").toLowerCase().includes(q)))
  }, [stores, searchQuery])

  const counts = useMemo(() => {
    const by = (p: string) => stores.filter((s) => s.platform === p).length
    return {
      all: stores.length,
      shopify: by("shopify"),
      woocommerce: by("woocommerce"),
      youcan: by("youcan"),
    }
  }, [stores])

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
      </div>

      <Tabs defaultValue="all">
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
    </div>
  )
}

function StoreGrid({ items, onEmptyClick }: { items: StoreSummary[]; onEmptyClick: () => void }) {
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
          title="Add Store"
        >
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-1 text-lg font-medium">No Stores</h3>
          <p className="mb-4 text-center text-sm text-muted-foreground">Connect your first store to get started</p>
        </Card>
      )}
    </div>
  )
}

function StoreCard({ store }: { store: StoreSummary }) {
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
            variant={store.status === "connected" ? "secondary" : store.status === "error" ? "destructive" : "outline"}
            className={
              store.status === "connected" ? "bg-green-500 text-white border-transparent" : undefined
            }
          >
            {store.status === "connected" ? "Connected" : store.status === "error" ? "Error" : "Pending"}
          </Badge>
        </div>
        <CardDescription>{store.url}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Platform:</span>
            <span className="font-medium capitalize">{store.platform}</span>
          </div>
          {typeof store.products === "number" && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Products:</span>
              <span className="font-medium">{store.products}</span>
            </div>
          )}
          {store.lastSync && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Sync:</span>
              <span className="font-medium">{store.lastSync}</span>
            </div>
          )}
          {typeof store.chatbots === "number" && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Chatbots:</span>
              <span className="font-medium">{store.chatbots}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/stores/${store.id}`}>Manage Store</Link>
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
    resolver: zodResolver(AddStoreSchema),
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
                    <Input placeholder="My Awesome Store" {...field} />
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
                    <Input placeholder="mystore.com or mystore.myshopify.com" {...field} />
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
