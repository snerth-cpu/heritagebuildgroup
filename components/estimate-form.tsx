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
  PROJECT_TYPE_LABELS,
  projectTypeFromServiceSlug,
  type EstimateFieldErrors,
  type ProjectType,
} from "@/lib/estimate/types";
import { normalizePhone } from "@/lib/estimate/validate";

const MAX_PHOTOS = 4;
const PHONE_MAX_DIGITS = 10;

/** Digits-only U.S. phone (no country code), capped at 10. */
function phoneDigitsInput(raw: string) {
  return normalizePhone(raw).slice(0, PHONE_MAX_DIGITS);
}

type FormState = {
  name: string;
  phone: string;
  email: string;
  address: string;
  unit: string;
  city: string;
  state: string;
  zip: string;
  projectType: ProjectType | "";
  description: string;
  consent: boolean;
};

const INITIAL: FormState = {
  name: "",
  phone: "",
  email: "",
  address: "",
  unit: "",
  city: "",
  state: "",
  zip: "",
  projectType: "",
  description: "",
  consent: false,
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
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<EstimateFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

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

  const onPhotosChange = (fileList: FileList | null) => {
    markFormStart();
    const next = fileList ? Array.from(fileList).slice(0, MAX_PHOTOS) : [];
    setPhotos(next);
    setErrors((prev) => {
      if (!prev.photos) return prev;
      const nextErrors = { ...prev };
      delete nextErrors.photos;
      return nextErrors;
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrors({});

    // Build from the live form so the honeypot reflects what bots typed.
    const formData = new FormData(event.currentTarget);
    formData.set("consent", values.consent ? "yes" : "");
    formData.set("_form_started_at", String(startedAt.current));
    formData.set(
      "attribution",
      JSON.stringify({
        ...readAttribution(),
        landing_path: `${window.location.pathname}${window.location.search}`,
        service_slug: serviceSlug || serviceFromSearch(),
      }),
    );
    formData.delete("photos");
    for (const photo of photos) formData.append("photos", photo);

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
        <h2>Thanks — we got your quote request.</h2>
        <p>
          We will follow up using the phone and email you provided. Reference:{" "}
          <code>{submittedId.slice(0, 8)}</code>
        </p>
        <button
          type="button"
          className="text-button"
          onClick={() => {
            setSubmittedId(null);
            setPhotos([]);
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
      className="estimate-form estimate-form--native"
      autoComplete="on"
      onSubmit={onSubmit}
      noValidate
      onFocus={markFormStart}
      onPointerDown={markFormStart}
    >
      <fieldset className="estimate-section">
        <legend>Contact</legend>
        <label htmlFor={`${formId}-name`}>
          Name
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
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
        <div className="form-row">
          <label htmlFor={`${formId}-email`}>
            Email
            <input
              id={`${formId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
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
          <label htmlFor={`${formId}-phone`}>
            Phone
            <input
              id={`${formId}-phone`}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              maxLength={PHONE_MAX_DIGITS}
              placeholder="7245550100"
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
        </div>
      </fieldset>

      <fieldset className="estimate-section">
        <legend>Project address</legend>
        <label htmlFor={`${formId}-address`}>
          Street address
          <input
            id={`${formId}-address`}
            name="address"
            type="text"
            autoComplete="address-line1"
            required
            value={values.address}
            onChange={(e) => setField("address", e.target.value)}
            aria-invalid={Boolean(errors.address)}
            aria-describedby={errors.address ? `${formId}-address-err` : undefined}
          />
          {errors.address ? (
            <span id={`${formId}-address-err`} className="field-error">
              {errors.address}
            </span>
          ) : null}
        </label>
        <label htmlFor={`${formId}-unit`}>
          Apt / unit <span className="optional">(optional)</span>
          <input
            id={`${formId}-unit`}
            name="unit"
            type="text"
            autoComplete="address-line2"
            value={values.unit}
            onChange={(e) => setField("unit", e.target.value)}
            aria-invalid={Boolean(errors.unit)}
            placeholder="Suite, apt, building"
          />
          {errors.unit ? <span className="field-error">{errors.unit}</span> : null}
        </label>
        <div className="form-row form-row--three">
          <label htmlFor={`${formId}-city`}>
            City
            <input
              id={`${formId}-city`}
              name="city"
              type="text"
              autoComplete="address-level2"
              required
              value={values.city}
              onChange={(e) => setField("city", e.target.value)}
              aria-invalid={Boolean(errors.city)}
            />
            {errors.city ? <span className="field-error">{errors.city}</span> : null}
          </label>
          <label htmlFor={`${formId}-state`}>
            State
            <input
              id={`${formId}-state`}
              name="state"
              type="text"
              autoComplete="address-level1"
              required
              value={values.state}
              onChange={(e) => setField("state", e.target.value)}
              aria-invalid={Boolean(errors.state)}
              placeholder="PA"
            />
            {errors.state ? <span className="field-error">{errors.state}</span> : null}
          </label>
          <label htmlFor={`${formId}-zip`}>
            ZIP
            <input
              id={`${formId}-zip`}
              name="zip"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              required
              value={values.zip}
              onChange={(e) => setField("zip", e.target.value)}
              aria-invalid={Boolean(errors.zip)}
              aria-describedby={errors.zip ? `${formId}-zip-err` : undefined}
            />
            {errors.zip ? (
              <span id={`${formId}-zip-err`} className="field-error">
                {errors.zip}
              </span>
            ) : null}
          </label>
        </div>
      </fieldset>

      <fieldset className="estimate-section">
        <legend>Project</legend>
        <label htmlFor={`${formId}-project`}>
          Project type
          <select
            id={`${formId}-project`}
            name="projectType"
            required
            value={values.projectType}
            onChange={(e) => setField("projectType", e.target.value as ProjectType | "")}
            aria-invalid={Boolean(errors.projectType)}
          >
            <option value="">Select…</option>
            {(Object.keys(PROJECT_TYPE_LABELS) as ProjectType[]).map((key) => (
              <option key={key} value={key}>
                {PROJECT_TYPE_LABELS[key]}
              </option>
            ))}
          </select>
          {errors.projectType ? <span className="field-error">{errors.projectType}</span> : null}
        </label>
        <label htmlFor={`${formId}-description`}>
          Project details
          <textarea
            id={`${formId}-description`}
            name="description"
            rows={4}
            required
            value={values.description}
            onChange={(e) => setField("description", e.target.value)}
            aria-invalid={Boolean(errors.description)}
            placeholder="What are you looking to build or replace? Sizes, materials, or access notes help."
          />
          {errors.description ? <span className="field-error">{errors.description}</span> : null}
        </label>
        <label className="upload upload--optional" htmlFor={`${formId}-photos`}>
          Photos <span className="optional">(optional)</span>
          <input
            id={`${formId}-photos`}
            name="photos"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif"
            multiple
            onChange={(e) => onPhotosChange(e.target.files)}
          />
          <small>Optional · up to {MAX_PHOTOS} · JPEG/PNG/WebP/HEIC · 4 MB each</small>
          {photos.length ? (
            <small>
              Selected: {photos.map((f) => f.name).join(", ")}
            </small>
          ) : null}
          {errors.photos ? <span className="field-error">{errors.photos}</span> : null}
        </label>
      </fieldset>

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

      <label className="consent" htmlFor={`${formId}-consent`}>
        <input
          id={`${formId}-consent`}
          name="consent"
          type="checkbox"
          checked={values.consent}
          onChange={(e) => setField("consent", e.target.checked)}
          aria-invalid={Boolean(errors.consent)}
        />
        <span>
          I agree that HBG Construction may contact me about this quote request using the phone and
          email I provided. Information is only used to respond to this request and will not be sold
          or shared for marketing.
        </span>
      </label>
      {errors.consent ? <span className="field-error">{errors.consent}</span> : null}

      {errors.form ? (
        <p className="form-error" role="alert">
          {errors.form}
        </p>
      ) : null}

      <button type="submit" className="submit" disabled={submitting}>
        <span>{submitting ? "SENDING…" : "REQUEST A QUOTE"}</span>
        <span aria-hidden="true">{submitting ? "…" : "↗"}</span>
      </button>
      <p className="form-note">
        Submitted information will only be used to respond to your quote request. It will not be sold
        or shared for marketing purposes.
      </p>
      <p className="form-note">PA Registered & Fully Insured</p>
    </form>
  );
}
