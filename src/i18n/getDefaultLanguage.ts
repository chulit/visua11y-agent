import { getScriptDataAttribute } from "../utils/getScriptDataAttribute";
import { resolveLanguageCode } from "./Languages";

export function getDefaultLanguage() {
    const language = 
        getScriptDataAttribute("lang") ||
        document.documentElement?.lang ||
        navigator?.language ||
        document.querySelector('meta[http-equiv="Content-Language"]')?.content

    return resolveLanguageCode(language);
}
