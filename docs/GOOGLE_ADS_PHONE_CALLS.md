# Google Ads — website phone-call conversion tracking

Tracks **Calls to a phone number on your website** via Google’s forwarding-number replacement. Calls still ring **(724) 719-7237**.

## What ships in code

- Single `gtag.js` from existing GA4 (`G-JJ9HCGZZEM`) — **no second Google tag script**
- After GA loads: `gtag('config', 'AW-…')` plus the phone snippet `gtag('config', 'AW-…/LABEL', { phone_conversion_number: '(724) 719-7237', … })`
- Visible numbers use `PhoneLink` + CSS class `hbg-phone` so Google can replace text and `tel:` hrefs
- `generate_lead` / estimate form tracking unchanged
- GA4 `click_to_call` remains a click analytics event only — **not** an Ads phone-call conversion (those require a Google forwarding number + minimum call length)

## Required env (Vercel / local)

From Google Ads → Goals → Conversions → your **Calls to a phone number on your website** action → tag setup:

| Variable | Example | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | `AW-1234567890` | Ads tag / conversion ID |
| `NEXT_PUBLIC_GOOGLE_ADS_PHONE_CONVERSION_LABEL` | `AbCdefGhIjkLmNoP` | Label from that phone conversion action |

Or one combined value:

| Variable | Example |
| --- | --- |
| `NEXT_PUBLIC_GOOGLE_ADS_PHONE_CONVERSION` | `AW-1234567890/AbCdefGhIjkLmNoP` |

Until these are set, the phone snippet does **not** load (safe no-op).

## Tag Assistant validation (before Production)

Do **not** enable on Production until Tag Assistant looks correct.

1. Set the Ads ID + label env vars on a **Preview** deployment **or** locally.
2. For Preview / localhost Tag Assistant only, also set:
   - `NEXT_PUBLIC_ENABLE_TAG_DEBUG=1`
3. Open the preview (or `http://localhost:3000`) with [Google Tag Assistant](https://tagassistant.google.com/).
4. Confirm:
   - One `gtag/js` load (GA4)
   - `config` for `G-JJ9HCGZZEM`
   - `config` for `AW-…`
   - `config` for `AW-…/LABEL` with `phone_conversion_number: (724) 719-7237`
   - No duplicate Ads/GA tags
5. After validation: remove `NEXT_PUBLIC_ENABLE_TAG_DEBUG` from Preview, set the Ads env vars on **Production**, then deploy Production.

## Live Ads check (after Production)

1. Wait up to ~1 hour after the conversion action is created.
2. Click your own Search ad (chargeable click) → land on the site.
3. Phone displays should show a **Google forwarding number**; calling it still reaches HBG.
4. Non-Ads visitors keep seeing `(724) 719-7237`.
