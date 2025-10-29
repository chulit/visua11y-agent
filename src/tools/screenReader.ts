import { pluginConfig } from "@/globals/pluginConfig";
import { userSettings, saveUserSettings } from "@/globals/userSettings";

type SelectionHandler = () => void;

let activeUtterance: SpeechSynthesisUtterance | null = null;
let selectionListener: SelectionHandler | null = null;
let clickListener: ((event: MouseEvent) => void) | null = null;
let enabled = false;

const speech = typeof window !== "undefined" ? window.speechSynthesis : null;

function getToggleButton(): HTMLElement | null {
    return document.querySelector<HTMLElement>('.nextbility-btn[data-key="screen-reader"]');
}

function getCurrentLanguage(): string {
    return userSettings.lang || pluginConfig.lang || "en";
}

function stopSpeaking() {
    if (speech) {
        speech.cancel();
    }
    activeUtterance = null;
}

function speak(text: string) {
    if (!speech || !text) {
        return;
    }

    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getCurrentLanguage();
    activeUtterance = utterance;
    speech.speak(utterance);
}

function readSelection() {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text) {
        speak(text);
        return true;
    }

    return false;
}

function handleSelectionChange() {
    if (!enabled) {
        return;
    }

    // prevent rapid fire when selecting text by dragging
    window.clearTimeout((handleSelectionChange as unknown as { timeoutId?: number }).timeoutId);
    (handleSelectionChange as unknown as { timeoutId?: number }).timeoutId = window.setTimeout(() => {
        readSelection();
    }, 200);
}

function handleClick(event: MouseEvent) {
    if (!enabled) {
        return;
    }

    const target = event.target as HTMLElement | null;
    const isMenuElement = target?.closest(".nextbility-menu, .nextbility-container");
    if (isMenuElement) {
        return;
    }

    if (!readSelection()) {
        const text = target?.innerText?.trim?.();
        if (text) {
            speak(text);
        }
    }
}

function notifyUnsupported() {
    console.warn("[NextBility] Screen Reader is not supported in this browser.");
}

export default function screenReader(enable = false) {
    if (!speech) {
        notifyUnsupported();
        enabled = false;
        if (userSettings.states["screen-reader"]) {
            userSettings.states["screen-reader"] = false;
            saveUserSettings();
        }
        getToggleButton()?.classList.remove("nextbility-selected");
        return;
    }

    enabled = enable;
    document.documentElement.classList.toggle("nextbility-screen-reader", enable);

    if (enable) {
        if (!selectionListener) {
            selectionListener = handleSelectionChange;
            document.addEventListener("selectionchange", selectionListener);
        }

        if (!clickListener) {
            clickListener = handleClick;
            document.addEventListener("mouseup", clickListener);
            document.addEventListener("keyup", clickListener);
        }

        // initial read to give immediate feedback
        if (!readSelection()) {
            speak(document.body?.innerText?.slice(0, 600).trim() || "");
        }
    } else {
        stopSpeaking();
        if (selectionListener) {
            document.removeEventListener("selectionchange", selectionListener);
            selectionListener = null;
        }
        if (clickListener) {
            document.removeEventListener("mouseup", clickListener);
            document.removeEventListener("keyup", clickListener);
            clickListener = null;
        }
    }
}
