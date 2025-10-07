import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { N8N_BASE } from "@/lib/config";

async function proxy(req: NextRequest, paramsPromise: Promise<{ path?: string[] }>) {
  // In some Clerk versions, auth() can be async-typed; await it and then call getToken()
  const authObj = await auth();
  let token: string | null = null;
  try {
    token = (await authObj.getToken()) || null;
  } catch {
    token = null;
  }
  // Always proxy the request; if no token is available, send a placeholder Bearer
  // The n8n workflow only checks for presence of a Bearer token prefix.
  const bearer = token ? `Bearer ${token}` : "Bearer public";

  const { path = [] } = await paramsPromise;
  const segments = path.join("/");
  const search = req.nextUrl.search || "";
 
  // Normalize base to always include "/webhook" only
  let base = (N8N_BASE || "").replace(/\/+$/, "");
  const hasWebhook = /\/webhook(-test)?(\/|$)/.test(base);
  if (!hasWebhook) base += "/webhook";
  // If someone passed '/webhook/api/n8n', strip it so we call '/webhook/<segments>'
  base = base.replace(/\/webhook\/api\/n8n(\/|$)/, "/webhook$1");

  // Primary targets (no /api/n8n prefix)
  const target = `${base}/${segments}${search}`;

  // Alternate targets (with /api/n8n prefix) for workflows configured with that path
  // Special handling for store details endpoints
  const isStoreDetailsRequest = segments.startsWith('stores/') && segments !== 'stores/list';
  const altPrefix = isStoreDetailsRequest ? '/get-store-details/api/n8n' : '/api/n8n';
  
  const altTarget = `${base}${altPrefix}/${segments}${search}`;
 

 
  // Clone headers and inject auth
  const headers = new Headers(req.headers);
  headers.set("authorization", bearer);
 
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
 
  // Try a sequence of targets:
  // 1) /webhook/<segments>
  // 2) /webhook-test/<segments>
  // 3) /webhook/api/n8n/<segments>
  // 4) /webhook-test/api/n8n/<segments>
  let tried: Array<{ url: string; status?: number }> = [];

  async function tryFetch(url: string) {
    try {
      const r = await fetch(url, { method, headers, body, redirect: "manual" });
      tried.push({ url, status: r.status });
      
      return r;
    } catch (error) {
      const errorInfo = error instanceof Error ? {
        message: error.message,
        cause: error.cause,
        stack: error.stack,
        name: error.name
      } : { message: String(error) };
      

      
      throw error;
    }
  }

  // First attempt: production webhook
  let res = await tryFetch(target);

  // If 404, attempt alternate path with '/api/n8n' prefix
  if (res.status === 404) {
    res = await tryFetch(altTarget);
  }
 
  // Handle redirects from n8n (e.g., OAuth flows)
  if ([301, 302, 303, 307, 308].includes(res.status)) {
    const location = res.headers.get("location");
    if (location) {
      // Pass through exact redirect status
      return NextResponse.redirect(location, res.status);
    }
  }
 
  // Handle compressed responses properly
  const contentEncoding = res.headers.get('content-encoding');
  const isCompressed = contentEncoding && ['gzip', 'deflate', 'br', 'zstd'].includes(contentEncoding.toLowerCase());
  const isZstd = contentEncoding?.toLowerCase() === 'zstd';
  
  let responseBody: ReadableStream<Uint8Array> | null | string;
  const outHeaders = new Headers(res.headers);
  
  if (isCompressed && res.ok) {
    if (isZstd) {
      // Node.js fetch doesn't support zstd decompression, pass through to browser
      responseBody = res.body;
    } else {
      // For gzip, deflate, br - Node.js fetch can handle these
      try {
        const decompressedText = await res.text();
        responseBody = decompressedText;
        
        // Remove content-encoding since we're sending uncompressed data
        outHeaders.delete("content-encoding");
        outHeaders.set("content-length", String(new TextEncoder().encode(decompressedText).length));
      } catch (decompressError) {
        responseBody = res.body;
      }
    }
  } else {
    // For uncompressed responses, pass through normally
    responseBody = res.body;
    

  }
  
  // Remove hop-by-hop headers
  outHeaders.delete("transfer-encoding");
  

  

 
  return new NextResponse(responseBody, {
    status: res.status,
    statusText: res.statusText,
    headers: outHeaders,
  });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, params);
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, params);
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, params);
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, params);
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, params);
}
export async function OPTIONS(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, params);
}