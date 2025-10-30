import { pluginConfig } from "@/globals/pluginConfig";
import { saveUserSettings, userSettings } from "@/globals/userSettings";
import adjustFontSize from "@/tools/adjustFontSize";
import screenReader from "./screenReader";
import reset from "@/views/menu/reset";
import { $menu, openMenu } from "@/views/menu/menu";
import toggleMenu from "@/views/menu/toggleMenu";

type Command = {
    phrases: RegExp[];
    action: () => void;
};

const SpeechRecognitionConstructor =
    typeof window !== "undefined"
        ? (window as typeof window & { webkitSpeechRecognition?: typeof window.SpeechRecognition })
              .SpeechRecognition || (window as typeof window & { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition
        : undefined;

let recognition: SpeechRecognition | null = null;
let enabled = false;

function getToggleButton(): HTMLElement | null {
    return document.querySelector<HTMLElement>('.visua11y-agent-btn[data-key="voice-navigation"]');
}

const commands: Command[] = [
    {
        phrases: [/^open (accessibility )?menu$/i, /^open menu$/i],
        action: () => openMenu()
    },
    {
        phrases: [/^close (accessibility )?menu$/i, /^close menu$/i],
        action: () => {
            if ($menu && $menu.style.display !== "none") {
                toggleMenu();
            }
        }
    },
    {
        phrases: [/^(increase|larger|bigger) font$/i],
        action: () => adjustFontSizeByStep(0.1)
    },
    {
        phrases: [/^(decrease|smaller|reduce) font$/i],
        action: () => adjustFontSizeByStep(-0.1)
    },
    {
        phrases: [/^reset (settings)?$/i],
        action: () => reset()
    },
    {
        phrases: [/^start screen reader$/i, /^enable screen reader$/i],
        action: () => toggleScreenReader(true)
    },
    {
        phrases: [/^stop screen reader$/i, /^disable screen reader$/i],
        action: () => toggleScreenReader(false)
    }
];

function normalizeTranscript(transcript: string): string {
    return transcript.trim().toLowerCase();
}

function adjustFontSizeByStep(step: number) {
    let fontSize = Number(userSettings?.states?.fontSize) || 1;
    fontSize += step;
    fontSize = Math.max(0.1, Math.min(2, Number(fontSize.toFixed(2))));

    adjustFontSize(fontSize);
    userSettings.states.fontSize = fontSize;
    saveUserSettings();

    const $amount = document.querySelector<HTMLElement>(".visua11y-agent-amount");
    if ($amount) {
        $amount.textContent = `${(fontSize * 100).toFixed(0)}%`;
    }
}

function toggleScreenReader(shouldEnable: boolean) {
    if (userSettings.states["screen-reader"] === shouldEnable) {
        return;
    }

    userSettings.states["screen-reader"] = shouldEnable;
    saveUserSettings();
    screenReader(shouldEnable);

    const button = document.querySelector<HTMLElement>(`.visua11y-agent-btn[data-key="screen-reader"]`);
    button?.classList.toggle("visua11y-agent-selected", shouldEnable);
}

function handleResult(event: SpeechRecognitionEvent) {
    for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (!result.isFinal) {
            continue;
        }

        const transcript = normalizeTranscript(result[0].transcript);

        const matchedCommand = commands.find((command) =>
            command.phrases.some((regex) => regex.test(transcript))
        );

        if (matchedCommand) {
            matchedCommand.action();
            break;
        }
    }
}

function createRecognitionInstance(): SpeechRecognition | null {
    if (!SpeechRecognitionConstructor) {
        return null;
    }

    const instance = new SpeechRecognitionConstructor();
    instance.continuous = true;
    instance.interimResults = false;
    instance.lang = userSettings.lang || pluginConfig.lang || "en";

    instance.onresult = handleResult;
    instance.onerror = () => {
        if (enabled) {
            restartRecognition();
        }
    };
    instance.onend = () => {
        if (enabled) {
            restartRecognition();
        }
    };

    return instance;
}

function restartRecognition() {
    window.setTimeout(() => {
        if (enabled && recognition) {
            try {
                recognition.start();
            } catch (error) {
                // Recognition can throw if already started; swallow.
            }
        }
    }, 300);
}

function stopRecognition() {
    if (recognition) {
        try {
            recognition.onresult = null;
            recognition.onend = null;
            recognition.onerror = null;
            recognition.stop();
        } catch (error) {
            // noop
        }
    }
}

function notifyUnsupported() {
    console.warn("[Visua11y Agent] Voice Navigation is not supported in this browser.");
}

export default function voiceNavigation(enable = false) {
    if (!SpeechRecognitionConstructor) {
        notifyUnsupported();
        if (userSettings.states["voice-navigation"]) {
            userSettings.states["voice-navigation"] = false;
            saveUserSettings();
        }
        getToggleButton()?.classList.remove("visua11y-agent-selected");
        return;
    }

    enabled = enable;
    document.documentElement.classList.toggle("visua11y-agent-voice-navigation", enable);

    if (enable) {
        if (!recognition) {
            recognition = createRecognitionInstance();
        }

        if (recognition) {
            recognition.lang = userSettings.lang || pluginConfig.lang || "en";
            try {
                recognition.start();
            } catch (error) {
                // Safari can throw "InvalidStateError" when start is called twice
            }
        }
    } else {
        stopRecognition();
    }
}
