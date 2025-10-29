// @ts-ignore
import template from "./menu.html";

import FilterButtons from "./FilterButtons";
import ContentButtons from "./ContentButtons";
import ToolButtons from "../../enum/TOOL_PRESETS";
import widgetSettingsIcon from "../../icons/widgetSettingsIcon.svg";
import logoAsset from "../../icons/logo.png";

import renderButtons from "./renderButtons";
import adjustFontSize from "../../tools/adjustFontSize";
import renderTools from "./renderTools";
import reset from "./reset";

import { ILanguage, LANGUAGES, resolveLanguageCode } from "../../i18n/Languages";

import css from "./menu.css";
import enableContrast from "@/tools/enableContrast";
import { pluginConfig } from "@/globals/pluginConfig";
import { userSettings, saveUserSettings } from "@/globals/userSettings";
import { changeLanguage } from "@/i18n/changeLanguage";
import toggleMenu from "./toggleMenu";
import { $widget, applyButtonPosition } from "../widget/widget";
import { DEFAULT_CUSTOM_PALETTE_STATE, ICustomPaletteState, CustomPaletteCategory } from "@/tools/customPalette";
import { t } from "@/i18n/translate";
import customPaletteIcon from "../../icons/customPaletteIcon.svg";

function hslToHex(h: number, s: number, l: number): string {
    const saturation = Math.max(0, Math.min(100, s)) / 100;
    const lightness = Math.max(0, Math.min(100, l)) / 100;
    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const huePrime = (Math.max(0, Math.min(360, h)) % 360) / 60;
    const x = chroma * (1 - Math.abs((huePrime % 2) - 1));

    let r = 0, g = 0, b = 0;

    if (huePrime >= 0 && huePrime < 1) {
        r = chroma; g = x; b = 0;
    } else if (huePrime >= 1 && huePrime < 2) {
        r = x; g = chroma; b = 0;
    } else if (huePrime >= 2 && huePrime < 3) {
        r = 0; g = chroma; b = x;
    } else if (huePrime >= 3 && huePrime < 4) {
        r = 0; g = x; b = chroma;
    } else if (huePrime >= 4 && huePrime < 5) {
        r = x; g = 0; b = chroma;
    } else {
        r = chroma; g = 0; b = x;
    }

    const m = lightness - chroma / 2;
    const toHex = (value: number) => {
        const v = Math.round((value + m) * 255);
        return v.toString(16).padStart(2, "0");
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToHue(hex: string, fallback: number): number {
    const sanitized = hex.replace("#", "");
    if (![3, 6].includes(sanitized.length)) {
        return fallback;
    }

    const normalize = sanitized.length === 3
        ? sanitized.split("").map((char) => char + char).join("")
        : sanitized;

    const bigint = parseInt(normalize, 16);
    if (Number.isNaN(bigint)) {
        return fallback;
    }

    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    if (delta === 0) {
        return fallback;
    }

    let hue = 0;

    if (max === rNorm) {
        hue = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
        hue = (bNorm - rNorm) / delta + 2;
    } else {
        hue = (rNorm - gNorm) / delta + 4;
    }

    const degrees = Math.round((hue * 60 + 360) % 360);
    return degrees;
}

export default function renderMenu() {
    const $container: HTMLElement = document.createElement("div");
    $container.innerHTML = `<style>${css}</style>` + template;

    const $menu = $container.querySelector(".nextbility-menu");
    if (pluginConfig?.position?.includes("right")) {
        $menu.style.right = '0px';
        $menu.style.left = 'auto';
    }

    const $logo = $container.querySelector<HTMLImageElement>("[data-nextbility-logo]");
    if ($logo) {
        $logo.src = logoAsset;
    }

    $menu.querySelector(".content").innerHTML = renderButtons(ContentButtons);
    $menu.querySelector(".tools").innerHTML = renderButtons(ToolButtons, 'nextbility-tools');

    const $contrastGrid = $menu.querySelector(".contrast");
    $contrastGrid.innerHTML = renderButtons(FilterButtons, 'nextbility-filter');

    const $contrastButtons = Array.from($menu.querySelectorAll<HTMLButtonElement>(".nextbility-contrast-option"));

    // *** States UI Rendering ***
    const states = userSettings?.states;
    const filterButtons = Array.from($menu.querySelectorAll<HTMLButtonElement>('.nextbility-filter'));

    const fontSize = Number(states?.fontSize) || 1;
    if (fontSize != 1) {
        $menu.querySelector(".nextbility-amount").innerHTML = `${fontSize * 100}%`;
    }

    if (states) {
        const buttons = Array.from($menu.querySelectorAll('.nextbility-btn'));

        Object.entries(states).forEach(([key, value]) => {
            if (!value || key === "fontSize") {
                return;
            }

            if (typeof value === "object" && key !== "contrast") {
                return;
            }

            const selector = key === "contrast" ? states[key] : key;
            const btn = buttons.find(b => b.dataset.key === selector);
            if (btn) btn.classList.add("nextbility-selected");
            if (key === "contrast" && typeof selector === "string") {
                filterButtons.forEach(b => {
                    if (b.dataset.key !== selector) {
                        b.classList.remove("nextbility-selected");
                    }
                });
            }
        });
    }

    const contrastCycleOrder = ["contrast", "dark-contrast", "light-contrast", "high-contrast"];
    const contrastLabelMap: Record<string, string> = {
        "dark-contrast": "Dark Contrast",
        "light-contrast": "Light Contrast",
        "high-contrast": "High Contrast"
    };

    const $contrastCycleButton = $menu.querySelector<HTMLButtonElement>('.nextbility-filter[data-key="contrast-cycle"]');
    const $contrastCycleLabel = $contrastCycleButton?.querySelector<HTMLSpanElement>('.nextbility-translate');

    const updateContrastCycleButton = (value: string | false | "contrast") => {
        if (!$contrastCycleButton || !$contrastCycleLabel) {
            return;
        }

        const isActive = typeof value === "string" && value !== "contrast" && contrastCycleOrder.includes(value);
        const translationKey = isActive ? contrastLabelMap[value as keyof typeof contrastLabelMap] : "Contrast";

        $contrastCycleButton.classList.toggle("nextbility-selected", isActive);
        $contrastCycleButton.setAttribute("aria-pressed", String(isActive));
        $contrastCycleLabel.setAttribute("data-translate", translationKey);
        $contrastCycleLabel.textContent = t(translationKey);

        const barsWrapper = $contrastCycleButton.querySelector<HTMLDivElement>(".nextbility-contrast-bars");
        const barElements = Array.from($contrastCycleButton.querySelectorAll<HTMLSpanElement>(".nextbility-contrast-bar"));

        barElements.forEach((bar) => bar.classList.remove("is-active"));

        if (isActive) {
            barsWrapper?.classList.add("is-visible");
            const activeStepIndex = Math.max(0, contrastCycleOrder.indexOf(value as string) - 1);
            barElements.forEach((bar, index) => {
                bar.classList.toggle("is-active", index <= activeStepIndex);
            });
        } else {
            barsWrapper?.classList.remove("is-visible");
        }
    };

    const getNextContrastValue = (current?: string | null) => {
        const index = current ? contrastCycleOrder.indexOf(current) : -1;
        const nextIndex = (index + 1) % contrastCycleOrder.length;
        return contrastCycleOrder[nextIndex];
    };

    updateContrastCycleButton(typeof states?.contrast === "string" ? states.contrast : false);

    // *** Widget Placement ***
    const currentPosition = userSettings.position || pluginConfig.position || "bottom-left";
    const $positionToggle = $menu.querySelector<HTMLButtonElement>(".nextbility-position-toggle");
    const $positionCard = $menu.querySelector<HTMLElement>(".nextbility-position-card");
    const $settingsToggle = $menu.querySelector<HTMLButtonElement>(".nextbility-settings-toggle");
    const $settingsCard = $menu.querySelector<HTMLElement>(".nextbility-settings-card");
    const $settingsIcon = $menu.querySelector<HTMLElement>(".nextbility-settings-icon");
    const $customPaletteCard = $menu.querySelector<HTMLElement>(".nextbility-custom-palette-card");
    const $customPaletteIcon = $customPaletteCard?.querySelector<HTMLElement>(".nextbility-custom-palette-icon");
    const $customPaletteTabs = Array.from($menu.querySelectorAll<HTMLButtonElement>(".nextbility-custom-palette-tab"));
    const $customPaletteRange = $menu.querySelector<HTMLInputElement>(".nextbility-custom-palette-range");
    const $customPaletteReset = $menu.querySelector<HTMLButtonElement>(".nextbility-custom-palette-reset");

    if ($settingsIcon) {
        $settingsIcon.innerHTML = widgetSettingsIcon;
    }

    const setSettingsVisibility = (expanded: boolean) => {
        if (!$settingsCard || !$settingsToggle) {
            return;
        }

        $settingsToggle.setAttribute("aria-expanded", String(expanded));
        $settingsCard.classList.toggle("nextbility-settings-open", expanded);
    };

    if ($settingsToggle) {
        setSettingsVisibility(false);
        $settingsToggle.addEventListener("click", () => {
            const expanded = $settingsToggle.getAttribute("aria-expanded") !== "true";
            setSettingsVisibility(expanded);
        });
    }

    if ($customPaletteIcon) {
        $customPaletteIcon.innerHTML = customPaletteIcon;
    }

    const paletteDefaults = DEFAULT_CUSTOM_PALETTE_STATE.colors;
    const hueFallback: Record<CustomPaletteCategory, number> = {
        backgrounds: 0,
        headings: 210,
        contents: 220
    };

    const categoryConfig: Record<CustomPaletteCategory, { saturation: number; lightness: number }> = {
        backgrounds: { saturation: 70, lightness: 92 },
        headings: { saturation: 85, lightness: 45 },
        contents: { saturation: 60, lightness: 28 }
    };

    const savedPalette = states && typeof states['custom-palette'] === "object" ? (states['custom-palette'] as ICustomPaletteState) : undefined;

    let paletteState: ICustomPaletteState = {
        enabled: DEFAULT_CUSTOM_PALETTE_STATE.enabled,
        activeCategory: DEFAULT_CUSTOM_PALETTE_STATE.activeCategory,
        colors: { ...paletteDefaults }
    };

    if (savedPalette) {
        paletteState = {
            enabled: Boolean(savedPalette.enabled),
            activeCategory: savedPalette.activeCategory ?? DEFAULT_CUSTOM_PALETTE_STATE.activeCategory,
            colors: { ...paletteDefaults, ...(savedPalette.colors ?? {}) }
        };

        if (paletteState.enabled) {
            userSettings.states['custom-palette'] = paletteState;
        }
    }

    const paletteHues: Record<CustomPaletteCategory, number> = {
        backgrounds: hexToHue(paletteState.colors?.backgrounds ?? paletteDefaults.backgrounds, hueFallback.backgrounds),
        headings: hexToHue(paletteState.colors?.headings ?? paletteDefaults.headings, hueFallback.headings),
        contents: hexToHue(paletteState.colors?.contents ?? paletteDefaults.contents, hueFallback.contents)
    };

    const colorsMatchDefaults = () => (
        (['backgrounds', 'headings', 'contents'] as CustomPaletteCategory[]).every((category) => {
            const color = paletteState.colors?.[category] ?? paletteDefaults[category];
            return color.toLowerCase() === paletteDefaults[category].toLowerCase();
        })
    );

    const setActiveTab = (category: CustomPaletteCategory) => {
        paletteState.activeCategory = category;
        $customPaletteTabs.forEach((tab) => {
            const isActive = tab.dataset.category === category;
            tab.classList.toggle("is-active", isActive);
            tab.setAttribute("aria-selected", String(isActive));
        });
    };

    const createGradient = (category: CustomPaletteCategory) => {
        const { saturation, lightness } = categoryConfig[category];
        const stops = [0, 30, 60, 120, 180, 240, 300, 360];
        return `linear-gradient(90deg, ${stops
            .map((h, index) => `${hslToHex(h, saturation, lightness)} ${(index / (stops.length - 1)) * 100}%`)
            .join(',')})`;
    };

    const updateSliderVisuals = (category: CustomPaletteCategory) => {
        if (!$customPaletteRange) {
            return;
        }

        const hue = paletteHues[category] ?? hueFallback[category];
        const gradient = createGradient(category);
        const currentColor = paletteState.colors?.[category] ?? paletteDefaults[category];

        $customPaletteRange.value = String(hue);
        $customPaletteRange.style.setProperty("--nextbility-palette-gradient", gradient);
        $customPaletteRange.style.setProperty("--nextbility-palette-thumb", currentColor);

        const barsWrapper = $customPaletteCard?.querySelector<HTMLDivElement>(".nextbility-custom-palette-bars");
        if (barsWrapper) {
            const bars = Array.from(barsWrapper.querySelectorAll<HTMLSpanElement>(".nextbility-custom-palette-bar"));
            bars.forEach((bar) => {
                const cat = (bar.dataset.category as CustomPaletteCategory) || "backgrounds";
                const colorValue = paletteState.colors?.[cat] ?? paletteDefaults[cat];
                bar.style.background = colorValue;
                bar.classList.toggle("is-active", cat === category);
            });
        }
    };

    const persistPaletteState = (apply = true) => {
        const matchesDefaults = colorsMatchDefaults();
        paletteState.enabled = !matchesDefaults;

        if (paletteState.enabled) {
            userSettings.states['custom-palette'] = {
                enabled: true,
                activeCategory: paletteState.activeCategory,
                colors: { ...paletteDefaults, ...(paletteState.colors ?? {}) }
            };
        } else {
            delete userSettings.states['custom-palette'];
        }

        if (apply) {
            renderTools();
        }

        saveUserSettings();
    };

    const updatePaletteUI = () => {
        const category = paletteState.activeCategory ?? DEFAULT_CUSTOM_PALETTE_STATE.activeCategory;
        setActiveTab(category);
        updateSliderVisuals(category);
    };

    $customPaletteTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const category = (tab.dataset.category as CustomPaletteCategory) ?? DEFAULT_CUSTOM_PALETTE_STATE.activeCategory;
            setActiveTab(category);
            updateSliderVisuals(category);
        });
    });

    $customPaletteRange?.addEventListener("input", (event) => {
        const category = paletteState.activeCategory ?? DEFAULT_CUSTOM_PALETTE_STATE.activeCategory;
        const hue = Number((event.target as HTMLInputElement).value) || 0;
        paletteHues[category] = hue;

        const { saturation, lightness } = categoryConfig[category];
        const nextColor = hslToHex(hue, saturation, lightness);
        paletteState.colors = {
            ...paletteState.colors,
            [category]: nextColor
        };

        paletteState.enabled = true;

        updateSliderVisuals(category);
        persistPaletteState(true);
    });

    $customPaletteReset?.addEventListener("click", () => {
        paletteState = {
            enabled: false,
            activeCategory: DEFAULT_CUSTOM_PALETTE_STATE.activeCategory,
            colors: { ...paletteDefaults }
        };

        (['backgrounds', 'headings', 'contents'] as CustomPaletteCategory[]).forEach((category) => {
            paletteHues[category] = hueFallback[category];
        });

        updatePaletteUI();
        persistPaletteState(true);
    });

    updatePaletteUI();

    const setPositionGridVisibility = (expanded: boolean) => {
        if (!$positionCard || !$positionToggle) {
            return;
        }

        $positionToggle.setAttribute("aria-expanded", String(expanded));
        $positionCard.classList.toggle("nextbility-position-open", expanded);
    };

    if ($positionToggle) {
        setPositionGridVisibility(false);
        $positionToggle.addEventListener("click", () => {
            const expanded = $positionToggle.getAttribute("aria-expanded") !== "true";
            if (expanded) {
                setSettingsVisibility(true);
            }
            setPositionGridVisibility(expanded);
        });
    }

    const positionButtons = Array.from($menu.querySelectorAll<HTMLButtonElement>(".nextbility-position-btn"));

    positionButtons.forEach((button) => {
        button.classList.toggle("nextbility-selected", button.dataset.position === currentPosition);
        button.addEventListener("click", () => {
            const selectedPosition = button.dataset.position;
            if (!selectedPosition) {
                return;
            }

            positionButtons.forEach((btn) =>
                btn.classList.toggle("nextbility-selected", btn === button)
            );

            pluginConfig.position = selectedPosition;
            userSettings.position = selectedPosition;
            if (selectedPosition.includes("right")) {
                $menu.style.right = "0px";
                $menu.style.left = "auto";
            } else {
                $menu.style.left = "0px";
                $menu.style.right = "auto";
            }
            saveUserSettings();
            applyButtonPosition();
            setSettingsVisibility(true);
            setPositionGridVisibility(true);
        });
    });

    applyButtonPosition();

    // *** Translations ***
    userSettings.lang = resolveLanguageCode(userSettings.lang || pluginConfig?.lang);

    const $lang = $menu.querySelector<HTMLSelectElement>("#nextbility-language");
    const $languageWrapper = $menu.querySelector<HTMLElement>(".nextbility-language-wrapper");
    const $languageToggle = $menu.querySelector<HTMLButtonElement>(".nextbility-menu-language");
    const $languagePanel = $menu.querySelector<HTMLElement>("#nextbility-language-panel");
    const $languageSearch = $menu.querySelector<HTMLInputElement>(".nextbility-language-search");
    const $languageList = $menu.querySelector<HTMLDivElement>(".nextbility-language-list");
    const $languageEmpty = $menu.querySelector<HTMLElement>(".nextbility-language-empty");

    let languagePanelOpen = false;

    const escapeHTML = (value: string = ""): string => value.replace(/[&<>"']/g, (match) => {
        const map: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };
        return map[match] || match;
    });

    const setLanguageSearchText = () => {
        if ($languageSearch) {
            $languageSearch.placeholder = t("Search languages");
        }
        if ($languageEmpty) {
            $languageEmpty.textContent = t("No languages found");
        }
    };

    const getActiveLanguageCode = () => resolveLanguageCode(userSettings.lang || pluginConfig?.lang);

    const updateLanguageToggleLabel = () => {
        if (!$languageToggle) {
            return;
        }
        const code = getActiveLanguageCode();
        const lang = LANGUAGES.find((language) => language.code === code);
        const translatedLabel = t("Language");
        const label = `${translatedLabel}: ${lang?.label || code}`;
        $languageToggle.setAttribute("title", translatedLabel);
        $languageToggle.setAttribute("aria-label", label);
    };

    const renderLanguageList = (query: string = "") => {
        if (!$languageList) {
            return;
        }

        setLanguageSearchText();

        const normalized = query.trim().toLowerCase();
        const selectedCode = getActiveLanguageCode();

        const items = LANGUAGES.filter((language) => {
            if (!normalized) {
                return true;
            }

            const label = language.label?.toLowerCase() || "";
            const code = language.code.toLowerCase();
            return label.includes(normalized) || code.includes(normalized);
        });

        if (!items.length) {
            $languageList.innerHTML = "";
            if ($languageEmpty) {
                $languageEmpty.hidden = false;
            }
            return;
        }

        if ($languageEmpty) {
            $languageEmpty.hidden = true;
        }

        const html = items.map((language) => {
            const isSelected = language.code === selectedCode;
            const safeCode = escapeHTML(language.code);
            const safeLabel = escapeHTML(language.label || language.code);
            const safeCodeLabel = escapeHTML(language.code.toUpperCase());

            return `<button type="button" class="nextbility-language-option" data-lang="${safeCode}" data-selected="${String(isSelected)}" role="option" aria-selected="${String(isSelected)}">
                <span>${safeLabel}</span>
                <small>${safeCodeLabel}</small>
            </button>`;
        }).join("");

        $languageList.innerHTML = html;
    };

    const setLanguagePanelVisibility = (visible: boolean) => {
        languagePanelOpen = visible;
        if ($languageToggle) {
            $languageToggle.setAttribute("aria-expanded", String(visible));
        }
        if ($languagePanel) {
            $languagePanel.hidden = !visible;
        }

        if (visible) {
            renderLanguageList($languageSearch?.value || "");
            window.setTimeout(() => {
                $languageSearch?.focus();
            }, 0);
        } else if ($languageSearch) {
            $languageSearch.value = "";
            renderLanguageList("");
        }
    };

    const populateLanguageOptions = () => {
        if ($lang) {
            const langOptions = LANGUAGES.map((lang: ILanguage) => `<option value="${lang.code}">${lang.label}</option>`).join('');
            const previousValue = $lang.value;
            $lang.innerHTML = langOptions;

            const desiredValue = LANGUAGES.some((lang) => lang.code === userSettings.lang)
                ? userSettings.lang
                : resolveLanguageCode(previousValue);

            if (LANGUAGES.some((lang) => lang.code === desiredValue)) {
                $lang.value = desiredValue;
            }
        }

        renderLanguageList($languageSearch?.value || "");
        updateLanguageToggleLabel();
    };

    populateLanguageOptions();

    setLanguagePanelVisibility(false);

    $languageToggle?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setLanguagePanelVisibility(!languagePanelOpen);
    });

    $languageSearch?.addEventListener("input", () => {
        renderLanguageList($languageSearch.value);
    });

    $languageList?.addEventListener("click", (event) => {
        const target = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>(".nextbility-language-option");
        if (!target) {
            return;
        }

        const code = target.dataset.lang;
        if (!code) {
            return;
        }

        changeLanguage(code);
        renderLanguageList($languageSearch?.value || "");
        updateLanguageToggleLabel();
        setLanguagePanelVisibility(false);
        $languageToggle?.focus();
    });

    const handleLanguagePanelOutsideClick = (event: MouseEvent) => {
        if (!languagePanelOpen) {
            return;
        }

        const target = event.target as Node | null;
        if ($languageWrapper && target && $languageWrapper.contains(target)) {
            return;
        }

        setLanguagePanelVisibility(false);
    };

    const handleLanguagePanelKeydown = (event: KeyboardEvent) => {
        if (event.key === "Escape" && languagePanelOpen) {
            setLanguagePanelVisibility(false);
            $languageToggle?.focus();
        }
    };

    document.addEventListener("mousedown", handleLanguagePanelOutsideClick);
    document.addEventListener("keydown", handleLanguagePanelKeydown);

    $lang?.addEventListener("change", (event) => {
        changeLanguage((event.target as HTMLSelectElement).value);
        renderLanguageList($languageSearch?.value || "");
        updateLanguageToggleLabel();
        setLanguagePanelVisibility(false);
    });

    const handleLanguagesUpdated = () => {
        populateLanguageOptions();
    };

    const handleLanguageChanged = () => {
        renderLanguageList($languageSearch?.value || "");
        updateLanguageToggleLabel();
    };

    document.addEventListener("nextbility:languages:updated", handleLanguagesUpdated);
    document.addEventListener("nextbility:language:changed", handleLanguageChanged);

    // *** Utils ***
    $container.querySelectorAll('.nextbility-menu-close, .nextbility-overlay').forEach((el) =>
        el.addEventListener('click', toggleMenu)
    );

    $container.querySelectorAll('.nextbility-menu-reset').forEach((el) =>
        el.addEventListener('click', reset)
    );

    // *** Controls ***
    $menu.querySelectorAll(".nextbility-plus, .nextbility-minus").forEach((el: HTMLElement) => {
        el.addEventListener("click", () => {
            const difference = 0.1;

            let fontSize = userSettings?.states?.fontSize || 1;
            if (el.classList.contains('nextbility-minus')) {
                fontSize -= difference;
            } else {
                fontSize += difference;
            }

            fontSize = Math.max(fontSize, 0.1);
            fontSize = Math.min(fontSize, 2);
            fontSize = Number(fontSize.toFixed(2));

            document.querySelector(".nextbility-amount").textContent = `${(fontSize * 100).toFixed(0)}%`;

            adjustFontSize(fontSize);
            userSettings.states.fontSize = fontSize;

            saveUserSettings();
        });
    });

    $menu.querySelectorAll(".nextbility-btn").forEach((el: HTMLElement) => {
        el.addEventListener("click", () => {
            const key = el.dataset.key;
            const isSelected = !el.classList.contains("nextbility-selected");

            if (el.classList.contains("nextbility-filter")) {
                if (key === "contrast-cycle") {
                    filterButtons.forEach(button => {
                        if (button !== el) {
                            button.classList.remove("nextbility-selected");
                        }
                    });

                    const current = typeof userSettings.states.contrast === "string" ? userSettings.states.contrast : "contrast";
                    const nextValue = getNextContrastValue(current);

                    userSettings.states.contrast = nextValue === "contrast" ? false : nextValue;
                    updateContrastCycleButton(userSettings.states.contrast || "contrast");
                    enableContrast(userSettings.states.contrast);
                    saveUserSettings();
                    return;
                }

                filterButtons.forEach((filterBtn) => filterBtn.classList.remove("nextbility-selected"));

                if (isSelected) {
                    el.classList.add("nextbility-selected");
                }

                userSettings.states.contrast = isSelected ? key : false;
                updateContrastCycleButton(false);
                enableContrast(userSettings.states.contrast);
                saveUserSettings();
                return;
            }

            el.classList.toggle("nextbility-selected", isSelected);
            userSettings.states[key] = isSelected;
            renderTools();
            saveUserSettings();
        });
    });

    $widget.appendChild($container);

    return $container;
}
