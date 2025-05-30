import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

export interface UserInfo {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<UserInfo | null>(null);
  private isChecking = false;
  private isLoggingOut = false;
  private readonly keycloakBaseUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.handleAuthCallback();
  }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  user$(): Observable<UserInfo | null> {
    return this.userSubject.asObservable();
  }

  handleAuthCallback(): void {
    this.route.queryParams.subscribe((params) => {
      console.log('AuthService: Handling query params', params);
      if (params['error'] === 'true') {
        this.setUnauthenticated();
        this.router.navigate(['/login'], { queryParams: { error: 'true' } });
      } else if (params['session_expired'] === 'true') {
        this.setUnauthenticated();
        this.router.navigate(['/login'], {
          queryParams: { session_expired: 'true' },
        });
      } else if (params['logout'] === 'true') {
        this.setUnauthenticated();
        this.isLoggingOut = false;
        this.router.navigate(['/login'], { queryParams: { logout: 'true' } });
      } else if (params['code']) {
        this.exchangeCodeForSession(params['code']);
      } else if (
        !this.isLoggingOut &&
        !this.isAuthenticatedSubject.getValue()
      ) {
        this.checkAuthStatus();
      }
    });
  }

  private exchangeCodeForSession(code: string): void {
    this.http
      .post(
        `${environment.baseUrl}/login/oauth2/code/keycloak`,
        { code },
        { withCredentials: true }
      )
      .pipe(
        tap(() => {
          this.isAuthenticatedSubject.next(true);
          this.checkAuthStatus();
        }),
        catchError((error: HttpErrorResponse) => {
          this.setUnauthenticated();
          this.router.navigate(['/login'], { queryParams: { error: 'true' } });
          return of(null);
        })
      )
      .subscribe();
  }

  checkAuthStatus(): void {
    if (
      this.isChecking ||
      this.isLoggingOut ||
      this.isAuthenticatedSubject.getValue()
    ) {
      console.log('AuthService: Skipping checkAuthStatus', {
        isChecking: this.isChecking,
        isLoggingOut: this.isLoggingOut,
        isAuthenticated: this.isAuthenticatedSubject.getValue(),
      });
      return;
    }
    this.isChecking = true;

    this.http
      .get<UserInfo>(`${environment.baseUrl}/user`, {
        withCredentials: true,
      })
      .pipe(
        tap((userInfo: UserInfo) => {
          console.log('AuthService: User authenticated', userInfo);
          this.isAuthenticatedSubject.next(true);
          this.userSubject.next(userInfo);
          this.isChecking = false;
        }),
        catchError((error) => {
          console.log('AuthService: Not authenticated', error);
          this.setUnauthenticated();
          this.isChecking = false;
          return of(null);
        })
      )
      .subscribe();
  }

  redirectToLogin(): void {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: 'SphynxApp',
      scope: 'openid profile email',
      redirect_uri: `${this.keycloakBaseUrl}/login/oauth2/code/keycloak`,
      state: btoa(Math.random().toString()),
      nonce: btoa(Math.random().toString()),
    });
    console.log(
      'AuthService: Redirecting to:',
      `${this.keycloakBaseUrl}/proxy/keycloak-auth?${params.toString()}`
    );
    window.location.href = `${
      this.keycloakBaseUrl
    }/proxy/keycloak-auth?${params.toString()}`;
  }

  logout(): void {
    console.log('AuthService: Starting logout');
    this.isLoggingOut = true;
    this.setUnauthenticated();

    this.http
      .post(`${environment.baseUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        catchError((error) => {
          console.error('AuthService: Logout request failed:', error);
          return of(null);
        })
      )
      .subscribe(() => {
        const redirectUri = encodeURIComponent(
          `${window.location.origin}/logout-frontchannel`
        );
        const logoutUrl = `http://localhost:8081/realms/SphynxRealm/protocol/openid-connect/logout?client_id=SphynxApp&post_logout_redirect_uri=${redirectUri}`;

        console.log('AuthService: Redirecting to Keycloak logout:', logoutUrl);
        if (isPlatformBrowser(this.platformId)) {
          window.location.href = logoutUrl;
        }
      });
  }

  private deleteAllCookies(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const domain = window.location.hostname;
    const cookies = document.cookie.split(';');

    console.log('AuthService: Cookies before deletion:', document.cookie);
    cookies.forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/api; domain=${domain}`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/api;`;
    });
    console.log('AuthService: Cookies after deletion:', document.cookie);
  }

  public setUnauthenticated(): void {
    console.log('AuthService: Setting unauthenticated state');
    this.isAuthenticatedSubject.next(false);
    this.userSubject.next(null);
    this.deleteAllCookies(); // Note: Won't clear HttpOnly JSESSIONID

    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      sessionStorage.clear();
    }
  }
}
