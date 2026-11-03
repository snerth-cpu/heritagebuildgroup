import {
  PROPERTY_TYPE_LABELS,
  PROJECT_TYPE_LABELS,
  TIMELINE_LABELS,
  WORK_TYPE_LABELS,
  type LeadRecord,
} from "./types";

export type EmailResult = { status: "sent" | "skipped" | "failed"; error?: string };

function leadEmailBody(lead: LeadRecord) {
  const lines = [
    `New estimate request (${lead.id})`,
    `Submitted: ${lead.createdAt}`,
    "",
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Street: ${lead.address}`,
    `City: ${lead.city || "(not provided)"}`,
    `State: ${lead.state || "(not provided)"}`,
    `ZIP: ${lead.zip}`,
    `Property: ${PROPERTY_TYPE_LABELS[lead.propertyType]}`,
    `Project type: ${PROJECT_TYPE_LABELS[lead.projectType]}`,
    `Work type: ${WORK_TYPE_LABELS[lead.workType]}`,
    `Timeline: ${TIMELINE_LABELS[lead.timeline]}`,
    `Size: ${lead.projectSize || "(not provided)"}`,
    "",
    "Description:",
    lead.description,
    "",
    `Photos attached in storage: ${lead.photos.length}`,
    lead.photos.map((p) => `- ${p.filename} (${p.contentType}, ${p.size} bytes)`).join("\n") ||
      "- none",
    "",
    "Attribution (non-PII):",
    JSON.stringify(lead.attribution || {}, null, 2),
  ];
  return lines.join("\n");
}

async function sendViaResend(to: string, subject: string, text: string): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { status: "skipped", error: "RESEND_API_KEY not set" };

  const from = process.env.ESTIMATE_FROM_EMAIL || "HBG Construction <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { status: "failed", error: `Resend ${res.status}: ${body.slice(0, 300)}` };
  }
  return { status: "sent" };
}

async function sendViaSmtp(to: string, subject: string, text: string): Promise<EmailResult> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    return { status: "skipped", error: "SMTP_* not fully configured" };
  }

  // Lightweight SMTP without nodemailer dependency: use Resend-style HTTP if SMTP_URL points to a relay,
  // otherwise document that SMTP needs nodemailer. Prefer Resend for this stack.
  // For environments with only SMTP, we attempt a minimal TCP-less approach via fetch to a webhook if set.
  if (process.env.SMTP_WEBHOOK_URL) {
    const res = await fetch(process.env.SMTP_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        from: process.env.ESTIMATE_FROM_EMAIL || user,
        subject,
        text,
        host,
      }),
    });
    if (!res.ok) {
      return { status: "failed", error: `SMTP webhook ${res.status}` };
    }
    return { status: "sent" };
  }

  return {
    status: "skipped",
    error:
      "SMTP_HOST/USER/PASS set but no nodemailer transport; set RESEND_API_KEY or SMTP_WEBHOOK_URL",
  };
}

/** Notify scott@… after the lead is already saved. Never throws. */
export async function notifyLeadEmail(lead: LeadRecord): Promise<EmailResult> {
  const to = process.env.ESTIMATE_NOTIFY_EMAIL || "scott@heritagebuildgroup.com";
  const subject = `[HBG Quote] ${PROJECT_TYPE_LABELS[lead.projectType]} — ${lead.zip} (${lead.id.slice(0, 8)})`;
  const text = leadEmailBody(lead);

  try {
    if (process.env.RESEND_API_KEY) {
      return await sendViaResend(to, subject, text);
    }
    if (process.env.SMTP_HOST) {
      return await sendViaSmtp(to, subject, text);
    }
    return { status: "skipped", error: "No email provider configured (RESEND_API_KEY or SMTP_*)" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email error";
    return { status: "failed", error: message };
  }
}
