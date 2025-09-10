"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, BrainCircuit, MessageSquare, Users, Zap } from "lucide-react"
import { DashboardChart } from "@/components/dashboard-chart"
import { OnboardingProgress } from "@/components/onboarding-progress"

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, John!</h2>
          <p className="text-muted-foreground">Here's what's happening with your AI chatbots today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Zap className="mr-2 h-4 w-4" />
            Create New Chatbot
          </Button>
        </div>
      </div>

      <OnboardingProgress />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chatbots</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
            <div className="mt-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                All online
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">+18% from yesterday</p>
            <Progress value={68} className="mt-4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <p className="text-xs text-muted-foreground">8,230 / 10,000 messages</p>
            <Progress value={72} className="mt-4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom LLM Usage</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-xs text-muted-foreground">API requests</p>
            <Progress value={60} className="mt-4" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Message Volume</CardTitle>
            <CardDescription>Daily message volume for the past 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <DashboardChart />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest interactions with your chatbots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center">
                    <p className="text-sm font-medium leading-none">GPT-4o model updated</p>
                    <Badge variant="outline" className="ml-2 text-xs">
                      System
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">New model version deployed with improved performance</p>
                </div>
                <div className="text-xs text-muted-foreground">5 min ago</div>
              </div>

              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">New conversation on Shopify Store</p>
                  <p className="text-xs text-muted-foreground">Customer asked about product availability</p>
                </div>
                <div className="text-xs text-muted-foreground">12 min ago</div>
              </div>

              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Prompt template updated</p>
                  <p className="text-xs text-muted-foreground">Product recommendation prompt improved</p>
                </div>
                <div className="text-xs text-muted-foreground">24 min ago</div>
              </div>

              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">High satisfaction rating</p>
                  <p className="text-xs text-muted-foreground">Customer rated conversation 5/5 stars</p>
                </div>
                <div className="text-xs text-muted-foreground">36 min ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
