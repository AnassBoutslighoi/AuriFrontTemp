import { DashboardLayout } from "@/components/dashboard-layout"
import { ChatbotDetailPage } from "@/components/chatbot-detail-page"

export default function ChatbotDetail({ params }: { params: { botId: string } }) {
  return (
    <DashboardLayout>
      <ChatbotDetailPage botId={params.botId} />
    </DashboardLayout>
  )
}
