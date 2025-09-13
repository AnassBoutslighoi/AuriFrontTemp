"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, MessageSquare, Zap } from "lucide-react"
import { DashboardChart } from "@/components/dashboard-chart"
import { OnboardingProgress } from "@/components/onboarding-progress"
import { useAnalyticsOverview } from "@/hooks/analytics"
import { useTranslation } from "react-i18next"
import { useUser } from "@clerk/nextjs"

export function DashboardPage() {
  const { data: overview } = useAnalyticsOverview()
  const { t } = useTranslation()
  const { user } = useUser()
  const name = user?.firstName ?? t("dashboard.userDefault", { defaultValue: "there" })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-start">{t("dashboard.welcome", { name })}</h2>
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.cards.conversationsToday")}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(overview?.conversationsToday ?? 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t("dashboard.cards.today")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.cards.avgResponseTime")}</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((overview?.avgResponseTimeSec ?? 0)).toFixed(1)}s</div>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.cards.avgResponseTimeHelp", { defaultValue: "Average time to respond" })}
            </p>
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
      </div>
    </div>
  )
}
