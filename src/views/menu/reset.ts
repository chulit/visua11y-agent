import { saveUserSettings, userSettings } from "@/globals/userSettings";
import { pluginConfig, pluginDefaults } from "@/globals/pluginConfig";
import runAccessibility from "./runAccessibility";
import { applyButtonPosition, applyButtonIcon } from "../widget/widget";
import { changeLanguage } from "@/i18n/changeLanguage";

export default function reset() {
    document?.querySelectorAll(".visua11y-agent-selected")?.forEach(el => el?.classList?.remove("visua11y-agent-selected"))

    userSettings.states = {};
    userSettings.position = undefined;
    userSettings.offset = undefined;
    userSettings.lang = undefined;

    pluginConfig.lang = pluginDefaults.lang;
    pluginConfig.position = pluginDefaults.position;
    pluginConfig.offset = Array.isArray(pluginDefaults.offset) ? [...pluginDefaults.offset] : [20, 20];
    pluginConfig.size = pluginDefaults.size;
    pluginConfig.icon = pluginDefaults.icon;

    applyButtonPosition();
    applyButtonIcon();

    const positionButtons = document.querySelectorAll<HTMLButtonElement>(".visua11y-agent-position-btn");
    positionButtons.forEach((btn) =>
        btn.classList.toggle("visua11y-agent-selected", btn.dataset.position === pluginConfig.position)
    );

    const $positionToggle = document.querySelector<HTMLButtonElement>(".visua11y-agent-position-toggle");
    const $positionCard = document.querySelector<HTMLElement>(".visua11y-agent-position-card");
    const $settingsToggle = document.querySelector<HTMLButtonElement>(".visua11y-agent-settings-toggle");
    const $settingsCard = document.querySelector<HTMLElement>(".visua11y-agent-settings-card");
    const $customPaletteTabs = document.querySelectorAll<HTMLButtonElement>(".visua11y-agent-custom-palette-tab");
    const $customPaletteRange = document.querySelector<HTMLInputElement>(".visua11y-agent-custom-palette-range");
    const $customPaletteBars = document.querySelectorAll<HTMLDivElement>(".visua11y-agent-contrast-bars");

    if ($positionToggle && $positionCard) {
        $positionToggle.setAttribute("aria-expanded", "false");
        $positionCard.classList.remove("visua11y-agent-position-open");
    }

    if ($settingsToggle && $settingsCard) {
        $settingsToggle.setAttribute("aria-expanded", "false");
        $settingsCard.classList.remove("visua11y-agent-settings-open");
    }

    $customPaletteTabs.forEach((tab) => {
        const isBackgrounds = tab.dataset.category === "backgrounds";
        tab.classList.toggle("is-active", isBackgrounds);
        tab.setAttribute("aria-selected", String(isBackgrounds));
    });

    if ($customPaletteRange) {
        $customPaletteRange.value = "0";
        $customPaletteRange.style.removeProperty("--visua11y-agent-palette-gradient");
        $customPaletteRange.style.removeProperty("--visua11y-agent-palette-thumb");
    }

    $customPaletteBars.forEach((barContainer) => {
        barContainer.classList.remove("is-visible");
        barContainer.querySelectorAll(".visua11y-agent-contrast-bar").forEach((bar) => bar.classList.remove("is-active"));
    });

    const $contrastCycleButton = document.querySelector<HTMLButtonElement>('.visua11y-agent-filter[data-key="contrast-cycle"]');
    if ($contrastCycleButton) {
        $contrastCycleButton.setAttribute("aria-pressed", "false");
        const label = $contrastCycleButton.querySelector<HTMLSpanElement>('.visua11y-agent-translate');
        if (label) {
            label.setAttribute("data-translate", "Contrast");
            label.textContent = "Contrast";
        }
        $contrastCycleButton.querySelectorAll('.visua11y-agent-contrast-bar').forEach((bar) => bar.classList.remove('is-active'));
        $contrastCycleButton.querySelector('.visua11y-agent-contrast-bars')?.classList.remove('is-visible');
    }

    const $languagePanel = document.querySelector<HTMLElement>("#visua11y-agent-language-panel");
    const $languageToggle = document.querySelector<HTMLButtonElement>(".visua11y-agent-menu-language");
    const $languageSearch = document.querySelector<HTMLInputElement>(".visua11y-agent-language-search");
    if ($languagePanel) {
        $languagePanel.hidden = true;
    }
    if ($languageToggle) {
        $languageToggle.setAttribute("aria-expanded", "false");
    }
    if ($languageSearch) {
        $languageSearch.value = "";
    }

    runAccessibility();
    saveUserSettings();
    changeLanguage(pluginDefaults.lang);
}
