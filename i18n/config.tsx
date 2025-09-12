"use client";

import React from "react";
import i18n from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      app: {
        title: "ChatCommerce",
        subtitle: "AI Chatbot Platform",
        search: "Search...",
        dashboard: "Dashboard",
        stores: "Stores",
        chatbots: "Chatbots",
        chatHistory: "Chat History",
        analytics: "Analytics",
        billing: "Billing",
        settings: "Settings",
        support: "Support",
        management: "Management",
        embedding: "Embedding",
      },
      dashboard: {
        welcome: "Welcome back, {{name}}!",
        subtitle: "Here's what's happening with your AI chatbots today.",
        createNew: "Create New Chatbot",
        allOnline: "All online",
        cards: {
          active: "Active Chatbots",
          daily: "Daily Messages",
          plan: "Plan Usage",
          custom: "Custom LLM Usage",
          autoUpdated: "Auto-updated",
          today: "Today",
          messagesConsumed: "Messages consumed this period",
          apiRequests: "API requests"
        },
        charts: {
          messageVolumeTitle: "Message Volume",
          messageVolumeDesc: "Daily message volume for the past 30 days",
          recentTitle: "Recent Activity",
          recentDesc: "Latest interactions with your chatbots",
          system: "System"
        }
      },
      onboarding: {
        title: "Getting Started",
        description: "Complete these steps to fully set up your chatbot",
        progress: "Progress",
        steps: {
          createAccount: "Create account",
          connectStore: "Connect your store",
          configureChatbot: "Configure your chatbot",
          testChatbot: "Test your chatbot",
          goLive: "Go live"
        }
      }
    },
  },
  ar: {
    translation: {
      app: {
        title: "تشات كوميرس",
        subtitle: "منصة روبوت الدردشة بالذكاء الاصطناعي",
        search: "ابحث...",
        dashboard: "لوحة التحكم",
        stores: "المتاجر",
        chatbots: "الروبوتات",
        chatHistory: "سجل الدردشة",
        analytics: "التحليلات",
        billing: "الفوترة",
        settings: "الإعدادات",
        support: "الدعم",
        management: "الإدارة",
        embedding: "التضمين",
      },
      dashboard: {
        welcome: "مرحبًا بعودتك، {{name}}!",
        subtitle: "إليك ما يحدث مع روبوتات الدردشة لديك اليوم.",
        createNew: "إنشاء روبوت دردشة جديد",
        allOnline: "الجميع متصل",
        cards: {
          active: "الروبوتات النشطة",
          daily: "الرسائل اليومية",
          plan: "استخدام الخطة",
          custom: "استخدام النماذج المخصصة",
          autoUpdated: "تحديث تلقائي",
          today: "اليوم",
          messagesConsumed: "الرسائل المستهلكة خلال هذه الفترة",
          apiRequests: "طلبات API"
        },
        charts: {
          messageVolumeTitle: "حجم الرسائل",
          messageVolumeDesc: "حجم الرسائل اليومية خلال آخر 30 يومًا",
          recentTitle: "النشاط الأخير",
          recentDesc: "أحدث التفاعلات مع روبوتات الدردشة لديك",
          system: "النظام"
        }
      },
      onboarding: {
        title: "البدء",
        description: "أكمل هذه الخطوات لإعداد روبوت الدردشة بالكامل",
        progress: "التقدم",
        steps: {
          createAccount: "إنشاء حساب",
          connectStore: "ربط متجرك",
          configureChatbot: "تهيئة روبوت الدردشة",
          testChatbot: "اختبار روبوت الدردشة",
          goLive: "الإطلاق"
        }
      }
    },
  },
};

const getDefaultLng = () => {
  const envDefault = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "ar";
  if (typeof window === "undefined") return envDefault;
  return localStorage.getItem("locale") || envDefault;
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: getDefaultLng(),
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

export function setLocale(lng: string) {
  i18n.changeLanguage(lng);
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
    document.documentElement.dir = lng.startsWith("ar") ? "rtl" : "ltr";
  }
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("locale", lng);
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

export { i18n };