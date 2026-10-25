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

// One live Payment Link per plan. Extra bins are optional add-ons on Stripe checkout
// (adjustable quantity, up to 4 extra bins / $5 each).
const STRIPE_PAYMENT_LINKS = {
  firstaid: "https://book.stripe.com/5kQfZhb0DdF6df3daMf3a03",
  monthly: "https://buy.stripe.com/28EeVd1q3asU3EteeQf3a0l", // First cleaning paid now + monthly recurring billing after the first visit
  quarterly: "https://buy.stripe.com/fZucN5d8L6cE2Ap4Egf3a0m", // First cleaning paid now + quarterly recurring billing after the first visit
};

const PLAN_LABELS = {
  monthly: "Monthly Checkup — first cleaning $89.95, then normal monthly billing",
  quarterly: "Quarterly Booster — first cleaning $89.95, then normal quarterly billing",
  firstaid: "First Aid (One-Time Deep Clean) — $89.95",
};

function extraBinsFromSelection(binsValue) {
  // Plans include 2 bins; extras are $5 each. "7+" caps online checkout at 4 extras.
  if (binsValue === "7+") return 4;
  const n = parseInt(binsValue, 10);
  if (!Number.isFinite(n) || n <= 2) return 0;
  return Math.min(4, n - 2);
}

function checkoutUrlFor(planKey) {
  return STRIPE_PAYMENT_LINKS[planKey] || "";
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
  const checkoutUrl = checkoutUrlFor(planKey);
  const extrasNote =
    extras > 0
      ? `${extras} extra bin(s) — customer can add Extra Bin on Stripe checkout ($5 each, qty adjustable)`
      : "No extra bins (2 included)";

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
          ? `Request received! On the next page, add Extra Bin and set the quantity to ${extras} ($5 each).`
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
