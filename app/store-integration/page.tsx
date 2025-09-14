import { redirect } from "next/navigation"

export default function StoreIntegration() {
  // Legacy route – unified into /stores
  redirect("/stores")
}
