"use client"

import { useState } from "react"
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
import Link from "next/link"

// Sample chatbot data
const chatbotData = [
  {
    id: "bot-1",
    name: "Fashion Assistant",
    store: { id: "store-1", name: "Fashion Boutique", platform: "shopify" },
    model: "gpt-4o",
    status: "active",
    messagesPerDay: 124,
    responseTime: "1.2s",
  },
  {
    id: "bot-2",
    name: "Order Helper",
    store: { id: "store-1", name: "Fashion Boutique", platform: "shopify" },
    model: "gpt-4o",
    status: "active",
    messagesPerDay: 86,
    responseTime: "1.3s",
  },
  {
    id: "bot-3",
    name: "Tech Support",
    store: { id: "store-2", name: "Tech Gadgets", platform: "woocommerce" },
    model: "gpt-3.5-turbo",
    status: "active",
    messagesPerDay: 152,
    responseTime: "0.9s",
  },
  {
    id: "bot-4",
    name: "Decor Assistant",
    store: { id: "store-3", name: "Home Decor", platform: "youcan" },
    model: "claude-3-opus",
    status: "active",
    messagesPerDay: 78,
    responseTime: "1.5s",
  },
]

// Sample store data for dropdown
const storeData = [
  { id: "store-1", name: "Fashion Boutique", platform: "shopify" },
  { id: "store-2", name: "Tech Gadgets", platform: "woocommerce" },
  { id: "store-3", name: "Home Decor", platform: "youcan" },
  { id: "store-4", name: "Sports Equipment", platform: "shopify" },
]

export function ChatbotsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddChatbotOpen, setIsAddChatbotOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState("")

  // Filter chatbots based on search query
  const filteredChatbots = chatbotData.filter(
    (bot) =>
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.store.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chatbots</h2>
          <p className="text-muted-foreground">Manage your AI chatbots across all stores.</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddChatbotOpen} onOpenChange={setIsAddChatbotOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Chatbot
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Chatbot</DialogTitle>
                <DialogDescription>Create a new AI chatbot for one of your stores.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="bot-name">Chatbot Name</Label>
                  <Input id="bot-name" placeholder="Product Assistant" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="store-select">Select Store</Label>
                  <Select value={selectedStore} onValueChange={setSelectedStore}>
                    <SelectTrigger id="store-select">
                      <SelectValue placeholder="Select a store" />
                    </SelectTrigger>
                    <SelectContent>
                      {storeData.map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name} ({store.platform})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chatbots..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Chatbots ({chatbotData.length})</TabsTrigger>
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
              <h3 className="mb-1 text-lg font-medium">Create New Chatbot</h3>
              <p className="mb-4 text-center text-sm text-muted-foreground">Add a new chatbot to one of your stores</p>
              <Button onClick={() => setIsAddChatbotOpen(true)}>Create Chatbot</Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ChatbotCard({ bot }: { bot: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle>{bot.name}</CardTitle>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
            Active
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          <ShoppingBag className="h-3 w-3" />
          {bot.store.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Messages today:</span>
            <span className="font-medium">{bot.messagesPerDay}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Avg. response time:</span>
            <span className="font-medium">{bot.responseTime}</span>
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
