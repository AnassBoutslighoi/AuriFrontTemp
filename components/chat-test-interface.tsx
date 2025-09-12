"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, User, Loader2, BrainCircuit } from "lucide-react"
import { useChat } from "@/hooks/chat"
import { toast } from "@/components/ui/use-toast"

interface ChatMessage {
  id: string
  role: "user" | "bot"
  content: string
  timestamp: Date
  thinking?: boolean
}

interface ChatTestInterfaceProps {
  greeting: string
  model?: string
}

export function ChatTestInterface({ greeting, model = "gpt-4o" }: ChatTestInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "bot",
      content: greeting,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const { mutateAsync: sendChat, isPending } = useChat()

  const handleSendMessage = async () => {
    const text = input.trim()
    if (!text) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Add thinking message
    const thinkingId = (Date.now() + 1).toString()
    setMessages((prev) => [
      ...prev,
      {
        id: thinkingId,
        role: "bot",
        content: "",
        timestamp: new Date(),
        thinking: true,
      },
    ])

    try {
      const res = await sendChat({ message: text, model })
      // Remove thinking message
      setMessages((prev) => prev.filter((msg) => msg.id !== thinkingId))

      const botMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: "bot",
        content: res.reply,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (e: any) {
      setMessages((prev) => prev.filter((msg) => msg.id !== thinkingId))
      toast({
        title: "Chat failed",
        description: e?.message || "Unexpected error",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-[500px] flex-col rounded-lg border">
      <div className="flex items-center gap-2 border-b p-3">
        <Bot className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium">ShopAssistant</h3>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">Test Mode</p>
            <Badge variant="outline" className="text-xs px-1 py-0 h-4">
              <BrainCircuit className="h-3 w-3 mr-1" />
              {model}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-2 ${message.role === "user" ? "justify-end" : ""}`}>
            {message.role === "bot" && (
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
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
              {message.thinking ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              ) : (
                <>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </>
              )}
            </div>

            {message.role === "user" && (
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>

      <div className="border-t p-3">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!input.trim() || isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
