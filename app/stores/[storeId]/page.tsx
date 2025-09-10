import { DashboardLayout } from "@/components/dashboard-layout"
import { StoreDetailPage } from "@/components/store-detail-page"

export default function StoreDetail({ params }: { params: { storeId: string } }) {
  return (
    <DashboardLayout>
      <StoreDetailPage storeId={params.storeId} />
    </DashboardLayout>
  )
}
