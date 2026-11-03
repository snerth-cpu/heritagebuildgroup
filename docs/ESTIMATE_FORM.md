# Native estimate form (replaces Jobber embed)

This branch ships a first-party `/estimate` form aligned with the archived Jobber work-request field set. **Production can stay on Jobber until this PR is reviewed and merged.** Rollback = revert the PR (Jobber embed is archived at `components/estimate-form-jobber.tsx`).

## Architecture

| Piece | Role |
| --- | --- |
| `components/estimate-form.tsx` | Native mobile-friendly form UI (Jobber-parity fields) |
| `components/estimate-form-jobber.tsx` | Archived Jobber embed (unused) |
| `POST /api/estimate` | Validate → **save first** → email notify |
| `GET /api/leads` | Admin retrieval (`LEADS_ADMIN_TOKEN`) |
| `lib/estimate/store.ts` | Durable storage (Netlify Blobs or `.data/leads`) |
| `lib/estimate/email.ts` | Staff notify to scott@ + customer confirmation (Resend or SMTP) |
| `lib/analytics.ts` | `form_start` + `generate_lead` once per saved id |

## Form fields (vs Jobber)

| Field | Native | Jobber (typical / site mapping) |
| --- | --- | --- |
| Name | Required (`autocomplete="name"`) | Standard contact |
| Email | Required (`type="email"`, `autocomplete="email"`) | Standard contact |
| Phone | Required (`type="tel"`, `autocomplete="tel"`) | Standard contact |
| Street address | Required (`autocomplete="address-line1"`) | Property address |
| Apt / unit | Optional (`autocomplete="address-line2"`) | Address line 2 |
| City / State / ZIP | Required (`address-level2` / `address-level1` / `postal-code`) | Property address |
| Project type | Required — Metal Roofing, Metal Siding, Barn Siding (Board & Batten), Pole Building, Garage, Window / Door Replacement, Other | Jobber / site service labels |
| Project details | Required | Request description |
| Photos | Optional, de-emphasized | Often supported; kept as small add-on |
| ~~New / replacement / renovation~~ | **Removed** | Not on Jobber parity form |
| ~~Residential / commercial~~ | **Removed** | Prefer Jobber parity |
| ~~Timeline / size / budget~~ | **Removed** | Prefer Jobber parity |

## Address entry (browser autofill)

Address fields are plain inputs inside a single `<form autoComplete="on">`. There is **no** Google Places, Nominatim, Mapbox, or other paid suggestion API.

Browsers (especially mobile Safari/Chrome with saved addresses) can autofill via standard HTML `autocomplete` attributes:

| Field | `autocomplete` |
| --- | --- |
| Street | `address-line1` |
| Unit | `address-line2` |
| City | `address-level2` |
| State | `address-level1` |
| ZIP | `postal-code` |
| Name / email / phone | `name` / `email` / `tel` |

Street, city, state, and ZIP remain **required** for manual entry. Apt/unit is optional. No API key or third-party address service is needed.

## Environment variables

