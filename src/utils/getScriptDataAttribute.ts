export function getScriptDataAttribute(attr: string): string | undefined {
  const key = `data-visua11y-agent-${attr}`;

  const script = document.currentScript;
  if (script?.hasAttribute(key)) {
    return script.getAttribute(key);
  }

  return document.querySelector(`script[${key}]`)?.getAttribute(key);
}
