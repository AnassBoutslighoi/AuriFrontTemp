"use client"

import { useState, useEffect } from "react"
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
import { Plus, Search, ShoppingBag, ShoppingCart, Store , Store as StoreIcon } from "lucide-react"
import Link from "next/link"

type Store = {
  id: string
  name: string
  url: string
  platform: string
  status: "connected" | "error"
  products: number
  lastSync: string
  chatbots: number
}

export function StoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false)
  const [newStorePlatform, setNewStorePlatform] = useState("shopify")

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_STORE_SERVICE_URL}/v1/store`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data: Store[]) => setStores(data))
      .catch(console.error)
  }, [])

  const filtered = stores.filter((s) =>
    [s.name, s.url].some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Stores</h2>
          <p className="text-muted-foreground">Manage your connected e-commerce stores.</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddStoreOpen} onOpenChange={setIsAddStoreOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Store
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Store</DialogTitle>
                <DialogDescription>Connect a new e-commerce store to your account.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input id="store-name" placeholder="My Awesome Store" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="store-url">Store URL</Label>
                  <Input id="store-url" placeholder="mystore.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={newStorePlatform} onValueChange={setNewStorePlatform}>
                    <SelectTrigger id="platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shopify">Shopify</SelectItem>
                      <SelectItem value="woocommerce">WooCommerce</SelectItem>
                      <SelectItem value="youcan">YouCan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddStoreOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddStoreOpen(false)}>Connect Store</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stores..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Stores ({stores.length})</TabsTrigger>
          <TabsTrigger value="shopify">
            Shopify ({stores.filter((s) => s.platform === "shopify").length})
          </TabsTrigger>
          <TabsTrigger value="woocommerce">
            WooCommerce ({stores.filter((s) => s.platform === "woocommerce").length})
          </TabsTrigger>
          <TabsTrigger value="youcan">
            YouCan ({stores.filter((s) => s.platform === "youcan").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shopify" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered
              .filter((s) => s.platform === "shopify")
              .map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="woocommerce" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered
              .filter((s) => s.platform === "woocommerce")
              .map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="youcan" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered
              .filter((s) => s.platform === "youcan")
              .map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StoreCard({ store }: { store: Store }) {
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
            variant={store.status === "connected" ? "secondary" : "destructive"}
            className={store.status === "connected" ? "bg-green-500 text-white border-transparent" : undefined}
          >
            {store.status === "connected" ? "Connected" : "Error"}
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
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Products:</span>
            <span className="font-medium">{store.products}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Last Sync:</span>
            <span className="font-medium">{store.lastSync}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Chatbots:</span>
            <span className="font-medium">{store.chatbots}</span>
          </div>
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
