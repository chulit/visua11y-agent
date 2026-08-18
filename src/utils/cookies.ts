export function getCookie(cname: string) {
  const name = `${cname.trim()}=`;
  const cookies = decodeURIComponent(document.cookie).split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name)) {
      return cookie.slice(name.length).trim();
    }
  }
  return '';
}

export function setCookie(cname: string, cvalue: unknown, exdays: number = 365) {
  const days = Number.isFinite(exdays) ? Number(exdays) : 365;
  const value = encodeURIComponent(String(cvalue));
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toUTCString();
  document.cookie = `${cname}=${value};${expires};path=/;SameSite=Lax`;
}
