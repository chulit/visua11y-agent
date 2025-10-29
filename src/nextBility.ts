import runAccessibility from "@/views/menu/runAccessibility";
import translateWidget from "@/views/menu/translateWidget";
import { renderWidget, applyButtonIcon } from "@/views/widget/widget";

import { 
    userSettings,
    getSavedUserSettings
} from '@/globals/userSettings';

import {
    pluginConfig,
    pluginDefaults
} from "./globals/pluginConfig";
import { changeLanguage } from "./i18n/changeLanguage";
import { IRegisterLanguageOptions, registerLanguage, resolveLanguageCode } from "./i18n/Languages";

export default function nextBility({
    options
}) {
    const savedSettings = getSavedUserSettings() || {};

    Object.assign(pluginConfig, options);
    pluginDefaults.lang = pluginConfig.lang;
    pluginDefaults.position = pluginConfig.position;
    pluginDefaults.offset = Array.isArray(pluginConfig.offset) ? [...pluginConfig.offset] : [20, 20];
    pluginDefaults.size = pluginConfig.size;
    pluginDefaults.icon = pluginConfig.icon;
    Object.assign(userSettings, savedSettings);
    if (!userSettings.states || typeof userSettings.states !== "object") {
        userSettings.states = {};
    }

    const initialLanguage = resolveLanguageCode(userSettings.lang || pluginConfig.lang);
    userSettings.lang = initialLanguage;
    pluginConfig.lang = initialLanguage;

    if (userSettings.position) {
        pluginConfig.position = userSettings.position;
    }

    if (Array.isArray(userSettings.offset)) {
        pluginConfig.offset = userSettings.offset;
    }
    
    runAccessibility();
    renderWidget();

    function setIcon(icon?: string) {
        pluginConfig.icon = icon;
        applyButtonIcon();
    }

    function registerCustomLanguage(options: IRegisterLanguageOptions) {
        const code = registerLanguage(options);
        if (code && userSettings.lang === code) {
            translateWidget();
        }

        return code;
    }

    return {
        changeLanguage,
        setIcon,
        registerLanguage: registerCustomLanguage
    }
}
