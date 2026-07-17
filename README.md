# Trash Doctor — Bin Cleaning & Sanitizing

Marketing website for Trash Doctor, a residential trash can cleaning and sanitizing service.

## Structure

- `index.html` — the full single-page site (hero, how it works, before/after, why clean, pricing, reviews, CTA, footer)
- `styles.css` — all styling
- `script.js` — mobile nav, before/after slider, scroll reveals
- `assets/` — logo and image assets

## Run it

It's a static site — no build step. Open `index.html` in a browser, or serve the folder:

```powershell
# from the project folder
python -m http.server 8000
# or
npx serve .
```

Then visit http://localhost:8000

## Editing

- Business name and phone live in `index.html` — search for "Trash Doctor" and "(469)".
- Pricing plans are in the `#pricing` section of `index.html`.
- Colors are defined as CSS variables at the top of `styles.css`.

## Book Now → text message (Twilio)

The booking form posts to `/api/book`, which texts your phone via Twilio.

1. Create a free/trial account at [twilio.com](https://www.twilio.com)
2. Get a Twilio phone number
3. In Vercel → your project → **Settings → Environment Variables**, add:

| Name | Value |
|------|--------|
| `TWILIO_ACCOUNT_SID` | from Twilio console |
| `TWILIO_AUTH_TOKEN` | from Twilio console |
| `TWILIO_FROM_NUMBER` | your Twilio number, like `+15551234567` |
| `BOOKING_NOTIFY_TO` | `+14697421073` |

4. Redeploy the project (Deployments → Redeploy)
5. On Twilio trial, verify your personal phone number so it can receive texts

Until those are set, Book Now will ask the customer to call instead.
