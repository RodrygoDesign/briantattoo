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
const scrollGallery = document.querySelector("[data-scroll-gallery]");
const scrollGalleryStage = scrollGallery?.querySelector(".scroll-gallery__stage");
const scrollGalleryGrid = document.querySelector("[data-scroll-grid]");
const scrollGalleryImages = scrollGalleryGrid?.querySelectorAll("img") || [];
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

const closeNav = () => {
  if (!header || !navToggle) return;
  header.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
  const navLabel = navToggle.querySelector(".sr-only");
  if (navLabel) navLabel.textContent = "Abrir menu";
};

if (navToggle && header && nav) {
  const navLabel = navToggle.querySelector(".sr-only");

  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    if (navLabel) navLabel.textContent = isOpen ? "Cerrar menu" : "Abrir menu";
  });

  nav.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    closeNav();
  });

  document.addEventListener("click", (event) => {
    if (!header.classList.contains("is-open")) return;
    if (header.contains(event.target)) return;
    closeNav();
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 921px)").matches) closeNav();
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

if (scrollGallery && scrollGalleryStage && scrollGalleryGrid && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let galleryTicking = false;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const updateScrollGallery = () => {
    galleryTicking = false;

    const rect = scrollGalleryStage.getBoundingClientRect();
    const distance = Math.max(1, scrollGalleryStage.offsetHeight - window.innerHeight);
    const progress = clamp(-rect.top / distance, 0, 1);
    const rotation = -18 + progress * 292;
    const scale = 0.68 + progress * 1.12;
    const imageRotation = -rotation;
    const imageScale = 1.18 - progress * 0.04;

    scrollGalleryGrid.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    scrollGalleryImages.forEach((image) => {
      image.style.transform = `rotate(${imageRotation}deg) scale(${imageScale})`;
    });
  };

  const requestGalleryUpdate = () => {
    if (galleryTicking) return;
    galleryTicking = true;
    window.requestAnimationFrame(updateScrollGallery);
  };

  updateScrollGallery();
  window.addEventListener("scroll", requestGalleryUpdate, { passive: true });
  window.addEventListener("resize", requestGalleryUpdate);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    closeNav();
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