| Variable | Required? | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | **Required for email** | Send staff + customer emails via [Resend](https://resend.com) (free tier) |
| `ESTIMATE_FROM_EMAIL` | Required for production mail | Verified from-address, e.g. `HBG Construction <quotes@heritagebuildgroup.com>` |
| `ESTIMATE_NOTIFY_EMAIL` | Optional | Staff inbox — default `scott@heritagebuildgroup.com` |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | Alt to Resend | SMTP credentials |
| `SMTP_WEBHOOK_URL` | Optional | HTTP relay if using SMTP_* without nodemailer |
| `LEADS_ADMIN_TOKEN` | Recommended | Bearer token for `GET /api/leads` |
| `NETLIFY_SITE_ID` + `NETLIFY_AUTH_TOKEN` | For Blobs off-Netlify | Use Netlify Blobs from Vercel/local |
| `NETLIFY_BLOBS_SITE_ID` / `NETLIFY_BLOBS_TOKEN` | Aliases | Same as above |
| `LEADS_LOCAL_DIR` | Optional | Local/dev store path (default `.data/leads`) |
| `NEXT_PUBLIC_GA_ID` | Optional | Defaults to `G-JJ9HCGZZEM` |

If email env vars are missing, **leads still save**; `emailStatus` is `skipped` and the error is stored on the lead record.

## Retrieving leads

```bash
curl -H "Authorization: Bearer $LEADS_ADMIN_TOKEN" \
  "https://www.heritagebuildgroup.com/api/leads?limit=20"

curl -H "Authorization: Bearer $LEADS_ADMIN_TOKEN" \
  "https://www.heritagebuildgroup.com/api/leads?id=<uuid>"
```

On Netlify Blobs: open the site’s Blobs store `hbg-estimate-leads` in the Netlify dashboard (keys `leads/<id>.json`, `photos/<id>/…`, `index.json`).

Locally: inspect `.data/leads/` (gitignored).

## GA4 / Google Ads

- Measurement ID: **`G-JJ9HCGZZEM`** (single tag via `@next/third-parties`).
- `form_start` — first real interaction with the native form.
- `generate_lead` — **only** after `POST /api/estimate` returns `{ ok: true, id }`, with `sessionStorage` dedupe per submission id. No PII in the event.
- Direct visits to `/estimate?submitted=…` or any thank-you URL do **not** fire `generate_lead`.
- Import GA4 `generate_lead` as the Google Ads primary conversion. **Do not** add a parallel primary `AW-` conversion for the same submit. No campaign/budget changes in this PR.

### Tag Assistant checks

1. Open `/estimate`, interact → one `form_start`.
2. Submit a labeled TEST lead → one `generate_lead` with `lead_source: native_form_save`.
3. Reload / revisit success URL → **no** second `generate_lead`.
4. Failed validation → no `generate_lead`.

## Email setup (Resend) — so Scott + the customer both get mail

After a successful save the form sends **two** emails (each best-effort; a failed email never drops the saved lead):

1. **Staff notify** → `scott@heritagebuildgroup.com` with the customer’s details  
2. **Customer confirmation** → the email address the customer entered  

### A. Create Resend + API key

1. Sign up at [https://resend.com](https://resend.com) (free tier is enough).
2. Open **API Keys** → **Create API Key** → copy the key (`re_…`).
3. **Domains** → **Add Domain** → `heritagebuildgroup.com`  
   Add the DNS records Resend shows (SPF/DKIM). Wait until the domain shows **Verified**.  
   Without a verified domain, Resend only allows sending to your own Resend-login email using `onboarding@resend.dev` — customers and scott@ will **not** receive real mail.

### B. Add env vars on Netlify (primary host)

1. Netlify → your site (`heritagebuildgroup` / meek-hotteok…) → **Site configuration** → **Environment variables**.
2. Add:
   - `RESEND_API_KEY` = `re_…` (secret; not `NEXT_PUBLIC_`)
   - `ESTIMATE_FROM_EMAIL` = `HBG Construction <quotes@heritagebuildgroup.com>`  
     (use an address on the **verified** domain)
   - Optional: `ESTIMATE_NOTIFY_EMAIL` = `scott@heritagebuildgroup.com` (this is already the default)
3. Scope variables to **Production** and **Deploy Previews** (so PR #18 preview can send mail too).
4. **Trigger a redeploy** of the deploy preview / production after saving env vars (env changes do not apply to an already-built deploy).

If you also use **Vercel** for production, add the same three variables there → Settings → Environment Variables → Production (and Preview if needed) → redeploy.

### C. Confirm it works

1. Submit a TEST lead on the preview with your real email as the customer email.
2. You should receive the short confirmation.
3. `scott@heritagebuildgroup.com` should receive `[HBG Quote] …` with name, phone, email, address, project type, and description.
4. If staff/customer mail is missing, check Netlify function logs for `staffEmail=` / `customerEmail=` and Resend’s **Logs** dashboard for bounce/reject reasons.

## Fees / third parties

| Service | Cost note |
| --- | --- |
| Netlify Blobs | Included with Netlify; optional off-Netlify via site token |
| Local `.data/leads` | Free; durable on a persistent disk only (ephemeral on most serverless FS) |
| Resend | Free tier sufficient for estimate volume |
| SMTP | Whatever your existing mailbox provider charges |
| Jobber | Unchanged until this PR replaces production |

## Jobber rollback

1. Revert this PR, **or**
2. Point `app/estimate/page.tsx` at `EstimateForm` from `components/estimate-form-jobber.tsx` and restore Jobber listeners in `conversion-tracker.tsx` if needed.

## Deploy notes

- Hosting today: Vercel production + Netlify Deploy Previews (`@netlify/plugin-nextjs`).
- **Netlify (preview + prod):** `/api/estimate` is rewritten to a native Netlify Function (`netlify/functions/estimate.mts`) so `@netlify/blobs` gets automatic site context. No manual Blobs tokens are required on Netlify. Local `.data/leads` is **not** used on Netlify’s read-only filesystem.
- **Vercel / off-Netlify:** the Next.js `app/api/estimate` route handles POSTs. Set `NETLIFY_SITE_ID` + `NETLIFY_AUTH_TOKEN` (or `NETLIFY_BLOBS_*` aliases) for durable Blobs. Without them, local FS is used when writable; otherwise the handler tries an email-only fallback, then returns a clear save error.
- Email (`RESEND_API_KEY` / SMTP) is optional when Blobs/FS save works — leads still save when email is skipped/failed.
- Never commit secrets. `.env*` is gitignored.
