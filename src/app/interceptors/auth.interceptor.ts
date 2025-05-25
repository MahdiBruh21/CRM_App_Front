// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const clonedReq = req.clone({ withCredentials: true });
    return next.handle(clonedReq).pipe(
      tap({
        error: (err) => {
          if (err.status === 401) {
            this.router.navigate(['/login'], {
              queryParams: { session_expired: 'true' },
            });
          }
        },
      })
    );
  }
}
