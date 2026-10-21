/* =========================================================
   Avenu Roofing – Services page replica (vanilla JS)
   Features: sticky header, mobile nav, testimonial slider,
   animated counters, FAQ accordion, forms, scroll-to-top,
   reveal-on-scroll animations.
   ========================================================= */
"use strict";

/* ---------- Sticky header shadow ---------- */
const header = document.getElementById("siteHeader");
window.addEventListener("scroll", () => {
  header.classList.toggle("sticky-shadow", window.scrollY > 60);
  toTopBtn.classList.toggle("show", window.scrollY > 400);
});

/* ---------- Mobile navigation ---------- */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
navToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  navToggle.innerHTML = open
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});
document.addEventListener("click", (e) => {
  if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
    mainNav.classList.remove("open");
    navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }
});

/* ---------- Scroll-to-top button ---------- */
const toTopBtn = document.getElementById("toTop");
toTopBtn.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

/* ---------- Testimonial slider ---------- */
const testimonials = [
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ut orci urna. Mauris lacinia aliquam semper. Praesent venenatis mi ut neque ultrices dictum.",
    name: "Justin Deviz",
    role: "Happy Client",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ut orci urna. Mauris lacinia aliquam semper. Praesent venenatis mi ut neque ultrices dictum.",
    name: "Justin Deviz",
    role: "Happy Client",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ut orci urna. Mauris lacinia aliquam semper. Praesent venenatis mi ut neque ultrices dictum.",
    name: "Justin Deviz",
    role: "Happy Client",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ut orci urna. Mauris lacinia aliquam semper. Praesent venenatis mi ut neque ultrices dictum.",
    name: "Justin Deviz",
    role: "Happy Client",
  },
];

const tTrack = document.getElementById("tTrack");
const tDots = document.getElementById("tDots");
const stars = '<div class="t-stars">' + '<i class="fa-solid fa-star"></i>'.repeat(5) + "</div>";

testimonials.forEach((t) => {
  const slide = document.createElement("div");
  slide.className = "t-slide";
  slide.innerHTML = `
    ${stars}
    <p>${t.text}</p>
    <div class="t-author">
      <div class="t-avatar">${t.name.charAt(0)}</div>
      <div><h4>${t.name}</h4><span>${t.role}</span></div>
    </div>`;
  tTrack.appendChild(slide);
});

let tIndex = 0;
let slidesPerView = getPerView();
function getPerView() {
  const w = window.innerWidth;
  return w <= 640 ? 1 : w <= 991 ? 2 : 3;
}

function buildDots() {
  tDots.innerHTML = "";
  const pages = Math.ceil(testimonials.length / slidesPerView);
  for (let i = 0; i < pages; i++) {
    const b = document.createElement("button");
    b.setAttribute("aria-label", "Go to slide " + (i + 1));
    if (i === tIndex) b.classList.add("active");
    b.addEventListener("click", () => { tIndex = i; updateSlider(); });
    tDots.appendChild(b);
  }
}

function updateSlider() {
  const pages = Math.ceil(testimonials.length / slidesPerView);
  tIndex = (tIndex + pages) % pages;
  const slideW = tTrack.querySelector(".t-slide").offsetWidth + 28;
  tTrack.style.transform = `translateX(-${tIndex * slidesPerView * slideW}px)`;
  [...tDots.children].forEach((d, i) => d.classList.toggle("active", i === tIndex));
}

buildDots();
updateSlider();

// auto-play every 5s
let tTimer = setInterval(() => { tIndex++; updateSlider(); }, 5000);
tTrack.closest(".t-slider").addEventListener("mouseenter", () => clearInterval(tTimer));
tTrack.closest(".t-slider").addEventListener("mouseleave", () => {
  tTimer = setInterval(() => { tIndex++; updateSlider(); }, 5000);
});

window.addEventListener("resize", () => {
  const newPer = getPerView();
  if (newPer !== slidesPerView) {
    slidesPerView = newPer;
    tIndex = 0;
    buildDots();
    updateSlider();
  }
});

/* ---------- Animated counters ---------- */
const counters = document.querySelectorAll(".counter");
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const duration = 2000;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = (target * eased).toFixed(decimals);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------- Reveal on scroll + counter trigger ---------- */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("visible");
      el.querySelectorAll(".counter").forEach((c) => {
        if (!c.dataset.done) { c.dataset.done = "1"; animateCounter(c); }
      });
      io.unobserve(el);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ---------- FAQ accordion ---------- */
document.querySelectorAll(".faq-item").forEach((item) => {
  const q = item.querySelector(".faq-q");
  const a = item.querySelector(".faq-a");
  if (item.classList.contains("open")) a.style.maxHeight = a.scrollHeight + "px";
  q.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    // close all
    document.querySelectorAll(".faq-item").forEach((other) => {
      other.classList.remove("open");
      other.querySelector(".faq-a").style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add("open");
      a.style.maxHeight = a.scrollHeight + "px";
    }
  });
});

/* ---------- Estimate form validation ---------- */
const estForm = document.getElementById("estimateForm");
const formMsg = document.getElementById("formMsg");
estForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = estForm.fullname.value.trim();
  const email = estForm.email.value.trim();
  const phone = estForm.phone.value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  formMsg.className = "form-msg";
  if (!name || !email || !phone) {
    formMsg.classList.add("err");
    formMsg.textContent = "Please fill in your name, email and phone number.";
  } else if (!emailOk) {
    formMsg.classList.add("err");
    formMsg.textContent = "Please enter a valid email address.";
  } else {
    formMsg.classList.add("ok");
    formMsg.textContent = `Thank you, ${name}! Your free estimate request has been received.`;
    estForm.reset();
  }
});

/* ---------- Newsletter form ---------- */
document.getElementById("newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = e.target.querySelector("input");
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
    alert("Thanks for subscribing!");
    input.value = "";
  } else {
    alert("Please enter a valid email address.");
  }
});
