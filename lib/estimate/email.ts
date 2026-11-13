import { BUSINESS_PHONE } from "@/lib/seo";
import { PROJECT_TYPE_LABELS, type LeadRecord } from "./types";

export type EmailResult = { status: "sent" | "skipped" | "failed"; error?: string };

export type NotifyEmailsResult = {
  staff: EmailResult;
  customer: EmailResult;
};

function leadEmailBody(lead: LeadRecord) {
  const lines = [
    `New estimate request (${lead.id})`,
    `Submitted: ${lead.createdAt}`,
    "",
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email || "(not provided)"}`,
    `ZIP: ${lead.zip}`,
    `Street: ${lead.address || "(not provided)"}`,
    `Unit: ${lead.unit || "(none)"}`,
    `City: ${lead.city || "(not provided)"}`,
    `State: ${lead.state || "(not provided)"}`,
    `Project type: ${PROJECT_TYPE_LABELS[lead.projectType]}`,
    "",
    "Description:",
    lead.description || "(not provided)",
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

function customerConfirmationBody(lead: LeadRecord) {
  const project = PROJECT_TYPE_LABELS[lead.projectType];
  const location = [lead.address, lead.city, lead.state, lead.zip].filter(Boolean).join(", ") || lead.zip;
  return [
    `Hi ${lead.name.split(/\s+/)[0] || "there"},`,
    "",
    "Thanks for requesting a free estimate from HBG Construction. We received your request and will follow up soon.",
    "",
    "What you submitted:",
    `• Project type: ${project}`,
    `• Project ZIP: ${location}`,
    `• Reference: ${lead.id.slice(0, 8)}`,
    "",
    "Questions in the meantime?",
    `Call us at ${BUSINESS_PHONE}.`,
    "",
    "— HBG Construction",
    "Heritage Build Group LLC",
  ].join("\n");
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

async function dispatchEmail(to: string, subject: string, text: string): Promise<EmailResult> {
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

/** Staff notify to scott@… after the lead is already saved. Never throws. */
export async function notifyLeadEmail(lead: LeadRecord): Promise<EmailResult> {
  const to = process.env.ESTIMATE_NOTIFY_EMAIL || "scott@heritagebuildgroup.com";
  const subject = `[HBG Quote] ${PROJECT_TYPE_LABELS[lead.projectType]} — ${lead.zip} (${lead.id.slice(0, 8)})`;
  return dispatchEmail(to, subject, leadEmailBody(lead));
}

/** Customer confirmation — no pricing/promises; never throws. */
export async function sendCustomerConfirmation(lead: LeadRecord): Promise<EmailResult> {
  if (!lead.email) {
    return { status: "skipped", error: "No customer email" };
  }
  const subject = "We received your HBG Construction quote request";
  return dispatchEmail(lead.email, subject, customerConfirmationBody(lead));
}

/** Staff + customer emails after save. Each is independent; never throws. */
export async function notifyEstimateEmails(lead: LeadRecord): Promise<NotifyEmailsResult> {
  const staff = await notifyLeadEmail(lead);
  const customer = await sendCustomerConfirmation(lead);
  return { staff, customer };
}
