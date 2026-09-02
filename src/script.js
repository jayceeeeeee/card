const sectionButtons = document.querySelectorAll("[data-section-target]");
const sectionLinks = document.querySelectorAll("[data-section-link]");
const sectionPanels = document.querySelectorAll("[data-section-panel]");
const projectShareButtons = document.querySelectorAll("[data-share-project]");
const defaultSection = "services";
const pageTheme = document.body.dataset.theme;

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

async function copyText(text) {
    if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const input = document.createElement("input");
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
}

projectShareButtons.forEach((button) => {
    button.addEventListener("click", async () => {
        const projectLink = button.dataset.shareProject;

        if (!projectLink) {
            return;
        }

        const originalText = button.textContent;

        try {
            await copyText(projectLink);
            button.textContent = "Copied";
            window.setTimeout(() => {
                button.textContent = originalText;
            }, 1400);
        } catch {
            button.textContent = "Failed";
            window.setTimeout(() => {
                button.textContent = originalText;
            }, 1400);
        }
    });
});

window.addEventListener("hashchange", () => {
    showSection(window.location.hash.slice(1));
});

function applyPageTheme() {
    if (pageTheme && window.JayceeShared) {
        window.JayceeShared.setTheme(pageTheme);
    }
}

showSection(window.location.hash.slice(1) || defaultSection);

if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", applyPageTheme);
} else {
    applyPageTheme();
}
