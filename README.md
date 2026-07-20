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
1. Create a free account at [stripe.com](https://stripe.com)
2. Finish business verification when Stripe asks
3. Dashboard → **Payment Links** → create one product/link for each plan:
   - Monthly Checkup — $29.99
   - Quarterly Booster — $39.99
   - First Aid — $89.95
4. Paste each `https://buy.stripe.com/...` URL into `STRIPE_PAYMENT_LINKS` in `script.js`
5. Push/redeploy

Until Stripe links are pasted, the form still emails you and tells the customer you’ll text a payment link.
