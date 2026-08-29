const canvas = document.getElementById("matrixRain");
const context = canvas.getContext("2d");

const glyphs = "01<>[]{}:/SYSTEMPROFILEEXPERIENCECEDRICJBT";
let columns = [];
let frame = 0;

function resizeCanvas() {
    const density = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * density);
    canvas.height = Math.floor(window.innerHeight * density);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(density, 0, 0, density, 0, 0);

    const columnCount = Math.ceil(window.innerWidth / 18);
    columns = Array.from({ length: columnCount }, () => Math.random() * window.innerHeight);
}

function drawRain() {
    frame += 1;
    context.fillStyle = "rgba(5, 7, 6, 0.11)";
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);

    context.font = "16px 'Share Tech Mono', monospace";
    context.textAlign = "center";

    columns.forEach((y, index) => {
        const character = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = index * 18 + 9;
        const glow = frame % 12 === 0 ? 0.95 : 0.58;

        context.fillStyle = `rgba(38, 255, 129, ${glow})`;
        context.fillText(character, x, y);

        columns[index] = y > window.innerHeight + Math.random() * 800 ? 0 : y + 18;
    });

    requestAnimationFrame(drawRain);
}

resizeCanvas();
drawRain();

window.addEventListener("resize", resizeCanvas);

const sectionButtons = document.querySelectorAll("[data-section-target]");
const sectionLinks = document.querySelectorAll("[data-section-link]");
const sectionPanels = document.querySelectorAll("[data-section-panel]");
const defaultSection = "experiences";

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

window.addEventListener("hashchange", () => {
    showSection(window.location.hash.slice(1));
});

showSection(window.location.hash.slice(1) || defaultSection);