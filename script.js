// Correo que recibe las solicitudes del formulario
const CONTACT_EMAIL = "contacto@andestech.ec";

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
document.querySelectorAll(".card, .benefit, .plan, .steps li, .team, .form").forEach((el) => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});

// Resaltar sección activa en el menú
const sectionObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      navLinks.querySelectorAll("a:not(.btn)").forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`)
      );
    }
  }),
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));

// Botones "Cotizar" preseleccionan el plan en el formulario
const form = document.getElementById("contact-form");
document.querySelectorAll("[data-plan]").forEach((btn) =>
  btn.addEventListener("click", () => {
    form.servicio.value = `Plan ${btn.dataset.plan}`;
  })
);

// Envío del formulario: abre el cliente de correo con la solicitud lista
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  const subject = `Solicitud de diagnóstico: ${d.empresa} (${d.servicio})`;
  const body = [
    `Nombre: ${d.nombre}`,
    `Empresa: ${d.empresa}`,
    `Correo: ${d.correo}`,
    `Teléfono: ${d.telefono || "-"}`,
    `Servicio de interés: ${d.servicio}`,
    "",
    d.mensaje,
  ].join("\n");
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  form.querySelector(".form-status").textContent = "¡Gracias! Se abrió su correo con la solicitud lista para enviar.";
});

document.getElementById("year").textContent = new Date().getFullYear();
