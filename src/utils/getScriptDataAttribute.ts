export function getScriptDataAttribute(attr) {
    const key = `data-nextbility-${attr}`;

    const script = document.currentScript;
    if (script?.hasAttribute(key)) {
        return script.getAttribute(key);
    }
    
    return document.querySelector(`[${key}]`)?.getAttribute(key);
}