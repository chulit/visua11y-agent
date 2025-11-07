import { getStorageData, saveStorageData } from '@/storage/index';
import { ISettings, ISettingsStates } from '@/types/ISettings';

export const userSettings: ISettings = {
  lang: undefined,
  position: undefined,
  offset: undefined,
  widgetSize: undefined,
  states: {},
};

export const STORAGE_KEY = 'visua11y-agent-user-settings';

export function setUserStateSettings(state: ISettingsStates) {
  userSettings.states = {
    ...userSettings.states,
    ...state,
  };

  saveUserSettings();
}

export function saveUserSettings() {
  saveStorageData(STORAGE_KEY, userSettings);
}

export function getSavedUserSettings(): ISettings | null {
  return getStorageData(STORAGE_KEY);
}
