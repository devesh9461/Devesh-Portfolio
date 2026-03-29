const header = document.querySelector(".header");
const menuToggle = document.querySelector("#menuToggle");
const navList = document.querySelector("#navLinks");
const navLinks = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
const contactForm = document.querySelector(".contact form");
const desktopBreakpoint = 900;

let lastScrollY = window.scrollY;
let activeLink = navLinks[0] || null;
let scrollTicking = false;

function isDesktopView() {
    return window.innerWidth > desktopBreakpoint;
}

function moveIndicator(targetLink) {
    if (!navList || !targetLink || !isDesktopView()) {
        navList?.style.setProperty("--indicator-opacity", "0");
        return;
    }

    const navRect = navList.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();

    navList.style.setProperty("--indicator-left", `${linkRect.left - navRect.left}px`);
    navList.style.setProperty("--indicator-width", `${linkRect.width}px`);
    navList.style.setProperty("--indicator-opacity", "1");
}

function setActiveLink(nextLink) {
    if (!nextLink) {
        return;
    }

    navLinks.forEach((link) => {
        link.classList.toggle("active", link === nextLink);
    });

    activeLink = nextLink;
    moveIndicator(activeLink);
}

function updateActiveLinkFromScroll() {
    if (!header || sections.length === 0) {
        return;
    }

    const offset = header.offsetHeight + 120;
    let currentSection = sections[0];

    sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - offset) {
            currentSection = section;
        }
    });

    const matchingLink = navLinks.find((link) => link.getAttribute("href") === `#${currentSection.id}`);

    if (matchingLink) {
        setActiveLink(matchingLink);
    }
}

function closeMenu() {
    if (!menuToggle || !navList) {
        return;
    }

    navList.classList.remove("active");
    menuToggle.classList.remove("is-active");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    header?.classList.remove("is-hidden");
}

function updateHeaderVisibility() {
    if (!header) {
        return;
    }

    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    const menuOpen = navList?.classList.contains("active");

    header.classList.toggle("is-scrolled", currentScrollY > 10);

    if (!isDesktopView() || menuOpen) {
        header.classList.remove("is-hidden");
        lastScrollY = currentScrollY;
        return;
    }

    if (scrollingDown && currentScrollY > 120) {
        header.classList.add("is-hidden");
    } else {
        header.classList.remove("is-hidden");
    }

    lastScrollY = currentScrollY;
}

function handleScroll() {
    updateHeaderVisibility();
    updateActiveLinkFromScroll();
}

if (menuToggle && navList) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navList.classList.toggle("active");

        menuToggle.classList.toggle("is-active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        document.body.classList.toggle("menu-open", isOpen);
        header?.classList.remove("is-hidden");
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        setActiveLink(link);
        closeMenu();
    });

    link.addEventListener("mouseenter", () => {
        moveIndicator(link);
    });

    link.addEventListener("focus", () => {
        moveIndicator(link);
    });
});

navList?.addEventListener("mouseleave", () => {
    moveIndicator(activeLink);
});

window.addEventListener(
    "scroll",
    () => {
        if (scrollTicking) {
            return;
        }

        scrollTicking = true;

        window.requestAnimationFrame(() => {
            handleScroll();
            scrollTicking = false;
        });
    },
    { passive: true }
);

window.addEventListener("resize", () => {
    if (isDesktopView()) {
        closeMenu();
    }

    updateHeaderVisibility();
    updateActiveLinkFromScroll();
    moveIndicator(activeLink);
});

window.addEventListener("load", () => {
    updateHeaderVisibility();
    updateActiveLinkFromScroll();
    moveIndicator(activeLink);
});

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
    });
}

updateHeaderVisibility();
updateActiveLinkFromScroll();
moveIndicator(activeLink);
