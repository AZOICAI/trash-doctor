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

## Book Now → email (Web3Forms) + pay (Stripe)

**Email alerts**
1. Go to [web3forms.com](https://web3forms.com)
2. Enter the email where you want bookings
3. Put the Access Key in `script.js` (`WEB3FORMS_ACCESS_KEY`)

**Card payments (Stripe Payment Links)**

Live Payment Links are already wired in `script.js` for:
- Monthly Checkup — $29.99/mo
- Quarterly Booster — $39.99 every 3 months
- First Aid — $89.95 one-time

After booking, customers are sent to Stripe Checkout to enter card details. Manage links in the [Stripe Dashboard](https://dashboard.stripe.com/payment-links).

