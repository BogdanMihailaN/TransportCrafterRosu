const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("[data-mobile-menu]");

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const syncHeader = () => {
  const scrolled = window.scrollY > 12;
  header.classList.toggle("is-scrolled", scrolled);
};

const getBaseUrl = () => `${window.location.pathname}${window.location.search}`;

const pageWasReloaded = () => {
  const entries =
    typeof performance.getEntriesByType === "function"
      ? performance.getEntriesByType("navigation")
      : [];
  const navigation = entries[0];

  return navigation
    ? navigation.type === "reload"
    : performance.navigation && performance.navigation.type === 1;
};

const resetReloadPosition = () => {
  if (window.location.hash) {
    history.replaceState(null, "", getBaseUrl());
  }

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    syncHeader();
  });
};

const closeMenu = () => {
  menuButton.setAttribute("aria-expanded", "false");
  mobileMenu.classList.remove("is-open");
  header.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
};

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  mobileMenu.classList.toggle("is-open", !isOpen);
  header.classList.toggle("menu-active", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

mobileMenu.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMenu();
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    const targetId = href ? href.slice(1) : "";
    const target = targetId ? document.getElementById(targetId) : null;

    if (!target) {
      return;
    }

    event.preventDefault();
    closeMenu();
    target.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", getBaseUrl());
  });
});

if (pageWasReloaded()) {
  window.addEventListener("load", resetReloadPosition);
  window.addEventListener("pageshow", resetReloadPosition);
}

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();
