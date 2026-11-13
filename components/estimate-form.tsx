"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import {
  captureAttribution,
  ensureGtag,
  pageContext,
  readAttribution,
  trackEvent,
  trackGenerateLeadOnce,
} from "@/lib/analytics";
import {
  ESTIMATE_FORM_PROJECT_TYPES,
  PROJECT_TYPE_LABELS,
  projectTypeFromServiceSlug,
  type EstimateFieldErrors,
  type ProjectType,
} from "@/lib/estimate/types";
import { normalizePhone } from "@/lib/estimate/validate";

const PHONE_MAX_DIGITS = 10;

/** Digits-only U.S. phone (no country code), capped at 10. */
function phoneDigitsInput(raw: string) {
  return normalizePhone(raw).slice(0, PHONE_MAX_DIGITS);
}

type FormState = {
  name: string;
  phone: string;
  email: string;
  zip: string;
  projectType: ProjectType | "";
  description: string;
};

const INITIAL: FormState = {
  name: "",
  phone: "",
  email: "",
  zip: "",
  projectType: "",
  description: "",
};

function serviceFromSearch() {
  try {
    return new URLSearchParams(window.location.search).get("service") || undefined;
  } catch {
    return undefined;
  }
}

export function EstimateForm({ serviceSlug }: { serviceSlug?: string }) {
  const formStartSent = useRef(false);
  const startedAt = useRef(Date.now());
  const formId = useId();
  const [values, setValues] = useState<FormState>(() => ({
    ...INITIAL,
    projectType: projectTypeFromServiceSlug(serviceSlug) || "",
  }));
  const [errors, setErrors] = useState<EstimateFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState("");

  useEffect(() => {
    const fromService = projectTypeFromServiceSlug(serviceSlug);
    if (fromService) {
      setValues((prev) => (prev.projectType ? prev : { ...prev, projectType: fromService }));
    }
  }, [serviceSlug]);

  useEffect(() => {
    ensureGtag();
    captureAttribution();
    startedAt.current = Date.now();

    const scrollToForm = () => {
      if (window.location.hash !== "#estimate-form") return;
      document.getElementById("estimate-form")?.scrollIntoView({ block: "start" });
    };
    requestAnimationFrame(scrollToForm);
    window.addEventListener("hashchange", scrollToForm);
    return () => window.removeEventListener("hashchange", scrollToForm);
  }, []);

  const markFormStart = () => {
    if (formStartSent.current) return;
    formStartSent.current = true;
    const service = serviceSlug || serviceFromSearch();
    trackEvent("form_start", {
      ...pageContext(),
      ...readAttribution(),
      form_id: "native_estimate",
      location: "estimate_form",
      ...(service ? { service_slug: service } : {}),
    });
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    markFormStart();
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as keyof EstimateFieldErrors] && !prev.form) return prev;
      const next = { ...prev };
      delete next[key as keyof EstimateFieldErrors];
      delete next.form;
      return next;
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrors({});

    // Build from the live form so the honeypot reflects what bots typed.
    // Consent is granted by submitting after the notice under the button.
    const formData = new FormData(event.currentTarget);
    formData.set("consent", "yes");
    formData.set("_form_started_at", String(startedAt.current));
    formData.set(
      "attribution",
      JSON.stringify({
        ...readAttribution(),
        landing_path: `${window.location.pathname}${window.location.search}`,
        service_slug: serviceSlug || serviceFromSearch(),
      }),
    );

    try {
      const res = await fetch("/api/estimate", { method: "POST", body: formData });
      const payload = (await res.json().catch(() => null)) as
        | { ok: true; id: string }
        | { ok: false; errors?: EstimateFieldErrors }
        | null;

      if (!res.ok || !payload || !payload.ok) {
        setErrors(
          payload && "errors" in payload && payload.errors
            ? payload.errors
            : { form: "Something went wrong. Please try again or call us." },
        );
        setSubmitting(false);
        return;
      }

      const id = payload.id;
      setSubmittedId(id);
      setSubmittedEmail(values.email.trim());

      // Fire only after a confirmed successful save — never on click alone.
      void trackGenerateLeadOnce(id, {
        ...(values.projectType ? { project_type: values.projectType } : {}),
        ...(serviceSlug || serviceFromSearch()
          ? { service_slug: serviceSlug || serviceFromSearch() }
          : {}),
      });

      try {
        const url = new URL(window.location.href);
        url.searchParams.set("submitted", id);
        url.searchParams.delete("lead");
        window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}${url.hash}`);
      } catch {
        /* ignore */
      }
    } catch {
      setErrors({ form: "Network error. Check your connection and try again, or call us." });
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <div id="estimate-form" className="estimate-form estimate-form--native success" role="status">
        <span aria-hidden="true">✓</span>
        <p className="eyebrow">REQUEST RECEIVED</p>
        <h2>Thanks — we got your estimate request.</h2>
        <p>
          {submittedEmail
            ? "A confirmation is on the way to the email you entered. We will also follow up by phone."
            : "We will follow up by phone to discuss your project."}{" "}
          Reference: <code>{submittedId.slice(0, 8)}</code>
        </p>
        <button
          type="button"
          className="text-button"
          onClick={() => {
            setSubmittedId(null);
            setSubmittedEmail("");
            startedAt.current = Date.now();
            setValues({
              ...INITIAL,
              projectType: projectTypeFromServiceSlug(serviceSlug) || "",
            });
            try {
              const url = new URL(window.location.href);
              url.searchParams.delete("submitted");
              window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
            } catch {
              /* ignore */
            }
          }}
        >
          Submit another request
        </button>
        <p className="form-note">PA Registered & Fully Insured</p>
      </div>
    );
  }

  return (
    <form
      id="estimate-form"
      className="estimate-form estimate-form--native estimate-form--simple"
      autoComplete="on"
      onSubmit={onSubmit}
      noValidate
      onFocus={markFormStart}
      onPointerDown={markFormStart}
    >
      <label htmlFor={`${formId}-name`}>
        Name <span className="req" aria-hidden="true">*</span>
        <input
          id={`${formId}-name`}
          name="name"
          type="text"
          autoComplete="name"
          autoCapitalize="words"
          required
          value={values.name}
          onChange={(e) => setField("name", e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${formId}-name-err` : undefined}
        />
        {errors.name ? (
          <span id={`${formId}-name-err`} className="field-error">
            {errors.name}
          </span>
        ) : null}
      </label>

      <label htmlFor={`${formId}-phone`}>
        Phone Number <span className="req" aria-hidden="true">*</span>
        <input
          id={`${formId}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          maxLength={PHONE_MAX_DIGITS}
          placeholder="(724) 555-0100"
          value={values.phone}
          onChange={(e) => setField("phone", phoneDigitsInput(e.target.value))}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? `${formId}-phone-err` : undefined}
        />
        {errors.phone ? (
          <span id={`${formId}-phone-err`} className="field-error">
            {errors.phone}
          </span>
        ) : null}
      </label>

      <label htmlFor={`${formId}-email`}>
        Email Address <span className="optional">(optional)</span>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => setField("email", e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${formId}-email-err` : undefined}
        />
        {errors.email ? (
          <span id={`${formId}-email-err`} className="field-error">
            {errors.email}
          </span>
        ) : null}
      </label>

      <label htmlFor={`${formId}-zip`}>
        Project ZIP Code <span className="req" aria-hidden="true">*</span>
        <input
          id={`${formId}-zip`}
          name="zip"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="postal-code"
          required
          maxLength={10}
          placeholder="16066"
          value={values.zip}
          onChange={(e) => setField("zip", e.target.value.replace(/[^\d-]/g, "").slice(0, 10))}
          aria-invalid={Boolean(errors.zip)}
          aria-describedby={errors.zip ? `${formId}-zip-err` : undefined}
        />
        {errors.zip ? (
          <span id={`${formId}-zip-err`} className="field-error">
            {errors.zip}
          </span>
        ) : null}
      </label>

      <label htmlFor={`${formId}-project`}>
        Project Type <span className="req" aria-hidden="true">*</span>
        <select
          id={`${formId}-project`}
          name="projectType"
          required
          value={values.projectType}
          onChange={(e) => setField("projectType", e.target.value as ProjectType | "")}
          aria-invalid={Boolean(errors.projectType)}
          aria-describedby={errors.projectType ? `${formId}-project-err` : undefined}
        >
          <option value="">Select…</option>
          {ESTIMATE_FORM_PROJECT_TYPES.map((key) => (
            <option key={key} value={key}>
              {PROJECT_TYPE_LABELS[key]}
            </option>
          ))}
        </select>
        {errors.projectType ? (
          <span id={`${formId}-project-err`} className="field-error">
            {errors.projectType}
          </span>
        ) : null}
      </label>

      <label htmlFor={`${formId}-description`}>
        Tell Us About Your Project <span className="optional">(optional)</span>
        <textarea
          id={`${formId}-description`}
          name="description"
          rows={3}
          value={values.description}
          onChange={(e) => setField("description", e.target.value)}
          aria-invalid={Boolean(errors.description)}
          placeholder="Building type, approximate size, or anything else we should know."
        />
        {errors.description ? <span className="field-error">{errors.description}</span> : null}
      </label>

      {/* Honeypot — visually hidden, not tabbable for assistive tech */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={`${formId}-company`}>Company website</label>
        <input
          id={`${formId}-company`}
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {errors.form ? (
        <p className="form-error" role="alert">
          {errors.form}
        </p>
      ) : null}

      <button type="submit" className="submit" disabled={submitting}>
        <span>{submitting ? "SENDING…" : "REQUEST MY FREE ESTIMATE"}</span>
        <span aria-hidden="true">{submitting ? "…" : "↗"}</span>
      </button>
      <p className="form-note form-note--consent">
        By submitting, you agree that HBG Construction may contact you about your estimate request.
      </p>
      <p className="form-note form-note--reassure">
        No obligation. We&apos;ll contact you to discuss your project.
      </p>
      <p className="form-note">PA Registered & Fully Insured</p>
    </form>
  );
}
