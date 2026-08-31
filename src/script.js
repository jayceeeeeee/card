const sectionButtons = document.querySelectorAll("[data-section-target]");
const sectionLinks = document.querySelectorAll("[data-section-link]");
const sectionPanels = document.querySelectorAll("[data-section-panel]");
const themeButtons = document.querySelectorAll("[data-theme-choice]");
const defaultSection = "experiences";
const defaultTheme = "matrix";
const themeStorageKey = "jaycee-profile-theme";

function getStoredTheme() {
    try {
        return localStorage.getItem(themeStorageKey);
    } catch {
        return null;
    }
}

function storeTheme(theme) {
    try {
        localStorage.setItem(themeStorageKey, theme);
    } catch {
        return;
    }
}

function getKnownSection(target) {
    return Array.from(sectionPanels).some((panel) => panel.dataset.sectionPanel === target)
        ? target
        : defaultSection;
}

function showSection(target, options = {}) {
    const nextSection = getKnownSection(target);

    sectionButtons.forEach((sectionButton) => {
        const isActive = sectionButton.dataset.sectionTarget === nextSection;
        sectionButton.classList.toggle("is-active", isActive);
        sectionButton.setAttribute("aria-pressed", String(isActive));
    });

    sectionPanels.forEach((panel) => {
        const isTargetPanel = panel.dataset.sectionPanel === nextSection;
        panel.hidden = !isTargetPanel;
        panel.classList.toggle("is-visible", isTargetPanel);
    });

    if (options.updateHash) {
        history.pushState(null, "", `#${nextSection}`);
    }
}

sectionButtons.forEach((button) => {
    button.addEventListener("click", () => {
        showSection(button.dataset.sectionTarget, { updateHash: true });
    });
});

sectionLinks.forEach((link) => {
    link.addEventListener("click", () => {
        showSection(link.dataset.sectionLink, { updateHash: true });
    });
});

function getKnownTheme(theme) {
    return Array.from(themeButtons).some((button) => button.dataset.themeChoice === theme)
        ? theme
        : defaultTheme;
}

function setTheme(theme) {
    const nextTheme = getKnownTheme(theme);

    document.body.dataset.theme = nextTheme;

    themeButtons.forEach((button) => {
        const isActive = button.dataset.themeChoice === nextTheme;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    storeTheme(nextTheme);
}

themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        setTheme(button.dataset.themeChoice);
    });
});

window.addEventListener("hashchange", () => {
    showSection(window.location.hash.slice(1));
});

showSection(window.location.hash.slice(1) || defaultSection);
setTheme(getStoredTheme() || defaultTheme);
