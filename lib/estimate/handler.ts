import { randomUUID } from "crypto";
import { notifyEstimateEmails } from "./email";
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
      ? "Storage unavailable on this host. On Vercel set BLOB_READ_WRITE_TOKEN (or NETLIFY_SITE_ID + NETLIFY_AUTH_TOKEN) and RESEND_API_KEY."
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
    diagnostics: {
      ...diagnostics,
      hasLeadsAdminToken: Boolean(process.env.LEADS_ADMIN_TOKEN),
      hasResendApiKey: Boolean(process.env.RESEND_API_KEY),
      hasEstimateFromEmail: Boolean(process.env.ESTIMATE_FROM_EMAIL),
    },
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
    // Still notify by email so the inquiry is not invisible to the business, but do NOT
    // report website success without durable storage (requirement: save before success UI).
    const emailOnly: LeadRecord = { ...draft, photos: [] };
    const emails = await notifyEstimateEmails(emailOnly);
    console.error("[estimate] durable storage failed; emailed as emergency notify only", {
      id,
      storage: error instanceof LeadStorageError ? error.code : "unknown",
      staffEmail: emails.staff.status,
      customerEmail: emails.customer.status,
      staffError: emails.staff.error,
      customerError: emails.customer.error,
    });
    return saveFailureResponse(error);
  }

  // Email is best-effort after a successful save — never roll back or fail the request.
  const emails = await notifyEstimateEmails(saved);
  const withEmail: LeadRecord = {
    ...saved,
    emailStatus: emails.staff.status,
    emailError: emails.staff.error,
    customerEmailStatus: emails.customer.status,
    customerEmailError: emails.customer.error,
  };
  try {
    saved = await updateLead(withEmail);
  } catch (error) {
    console.error("[estimate] email status update failed (lead already saved)", error);
    saved = withEmail;
  }

  const backend = await storageBackendLabel();
  console.info(
    `[estimate] saved ${saved.id} via ${backend}; staffEmail=${saved.emailStatus}${
      saved.emailError ? ` (${saved.emailError})` : ""
    }; customerEmail=${saved.customerEmailStatus || "n/a"}${
      saved.customerEmailError ? ` (${saved.customerEmailError})` : ""
    }`,
  );

  return json({
    ok: true,
    id: saved.id,
    emailStatus: saved.emailStatus,
    customerEmailStatus: saved.customerEmailStatus,
    backend,
  });
}
