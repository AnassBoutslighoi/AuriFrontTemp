import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"
import { useTranslation } from "react-i18next"

export function OnboardingProgress() {
  const { t } = useTranslation()

  const steps = [
    { title: t("onboarding.steps.createAccount"), completed: true },
    { title: t("onboarding.steps.connectStore"), completed: true },
    { title: t("onboarding.steps.configureChatbot"), completed: true },
    { title: t("onboarding.steps.testChatbot"), completed: false },
    { title: t("onboarding.steps.goLive"), completed: false },
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
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              {step.completed ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span className={`text-sm ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
