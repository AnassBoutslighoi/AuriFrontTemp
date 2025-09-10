"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Bot, BrainCircuit, Globe, MessageSquare, Settings, ShoppingBag } from "lucide-react"

// Sample chatbot data
const chatbotsData = {
  "bot-1": {
    id: "bot-1",
    name: "Fashion Assistant",
    store: { id: "store-1", name: "Fashion Boutique", platform: "shopify" },
    model: "gpt-4o",
    status: "active",
    greeting: "Hello! I'm your Fashion Boutique assistant. How can I help you find the perfect outfit today?",
    language: "english",
    temperature: 0.7,
    maxTokens: 1024,
    systemPrompt:
      "You are a helpful fashion assistant for Fashion Boutique. Your goal is to help customers find clothing items, answer questions about fashion, sizes, materials, and provide a pleasant shopping experience. Be friendly, knowledgeable about fashion trends, and helpful.",
    features: {
      productSearch: true,
      orderTracking: true,
      productRecommendations: true,
      faqAnswers: true,
      humanHandoff: true,
      ragEnabled: true,
    },
  },
  "bot-2": {
    id: "bot-2",
    name: "Order Helper",
    store: { id: "store-1", name: "Fashion Boutique", platform: "shopify" },
    model: "gpt-4o",
    status: "active",
    greeting:
      "Hi there! I'm the Order Helper for Fashion Boutique. I can help you track orders, manage returns, and answer shipping questions.",
    language: "english",
    temperature: 0.5,
    maxTokens: 1024,
    systemPrompt:
      "You are an order management assistant for Fashion Boutique. Your goal is to help customers track their orders, process returns and exchanges, and answer questions about shipping and delivery. Be efficient, accurate, and helpful.",
    features: {
      productSearch: false,
      orderTracking: true,
      productRecommendations: false,
      faqAnswers: true,
      humanHandoff: true,
      ragEnabled: true,
    },
  },
  "bot-3": {
    id: "bot-3",
    name: "Tech Support",
    store: { id: "store-2", name: "Tech Gadgets", platform: "woocommerce" },
    model: "gpt-3.5-turbo",
    status: "active",
    greeting: "Welcome to Tech Gadgets support! How can I assist with your tech questions today?",
    language: "english",
    temperature: 0.3,
    maxTokens: 2048,
    systemPrompt:
      "You are a technical support assistant for Tech Gadgets store. Your goal is to help customers with technical questions about products, troubleshooting, and product recommendations. Be technical but explain concepts clearly, and be helpful.",
    features: {
      productSearch: true,
      orderTracking: false,
      productRecommendations: true,
      faqAnswers: true,
      humanHandoff: true,
      ragEnabled: true,
    },
  },
  "bot-4": {
    id: "bot-4",
    name: "Decor Assistant",
    store: { id: "store-3", name: "Home Decor", platform: "youcan" },
    model: "claude-3-opus",
    status: "active",
    greeting:
      "Hello! I'm your Home Decor virtual assistant. How can I help you find the perfect items for your home today?",
    language: "english",
    temperature: 0.8,
    maxTokens: 1024,
    systemPrompt:
      "You are a home decoration assistant for Home Decor store. Your goal is to help customers find home decoration items, provide design advice, and answer questions about products. Be creative, inspirational, and helpful.",
    features: {
      productSearch: true,
      orderTracking: true,
      productRecommendations: true,
      faqAnswers: true,
      humanHandoff: false,
      ragEnabled: true,
    },
  },
}

