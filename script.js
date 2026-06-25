document.documentElement.classList.add("js-enabled");

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const yearTarget = document.querySelector("[data-year]");
const filterButtons = document.querySelectorAll("[data-filter]");
const galleryItems = document.querySelectorAll("[data-category]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImg = document.querySelector("[data-lightbox-img]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const bookingForm = document.querySelector("[data-booking-form]");
const formStatus = document.querySelector("[data-form-status]");
const whatsappPhone = "34643665793";

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (navToggle && header && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.querySelector(".sr-only").textContent = isOpen ? "Cerrar menu" : "Abrir menu";
  });

  nav.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    header.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.querySelector(".sr-only").textContent = "Abrir menu";
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });

    galleryItems.forEach((item) => {
      const shouldShow = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

galleryItems.forEach((item) => {
  const trigger = item.querySelector(".work-item__button");
  const image = item.querySelector("img");

  if (!trigger || !image || !lightbox || !lightboxImg || !lightboxTitle) return;

  trigger.addEventListener("click", () => {
    lightboxImg.src = image.src.replace(/w=\d+/u, "w=1400");
    lightboxImg.alt = image.alt;
    lightboxTitle.textContent = item.dataset.title || image.alt;
    lightbox.hidden = false;
    document.body.classList.add("nav-open");
    lightboxClose?.focus();
  });
});

const closeLightbox = () => {
  if (!lightbox || !lightboxImg) return;
  lightbox.hidden = true;
  lightboxImg.src = "";
  document.body.classList.remove("nav-open");
};

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    header?.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
    const navLabel = navToggle?.querySelector(".sr-only");
    if (navLabel) navLabel.textContent = "Abrir menu";
  }
});

const validateField = (field) => {
  const isValid = field.checkValidity();
  field.classList.toggle("field-error", !isValid);
  return isValid;
};

if (bookingForm && formStatus) {
  bookingForm.addEventListener("input", (event) => {
    const field = event.target;
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
      validateField(field);
      formStatus.textContent = "";
    }
  });

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = [...bookingForm.querySelectorAll("input, select, textarea")];
    const isValid = fields.every(validateField);

    if (!isValid) {
      formStatus.textContent = "Revisa los campos marcados para preparar la solicitud.";
      return;
    }

    const formData = new FormData(bookingForm);
    const summary = [
      "Hola BrianTattoo, quiero reservar una cita.",
      "",
      `Nombre: ${formData.get("nombre")}`,
      `Idea / zona: ${formData.get("idea")}`
    ].join("\n");
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(summary)}`;

    bookingForm.dataset.lastRequest = summary;
    formStatus.textContent = "Abriendo WhatsApp con tu solicitud preparada.";
    window.open(whatsappUrl, "_blank", "noopener");
    bookingForm.reset();
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
