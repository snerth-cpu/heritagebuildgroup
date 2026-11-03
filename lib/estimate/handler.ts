import { randomUUID } from "crypto";
import { notifyLeadEmail } from "./email";
import { checkRateLimit, clientKeyFromRequest } from "./rate-limit";
import {
  LeadStorageError,
  saveLead,
  storageBackendLabel,
  storageDiagnostics,
  updateLead,
} from "./store";
import { formatPhoneDisplay, validateEstimateFormData } from "./validate";
import type { LeadRecord } from "./types";

function isCustomerFacingProduction() {
  return process.env["CONTEXT"] === "production" || process.env["VERCEL_ENV"] === "production";
}

function json(data: unknown, status = 200, headers?: HeadersInit) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      ...(headers || {}),
    },
  });
}

function saveFailureResponse(error: unknown) {
  const storageError = error instanceof LeadStorageError ? error : null;
  const diagnostics = storageDiagnostics();
  console.error("[estimate] save failed", {
    code: storageError?.code || "unknown",
    message: storageError?.message || (error instanceof Error ? error.message : String(error)),
    causeDetail: storageError?.causeDetail,
    diagnostics,
  });

  const publicMessage = "We could not save your request. Please call us or try again.";
  if (isCustomerFacingProduction()) {
    return json({ ok: false, errors: { form: publicMessage } }, 500);
  }

  const hint =
    storageError?.code === "storage_unavailable"
      ? "Storage backend unavailable (Netlify Blobs context missing and filesystem is not writable on this host)."
      : storageError?.causeDetail
        ? `Save failed (${storageError.code}).`
        : "Save failed on the server.";

  return json(
    {
      ok: false,
      errors: {
        form: `${publicMessage} ${hint}`,
        detail: storageError?.code || "save_failed",
      },
      diagnostics: {
        backendAttempt: diagnostics,
      },
    },
    500,
  );
}

/** Non-production storage probe — no secrets. */
export async function handleEstimateGet() {
  const diagnostics = storageDiagnostics();
  let backend: string = "unresolved";
  try {
    backend = await storageBackendLabel();
  } catch (error) {
    backend = error instanceof Error ? error.message : "error";
  }
  return json({
    ok: true,
    backend,
    diagnostics,
    customerFacingProduction: isCustomerFacingProduction(),
  });
}

export async function handleEstimatePost(request: Request) {
  const clientKey = clientKeyFromRequest(request);
  const limited = checkRateLimit(clientKey);
  if (!limited.ok) {
    return json(
      { ok: false, errors: { form: "Too many requests. Please try again later." } },
      429,
      { "Retry-After": String(limited.retryAfterSec) },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, errors: { form: "Invalid form submission." } }, 400);
  }

  const validated = validateEstimateFormData(form);
  if (!validated.ok) {
    return json({ ok: false, errors: validated.errors }, validated.status);
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
    // Email-first fallback when durable storage is unavailable (common on Next-on-Netlify
    // without Blobs context). Prefer not to lose the lead entirely.
    const emailOnly: LeadRecord = { ...draft, photos: [] };
    const emailResult = await notifyLeadEmail(emailOnly);
    if (emailResult.status === "sent") {
      console.error("[estimate] storage failed; lead delivered via email-only fallback", {
        id,
        storage: error instanceof LeadStorageError ? error.code : "unknown",
      });
      return json({
        ok: true,
        id,
        emailStatus: emailResult.status,
        backend: "email-only",
      });
    }

    return saveFailureResponse(error);
  }

  // Email is best-effort after a successful save — never roll back or fail the request.
  const emailResult = await notifyLeadEmail(saved);
  const withEmail: LeadRecord = {
    ...saved,
    emailStatus: emailResult.status,
    emailError: emailResult.error,
  };
  try {
    saved = await updateLead(withEmail);
  } catch (error) {
    console.error("[estimate] email status update failed (lead already saved)", error);
    saved = withEmail;
  }

  const backend = await storageBackendLabel();
  console.info(
    `[estimate] saved ${saved.id} via ${backend}; email=${saved.emailStatus}${
      saved.emailError ? ` (${saved.emailError})` : ""
    }`,
  );

  return json({
    ok: true,
    id: saved.id,
    emailStatus: saved.emailStatus,
    backend,
  });
}
