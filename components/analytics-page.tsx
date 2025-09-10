"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Pie,
  PieChart,
} from "@/components/ui/chart"
import { Calendar, Download, BrainCircuit, MessageSquare, Search, Clock, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const dailyData = [
  { date: "2023-05-01", messages: 145, conversations: 32 },
  { date: "2023-05-02", messages: 132, conversations: 28 },
  { date: "2023-05-03", messages: 164, conversations: 35 },
  { date: "2023-05-04", messages: 187, conversations: 42 },
  { date: "2023-05-05", messages: 212, conversations: 48 },
  { date: "2023-05-06", messages: 198, conversations: 45 },
  { date: "2023-05-07", messages: 173, conversations: 38 },
  { date: "2023-05-08", messages: 201, conversations: 44 },
  { date: "2023-05-09", messages: 224, conversations: 52 },
  { date: "2023-05-10", messages: 248, conversations: 56 },
]

const topQueriesData = [
  { query: "Product availability", count: 124 },
  { query: "Shipping information", count: 98 },
  { query: "Return policy", count: 76 },
  { query: "Product recommendations", count: 65 },
  { query: "Order status", count: 58 },
]

const satisfactionData = [
  { name: "Very Satisfied", value: 45 },
  { name: "Satisfied", value: 30 },
  { name: "Neutral", value: 15 },
  { name: "Unsatisfied", value: 7 },
  { name: "Very Unsatisfied", value: 3 },
]

const llmPerformanceData = [
  { date: "2023-05-01", latency: 1.2, tokens: 320 },
  { date: "2023-05-02", latency: 1.3, tokens: 290 },
  { date: "2023-05-03", latency: 1.1, tokens: 350 },
  { date: "2023-05-04", latency: 1.4, tokens: 380 },
  { date: "2023-05-05", latency: 1.2, tokens: 410 },
  { date: "2023-05-06", latency: 1.0, tokens: 390 },
  { date: "2023-05-07", latency: 1.3, tokens: 360 },
  { date: "2023-05-08", latency: 1.2, tokens: 400 },
  { date: "2023-05-09", latency: 1.1, tokens: 430 },
  { date: "2023-05-10", latency: 0.9, tokens: 450 },
]

const modelUsageData = [
  { name: "GPT-4o", value: 65 },
  { name: "GPT-3.5 Turbo", value: 25 },
  { name: "Claude 3", value: 10 },
]

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff6b6b"]

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Monitor and analyze your chatbot performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,549</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">-0.3s from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">+3% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usage">
        <TabsList>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="queries">Top Queries</TabsTrigger>
          <TabsTrigger value="llm">LLM Performance</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chatbot Usage</CardTitle>
              <CardDescription>Daily messages and conversations over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer className="h-full w-full" data={dailyData}>
                <Chart>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return `${date.getDate()}/${date.getMonth() + 1}`
                    }}
                  />
                  <YAxis />
                  <LineChart>
                    <Line dataKey="messages" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line dataKey="conversations" stroke="hsl(var(--muted-foreground))" strokeWidth={2} />
                  </LineChart>
                  <ChartTooltip>
                    <ChartTooltipContent
                      className="border-none bg-background p-2 shadow-md"
                      content={({ payload }) => {
                        if (!payload?.length) return null
                        const data = payload[0].payload
                        const date = new Date(data.date)
                        const formattedDate = `${date.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}`
                        return (
                          <div className="flex flex-col gap-1">
                            <p className="text-xs text-muted-foreground">{formattedDate}</p>
                            <p className="font-medium">{data.messages} messages</p>
                            <p className="font-medium">{data.conversations} conversations</p>
                          </div>
                        )
                      }}
                    />
                  </ChartTooltip>
                </Chart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Customer Queries</CardTitle>
              <CardDescription>Most common topics customers ask about</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer className="h-full w-full" data={topQueriesData}>
                <Chart>
                  <XAxis dataKey="query" />
                  <YAxis />
                  <BarChart>
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                  <ChartTooltip>
                    <ChartTooltipContent
                      className="border-none bg-background p-2 shadow-md"
                      content={({ payload }) => {
                        if (!payload?.length) return null
                        const data = payload[0].payload
                        return (
                          <div className="flex flex-col gap-1">
                            <p className="text-xs text-muted-foreground">{data.query}</p>
                            <p className="font-medium">{data.count} queries</p>
                          </div>
                        )
                      }}
                    />
                  </ChartTooltip>
                </Chart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="llm" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>LLM Performance Metrics</CardTitle>
                <CardDescription>Response time and token usage</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChartContainer className="h-full w-full" data={llmPerformanceData}>
                  <Chart>
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getDate()}/${date.getMonth() + 1}`
                      }}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <LineChart>
                      <Line
                        yAxisId="left"
                        dataKey="latency"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        name="Response Time (s)"
                      />
                      <Line
                        yAxisId="right"
                        dataKey="tokens"
                        stroke="hsl(var(--muted-foreground))"
                        strokeWidth={2}
                        name="Avg. Tokens"
                      />
                    </LineChart>
                    <ChartTooltip>
                      <ChartTooltipContent
                        className="border-none bg-background p-2 shadow-md"
                        content={({ payload }) => {
                          if (!payload?.length) return null
                          const data = payload[0].payload
                          const date = new Date(data.date)
                          const formattedDate = `${date.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}`
                          return (
                            <div className="flex flex-col gap-1">
                              <p className="text-xs text-muted-foreground">{formattedDate}</p>
                              <p className="font-medium">{data.latency}s response time</p>
                              <p className="font-medium">{data.tokens} tokens per response</p>
                            </div>
                          )
                        }}
                      />
                    </ChartTooltip>
                  </Chart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>LLM Cost Analysis</CardTitle>
                <CardDescription>Token usage and estimated costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Total Tokens Used</h3>
                      </div>
                      <div className="mt-2">
                        <div className="text-2xl font-bold">3.8M</div>
                        <p className="text-xs text-muted-foreground">+15% from last month</p>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Avg. Tokens Per Chat</h3>
                      </div>
                      <div className="mt-2">
                        <div className="text-2xl font-bold">420</div>
                        <p className="text-xs text-muted-foreground">-5% from last month</p>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <Search className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Estimated Cost</h3>
                      </div>
                      <div className="mt-2">
                        <div className="text-2xl font-bold">$42.65</div>
                        <p className="text-xs text-muted-foreground">For current billing period</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-3">Custom LLM Usage</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/10">
                            API Requests
                          </Badge>
                          <span className="text-sm">3.8M requests</span>
                        </div>
                        <span className="font-medium">100%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-muted">
                            Average Response Time
                          </Badge>
                          <span className="text-sm">1.2s</span>
                        </div>
                        <span className="font-medium">-0.3s from last month</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Satisfaction</CardTitle>
              <CardDescription>Satisfaction ratings from customer feedback</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer className="h-full w-full" data={satisfactionData}>
                <Chart>
                  <PieChart>
                    <Pie dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label />
                  </PieChart>
                  <ChartTooltip>
                    <ChartTooltipContent
                      className="border-none bg-background p-2 shadow-md"
                      content={({ payload }) => {
                        if (!payload?.length) return null
                        const data = payload[0].payload
                        return (
                          <div className="flex flex-col gap-1">
                            <p className="text-xs text-muted-foreground">{data.name}</p>
                            <p className="font-medium">{data.value}%</p>
                          </div>
                        )
                      }}
                    />
                  </ChartTooltip>
                </Chart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
