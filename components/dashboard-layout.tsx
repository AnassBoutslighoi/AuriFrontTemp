"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Store,
  MessageSquare,
  History,
  BarChart,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  Globe2,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "react-i18next"
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs"
import { LanguageToggle } from "@/components/language-toggle"
import Image from "next/image"
import { useTenant } from "@/components/tenant-provider"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const { t, i18n: i18next } = useTranslation()

  const [isRTL, setIsRTL] = useState<boolean>(
    (i18next.language ?? (typeof document !== "undefined" ? document.documentElement.lang : "ar")).startsWith("ar")
  )

  useEffect(() => {
    const update = () => {
      const lng =
        i18next.language ?? (typeof document !== "undefined" ? document.documentElement.lang : "ar")
      const dir = typeof document !== "undefined" ? document.documentElement.dir : undefined
      setIsRTL(lng.startsWith("ar") || dir === "rtl")
    }
    i18next.on("languageChanged", update)
    let observer: MutationObserver | null = null
    if (typeof MutationObserver !== "undefined" && typeof document !== "undefined") {
      observer = new MutationObserver(update)
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["dir"] })
    }
    update()
    return () => {
      i18next.off("languageChanged", update)
      observer?.disconnect()
    }
  }, [i18next])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar side={isRTL ? "right" : "left"}>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-3">
              {(() => {
                const { branding } = useTenant()
                if (branding?.logoUrl) {
                  return (
                    <Image
                      src={branding.logoUrl}
                      alt="Logo"
                      width={32}
                      height={32}
                      className="rounded"
                    />
                  )
                }
                return (
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ background: "var(--tenant-primary, hsl(var(--primary)))" }}
                  >
                    <span className="text-lg font-bold text-white">C</span>
                  </div>
                )
              })()}
              <div className="flex flex-col">
                <span className="text-lg font-bold">{t("app.title")}</span>
                <span className="text-xs text-muted-foreground">{t("app.subtitle")}</span>
              </div>
            </div>
            <div className="px-4 py-2">
              <Input
                placeholder={t("app.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
              />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{t("app.dashboard")}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/"}>
                      <Link href="/">
                        <LayoutDashboard />
                        <span>{t("app.dashboard")}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith("/stores")}>
                      <Link href="/stores">
                        <Store />
                        <span>{t("app.stores")}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith("/chatbots")}>
                      <Link href="/chatbots">
                        <MessageSquare />
                        <span>{t("app.chatbots")}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/chat-history"}>
                      <Link href="/chat-history">
                        <History />
                        <span>{t("app.chatHistory")}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>{t("app.management")}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/analytics"}>
                      <Link href="/analytics">
                        <BarChart />
                        <span>{t("app.analytics")}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/billing"}>
                      <Link href="/billing">
                        <CreditCard />
                        <span>{t("app.billing")}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                      <Link href="/settings">
                        <Settings />
                        <span>{t("app.settings")}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/support"}>
                      <Link href="/support">
                        <HelpCircle />
                        <span>{t("app.support")}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/embedding"}>
                      <Link href="/embedding">
                        <Globe2 />
                        <span>{t("app.embedding")}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2">
                <SignedIn>
                  <UserButton appearance={{ elements: { userButtonOuterIdentifier: "text-sm" } }} />
                </SignedIn>
                <SignedOut>
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>G</AvatarFallback>
                  </Avatar>
                </SignedOut>
              </div>
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <ModeToggle />
                <SignedIn>
                  <SignOutButton>
                    <Button variant="ghost" size="icon" title="Sign out">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </SignOutButton>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="redirect">
                    <Button variant="ghost" size="sm">{t("app.dashboard")}</Button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <div className="container py-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}
