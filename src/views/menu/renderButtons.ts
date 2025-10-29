

export default function renderButtons(buttons, btnClass?: string) {
    let html = "";

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const steps = Array.isArray((button as any)?.steps) ? (button as any).steps : null;

        const stepsHtml = steps
            ? `<div class="nextbility-contrast-bars">${steps
                  .map((_, index) => `<span class="nextbility-contrast-bar" data-index="${index}"></span>`)
                  .join("")}</div>`
            : "";

        html += `<button class="nextbility-btn ${btnClass || ""}" type="button" data-key="${button.key}" title="${button.label}">${button.icon}<span class="nextbility-translate">${button.label}</span>${stepsHtml}</button>`;
    }

    return html;
}
