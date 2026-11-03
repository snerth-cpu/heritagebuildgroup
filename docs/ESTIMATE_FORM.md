# Native estimate form (replaces Jobber embed)

This branch ships a first-party `/estimate` form. **Production can stay on Jobber until this PR is reviewed and merged.** Rollback = revert the PR (Jobber embed is archived at `components/estimate-form-jobber.tsx`).

## Architecture

| Piece | Role |
| --- | --- |
| `components/estimate-form.tsx` | Native mobile-friendly form UI |
| `components/address-autocomplete.tsx` | Street address suggestions (debounced) |
| `components/estimate-form-jobber.tsx` | Archived Jobber embed (unused) |
| `POST /api/estimate` | Validate → **save first** → email notify |
| `GET /api/address-suggest` | Server proxy for OpenStreetMap Nominatim autocomplete |
| `GET /api/leads` | Admin retrieval (`LEADS_ADMIN_TOKEN`) |
| `lib/estimate/store.ts` | Durable storage (Netlify Blobs or `.data/leads`) |
| `lib/estimate/email.ts` | Resend or SMTP webhook notify |
| `lib/analytics.ts` | `form_start` + `generate_lead` once per saved id |

## Environment variables

| Variable | Required? | Purpose |
| --- | --- | --- |
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
| `GOOGLE_PLACES_API_KEY` | **Not used** | Reserved note only — this form uses free Nominatim via server proxy (no Google key). Switch only if Places is preferred later. |

If email env vars are missing, **leads still save**; `emailStatus` is `skipped` and the error is stored on the lead record.

### Address autocomplete

- Client calls `GET /api/address-suggest?q=…` (debounced). **No API keys in the browser.**
- Server proxies [OpenStreetMap Nominatim](https://nominatim.org/) with a identifying `User-Agent`, per-IP rate limits, and ≤1 outbound request/second (Nominatim usage policy).
- Selecting a suggestion fills street, city, state, and ZIP when available.
- UI attribution: **© OpenStreetMap contributors**.
- Street address + ZIP are **required**. City/state are optional and usually filled by autocomplete.
- Budget is **not** collected.
- Alternative: Google Places Autocomplete would need `GOOGLE_PLACES_API_KEY` (or similar) on the **server** proxy only — Places has free monthly credit but is not zero-cost forever. Prefer Nominatim unless Places is already in the stack.

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
| OpenStreetMap Nominatim | Free public API; rate-limited; attribution required |
| Google Places (optional alt) | Free monthly credit, then paid — not wired unless chosen later |
| Jobber | Unchanged until this PR replaces production |

## Jobber rollback

1. Revert this PR, **or**
2. Point `app/estimate/page.tsx` at `EstimateForm` from `components/estimate-form-jobber.tsx` and restore Jobber listeners in `conversion-tracker.tsx` if needed.

## Deploy notes

- Hosting today: Vercel production + Netlify Deploy Previews (`@netlify/plugin-nextjs`).
- For durable Blobs on Vercel production, set `NETLIFY_SITE_ID` + `NETLIFY_AUTH_TOKEN` (or migrate production to Netlify). Without Blobs credentials, the API writes under `.data/leads` / writable FS — fine for local/preview; configure Blobs or another durable store before relying on production FS.
- Never commit secrets. `.env*` is gitignored.
