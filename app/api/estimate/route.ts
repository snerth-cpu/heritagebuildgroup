import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { notifyLeadEmail } from "@/lib/estimate/email";
import { checkRateLimit, clientKeyFromRequest } from "@/lib/estimate/rate-limit";
import { saveLead, storageBackendLabel, updateLead } from "@/lib/estimate/store";
import { formatPhoneDisplay, validateEstimateFormData } from "@/lib/estimate/validate";
import type { LeadRecord } from "@/lib/estimate/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const clientKey = clientKeyFromRequest(request);
  const limited = checkRateLimit(clientKey);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, errors: { form: "Too many requests. Please try again later." } },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, errors: { form: "Invalid form submission." } },
      { status: 400 },
    );
  }

  const validated = validateEstimateFormData(form);
  if (!validated.ok) {
    return NextResponse.json({ ok: false, errors: validated.errors }, { status: validated.status });
  }

  const data = validated.data;
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  const photoPayload = await Promise.all(
    data.photos.map(async (file) => ({
      filename: file.name || "photo.jpg",
      contentType: file.type || "application/octet-stream",
      bytes: new Uint8Array(await file.arrayBuffer()),
    })),
  );

  const draft: Omit<LeadRecord, "photos"> = {
    id,
    createdAt,
    name: data.name,
    phone: formatPhoneDisplay(data.phone),
    email: data.email,
    address: data.address,
    unit: data.unit,
    city: data.city,
    state: data.state,
    zip: data.zip,
    projectType: data.projectType,
    description: data.description,
    consent: true,
    attribution: data.attribution,
    emailStatus: "skipped",
    userAgent: request.headers.get("user-agent")?.slice(0, 300) || undefined,
    clientKey,
  };

  let saved: LeadRecord;
  try {
    saved = await saveLead(draft, photoPayload);
  } catch (error) {
    console.error("[estimate] save failed", error);
    return NextResponse.json(
      { ok: false, errors: { form: "We could not save your request. Please call us or try again." } },
      { status: 500 },
    );
  }

  const emailResult = await notifyLeadEmail(saved);
  const withEmail: LeadRecord = {
    ...saved,
    emailStatus: emailResult.status,
    emailError: emailResult.error,
  };
  try {
    saved = await updateLead(withEmail);
  } catch {
    saved = withEmail;
  }

  const backend = await storageBackendLabel();
  console.info(
    `[estimate] saved ${saved.id} via ${backend}; email=${saved.emailStatus}${
      saved.emailError ? ` (${saved.emailError})` : ""
    }`,
  );

  return NextResponse.json({
    ok: true,
    id: saved.id,
    emailStatus: saved.emailStatus,
  });
}
