interface Button {
    key: string;
    label: string;
    icon: string;
    steps?: string[];
}

export default function renderButtons(buttons: Button[], btnClass?: string) {
  let html = '';

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const steps = Array.isArray(button?.steps) ? button.steps : null;

    const stepsHtml = steps
      ? `<div class="visua11y-agent-contrast-bars">${steps
        .map(
          (_, index) =>
            `<span class="visua11y-agent-contrast-bar" data-index="${index}"></span>`
        )
        .join('')}</div>`
      : '';

    html += `<button class="visua11y-agent-btn ${btnClass || ''}" type="button" data-key="${button.key}" title="${button.label}">${button.icon}<span class="visua11y-agent-translate">${button.label}</span>${stepsHtml}</button>`;
  }

  return html;
}
