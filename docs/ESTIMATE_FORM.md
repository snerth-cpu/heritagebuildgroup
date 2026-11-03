# Native estimate form (replaces Jobber embed)

This branch ships a first-party `/estimate` form aligned with the archived Jobber work-request field set. **Production can stay on Jobber until this PR is reviewed and merged.** Rollback = revert the PR (Jobber embed is archived at `components/estimate-form-jobber.tsx`).

## Architecture

| Piece | Role |
| --- | --- |
| `components/estimate-form.tsx` | Native mobile-friendly form UI (Jobber-parity fields) |
| `components/address-autocomplete.tsx` | Street address suggestions (debounced) |
| `components/estimate-form-jobber.tsx` | Archived Jobber embed (unused) |
| `POST /api/estimate` | Validate → **save first** → email notify |
| `GET /api/address-suggest` | Server proxy for **Google Places Autocomplete (New)** + Place Details |
| `GET /api/leads` | Admin retrieval (`LEADS_ADMIN_TOKEN`) |
| `lib/estimate/store.ts` | Durable storage (Netlify Blobs or `.data/leads`) |
| `lib/estimate/email.ts` | Resend or SMTP webhook notify |
| `lib/analytics.ts` | `form_start` + `generate_lead` once per saved id |

## Form fields (vs Jobber)

| Field | Native | Jobber (typical / site mapping) |
| --- | --- | --- |
| Name | Required | Standard contact |
| Email | Required | Standard contact |
| Phone | Required | Standard contact |
| Street address | Required + Places autocomplete | Property address |
| Apt / unit | Optional | Address line 2 |
| City / State / ZIP | Required (often filled by Places) | Property address |
| Project type | Required — Metal Roofing, Metal Siding, Barn Siding (Board & Batten), Pole Building, Garage, Other | Jobber / site service labels |
| Project details | Required | Request description |
| Photos | Optional, de-emphasized | Often supported; kept as small add-on |
| ~~New / replacement / renovation~~ | **Removed** | Not on Jobber parity form |
| ~~Residential / commercial~~ | **Removed** | Prefer Jobber parity |
| ~~Timeline / size / budget~~ | **Removed** | Prefer Jobber parity |

## Environment variables

| Variable | Required? | Purpose |
| --- | --- | --- |
| `GOOGLE_PLACES_API_KEY` | Recommended | Server-only key for Places Autocomplete (New) + Place Details. **Never** expose as `NEXT_PUBLIC_*`. |
| `RESEND_API_KEY` | Recommended | Send lead email via [Resend](https://resend.com) (free tier) |
| `ESTIMATE_FROM_EMAIL` | Optional | Verified from-address (default Resend onboarding address) |
| `ESTIMATE_NOTIFY_EMAIL` | Optional | Default `scott@heritagebuildgroup.com` |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | Alt to Resend | SMTP credentials |
| `SMTP_WEBHOOK_URL` | Optional | HTTP relay if using SMTP_* without nodemailer |
| `LEADS_ADMIN_TOKEN` | Recommended | Bearer token for `GET /api/leads` |
| `NETLIFY_SITE_ID` + `NETLIFY_AUTH_TOKEN` | For Blobs off-Netlify | Use Netlify Blobs from Vercel/local |
| `NETLIFY_BLOBS_SITE_ID` / `NETLIFY_BLOBS_TOKEN` | Aliases | Same as above |
| `LEADS_LOCAL_DIR` | Optional | Local/dev store path (default `.data/leads`) |
| `NEXT_PUBLIC_GA_ID` | Optional | Defaults to `G-JJ9HCGZZEM` |

If email env vars are missing, **leads still save**; `emailStatus` is `skipped` and the error is stored on the lead record.

If `GOOGLE_PLACES_API_KEY` is missing, **the form still works** with manual address entry (no empty/broken dropdown).

### Google Places setup (`GOOGLE_PLACES_API_KEY`)

1. Open [Google Cloud Console](https://console.cloud.google.com/) → create or select a project.
2. Enable **Places API (New)** (includes Autocomplete + Place Details). Legacy “Places API” alone is not enough for the New endpoints this proxy calls.
3. Create an **API key** (Credentials).
4. **Restrict the key**:
   - Application restriction: prefer **IP** (server / Vercel / Netlify egress) or leave unrestricted only while testing.
   - API restriction: allow only **Places API (New)** (and Place Details / Autocomplete as listed).
5. Set `GOOGLE_PLACES_API_KEY` in Vercel and Netlify env (Preview + Production). Do **not** prefix with `NEXT_PUBLIC_`.
6. Redeploy. Typing a street on `/estimate` should show a suggestion dropdown; selecting fills street, city, state, and ZIP.
7. Billing: Places uses Google’s free monthly credit, then paid. Monitor usage in Cloud Console.

**Bias:** the server proxy sets `includedRegionCodes: ["us"]` and a Pittsburgh-centered `locationBias` circle (~200 km) so PA/OH results near the service area rank higher.

### Address autocomplete behavior

- Client calls `GET /api/address-suggest?q=…&session=…` (debounced). **API key never leaves the server.**
- Selecting a suggestion calls `GET /api/address-suggest?placeId=…&session=…` for Place Details, then fills street / city / state / ZIP.
- No OpenStreetMap / Nominatim path and no OSM attribution.
- Street + city + state + ZIP are **required**. Apt/unit is optional.

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

## Email setup (Resend)

1. Create a free Resend account; verify `heritagebuildgroup.com` (or use the onboarding sender for tests).
2. Set `RESEND_API_KEY` (+ optional `ESTIMATE_FROM_EMAIL`) in Vercel/Netlify env.
3. Deploy; submit a TEST lead; confirm inbox + stored lead.

## Fees / third parties

| Service | Cost note |
| --- | --- |
| Netlify Blobs | Included with Netlify; optional off-Netlify via site token |
| Local `.data/leads` | Free; durable on a persistent disk only (ephemeral on most serverless FS) |
| Resend | Free tier sufficient for estimate volume |
| SMTP | Whatever your existing mailbox provider charges |
| Google Places (New) | Free monthly credit, then paid — key server-side only |
| Jobber | Unchanged until this PR replaces production |

## Jobber rollback

1. Revert this PR, **or**
2. Point `app/estimate/page.tsx` at `EstimateForm` from `components/estimate-form-jobber.tsx` and restore Jobber listeners in `conversion-tracker.tsx` if needed.

## Deploy notes

- Hosting today: Vercel production + Netlify Deploy Previews (`@netlify/plugin-nextjs`).
- For durable Blobs on Vercel production, set `NETLIFY_SITE_ID` + `NETLIFY_AUTH_TOKEN` (or migrate production to Netlify). Without Blobs credentials, the API writes under `.data/leads` / writable FS — fine for local/preview; configure Blobs or another durable store before relying on production FS.
- After setting `GOOGLE_PLACES_API_KEY`, trigger a **preview rebuild** (push or redeploy) so Netlify/Vercel pick up the env var.
- Never commit secrets. `.env*` is gitignored.
