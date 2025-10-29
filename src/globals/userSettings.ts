import { getStorageData, saveStorageData } from "@/storage";

export const userSettings = {
  lang: undefined,
  position: undefined,
  offset: undefined,
  states: {}
};

export const STORAGE_KEY = "nextbility-user-settings";

export function setUserStateSettings(state) {
    userSettings.states = {
        ...userSettings.states,
        ...state
    }

    saveUserSettings();
}

export function saveUserSettings() {
    saveStorageData(STORAGE_KEY, userSettings);
}

export function getSavedUserSettings() {
    return getStorageData(STORAGE_KEY);
}
