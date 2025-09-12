import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { N8N_BASE } from "@/lib/config";

async function proxy(req: NextRequest, params: { path?: string[] }) {
  // In some Clerk versions, auth() can be async-typed; await it and then call getToken()
  const authObj = await auth();
  const token = await authObj.getToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const segments = (params.path ?? []).join("/");
  const target = `${N8N_BASE}/${segments}${req.nextUrl.search}`;

  // Clone headers and inject auth
  const headers = new Headers(req.headers);
  headers.set("authorization", `Bearer ${token}`);

  // Remove host header for cross-origin
  headers.delete("host");

  const method = req.method.toUpperCase();

  // Prepare body for non-GET/HEAD
  let body: BodyInit | undefined;
  if (!["GET", "HEAD"].includes(method)) {
    // Support streaming is optional; use arrayBuffer for broad compatibility
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = await req.json().catch(() => undefined);
      body = json ? JSON.stringify(json) : undefined;
      headers.set("content-type", "application/json");
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      const urlParams = new URLSearchParams();
      for (const [k, v] of formData.entries()) {
        urlParams.append(k, String(v));
      }
      body = urlParams;
      headers.set("content-type", "application/x-www-form-urlencoded");
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const form = new FormData();
      for (const [k, v] of formData.entries()) {
        form.append(k, v as any);
      }
      body = form;
      // Let fetch set correct content-type boundary
      headers.delete("content-type");
    } else {
      const ab = await req.arrayBuffer();
      body = ab.byteLength ? ab : undefined;
    }
  }

  const res = await fetch(target, {
    method,
    headers,
    body,
    redirect: "manual",
  });

  // Handle redirects from n8n (e.g., OAuth flows)
  if ([301, 302, 303, 307, 308].includes(res.status)) {
    const location = res.headers.get("location");
    if (location) {
      // Pass through exact redirect status
      return NextResponse.redirect(location, res.status);
    }
  }

  // Build response headers, optionally strip hop-by-hop headers
  const outHeaders = new Headers(res.headers);
  outHeaders.delete("content-encoding");
  outHeaders.delete("transfer-encoding");

  return new NextResponse(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: outHeaders,
  });
}

export async function GET(req: NextRequest, { params }: { params: { path?: string[] } }) {
  return proxy(req, params);
}
export async function POST(req: NextRequest, { params }: { params: { path?: string[] } }) {
  return proxy(req, params);
}
export async function PUT(req: NextRequest, { params }: { params: { path?: string[] } }) {
  return proxy(req, params);
}
export async function PATCH(req: NextRequest, { params }: { params: { path?: string[] } }) {
  return proxy(req, params);
}
export async function DELETE(req: NextRequest, { params }: { params: { path?: string[] } }) {
  return proxy(req, params);
}
export async function OPTIONS(req: NextRequest, { params }: { params: { path?: string[] } }) {
  return proxy(req, params);
}