import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * LoginComponent provides a simple login form.
 * This is a fake login for PoC purposes - any username/password combination will work.
 */
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // If already logged in, redirect to chat
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/chat']);
    }
  }

  /**
   * Handles the login form submission.
   * Since this is a fake login, any non-empty username will work.
   */
  onLogin(): void {
    this.errorMessage = '';

    if (!this.username.trim()) {
      this.errorMessage = 'Please enter a username';
      return;
    }

    // Fake login - always succeeds with a non-empty username
    const success = this.authService.login(this.username, this.password);

    if (success) {
      // Navigate to chat on successful login
      this.router.navigate(['/chat']);
    } else {
      this.errorMessage = 'Login failed. Please try again.';
    }
  }
}
