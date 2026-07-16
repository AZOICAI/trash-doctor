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

// Booking form (client-side only — wire up to a form service or backend later)
const bookForm = document.getElementById("bookForm");
const formSuccess = document.getElementById("formSuccess");

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  formSuccess.hidden = false;
  bookForm.reset();
});
