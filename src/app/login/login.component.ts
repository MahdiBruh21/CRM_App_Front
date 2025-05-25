import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['error'] === 'true') {
        this.errorMessage = 'Login failed. Please try again.';
      } else if (params['session_expired'] === 'true') {
        this.errorMessage = 'Your session has expired. Please log in again.';
      } else if (params['logout'] === 'true') {
        this.errorMessage = 'You have been logged out successfully.';
      }
    });
  }

  login(): void {
    this.authService.redirectToLogin();
  }
}
