import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-logout-frontchannel',
  template: `<div class="logout-container">Completing logout...</div>`,
  styles: [
    `
      .logout-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-size: 1.2rem;
      }
    `,
  ],
})
export class LogoutFrontchannelComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log('LogoutFrontchannelComponent: Starting logout cleanup');
    this.authService.setUnauthenticated();

    this.http
      .post(`${environment.baseUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        catchError((error) => {
          console.error(
            'LogoutFrontchannelComponent: Backend logout failed:',
            error
          );
          return of(null);
        })
      )
      .subscribe((response) => {
        console.log(
          'LogoutFrontchannelComponent: Backend logout response:',
          response
        );
        setTimeout(() => {
          console.log(
            'LogoutFrontchannelComponent: Redirecting to /login?logout=true'
          );
          this.router.navigate(['/login'], {
            queryParams: { logout: 'true' },
          });
        }, 1000);
      });
  }
}
