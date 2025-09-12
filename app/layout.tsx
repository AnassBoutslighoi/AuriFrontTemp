import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ChatCommerce - AI Chatbot Platform for E-commerce",
  description: "Manage your e-commerce chatbots with ease",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const defaultLang = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "ar"
  return (
    <html
      lang={defaultLang}
      dir={defaultLang.startsWith("ar") ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
