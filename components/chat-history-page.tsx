"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bot, Calendar, Download, Search, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ChatHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  const conversations = [
    {
      id: "1",
      customer: "Sarah Johnson",
      email: "sarah.j@example.com",
      date: "2023-05-10T14:32:00",
      preview: "I'm looking for a new summer dress",
      status: "resolved",
      messages: [
        { id: "m1", role: "bot", content: "Hello! How can I help you today?", time: "14:32" },
        { id: "m2", role: "user", content: "I'm looking for a new summer dress", time: "14:33" },
        {
          id: "m3",
          role: "bot",
          content:
            "Great! We have a wonderful collection of summer dresses. Do you have any specific style, color, or size in mind?",
          time: "14:33",
        },
        { id: "m4", role: "user", content: "I'm looking for something in blue, size medium", time: "14:34" },
        {
          id: "m5",
          role: "bot",
          content:
            "Perfect! We have several blue dresses in medium size. Our most popular ones are the 'Ocean Breeze Maxi Dress' and the 'Blue Floral Sundress'. Would you like me to show you these options?",
          time: "14:35",
        },
        { id: "m6", role: "user", content: "Yes, please show me both", time: "14:36" },
      ],
    },
    {
      id: "2",
      customer: "Michael Chen",
      email: "m.chen@example.com",
      date: "2023-05-10T11:15:00",
      preview: "When will my order #45678 arrive?",
      status: "resolved",
      messages: [],
    },
    {
      id: "3",
      customer: "Emma Wilson",
      email: "emma.w@example.com",
      date: "2023-05-09T16:48:00",
      preview: "Do you have this in red?",
      status: "resolved",
      messages: [],
    },
    {
      id: "4",
      customer: "James Rodriguez",
      email: "j.rodriguez@example.com",
      date: "2023-05-09T09:22:00",
      preview: "I need to return an item",
      status: "escalated",
      messages: [],
    },
    {
      id: "5",
      customer: "Aisha Patel",
      email: "a.patel@example.com",
      date: "2023-05-08T15:37:00",
      preview: "Is this product waterproof?",
      status: "resolved",
      messages: [],
    },
  ]

  const selectedConversationData = conversations.find((c) => c.id === selectedConversation)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Chat History</h2>
        <p className="text-muted-foreground">View and analyze past customer conversations.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Conversations</CardTitle>
              <CardDescription>Browse through past customer interactions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conversations</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Date
                </Button>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`rounded-lg border p-3 cursor-pointer transition-colors ${
                      selectedConversation === conversation.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{conversation.customer}</div>
                      <Badge
                        variant={
                          conversation.status === "resolved"
                            ? "outline"
                            : conversation.status === "escalated"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {conversation.status}
                      </Badge>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{conversation.preview}</div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {new Date(conversation.date).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="h-full">
            {selectedConversationData ? (
              <>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>
                          {selectedConversationData.customer
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{selectedConversationData.customer}</CardTitle>
                        <CardDescription>{selectedConversationData.email}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="conversation">
                    <TabsList className="mb-4">
                      <TabsTrigger value="conversation">Conversation</TabsTrigger>
                      <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="conversation" className="space-y-4">
                      <div className="space-y-4 max-h-[500px] overflow-y-auto p-2">
                        {selectedConversationData.messages.length > 0 ? (
                          selectedConversationData.messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex items-start gap-2 ${message.role === "user" ? "justify-end" : ""}`}
                            >
                              {message.role === "bot" && (
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    <Bot className="h-4 w-4" />
                                  </AvatarFallback>
                                </Avatar>
                              )}

                              <div
                                className={`rounded-lg px-3 py-2 max-w-[80%] ${
                                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">{message.time}</p>
                              </div>

                              {message.role === "user" && (
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    <User className="h-4 w-4" />
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                            <p>No messages to display</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Conversation Duration</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">4 minutes</div>
                            <p className="text-xs text-muted-foreground">Average: 3.5 minutes</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Customer Satisfaction</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">Good</div>
                            <p className="text-xs text-muted-foreground">Based on sentiment analysis</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Messages Exchanged</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">6</div>
                            <p className="text-xs text-muted-foreground">Average: 8 messages</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Resolution Time</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">4 minutes</div>
                            <p className="text-xs text-muted-foreground">Average: 5.2 minutes</p>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Key Topics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">Product inquiry</Badge>
                            <Badge variant="secondary">Size information</Badge>
                            <Badge variant="secondary">Color options</Badge>
                            <Badge variant="secondary">Summer collection</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </>
            ) : (
              <div className="flex h-full items-center justify-center p-6">
                <div className="text-center">
                  <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Conversation Selected</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Select a conversation from the list to view details.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
