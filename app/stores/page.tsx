import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StoresPage } from "@/components/stores-page"

function StoresPageWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoresPage />
    </Suspense>
  )
}

export default function Stores() {
  return (
    <DashboardLayout>
      <StoresPageWithSuspense />
    </DashboardLayout>
  )
}
