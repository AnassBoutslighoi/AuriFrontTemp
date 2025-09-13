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
import { ChatTestInterface } from "@/components/chat-test-interface"
import { Slider } from "@/components/ui/slider"
import { Bot, BrainCircuit, Globe, MessageSquare, Settings, Sparkles, Zap } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useSearchParams } from "next/navigation"

export function ChatbotConfigurationPage() {
  const [greeting, setGreeting] = useState("Hello! How can I help you with your shopping today?")
  const [language, setLanguage] = useState("english")
  const [model, setModel] = useState("gpt-4o")
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1024)
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful e-commerce assistant. Your goal is to help customers find products, answer questions about shipping and returns, and provide a pleasant shopping experience. Be friendly, concise, and helpful.",
  )

  const searchParams = useSearchParams()
  const initialTab = (searchParams.get("tab") ?? "general") as
    | "general"
    | "language"
    | "llm"
    | "features"
    | "test"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Chatbot Configuration</h2>
        <p className="text-muted-foreground">Customize your AI chatbot's behavior, appearance, and LLM settings.</p>
      </div>

      <Tabs defaultValue={initialTab}>
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
                <Input id="bot-name" defaultValue="ShopAssistant" />
                <p className="text-xs text-muted-foreground">This name will be displayed to your customers.</p>
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
                <Label htmlFor="llm-model">LLM Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                    <SelectItem value="llama-3-70b">Llama 3 (70B)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the AI model that powers your chatbot. More powerful models may incur higher costs.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  This prompt guides the AI's behavior and sets the context for all conversations.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="temperature">Temperature: {temperature}</Label>
                    <span className="text-xs text-muted-foreground">
                      {temperature < 0.4
                        ? "More focused and deterministic"
                        : temperature > 0.7
                          ? "More creative and varied"
                          : "Balanced responses"}
                    </span>
                  </div>
                  <Slider
                    id="temperature"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[temperature]}
                    onValueChange={(value) => setTemperature(value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls randomness. Lower values are more focused, higher values are more creative.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="max-tokens">Max Response Length: {maxTokens}</Label>
                  </div>
                  <Slider
                    id="max-tokens"
                    min={256}
                    max={4096}
                    step={256}
                    value={[maxTokens]}
                    onValueChange={(value) => setMaxTokens(value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of tokens (words/characters) in the AI's response.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-2">Advanced LLM Settings</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="context-window">
                    <AccordionTrigger className="text-sm">Context Window</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <Label htmlFor="context-window">Conversation Memory (messages)</Label>
                        <Select defaultValue="10">
                          <SelectTrigger>
                            <SelectValue placeholder="Select context length" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 messages</SelectItem>
                            <SelectItem value="10">10 messages</SelectItem>
                            <SelectItem value="15">15 messages</SelectItem>
                            <SelectItem value="20">20 messages</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Number of previous messages to include as context for the AI.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="function-calling">
                    <AccordionTrigger className="text-sm">Function Calling</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="function-calling">Enable Function Calling</Label>
                          <Switch id="function-calling" defaultChecked />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Allow the AI to call functions to search products, check inventory, etc.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="prompt-templates">
                    <AccordionTrigger className="text-sm">Prompt Templates</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <Label htmlFor="product-search-template">Product Search Template</Label>
                        <Textarea
                          id="product-search-template"
                          defaultValue="Search for products that match the following criteria: {{query}}"
                          rows={2}
                          className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          Template used when searching for products. Use <code>{"{{ query }}"}</code> as placeholder.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Features & Capabilities</CardTitle>
              <CardDescription>Enable or disable specific chatbot features.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="product-search">Product Search</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow customers to search for products through the chatbot.
                  </p>
                </div>
                <Switch id="product-search" defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="order-tracking">Order Tracking</Label>
                  <p className="text-xs text-muted-foreground">Allow customers to check their order status.</p>
                </div>
                <Switch id="order-tracking" defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="product-recommendations">Product Recommendations</Label>
                  <p className="text-xs text-muted-foreground">
                    Suggest products based on customer queries and browsing history.
                  </p>
                </div>
                <Switch id="product-recommendations" defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="faq-answers">FAQ Answers</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically answer common questions about shipping, returns, etc.
                  </p>
                </div>
                <Switch id="faq-answers" defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="human-handoff">Human Handoff</Label>
                  <p className="text-xs text-muted-foreground">Allow escalation to human support when needed.</p>
                </div>
                <Switch id="human-handoff" defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="rag-enabled">RAG Knowledge Base</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable Retrieval Augmented Generation with your product documentation.
                  </p>
                </div>
                <Switch id="rag-enabled" defaultChecked />
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
              <CardTitle>Test Your Chatbot</CardTitle>
              <CardDescription>Try out your chatbot with the current configuration.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 text-sm">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                  <span className="font-medium">Model:</span>
                  <span>{model}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium">Temp:</span>
                  <span>{temperature}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="font-medium">Max Tokens:</span>
                  <span>{maxTokens}</span>
                </div>
              </div>
              <ChatTestInterface greeting={greeting} model={model} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
