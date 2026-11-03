import { NextResponse } from "next/server";
import { getLead, listLeads, storageBackendLabel } from "@/lib/estimate/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

function tokenFromRequest(request: Request) {
  const header = request.headers.get("authorization") || "";
  if (header.toLowerCase().startsWith("bearer ")) return header.slice(7).trim();
  const url = new URL(request.url);
  return url.searchParams.get("token") || request.headers.get("x-leads-admin-token") || "";
}

/** Password-protected lead retrieval. Not publicly listable without LEADS_ADMIN_TOKEN. */
export async function GET(request: Request) {
  const expected = process.env.LEADS_ADMIN_TOKEN;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "LEADS_ADMIN_TOKEN is not configured on the server." },
      { status: 503 },
    );
  }

  const provided = tokenFromRequest(request);
  if (!provided || provided !== expected) return unauthorized();

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const limit = Number(url.searchParams.get("limit") || "50");

  if (id) {
    const lead = await getLead(id);
    if (!lead) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, lead, backend: await storageBackendLabel() });
  }

  const leads = await listLeads(Number.isFinite(limit) ? limit : 50);
  return NextResponse.json({
    ok: true,
    count: leads.length,
    backend: await storageBackendLabel(),
    leads,
  });
}
