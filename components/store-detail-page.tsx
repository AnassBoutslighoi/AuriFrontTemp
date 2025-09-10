"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, RefreshCw, ShoppingBag, ShoppingCart, Store, Plus, MessageSquare } from "lucide-react"
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
import Link from "next/link"

// Sample store data
const storesData = {
  "store-1": {
    id: "store-1",
    name: "Fashion Boutique",
    url: "fashionboutique.com",
    platform: "shopify",
    status: "connected",
    products: 128,
    categories: 12,
    orders: 56,
    lastSync: "12 minutes ago",
    chatbots: [
      { id: "bot-1", name: "Fashion Assistant", status: "active" },
      { id: "bot-2", name: "Order Helper", status: "active" },
    ],
  },
  "store-2": {
    id: "store-2",
    name: "Tech Gadgets",
    url: "techgadgets.com",
    platform: "woocommerce",
    status: "connected",
    products: 256,
    categories: 18,
    orders: 89,
    lastSync: "1 hour ago",
    chatbots: [{ id: "bot-3", name: "Tech Support", status: "active" }],
  },
  "store-3": {
    id: "store-3",
    name: "Home Decor",
    url: "homedecor.com",
    platform: "youcan",
    status: "connected",
    products: 89,
    categories: 8,
    orders: 32,
    lastSync: "30 minutes ago",
    chatbots: [{ id: "bot-4", name: "Decor Assistant", status: "active" }],
  },
  "store-4": {
    id: "store-4",
    name: "Sports Equipment",
    url: "sportsequipment.com",
    platform: "shopify",
    status: "error",
    products: 175,
    categories: 15,
    orders: 67,
    lastSync: "Failed 2 hours ago",
    chatbots: [],
  },
}

export function StoreDetailPage({ storeId }: { storeId: string }) {
  const [isAddChatbotOpen, setIsAddChatbotOpen] = useState(false)

  // Get store data based on storeId
  const store = storesData[storeId as keyof typeof storesData] || {
    id: storeId,
    name: "Unknown Store",
    url: "unknown.com",
    platform: "unknown",
    status: "error",
    products: 0,
    categories: 0,
    orders: 0,
    lastSync: "Never",
    chatbots: [],
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "shopify":
        return <ShoppingBag className="h-5 w-5" />
      case "woocommerce":
        return <ShoppingCart className="h-5 w-5" />
      case "youcan":
        return <Store className="h-5 w-5" />
      default:
        return <Store className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            {getPlatformIcon(store.platform)}
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{store.name}</h2>
            <p className="text-muted-foreground">
              {store.url} • {store.platform.charAt(0).toUpperCase() + store.platform.slice(1)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Store
          </Button>
          <Dialog open={isAddChatbotOpen} onOpenChange={setIsAddChatbotOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Chatbot
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Chatbot</DialogTitle>
                <DialogDescription>Create a new chatbot for {store.name}.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="bot-name">Chatbot Name</Label>
                  <Input id="bot-name" placeholder="Product Assistant" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bot-purpose">Primary Purpose</Label>
                  <Select defaultValue="product-assistant">
                    <SelectTrigger id="bot-purpose">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product-assistant">Product Assistant</SelectItem>
                      <SelectItem value="customer-support">Customer Support</SelectItem>
                      <SelectItem value="order-tracking">Order Tracking</SelectItem>
                      <SelectItem value="general-purpose">General Purpose</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddChatbotOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddChatbotOpen(false)}>Create Chatbot</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="chatbots">Chatbots</TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{store.products}</div>
                <p className="text-xs text-muted-foreground">Last synced: {store.lastSync}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{store.categories}</div>
                <p className="text-xs text-muted-foreground">Last synced: {store.lastSync}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{store.orders}</div>
                <p className="text-xs text-muted-foreground">Last synced: {store.lastSync}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Chatbots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{store.chatbots.length}</div>
                <p className="text-xs text-muted-foreground">
                  {store.chatbots.length > 0 ? "All active" : "No chatbots"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sync Status</CardTitle>
              <CardDescription>Current status of your store data synchronization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Catalog Sync</p>
                  <p className="text-sm font-medium">100%</p>
                </div>
                <Progress value={100} />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>All {store.products} products synced successfully</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Categories Sync</p>
                  <p className="text-sm font-medium">100%</p>
                </div>
                <Progress value={100} />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>All {store.categories} categories synced successfully</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Orders Sync</p>
                  <p className="text-sm font-medium">100%</p>
                </div>
                <Progress value={100} />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>All {store.orders} recent orders synced successfully</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbots" className="space-y-4 pt-4">
          {store.chatbots.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {store.chatbots.map((bot) => (
                <Card key={bot.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <CardTitle>{bot.name}</CardTitle>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                      >
                        Active
                      </Badge>
                    </div>
                    <CardDescription>Connected to {store.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Model:</span>
                        <span className="font-medium">Custom LLM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Messages today:</span>
                        <span className="font-medium">124</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Avg. response time:</span>
                        <span className="font-medium">1.2s</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2">
                    <Button variant="outline" className="flex-1">
                      Test
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href={`/chatbots/${bot.id}`}>Configure</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              <Card className="flex flex-col items-center justify-center border-dashed p-6">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-1 text-lg font-medium">Add New Chatbot</h3>
                <p className="mb-4 text-center text-sm text-muted-foreground">Create another chatbot for this store</p>
                <Button onClick={() => setIsAddChatbotOpen(true)}>Create Chatbot</Button>
              </Card>
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center p-10">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-medium">No Chatbots Yet</h3>
              <p className="mb-6 text-center text-muted-foreground">
                Create your first chatbot for this store to start engaging with customers.
              </p>
              <Button onClick={() => setIsAddChatbotOpen(true)}>Create Your First Chatbot</Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="catalog" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Catalog</CardTitle>
              <CardDescription>Browse and manage your store's product catalog.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 border-b p-3 font-medium">
                  <div className="col-span-2">Product</div>
                  <div>Category</div>
                  <div>Price</div>
                  <div>Stock</div>
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="grid grid-cols-5 border-b p-3 text-sm">
                    <div className="col-span-2 font-medium">Sample Product {i}</div>
                    <div>Category {(i % 3) + 1}</div>
                    <div>${(19.99 * i).toFixed(2)}</div>
                    <div>{i * 10} in stock</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <Button variant="outline">View All Products</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Settings</CardTitle>
              <CardDescription>Configure your store settings and connection details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input id="store-name" defaultValue={store.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-url">Store URL</Label>
                <Input id="store-url" defaultValue={store.url} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" type="password" defaultValue="••••••••••••••••" />
                <p className="text-xs text-muted-foreground">
                  This is your {store.platform} API key used for synchronization.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sync-frequency">Sync Frequency</Label>
                <Select defaultValue="hourly">
                  <SelectTrigger id="sync-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15min">Every 15 minutes</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="manual">Manual only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="text-destructive">
                Disconnect Store
              </Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
