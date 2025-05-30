import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  deleteCookie(name: string, path?: string, domain?: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;

    if (path) {
      cookieString += ` path=${path};`;
    } else {
      cookieString += ` path=/;`;
    }

    if (domain) {
      cookieString += ` domain=${domain};`;
    }

    document.cookie = cookieString;
  }

  deleteAllCookies(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const cookies = document.cookie.split(';');
    const domain = window.location.hostname;

    cookies.forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

      // Delete with domain
      this.deleteCookie(name, '/', domain);

      // Delete without domain
      this.deleteCookie(name);
    });
  }
}
