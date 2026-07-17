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

## Book Now → email (Web3Forms, free)

1. Go to [web3forms.com](https://web3forms.com)
2. Enter the email where you want bookings (free Gmail is fine)
3. Copy your **Access Key**
4. Paste it in `script.js` where it says `PASTE_YOUR_ACCESS_KEY_HERE`
5. Commit/push (or redeploy on Vercel)

When someone hits Book Now, that email gets the name, phone, address, and plan.
