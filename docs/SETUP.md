# Aurify SaaS Dashboard — Setup Guide

This document explains how to configure authentication, webhooks, environment variables, and n8n endpoints for the multi-tenant AI chatbot dashboard.

## 1) Environment variables

Create a `.env.local` file at the project root (copy from `.env.example`) and fill the values:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...or_pk_test_...
CLERK_SECRET_KEY=sk_live_...or_sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# n8n
NEXT_PUBLIC_N8N_BASE_URL=https://n8n.weblion.pro/webhook

# Internationalization
NEXT_PUBLIC_DEFAULT_LOCALE=ar
NEXT_PUBLIC_SUPPORTED_LOCALES=ar,en
```

Restart `npm run dev` after any env changes.

## 2) Clerk configuration

1. In Clerk Dashboard → Application → API Keys, copy your Publishable Key and Secret Key into `.env.local`.
2. Set OAuth/Social providers as desired in Clerk Dashboard.
3. Configure a webhook in Clerk:
   - URL: `https://n8n.weblion.pro/webhook/clerk-webhook`
   - Events: at minimum `user.created`
   - Copy the generated “webhook signing secret” to `CLERK_WEBHOOK_SECRET` in `.env.local`.

Notes:
- The app uses middleware to protect tenant pages. Public routes: `/sign-in`, `/sign-up`, `/favicon.ico`, `/widget/*`.
- Sign-in and sign-up are available at `/sign-in` and `/sign-up`. On success, users are redirected to `/`.

## 3) n8n endpoints (expected)

All calls are proxied via Next at `/api/n8n/*` and automatically include the Clerk JWT as `Authorization: Bearer <token>`:

- Tenant Registration (webhook from Clerk): `POST /clerk-webhook` (configured directly in Clerk to hit n8n)
- JWT validation: `ANY /validate-jwt`
- Shopify OAuth install: `ANY /shopify/install`
- Shopify OAuth callback: `ANY /oauth/shopify/callback`
- Initial sync: `POST /data-sync/initial`
- Real-time product webhooks:
  - `POST /webhooks/shopify/product-updated`
  - `POST /webhooks/woocommerce/product-updated`
  - `POST /webhooks/youcan/product-updated`
- LLM service (chat): `POST /fe4ced88-7675-4a72-ab9d-60eb4344e235`

Optional analytics/status endpoints used by the UI (provide them in n8n or the UI will show safe defaults):
- Analytics overview: `GET /analytics/overview`
- Store connections: `GET /connections/status`
- Sync status: `GET /sync/status`
- Sync logs: `GET /sync/logs?platform=shopify|woocommerce|youcan&limit=20`

## 4) Multi-tenant scope

- Tenant context is derived by calling `/api/n8n/validate-jwt` on load. Your n8n workflow should validate the JWT against Clerk and return:
  ```
  {
    "tenant_id": "tenant_xxx",
    "tenant_name": "...",
    "branding": { "logoUrl": "https://...", "primaryColor": "#6D28D9" }
  }
  ```
- Branding primaryColor is applied globally to theme CSS vars; logo is displayed in the sidebar header.

## 5) Store integrations (Shopify, WooCommerce, YouCan)

- The UI provides “Connect” buttons which trigger OAuth install via GET query to:
  - `/api/n8n/shopify/install?return_url=<APP_URL>/stores&shop=<SHOP>.myshopify.com&tenant_id=<TENANT>&store_name=<NAME>`
  - `/api/n8n/woocommerce/install?return_url=<APP_URL>/stores`
  - `/api/n8n/youcan/install?return_url=<APP_URL>/stores`
- Shopify expected query parameters:
  - `shop` (required): e.g. `mystore.myshopify.com`
  - `tenant_id` (recommended): current tenant identifier
  - `store_name` (optional): label to display in dashboard
  - `return_url` (required): where to navigate after install (typically `<APP_URL>/stores`)
  - Example:
    - `/api/n8n/shopify/install?shop=mystore.myshopify.com&tenant_id=tenant_123&store_name=My%20Store&return_url=http://localhost:3000/stores`
- After a successful OAuth install in n8n, call the `Initial Data Sync` workflow and configure platform webhooks to point to the n8n “real-time webhooks” listed above.
- The Store Integration page polls:
  - `GET /connections/status` for connection statuses
  - `GET /sync/logs?platform=...` for recent logs

## 6) Chat integration (LLM)

- The chat UI sends messages to `POST /api/n8n/fe4ced88-7675-4a72-ab9d-60eb4344e235` with Clerk JWT and payload:
  ```
  {
    "tenant_id": "tenant_xxx",
    "message": "Hello",
    "model": "gpt-4o",
    "temperature": 0.7,
    "maxTokens": 1024
  }
  ```
- Ensure your n8n LLM workflow accepts these fields and returns either `{ reply: "..." }` or a JSON with a top-level `message` field. Other structures will still render, but `{ reply }` is preferred.

## 7) Embedding the chatbot

- Visit `/embedding` to generate either an iframe or script snippet. The widget URL is:
  ```
  <iframe src="https://YOUR-APP-DOMAIN/widget/iframe?tenant_id=TENANT&locale=ar|en" ... />
  ```
- The widget auto-switches direction (RTL for ar, LTR for en). You can hardcode `locale` in the snippet or let the parent site decide.

## 8) Development tips

- When endpoints in n8n are not yet implemented, the UI shows safe defaults (0s and placeholders) and continues to function without crashing.
- To verify “public” widget, open:
  ```
  http://localhost:3000/widget/iframe?tenant_id=test-tenant&locale=en
  ```

## 9) Hardening and checks to enable later

- In `next.config.mjs`, re-enable TypeScript and ESLint build checks by removing `ignoreDuringBuilds` and `ignoreBuildErrors` once your workflows stabilize.
- Add rate limiting and request validation to the proxy if exposing untrusted user inputs directly.

## 10) File index (key code paths)

- Middleware/Auth: `middleware.ts`
- Providers: `components/providers.tsx`
- Tenant context: `components/tenant-provider.tsx`
- i18n: `i18n/config.tsx`
- API proxy: `app/api/n8n/[...path]/route.ts`
- Store hooks: `hooks/n8n.ts`, `hooks/stores.ts`
- Analytics hooks: `hooks/analytics.ts`
- Chat hook: `hooks/chat.ts`
- Store UI: `components/stores-page.tsx`
- Dashboard + analytics: `components/dashboard-page.tsx`, `components/analytics-page.tsx`
- Embedding: `components/embed-code-page.tsx`, `app/embedding/page.tsx`
- Public widget iframe: `app/widget/iframe/page.tsx`