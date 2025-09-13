"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { useStoreConnectionsStatus } from "@/hooks/stores"

type Step = {
  title: string
  completed: boolean
  href?: string
}

export function OnboardingProgress() {
  const { t } = useTranslation()
  const { data: status } = useStoreConnectionsStatus()

  const isStoreConnected = Boolean(status?.items?.some((i) => i.connected))

  const steps: Step[] = [
    { title: t("onboarding.steps.createAccount"), completed: true },
    { title: t("onboarding.steps.connectStore"), completed: isStoreConnected, href: "/store-integration" },
    { title: t("onboarding.steps.configureChatbot"), completed: false, href: "/chatbot-configuration" },
    { title: t("onboarding.steps.testChatbot"), completed: false, href: "/chatbot-configuration?tab=test" },
    { title: t("onboarding.steps.goLive"), completed: false, href: "/embedding" },
  ]

  const completedSteps = steps.filter((step) => step.completed).length
  const progress = Math.round((completedSteps / steps.length) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-start">{t("onboarding.title")}</CardTitle>
        <CardDescription className="text-start">{t("onboarding.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t("onboarding.progress")}</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-secondary">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="space-y-2">
          {steps.map((step, index) => {
            const isLink = !step.completed && step.href
            const content = (
              <>
                {step.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                <span className={`text-sm ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.title}
                </span>
              </>
            )

            return (
              <div key={index}>
                {isLink ? (
                  <Link
                    href={step.href!}
                    className="flex items-center gap-3 rounded-md p-2 hover:bg-secondary transition-colors"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 rounded-md p-2">{content}</div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