export function ChatbotDetailPage({ botId }: { botId: string }) {
  // Get bot data based on botId
  const bot = chatbotsData[botId as keyof typeof chatbotsData] || {
    id: botId,
    name: "Unknown Bot",
    store: { id: "unknown", name: "Unknown Store", platform: "unknown" },
    model: "gpt-4o",
    status: "inactive",
    greeting: "Hello! How can I help you?",
    language: "english",
    temperature: 0.7,
    maxTokens: 1024,
    systemPrompt: "You are a helpful e-commerce assistant.",
    features: {
      productSearch: true,
      orderTracking: true,
      productRecommendations: true,
      faqAnswers: true,
      humanHandoff: true,
      ragEnabled: true,
    },
  }

  const [greeting, setGreeting] = useState(bot.greeting)
  const [language, setLanguage] = useState(bot.language)
  const [temperature, setTemperature] = useState(bot.temperature)
  const [maxTokens, setMaxTokens] = useState(bot.maxTokens)
  const [systemPrompt, setSystemPrompt] = useState(bot.systemPrompt)
  const [features, setFeatures] = useState(bot.features)

  const updateFeature = (feature: keyof typeof features, value: boolean) => {
    setFeatures((prev) => ({ ...prev, [feature]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold tracking-tight">{bot.name}</h2>
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                Active
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <ShoppingBag className="h-4 w-4" />
              <span>{bot.store.name}</span>
              <span className="mx-1">•</span>
              <BrainCircuit className="h-4 w-4" />
              <span>Custom LLM</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Test Chatbot</Button>
          <Button>Save Changes</Button>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-5 lg:w-[750px]">
          <TabsTrigger value="general">
            <Bot className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="language">
            <Globe className="mr-2 h-4 w-4" />
            Language
          </TabsTrigger>
          <TabsTrigger value="llm">
            <BrainCircuit className="mr-2 h-4 w-4" />
            LLM Settings
          </TabsTrigger>
          <TabsTrigger value="features">
            <Settings className="mr-2 h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="test">
            <MessageSquare className="mr-2 h-4 w-4" />
            Test
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure the basic settings for your chatbot.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bot-name">Chatbot Name</Label>
                <Input id="bot-name" defaultValue={bot.name} />
                <p className="text-xs text-muted-foreground">This name will be displayed to your customers.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-association">Associated Store</Label>
                <Select defaultValue={bot.store.id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select store" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={bot.store.id}>{bot.store.name}</SelectItem>
                    <SelectItem value="store-2">Tech Gadgets</SelectItem>
                    <SelectItem value="store-3">Home Decor</SelectItem>
                    <SelectItem value="store-4">Sports Equipment</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  The store this chatbot is associated with. This determines which product catalog the bot can access.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="greeting">Welcome Message</Label>
                <Textarea id="greeting" value={greeting} onChange={(e) => setGreeting(e.target.value)} rows={3} />
                <p className="text-xs text-muted-foreground">
                  This message will be shown when a customer starts a new conversation.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="avatar">Custom Avatar</Label>
                  <Button variant="outline" size="sm">
                    Upload
                  </Button>
                </div>
                <div className="h-24 rounded-md border border-dashed flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No avatar uploaded</p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-show">Auto-show Chatbot</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically show the chatbot after 30 seconds on page.
                  </p>
                </div>
                <Switch id="auto-show" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="language" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Language Settings</CardTitle>
              <CardDescription>Configure the language and tone of your chatbot.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primary-language">Primary Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="arabic">Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Conversation Tone</Label>
                <Select defaultValue="friendly">
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">This sets the overall tone of your chatbot's responses.</p>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-translate">Auto-Translation</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically detect and respond in the customer's language.
                  </p>
                </div>
                <Switch id="auto-translate" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="llm" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>LLM Configuration</CardTitle>
              <CardDescription>Configure the Large Language Model powering your chatbot.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <Input
                  id="temperature"
                  type="number"
                  defaultValue={temperature}
                  onChange={(e) => setTemperature(Number.parseFloat(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  The temperature of the model. Lower values make the model more predictable, while higher values make
                  it more creative.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-tokens">Max Tokens</Label>
                <Input
                  id="max-tokens"
                  type="number"
                  defaultValue={maxTokens}
                  onChange={(e) => setMaxTokens(Number.parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  The maximum number of tokens the model can generate in a single response.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  The system prompt guides the model's behavior and provides context for the conversation.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Configuration</CardTitle>
              <CardDescription>Enable or disable specific features for your chatbot.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="product-search">Product Search</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow the chatbot to search for products in your store.
                  </p>
                </div>
                <Switch
                  id="product-search"
                  checked={features.productSearch}
                  onCheckedChange={(value) => updateFeature("productSearch", value)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="order-tracking">Order Tracking</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow the chatbot to track orders and provide shipping information.
                  </p>
                </div>
                <Switch
                  id="order-tracking"
                  checked={features.orderTracking}
                  onCheckedChange={(value) => updateFeature("orderTracking", value)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="product-recommendations">Product Recommendations</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow the chatbot to provide product recommendations based on customer preferences.
                  </p>
                </div>
                <Switch
                  id="product-recommendations"
                  checked={features.productRecommendations}
                  onCheckedChange={(value) => updateFeature("productRecommendations", value)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="faq-answers">FAQ Answers</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow the chatbot to answer frequently asked questions.
                  </p>
                </div>
                <Switch
                  id="faq-answers"
                  checked={features.faqAnswers}
                  onCheckedChange={(value) => updateFeature("faqAnswers", value)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="human-handoff">Human Handoff</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow the chatbot to hand off the conversation to a human agent.
                  </p>
                </div>
                <Switch
                  id="human-handoff"
                  checked={features.humanHandoff}
                  onCheckedChange={(value) => updateFeature("humanHandoff", value)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="rag-enabled">RAG Enabled</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow the chatbot to use Retrieval-Augmented Generation (RAG) for more accurate and context-aware
                    responses.
                  </p>
                </div>
                <Switch
                  id="rag-enabled"
                  checked={features.ragEnabled}
                  onCheckedChange={(value) => updateFeature("ragEnabled", value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Chatbot</CardTitle>
              <CardDescription>Test your chatbot configuration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>This tab is for testing the chatbot.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
