import { saveUserSettings, userSettings } from "@/globals/userSettings";
import { pluginConfig, pluginDefaults } from "@/globals/pluginConfig";
import runAccessibility from "./runAccessibility";
import { applyButtonPosition, applyButtonIcon } from "../widget/widget";
import { changeLanguage } from "@/i18n/changeLanguage";

export default function reset() {
    document?.querySelectorAll(".nextbility-selected")?.forEach(el => el?.classList?.remove("nextbility-selected"))

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

    const positionButtons = document.querySelectorAll<HTMLButtonElement>(".nextbility-position-btn");
    positionButtons.forEach((btn) =>
        btn.classList.toggle("nextbility-selected", btn.dataset.position === pluginConfig.position)
    );

    const $positionToggle = document.querySelector<HTMLButtonElement>(".nextbility-position-toggle");
    const $positionCard = document.querySelector<HTMLElement>(".nextbility-position-card");
    const $settingsToggle = document.querySelector<HTMLButtonElement>(".nextbility-settings-toggle");
    const $settingsCard = document.querySelector<HTMLElement>(".nextbility-settings-card");
    const $customPaletteTabs = document.querySelectorAll<HTMLButtonElement>(".nextbility-custom-palette-tab");
    const $customPaletteRange = document.querySelector<HTMLInputElement>(".nextbility-custom-palette-range");
    const $customPaletteBars = document.querySelectorAll<HTMLDivElement>(".nextbility-contrast-bars");

    if ($positionToggle && $positionCard) {
        $positionToggle.setAttribute("aria-expanded", "false");
        $positionCard.classList.remove("nextbility-position-open");
    }

    if ($settingsToggle && $settingsCard) {
        $settingsToggle.setAttribute("aria-expanded", "false");
        $settingsCard.classList.remove("nextbility-settings-open");
    }

    $customPaletteTabs.forEach((tab) => {
        const isBackgrounds = tab.dataset.category === "backgrounds";
        tab.classList.toggle("is-active", isBackgrounds);
        tab.setAttribute("aria-selected", String(isBackgrounds));
    });

    if ($customPaletteRange) {
        $customPaletteRange.value = "0";
        $customPaletteRange.style.removeProperty("--nextbility-palette-gradient");
        $customPaletteRange.style.removeProperty("--nextbility-palette-thumb");
    }

    $customPaletteBars.forEach((barContainer) => {
        barContainer.classList.remove("is-visible");
        barContainer.querySelectorAll(".nextbility-contrast-bar").forEach((bar) => bar.classList.remove("is-active"));
    });

    const $contrastCycleButton = document.querySelector<HTMLButtonElement>('.nextbility-filter[data-key="contrast-cycle"]');
    if ($contrastCycleButton) {
        $contrastCycleButton.setAttribute("aria-pressed", "false");
        const label = $contrastCycleButton.querySelector<HTMLSpanElement>('.nextbility-translate');
        if (label) {
            label.setAttribute("data-translate", "Contrast");
            label.textContent = "Contrast";
        }
        $contrastCycleButton.querySelectorAll('.nextbility-contrast-bar').forEach((bar) => bar.classList.remove('is-active'));
        $contrastCycleButton.querySelector('.nextbility-contrast-bars')?.classList.remove('is-visible');
    }

    runAccessibility();
    saveUserSettings();
    changeLanguage(pluginDefaults.lang);
}
