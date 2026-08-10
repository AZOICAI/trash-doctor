// Mobile nav
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

navToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

mainNav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// Before/after comparison slider
const slider = document.getElementById("baSlider");
const afterWrap = slider.querySelector(".ba-after-wrap");
const handle = slider.querySelector(".ba-handle");

function setSlider(clientX) {
  const rect = slider.getBoundingClientRect();
  let pct = ((clientX - rect.left) / rect.width) * 100;
  pct = Math.max(4, Math.min(96, pct));
  afterWrap.style.clipPath = `inset(0 0 0 ${pct}%)`;
  handle.style.left = `${pct}%`;
}

let dragging = false;
slider.addEventListener("pointerdown", (e) => {
  dragging = true;
  slider.setPointerCapture(e.pointerId);
  setSlider(e.clientX);
});
slider.addEventListener("pointermove", (e) => {
  if (dragging) setSlider(e.clientX);
});
slider.addEventListener("pointerup", () => (dragging = false));
slider.addEventListener("pointercancel", () => (dragging = false));

// Scroll reveal
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Booking form → emails you via Web3Forms, then Stripe Payment Link
const WEB3FORMS_ACCESS_KEY = "d80e1d01-fcbc-4279-8f65-ddb1c8e8df61";

// Live Stripe Payment Links keyed by plan + extra bins beyond the 2 included
// Extra Bin product: $5 one-time (First Aid) / $5/mo (Monthly) / $5 every 3 mo (Quarterly)
const STRIPE_PAYMENT_LINKS = {
  firstaid: {
    0: "https://book.stripe.com/5kQfZhb0DdF6df3daMf3a03", // $89.95
    1: "https://book.stripe.com/5kQeVd4CffNecaZ2w8f3a04", // +$5
    2: "https://book.stripe.com/8x26oH5Gj1Wo6QFb2Ef3a05", // +$10
    3: "https://book.stripe.com/5kQfZhc4H30s5MB1s4f3a06", // +$15
    4: "https://book.stripe.com/00waEX0lZ9oQej75Ikf3a07", // +$20
  },
  monthly: {
    0: "https://buy.stripe.com/eVqfZh8Sv7gIb6V7Qsf3a08", // $29.99/mo
    1: "https://buy.stripe.com/5kQ14nfgTfNe6QF0o0f3a09", // +$5/mo
    2: "https://buy.stripe.com/14A9AT1q39oQb6V5Ikf3a0a", // +$10/mo
    3: "https://buy.stripe.com/7sY5kDecP9oQ1wleeQf3a0b", // +$15/mo
    4: "https://buy.stripe.com/3cI28rfgT30s3EtfiUf3a0c", // +$20/mo
  },
  quarterly: {
    0: "https://buy.stripe.com/8x23cvc4HasUej7c6If3a0d", // $39.99/qtr
    1: "https://buy.stripe.com/eVqfZh2u7dF67UJfiUf3a0e", // +$5/qtr
    2: "https://buy.stripe.com/cNiaEX5Gj7gI4Ix4Egf3a0f", // +$10/qtr
    3: "https://buy.stripe.com/9B6dR94CfeJa0shdaMf3a0g", // +$15/qtr
    4: "https://buy.stripe.com/3cI4gz1q3eJaej7daMf3a0h", // +$20/qtr
  },
};

const PLAN_LABELS = {
  monthly: "Monthly Checkup — $29.99/mo",
  quarterly: "Quarterly Booster — $39.99/clean",
  firstaid: "First Aid (One-Time Deep Clean) — $89.95",
};

function extraBinsFromSelection(binsValue) {
  // Plans include 2 bins; extras are $5 each. "7+" caps online checkout at 4 extras.
  if (binsValue === "7+") return 4;
  const n = parseInt(binsValue, 10);
  if (!Number.isFinite(n) || n <= 2) return 0;
  return Math.min(4, n - 2);
}

function checkoutUrlFor(planKey, binsValue) {
  const byExtras = STRIPE_PAYMENT_LINKS[planKey];
  if (!byExtras) return "";
  const extras = extraBinsFromSelection(binsValue);
  return byExtras[extras] || byExtras[0] || "";
}

const bookForm = document.getElementById("bookForm");
const formSuccess = document.getElementById("formSuccess");
const payNext = document.getElementById("payNext");
const payLink = document.getElementById("payLink");
const submitBtn = bookForm.querySelector('button[type="submit"]');

bookForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (
    !WEB3FORMS_ACCESS_KEY ||
    WEB3FORMS_ACCESS_KEY === "PASTE_YOUR_ACCESS_KEY_HERE"
  ) {
    formSuccess.textContent =
      "Booking is almost ready — please call or text (469) 742-1073 for now.";
    formSuccess.classList.add("form-error");
    formSuccess.hidden = false;
    payNext.hidden = true;
    return;
  }

  formSuccess.hidden = true;
  formSuccess.classList.remove("form-error");
  payNext.hidden = true;
  submitBtn.disabled = true;
  const originalLabel = submitBtn.innerHTML;
  submitBtn.textContent = "Sending…";

  const formData = Object.fromEntries(new FormData(bookForm).entries());
  const planKey = formData.plan;
  const planLabel = PLAN_LABELS[planKey] || planKey;
  const extras = extraBinsFromSelection(formData.bins);
  const checkoutUrl = checkoutUrlFor(planKey, formData.bins);
  const extrasNote =
    extras > 0
      ? `${extras} extra bin(s) at $5 each included in Stripe total`
      : "No extra bins";

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `New Trash Doctor booking — ${planLabel} (${formData.bins} bins)`,
        from_name: "Trash Doctor Website",
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        plan: planLabel,
        bins: formData.bins,
        extra_bins: extrasNote,
        payment:
          checkoutUrl
            ? "Customer directed to Stripe checkout (plan + extras)"
            : "Stripe link not configured — collect payment manually",
        consent: formData.consent
          ? "Agreed to Terms, Privacy Policy, and call/text contact"
          : "",
      }),
    });
    const result = await res.json().catch(() => ({}));

    if (!res.ok || result.success === false) {
      throw new Error(result.message || "Could not send booking.");
    }

    bookForm.reset();

    if (checkoutUrl) {
      formSuccess.textContent =
        extras > 0
          ? `Request received! Checkout includes your plan plus ${extras} extra bin(s) ($5 each).`
          : "Request received! Continue to secure Stripe checkout to pay.";
      formSuccess.hidden = false;
      payLink.href = checkoutUrl;
      payNext.hidden = false;
      window.setTimeout(() => {
        window.location.href = checkoutUrl;
      }, 1200);
    } else {
      formSuccess.textContent =
        "Thanks! We got your request and will text you a secure payment link shortly.";
      formSuccess.hidden = false;
    }
  } catch (err) {
    formSuccess.textContent =
      err.message || "Something went wrong. Please call (469) 742-1073.";
    formSuccess.classList.add("form-error");
    formSuccess.hidden = false;
    payNext.hidden = true;
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalLabel;
  }
});
