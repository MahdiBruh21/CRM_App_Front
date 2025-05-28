import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../environments/environment';

export interface UserInfo {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  name: string; // Add this
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<UserInfo | null>(null);
  private isChecking = false;

  private readonly authBaseUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
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
      if (params['error']) {
        console.error('OAuth2 error callback', params);
        this.setUnauthenticated();
        this.router.navigate(['/login'], { queryParams: { error: 'true' } });
      } else if (params['session_expired']) {
        this.setUnauthenticated();
        this.router.navigate(['/login'], {
          queryParams: { session_expired: 'true' },
        });
      } else if (params['logout']) {
        this.setUnauthenticated();
        this.router.navigate(['/login'], { queryParams: { logout: 'true' } });
      } else if (params['code']) {
        this.exchangeCodeForSession(params['code']);
      } else {
        this.checkAuthStatus();
      }
    });
  }

  private exchangeCodeForSession(code: string): void {
    this.http
      .post(
        `${this.authBaseUrl}/login/oauth2/code/keycloak`,
        { code },
        { withCredentials: true }
      )
      .pipe(
        tap(() => {
          this.isAuthenticatedSubject.next(true);
          this.checkAuthStatus();
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error during token exchange:', error);
          this.setUnauthenticated();
          this.router.navigate(['/login'], { queryParams: { error: 'true' } });
          return of(null);
        })
      )
      .subscribe();
  }

  checkAuthStatus(): void {
    if (this.isChecking) return;
    this.isChecking = true;

    this.http
      .get<UserInfo>(`${environment.baseUrl}/user`, {
        withCredentials: true,
      })
      .pipe(
        tap((userInfo: UserInfo) => {
          this.isAuthenticatedSubject.next(true);
          this.userSubject.next(userInfo);
          this.isChecking = false;
        }),
        catchError((error) => {
          console.warn('User not authenticated:', error);
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
      redirect_uri: `${this.authBaseUrl}/login/oauth2/code/keycloak`,
      state: btoa(Math.random().toString()),
      nonce: btoa(Math.random().toString()),
    });
    window.location.href = `${
      this.authBaseUrl
    }/proxy/keycloak-auth?${params.toString()}`;
  }
  logout(): void {
    const redirectUri = encodeURIComponent(
      'http://localhost:4200/login?logout=true'
    );
    const logoutUrl = `http://localhost:8081/realms/SphynxRealm/protocol/openid-connect/logout?client_id=SphynxApp&post_logout_redirect_uri=${redirectUri}`;

    this.setUnauthenticated(); // clear local state
    window.location.href = logoutUrl;
  }

  // In AuthService:
  public setUnauthenticated(): void {
    this.isAuthenticatedSubject.next(false);
    this.userSubject.next(null);
    // Also clear any tokens or local storage here if you use them
    localStorage.clear();
    sessionStorage.clear();
  }
}
