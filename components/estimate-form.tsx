"use client";

import { useEffect } from "react";

const JOBBER_CONTAINER_ID = "fdc5a674-3e03-4178-a0d2-29eb4a6a2613-5089699";
const JOBBER_FORM_URL = "https://clienthub.getjobber.com/client_hubs/fdc5a674-3e03-4178-a0d2-29eb4a6a2613/public/work_request/embedded_work_request_form?form_id=5089699";
const JOBBER_SCRIPT_SRC = "https://d3ey4dbjkt2f6s.cloudfront.net/assets/static_link/work_request_embed_snippet.js";
const JOBBER_CSS_HREF = "https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css";

let pendingCleanup: number | null = null;

function ensureJobberCss() {
  if (document.querySelector(`link[href="${JOBBER_CSS_HREF}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = JOBBER_CSS_HREF;
  link.media = "screen";
  document.head.appendChild(link);
}

function injectJobberScript() {
  if (document.querySelector(`script[data-jobber-embed="true"]`)) return;
  const container = document.getElementById(JOBBER_CONTAINER_ID);
  if (!container) return;

  const script = document.createElement("script");
  script.src = JOBBER_SCRIPT_SRC;
  script.async = false;
  script.dataset.jobberEmbed = "true";
  script.setAttribute("clienthub_id", JOBBER_CONTAINER_ID);
  script.setAttribute("form_url", JOBBER_FORM_URL);
  container.insertAdjacentElement("afterend", script);
}

export function EstimateForm() {
  useEffect(() => {
    if (pendingCleanup != null) {
      window.clearTimeout(pendingCleanup);
      pendingCleanup = null;
    }

    const container = document.getElementById(JOBBER_CONTAINER_ID);
    if (!container) return;

    ensureJobberCss();
    injectJobberScript();

    const scrollToForm = () => {
      if (window.location.hash !== "#estimate-form") return;
      document.getElementById("estimate-form")?.scrollIntoView({ block: "start" });
    };
    requestAnimationFrame(scrollToForm);
    window.addEventListener("hashchange", scrollToForm);

    return () => {
      window.removeEventListener("hashchange", scrollToForm);
      pendingCleanup = window.setTimeout(() => {
        document.querySelectorAll(`script[data-jobber-embed="true"]`).forEach((el) => el.remove());
        const node = document.getElementById(JOBBER_CONTAINER_ID);
        node?.replaceChildren();
        node?.classList.remove("jobber-inline-work-request", "jobber-spinner");
        pendingCleanup = null;
      }, 250);
    };
  }, []);

  return (
    <div id="estimate-form" className="estimate-form jobber-embed">
      <div id={JOBBER_CONTAINER_ID} />
      <p className="form-note">Submitted information will only be used to respond to your estimate request. It will not be sold or shared for marketing purposes.</p>
      <p className="form-note">PA Registered & Fully Insured</p>
    </div>
  );
}
