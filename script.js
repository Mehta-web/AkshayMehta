/* Update these values when the real links and contact service are ready. */
const SITE_CONFIG = {
  pdfConverterUrl: "https://mehta-web.github.io/PDF-Image-Converter/",
  myBillUrl: "https://mehta-web.github.io/MyBill/",
  youtubeUrl: "https://www.youtube.com/@mehta2009",
  contactEmail: "mehta2442009@gmail.com",
  emailJsServiceId: "service_57c07xb",
  emailJsTemplateId: "template_w1k83gh",
  emailJsPublicKey: "Cy8rC6SQ7njqr2OeF",
};

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  }
});

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    projectCards.forEach((card) => {
      card.classList.toggle("is-hidden", filter !== "all" && card.dataset.category !== filter);
    });
  });
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

function isValidExternalUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

document.querySelectorAll(".configured-link").forEach((link) => {
  const url = SITE_CONFIG[link.dataset.config];
  if (isValidExternalUrl(url)) {
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.classList.remove("is-unconfigured");
  } else {
    link.href = "#contact";
    link.classList.add("is-unconfigured");
    link.setAttribute("aria-label", "Ask Akshay about this website. Website URL is not configured yet.");
    link.innerHTML = "Ask about this website <b>↗</b>";
  }
});

document.querySelectorAll(".youtube-link").forEach((link) => {
  if (isValidExternalUrl(SITE_CONFIG.youtubeUrl)) {
    link.href = SITE_CONFIG.youtubeUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.href = "#contact";
    link.removeAttribute("target");
    link.removeAttribute("rel");
    link.setAttribute("aria-label", "YouTube channel URL is not configured yet. Go to contact section.");
    const description = link.querySelector(".social-copy > span");
    if (description) {
      description.textContent = "Channel link not set — get in touch";
    }
  }
});

const emailElement = document.querySelector("#contact-email");
if (SITE_CONFIG.contactEmail.trim()) {
  emailElement.textContent = SITE_CONFIG.contactEmail;
  const emailLink = document.createElement("a");
  emailLink.href = `mailto:${SITE_CONFIG.contactEmail.trim()}`;
  emailLink.textContent = SITE_CONFIG.contactEmail.trim();
  emailElement.replaceChildren(emailLink);
}

const contactForm = document.querySelector("#contact-form");
const formMessage = document.querySelector("#form-message");

function showFormMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.classList.toggle("error", isError);
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  showFormMessage("");

  if (!contactForm.reportValidity()) {
    showFormMessage("Please complete the required fields with a valid email address.", true);
    return;
  }

  const emailJsConfig = [
    SITE_CONFIG.emailJsServiceId,
    SITE_CONFIG.emailJsTemplateId,
    SITE_CONFIG.emailJsPublicKey
  ];
  if (emailJsConfig.some((value) => !value.trim())) {
    showFormMessage("Email delivery is not configured yet. Add your EmailJS service ID, template ID, and public key in script.js.", true);
    return;
  }

  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.setAttribute("aria-busy", "true");
  showFormMessage("Sending your message...");

  try {
    const formData = new FormData(contactForm);
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        service_id: SITE_CONFIG.emailJsServiceId,
        template_id: SITE_CONFIG.emailJsTemplateId,
        user_id: SITE_CONFIG.emailJsPublicKey,
        template_params: {
          name: formData.get("name"),
          email: formData.get("email"),
          service: formData.get("service"),
          details: formData.get("details")
        }
      })
    });
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`EmailJS returned ${response.status}: ${errorDetails}`);
    }
    contactForm.reset();
    showFormMessage("Thanks for reaching out. Your message has been sent.");
  } catch (error) {
    console.error("Contact form submission failed:", error);
    showFormMessage(`Your message could not be sent. ${error.message}`, true);
  } finally {
    submitButton.disabled = false;
    submitButton.removeAttribute("aria-busy");
  }
});
