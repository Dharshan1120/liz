// ==========================================
//   LIZ STUDIO - PORTFOLIO JAVASCRIPT
// ==========================================

// ---- CUSTOM CURSOR ----
const cursor = document.getElementById("cursor");
const cursorDot = document.getElementById("cursorDot");
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + "px";
  cursorDot.style.top = mouseY + "px";
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.12;
  cursorY += (mouseY - cursorY) * 0.12;
  cursor.style.left = cursorX + "px";
  cursor.style.top = cursorY + "px";
  requestAnimationFrame(animateCursor);
}
animateCursor();

const hoverTargets = document.querySelectorAll("a, button, .service-card, .project-card, .profile-card, .skill-pill");
hoverTargets.forEach(el => {
  el.addEventListener("mouseenter", () => cursor.classList.add("hovering"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("hovering"));
});

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ---- MOBILE MENU ----
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const menuOverlay = document.getElementById("menuOverlay");
const mobileClose = document.getElementById("mobileClose");

hamburger.addEventListener("click", () => {
  mobileMenu.classList.add("open");
  menuOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
});

mobileClose.addEventListener("click", closeMobileMenu);

function closeMobileMenu() {
  mobileMenu.classList.remove("open");
  menuOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

// ---- SCROLL REVEAL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("revealed");
      }, index * 100);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
});

document.querySelectorAll(".card-reveal").forEach(el => revealObserver.observe(el));

// ---- CONTACT FORM ----
function handleFormSubmit(e) {
  e.preventDefault();
  const btnText = document.getElementById("btn-text");
  const btnLoading = document.getElementById("btn-loading");
  const formSuccess = document.getElementById("form-success");
  const sendBtn = document.getElementById("send-btn");

  sendBtn.disabled = true;
  btnText.style.display = "none";
  btnLoading.style.display = "inline";

  setTimeout(() => {
    sendBtn.disabled = false;
    btnText.style.display = "inline";
    btnLoading.style.display = "none";
    formSuccess.style.display = "block";
    document.getElementById("contactForm").reset();
    setTimeout(() => { formSuccess.style.display = "none"; }, 5000);
  }, 1800);
}

// ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ---- PARALLAX GLOW EFFECT ----
document.addEventListener("mousemove", (e) => {
  const glows = document.querySelectorAll(".hero-glow");
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  glows.forEach((glow, i) => {
    const factor = (i + 1) * 0.4;
    glow.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

// ---- TYPING ANIMATION FOR HERO TAGLINE ----
// Simple tilt effect on profile cards
document.querySelectorAll(".profile-card, .service-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

console.log("LIZ Studio - Built with passion by Dharshan & Baumendhra");
