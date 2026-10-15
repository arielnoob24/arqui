// Correo que recibe las solicitudes del formulario
const CONTACT_EMAIL = "contacto@andestech.ec";

const header = document.querySelector(".header");
const menuBtn = document.querySelector(".menu-btn");
const form = document.getElementById("contact-form");

// Menú móvil
menuBtn.addEventListener("click", () => {
  const open = header.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
header.querySelectorAll(".mega a, .menu-item:not(:has(.mega)) .menu-link, .nav-cta").forEach((a) =>
  a.addEventListener("click", () => {
    header.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

// Pestañas de soluciones
const tabs = document.querySelectorAll(".tabs [role=tab]");
function selectTab(name) {
  tabs.forEach((t) => {
    const active = t.dataset.tab === name;
    t.setAttribute("aria-selected", active);
    document.getElementById(`panel-${t.dataset.tab}`).hidden = !active;
  });
}
tabs.forEach((t) => t.addEventListener("click", () => selectTab(t.dataset.tab)));
document.querySelectorAll(".mega [data-tab]").forEach((a) =>
  a.addEventListener("click", () => selectTab(a.dataset.tab))
);

// Animación al hacer scroll
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      revealObserver.unobserve(e.target);
    }
  }),
  { threshold: 0.15 }
);
document
  .querySelectorAll(".head, .diagram, .pillars, .feature, .stats-right > div, .tabs, .plan, .timeline li, .about-grid > *, .contact-grid > *")
  .forEach((el) => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });

// Contador animado de cifras
const countObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    countObserver.unobserve(e.target);
    const el = e.target;
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1400, 1);
      const value = target * (1 - Math.pow(1 - p, 3));
      el.textContent = `${el.dataset.prefix || ""}${value.toFixed(decimals)}${el.dataset.suffix || ""}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }),
  { threshold: 0.6 }
);
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));
}

// Botones de planes preseleccionan el plan en el formulario
document.querySelectorAll("[data-plan]").forEach((btn) =>
  btn.addEventListener("click", () => {
    form.servicio.value = `Plan ${btn.dataset.plan}`;
  })
);

// Envío del formulario: abre el cliente de correo con la solicitud lista
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  const subject = `Solicitud: ${d.servicio} - ${d.empresa}`;
  const body = [
    `Nombre: ${d.nombre}`,
    `Empresa: ${d.empresa}`,
    `Correo: ${d.correo}`,
    `Teléfono: ${d.telefono || "-"}`,
    `Interés: ${d.servicio}`,
    "",
    d.mensaje,
  ].join("\n");
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  form.querySelector(".form-status").textContent = "Gracias. Se abrió su correo con la solicitud lista para enviar.";
});

document.getElementById("year").textContent = new Date().getFullYear();
