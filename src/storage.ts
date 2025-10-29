import { getCookie, setCookie } from "./utils/cookies";

export function saveStorageData(key, value) {
    const jsonValue = JSON.stringify(value);

    try {
        localStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error(e);
        setCookie(key, jsonValue);
    }
}

export function getStorageData(key) {
    let data;

    try {
        data = localStorage.getItem(key);
    } catch (e) {
        console.error(e);
        data = getCookie(key);
    }

    try {
        return JSON.parse(data);
    } catch (e) {
        console.error(e);
        return {};
    }
}