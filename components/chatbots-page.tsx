"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useTranslation } from "react-i18next"

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
import { Plus, Search, MessageSquare, ShoppingBag } from "lucide-react"

import { useChatbots } from "@/hooks/chatbots"
import { useStores } from "@/hooks/stores"

export function ChatbotsPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddChatbotOpen, setIsAddChatbotOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState("")

  const { data: chatbots = [] } = useChatbots()
  const { data: stores = [] } = useStores()

  const filteredChatbots = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return chatbots
    return chatbots.filter(
      (bot) =>
        bot.name.toLowerCase().includes(q) ||
        (bot.storeName || "").toLowerCase().includes(q),
    )
  }, [chatbots, searchQuery])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("app.chatbots", { defaultValue: "Chatbots" })}</h2>
          <p className="text-muted-foreground">{t("chatbots.description", { defaultValue: "Manage your AI chatbots across all stores." })}</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddChatbotOpen} onOpenChange={setIsAddChatbotOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("chatbots.create", { defaultValue: "Create Chatbot" })}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("chatbots.createTitle", { defaultValue: "Create New Chatbot" })}</DialogTitle>
                <DialogDescription>
                  {t("chatbots.createDesc", { defaultValue: "Create a new AI chatbot for one of your stores." })}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="bot-name">{t("chatbots.name", { defaultValue: "Chatbot Name" })}</Label>
                  <Input id="bot-name" placeholder="Product Assistant" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="store-select">{t("chatbots.selectStore", { defaultValue: "Select Store" })}</Label>
                  <Select value={selectedStore} onValueChange={setSelectedStore}>
                    <SelectTrigger id="store-select">
                      <SelectValue placeholder={t("chatbots.selectStorePlaceholder", { defaultValue: "Select a store" })} />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name} ({store.platform})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("chatbots.searchPlaceholder", { defaultValue: "Search chatbots..." })}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            {t("chatbots.tabs.all", { defaultValue: "All Chatbots" })} ({chatbots.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredChatbots.map((bot) => (
              <ChatbotCard key={bot.id} bot={bot} />
            ))}
            <Card className="flex flex-col items-center justify-center border-dashed p-6">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-1 text-lg font-medium">{t("chatbots.createCtaTitle", { defaultValue: "Create New Chatbot" })}</h3>
              <p className="mb-4 text-center text-sm text-muted-foreground">
                {t("chatbots.createCtaDesc", { defaultValue: "Add a new chatbot to one of your stores" })}
              </p>
              <Button onClick={() => setIsAddChatbotOpen(true)}>{t("chatbots.create", { defaultValue: "Create Chatbot" })}</Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ChatbotCard({ bot }: { bot: any }) {
  const storeLabel = bot.storeName || "—"
  const status = bot.status || "active"
  const messagesPerDay = typeof bot.messagesPerDay === "number" ? bot.messagesPerDay : 0
  const responseTime = bot.responseTime || "—"

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle>{bot.name}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className={status === "active" ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300" : undefined}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          <ShoppingBag className="h-3 w-3" />
          {storeLabel}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Messages today:</span>
            <span className="font-medium">{messagesPerDay}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Avg. response time:</span>
            <span className="font-medium">{responseTime}</span>
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
  )
}
