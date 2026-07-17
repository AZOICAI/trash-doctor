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

// Booking form → emails you via Web3Forms (free)
// 1) Go to https://web3forms.com → enter your email → copy Access Key
// 2) Paste the key below between the quotes
const WEB3FORMS_ACCESS_KEY = "d80e1d01-fcbc-4279-8f65-ddb1c8e8df61";

const bookForm = document.getElementById("bookForm");
const formSuccess = document.getElementById("formSuccess");
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
    return;
  }

  formSuccess.hidden = true;
  formSuccess.classList.remove("form-error");
  submitBtn.disabled = true;
  const originalLabel = submitBtn.innerHTML;
  submitBtn.textContent = "Sending…";

  const formData = Object.fromEntries(new FormData(bookForm).entries());

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `New Trash Doctor booking — ${formData.plan}`,
        from_name: "Trash Doctor Website",
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        plan: formData.plan,
      }),
    });
    const result = await res.json().catch(() => ({}));

    if (!res.ok || result.success === false) {
      throw new Error(result.message || "Could not send booking.");
    }

    formSuccess.textContent =
      "Thanks! We got your request and will call or text you shortly to confirm.";
    formSuccess.hidden = false;
    bookForm.reset();
  } catch (err) {
    formSuccess.textContent =
      err.message || "Something went wrong. Please call (469) 742-1073.";
    formSuccess.classList.add("form-error");
    formSuccess.hidden = false;
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalLabel;
  }
});
