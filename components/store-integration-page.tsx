"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, RefreshCw, ShoppingBag, ShoppingCart, Store } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function StoreIntegrationPage() {
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
                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Connected
                </Badge>
              </div>
              <CardDescription>Your WooCommerce store is connected and syncing data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">MyAwesomeStore.com</p>
                      <p className="text-sm text-muted-foreground">Last synced: 12 minutes ago</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Now
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Catalog Sync</p>
                  <p className="text-sm font-medium">100%</p>
                </div>
                <Progress value={100} />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>All 128 products synced successfully</span>
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
                  <span>All 12 categories synced successfully</span>
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
                  <span>All 56 recent orders synced successfully</span>
                </div>
              </div>
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
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <CardTitle>Shopify Integration</CardTitle>
              </div>
              <CardDescription>Connect your Shopify store to enable AI chatbot functionality.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-medium">Connect Shopify Store</h3>
              <p className="mt-2 text-center text-muted-foreground">
                Link your Shopify store to enable product catalog access and order management for your chatbot.
              </p>
              <Button className="mt-6">Connect Shopify</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="youcan" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                <CardTitle>YouCan Integration</CardTitle>
              </div>
              <CardDescription>Connect your YouCan store to enable AI chatbot functionality.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Store className="h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-medium">Connect YouCan Store</h3>
              <p className="mt-2 text-center text-muted-foreground">
                Link your YouCan store to enable product catalog access and order management for your chatbot.
              </p>
              <Button className="mt-6">Connect YouCan</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
