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
        userDefault: "there",
        cards: {
          active: "Active Chatbots",
          daily: "Daily Messages",
          conversationsToday: "Conversations Today",
          avgResponseTime: "Avg. Response Time",
          avgResponseTimeHelp: "Average time to respond",
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
      },
      stores: {
        title: "Stores",
        description: "Manage your connected e-commerce stores.",
        searchPlaceholder: "Search stores...",
        tabs: { all: "All Stores" },
        addStore: "Add Store",
        addNewStore: "Add New Store",
        connectDescription: "Connect a new e-commerce store to your account.",
        storeName: "Store Name",
        storeNamePlaceholder: "My Awesome Store",
        storeUrl: "Store URL / Domain",
        storeUrlPlaceholder: "mystore.com or mystore.myshopify.com",
        platform: "Platform",
        selectPlatform: "Select platform",
        connectStore: "Connect Store",
        connecting: "Redirecting to store authorization...",
        connectionSuccess: "Store Connected Successfully!",
        connectionSuccessDescription: "Your store has been connected to your account.",
        connectionError: "Failed to connect the store. Please try again.",
        connectionErrorDescription: "Failed to connect the store. Please try again.",
        connectionSuccessDetail: "Great! Your store has been successfully connected to your account. You can now start using it with your chatbots.",
        status: {
          all: "All",
          active: "Active",
          inactive: "Inactive",
          connecting: "Connecting",
          syncing: "Syncing",
          error: "Error",
          connected: "Connected",
          pending: "Pending"
        },
        platformLabel: "Platform:",
        productsLabel: "Products:",
        lastSyncLabel: "Last Sync:",
        chatbotsLabel: "Chatbots:",
        manageStore: "Manage Store",
        noStoresTitle: "No Stores",
        noStoresDescription: "Connect your first store to get started",
        connectErrorTitle: "Connection failed",
        connectError: "Unexpected error",
        errors: { nameTooShort: "Name is too short", urlRequired: "URL is required", invalidUrl: "Invalid URL" }
      },
      common: {
        cancel: "Cancel",
        gotIt: "Got it"
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
        userDefault: "صديقي",
        cards: {
          active: "الروبوتات النشطة",
          daily: "الرسائل اليومية",
          conversationsToday: "المحادثات اليوم",
          avgResponseTime: "متوسط زمن الاستجابة",
          avgResponseTimeHelp: "متوسط الوقت للاستجابة",
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
      },
      stores: {
        title: "المتاجر",
        description: "إدارة متاجرك المتصلة بالتجارة الإلكترونية.",
        searchPlaceholder: "ابحث في المتاجر...",
        tabs: { all: "كل المتاجر" },
        addStore: "أضف متجرًا",
        addNewStore: "إضافة متجر جديد",
        connectDescription: "قم بتوصيل متجر تجارة إلكترونية جديد بحسابك.",
        storeName: "اسم المتجر",
        storeNamePlaceholder: "متجري الرائع",
        storeUrl: "رابط/نطاق المتجر",
        storeUrlPlaceholder: "mystore.com أو mystore.myshopify.com",
        platform: "المنصة",
        selectPlatform: "اختر المنصة",
        connectStore: "ربط المتجر",
        connecting: "جاري إعادة التوجيه لتفويض المتجر...",
        connectionSuccess: "تم ربط المتجر بنجاح!",
        connectionSuccessDescription: "تم ربط المتجر بحسابك.",
        connectionError: "فشل ربط المتجر. يرجى المحاولة مرة أخرى.",
        connectionErrorDescription: "فشل ربط المتجر. يرجى المحاولة مرة أخرى.",
        connectionSuccessDetail: "عمل رائع! تم ربط متجرك بحسابك بنجاح. يمكنك الآن البدء في استخدامه مع روبوتات الدردشة.",
        status: {
          all: "الكل",
          active: "نشط",
          inactive: "غير نشط",
          connecting: "جارٍ الاتصال",
          syncing: "جاري المزامنة",
          error: "خطأ",
          connected: "متصل",
          pending: "قيد الانتظار"
        },
        platformLabel: "المنصة:",
        productsLabel: "المنتجات:",
        lastSyncLabel: "آخر مزامنة:",
        chatbotsLabel: "الروبوتات:",
        manageStore: "إدارة المتجر",
        noStoresTitle: "لا توجد متاجر",
        noStoresDescription: "قم بربط أول متجر للبدء",
        connectErrorTitle: "فشل الاتصال",
        connectError: "خطأ غير متوقع",
        errors: { nameTooShort: "الاسم قصير جدًا", urlRequired: "الرابط مطلوب", invalidUrl: "رابط غير صالح" }
      },
      common: {
        cancel: "إلغاء",
        gotIt: "حسنًا"
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