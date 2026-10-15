// Menú móvil
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

// Animación al hacer scroll
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      revealObserver.unobserve(e.target);
    }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll(".card, .process-band, .org, .bmc-cell").forEach((el) => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});

// Resaltar sección activa en el menú
const sections = document.querySelectorAll("main section[id]");
const sectionObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      navLinks.querySelectorAll("a").forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`)
      );
    }
  }),
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => sectionObserver.observe(s));
