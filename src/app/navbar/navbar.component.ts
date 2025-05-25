import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isAuthenticated$ = this.authService.isAuthenticated$();
  user$ = this.authService.user$();

  constructor(private authService: AuthService) {}

  login(): void {
    this.authService.redirectToLogin();
  }

  logout(): void {
    this.authService.logout();
  }
}
