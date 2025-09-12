"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, BrainCircuit, MessageSquare, Users, Zap } from "lucide-react"
import { DashboardChart } from "@/components/dashboard-chart"
import { OnboardingProgress } from "@/components/onboarding-progress"
import { useAnalyticsOverview } from "@/hooks/analytics"
import { useTranslation } from "react-i18next"

export function DashboardPage() {
  const { data: overview } = useAnalyticsOverview()
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-start">{t("dashboard.welcome", { name: "John" })}</h2>
          <p className="text-muted-foreground text-start">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Zap className="icon-start h-4 w-4" />
            {t("dashboard.createNew")}
          </Button>
        </div>
      </div>

      <OnboardingProgress />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.cards.active")}</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(overview?.activeBots ?? 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t("dashboard.cards.autoUpdated")}</p>
            <div className="mt-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                {t("dashboard.allOnline", { defaultValue: t("dashboard.cards.autoUpdated") })}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.cards.daily")}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(overview?.messagesToday ?? 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t("dashboard.cards.today")}</p>
            <Progress
              value={Math.min(100, ((overview?.messagesToday ?? 0) % 100))}
              className="mt-4"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.cards.plan")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(overview?.planUsagePct ?? 0)}%</div>
            <p className="text-xs text-muted-foreground">{t("dashboard.cards.messagesConsumed")}</p>
            <Progress value={Math.round(overview?.planUsagePct ?? 0)} className="mt-4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.cards.custom")}</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(overview?.customLlmRequests ?? 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t("dashboard.cards.apiRequests")}</p>
            <Progress value={60} className="mt-4" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>{t("dashboard.charts.messageVolumeTitle")}</CardTitle>
            <CardDescription>{t("dashboard.charts.messageVolumeDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <DashboardChart />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>{t("dashboard.charts.recentTitle")}</CardTitle>
            <CardDescription>{t("dashboard.charts.recentDesc")}</CardDescription>
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
                    <Badge variant="outline" className="gap-start text-xs">
                      {t("dashboard.charts.system")}
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
