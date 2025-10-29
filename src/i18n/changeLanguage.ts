import {
    saveUserSettings,
    userSettings
} from "@/globals/userSettings";
import { LANGUAGES, resolveLanguageCode } from "./Languages";
import translateWidget from "@/views/menu/translateWidget";
import { $menu } from "@/views/menu/menu";

export function changeLanguage(newLang) {
    const resolvedCode = resolveLanguageCode(newLang);

    if (!LANGUAGES.some((language) => language.code === resolvedCode)) {
        return;
    }

    if (userSettings.lang !== resolvedCode) {
        userSettings.lang = resolvedCode;

        const $lang = $menu?.querySelector<HTMLSelectElement>("#nextbility-language");
        if ($lang) {
            $lang.value = resolvedCode;
        }

        translateWidget();
        saveUserSettings();
    }

    if (typeof document !== "undefined" && typeof CustomEvent !== "undefined") {
        document.dispatchEvent(new CustomEvent("nextbility:language:changed", { detail: { code: resolvedCode } }));
    }
}
