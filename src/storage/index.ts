import { getCookie, setCookie } from '@/utils/cookies';

export function saveStorageData(key: string, value: unknown): void {
  const jsonValue = JSON.stringify(value);

  try {
    localStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(e);
    setCookie(key, jsonValue);
  }
}

export function getStorageData<T = Record<string, unknown>>(key: string): T {
  let data;

  try {
    data = localStorage.getItem(key);
  } catch (e) {
    console.error(e);
    data = getCookie(key);
  }

  // If no data found, return empty object
  if (!data) {
    return {} as T;
  }

  try {
    return JSON.parse(data) as T;
  } catch (e) {
    console.error(e);
    return {} as T;
  }
}
