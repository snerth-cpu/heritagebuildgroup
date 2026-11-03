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
| Project type | Required — Metal Roofing, Metal Siding, Barn Siding (Board & Batten), Pole Building, Garage, Window / Door Replacement, Other | Jobber / site service labels |
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

If `GOOGLE_PLACES_API_KEY` is missing, **the form still works** with manual address entry. The street field shows a non-blocking note: “Address suggestions unavailable — enter address manually” (not a silent empty dropdown).

### Google Places setup (`GOOGLE_PLACES_API_KEY`)

1. Open [Google Cloud Console](https://console.cloud.google.com/) → create or select a project.
2. Enable **Places API (New)** (API Library → search “Places API (New)”). Legacy “Places API” alone is **not** enough for `places:autocomplete` / Place Details (New).
3. Ensure billing is enabled on the project (Places needs a billing account; free monthly credit applies).
4. Create an **API key** (APIs & Services → Credentials → Create credentials → API key).
5. **Restrict the key** (recommended before production traffic):
   - Application restriction: **None** while validating Deploy Previews, or **IP addresses** once you know Netlify/Vercel egress. Do **not** use HTTP referrer restriction — the key is used server-side only.
   - API restriction: allow **Places API (New)** only.
6. Set the env var (server-only — **never** `NEXT_PUBLIC_*`):

#### Netlify (required for PR #18 Deploy Preview)

1. Netlify → site **meek-hotteok-b000fa** (or your HBG site) → **Site configuration** → **Environment variables**.
2. Add `GOOGLE_PLACES_API_KEY` = your key.
3. Scopes: enable **Deploy Previews** and **Production** (and Branch deploys if you use them). Preview-only is enough to test PR #18.
4. **Trigger a redeploy** of the PR preview (Deploys → “Clear cache and deploy site”, or push a commit / “Retry deploy” on the preview). Env vars are baked in at build/runtime for the Next server — existing preview builds will keep returning `enabled: false` until redeployed.
5. Verify:
   ```bash
   curl -sS "https://deploy-preview-18--meek-hotteok-b000fa.netlify.app/api/address-suggest?q=123+main+pittsburgh"
   # expect: {"ok":true,"enabled":true,"suggestions":[...]}
   curl -sS "https://deploy-preview-18--meek-hotteok-b000fa.netlify.app/api/address-suggest?debug=1"
   # expect: enabled true + debug.reason "configured" (no key leaked)
   ```

#### Vercel

Project → Settings → Environment Variables → `GOOGLE_PLACES_API_KEY` for Preview + Production → Redeploy.

7. Billing: Places uses Google’s free monthly credit, then paid. Monitor usage in Cloud Console.

**Bias:** the server proxy sets `includedRegionCodes: ["us"]`, `regionCode: "us"`, and a Pittsburgh-centered `locationBias` circle (~200 km) so PA/OH results near the service area rank higher.

### Address autocomplete behavior

- Client probes `GET /api/address-suggest` on mount, then calls `GET /api/address-suggest?q=…&session=…` (debounced). **API key never leaves the server.**
- Selecting a suggestion calls `GET /api/address-suggest?placeId=…&session=…` for Place Details, then fills street / city / state / ZIP.
- Debug: `?debug=1` returns a safe `debug` object (`missing_GOOGLE_PLACES_API_KEY`, `configured`, or Google `status`/`message`/`code` — never the key). Server logs the same Google error summary.
- No OpenStreetMap / Nominatim path and no OSM attribution. No Mapbox unless added later with its own token.
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
